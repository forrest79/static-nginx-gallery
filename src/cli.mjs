import { Command } from 'commander/esm.mjs';
import fs from 'fs';
import crypto from 'crypto';
import yaml from 'yaml';
import ejs from 'ejs';
import * as rollup from 'rollup';
import rollupNodeResolve from '@rollup/plugin-node-resolve';
import rollupReplace from '@rollup/plugin-replace';
import rollupCommonJS from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import sass from 'node-sass';
import { fileURLToPath } from 'url';
import * as path from 'path';
import defaultConfig from './defaultConfig.mjs';

// Helpers

const srcDir = path.dirname(fileURLToPath(import.meta.url));
const sha1 = (data) => crypto.createHash('sha1').update(data).digest('hex');

// Prepare build options

const program = new Command();

program.option('-d, --debug', 'build debug version (don\'t minimize CSS and JS)');
program.parse(process.argv);

if (program.args.length === 0) {
	console.error('You must specify YAML file with the build configuration.');
	process.exit(1);
} else if (program.args.length > 1) {
	console.error('You must specify only one YAML file with the build configuration.');
	process.exit(1);
}

const configYamlFile = program.args[0];
const debugMode = program.opts().debug === true;

// Prepare configuration

const config = defaultConfig;
let configYaml = null;

try {
	configYaml = yaml.parse(fs.readFileSync(configYamlFile, 'utf8'));

	if (configYaml.nginxConfDir !== undefined) {
		config.nginxConfDir = configYaml.nginxConfDir.replace(/(\/)$/, '');
	}

	if (configYaml.nginxAppDir !== undefined) {
		config.nginxAppDir = configYaml.nginxAppDir.replace(/(\/)$/, '');
	}

	if (configYaml.serverName !== undefined) {
		config.serverName = configYaml.serverName;
	}

	if (configYaml.galleryDir !== undefined) {
		config.galleryDir = configYaml.galleryDir;
	}

	if (configYaml.path !== undefined) {
		config.path = configYaml.path;
	}

	if (configYaml.port !== undefined) {
		config.port = configYaml.port;
	}

	if (configYaml.thumbnails !== undefined) {
		config.thumbnails = configYaml.thumbnails;
	}

	if (configYaml.videoThumbnails !== undefined) {
		config.videoThumbnails = configYaml.videoThumbnails;
	}

	if (configYaml.lightTheme !== undefined) {
		config.lightTheme = configYaml.lightTheme;
	}

	if (configYaml.title !== undefined) {
		config.title = configYaml.title;
	}

	if (configYaml.favicon !== undefined) {
		config.favicon = configYaml.favicon;
	}

	if (typeof configYaml.subtitles === 'object') {
		if (configYaml.subtitles.convertSrtToVtt !== undefined) {
			config.subtitlesConvertSrtToVtt = configYaml.subtitles.convertSrtToVtt;
		}
	}

	if (typeof configYaml.ssl === 'object') {
		config.ssl = true;

		if (configYaml.ssl.certificate !== undefined) {
			config.sslCertificate = configYaml.ssl.certificate;
		}

		if (configYaml.ssl.certificateKey !== undefined) {
			config.sslCertificateKey = configYaml.ssl.certificateKey;
		}

		if (configYaml.ssl.redirectHttpToHttps !== undefined) {
			config.sslRedirectHttpToHttps = configYaml.ssl.redirectHttpToHttps;
		}

		if (configYaml.ssl.httpPort !== undefined) {
			config.sslHttpPort = configYaml.ssl.httpPort;
		}

		if (configYaml.ssl.letsEncrypt !== undefined) {
			config.sslLetsEncrypt = configYaml.ssl.letsEncrypt;
		}
	}

	if (configYaml.httpAuth !== undefined) {
		config.httpAuth = configYaml.httpAuth;
	}

	let configError = false;

	if (config.nginxConfDir === null) {
		console.error('You must specify "nginxConfDir" in your configuration.');
		configError = true;
	}

	if (config.nginxAppDir === null) {
		console.error('You must specify "nginxAppDir" in your configuration.');
		configError = true;
	}

	if (config.serverName === null) {
		console.error('You must specify "serverName" in your configuration.');
		configError = true;
	}

	if (config.galleryDir === null) {
		console.error('You must specify "galleryDir" in your configuration.');
		configError = true;
	}

	if (config.ssl) {
		if (config.sslCertificate === null) {
			console.error('You must specify "ssl.certificate" in your configuration.');
			configError = true;
		}

		if (config.sslCertificateKey === null) {
			console.error('You must specify "ssl.certificateKey" in your configuration.');
			configError = true;
		}

		if (config.sslLetsEncrypt && (config.sslHttpPort !== 80)) {
			console.error('When using "ssl.letsEncrypt" in your configuration, then "ssl.httpPort" must be 80.');
			configError = true;
		}
	}

	if (configError) {
		process.exit(2);
	}

	if (config.port === null) {
		config.port = config.ssl === false ? 80 : 443;
	}

	if (config.path !== null) {
		config.path = '/' + config.path.replace(/^(\/)/, '');
	} else {
		config.path = '';
	}
} catch (e) {
	console.error(`Can't read YAML configuration file "${configYamlFile}".`, e);
	process.exit(1);
}

// Compile CSS
const renderedCss = sass.renderSync({
	file: path.join(srcDir, 'sass/main.scss'),
	outputStyle: debugMode ? 'expanded' : 'compressed',
}).css.toString().trim();

// Compile JS

const bundle = await rollup.rollup({
	input: path.join(srcDir, 'js/main.js'),
	plugins: [
		rollupReplace({
			'process.env.NODE_ENV': JSON.stringify(debugMode ? 'development' : 'production'),
			preventAssignment: true,
		}),
		rollupNodeResolve(),
		rollupCommonJS(),
		babel({
			babelHelpers: 'runtime',
			presets: [
				[
					'@babel/preset-env',
					{
						bugfixes: true,
						corejs: '3.9',
						targets: '>0.25%',
						useBuiltIns: 'usage',
					},
				],
			],
			compact: false,
			plugins: ['@babel/plugin-transform-runtime'],
			exclude: 'node_modules/core-js/**',
		}),
	].concat(debugMode ? [] : [terser()]),
});
const { output } = await bundle.generate({
	format: 'iife',
	name: 'gallery',
});
const renderedJs = output[0].code.trim();

// Build application

config.cssSha1 = sha1(renderedCss);
config.jsSha1 = sha1(renderedJs);

const nginxTemplate = fs.readFileSync(path.join(srcDir, 'templates/conf.ejs'), 'utf8');
const renderedNginxTemplate = ejs.render(nginxTemplate, config);

const xsltTemplate = fs.readFileSync(path.join(srcDir, 'templates/xslt.ejs'), 'utf8');
const renderedXsltTemplate = ejs.render(xsltTemplate, config);

fs.writeFileSync(config.nginxConfDir + '/static-nginx-gallery', renderedNginxTemplate);
fs.writeFileSync(config.nginxAppDir + '/static-nginx-gallery.xslt', renderedXsltTemplate);
fs.writeFileSync(config.nginxAppDir + '/static-nginx-gallery.css', renderedCss);
fs.writeFileSync(config.nginxAppDir + '/static-nginx-gallery.js', renderedJs);
