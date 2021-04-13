import { Command } from 'commander/esm.mjs';
import fs from 'fs';
import crypto from 'crypto';
import yaml from 'yaml';
import ejs from 'ejs';
import * as rollup from 'rollup';
import sass from 'node-sass';

const program = new Command();

program
	.option('-d, --debug', 'output extra debugging')
	.option('-s, --small', 'small pizza size')
	.option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(process.argv);

const options = program.opts();
if (options.debug) console.log(options);
console.log('pizza details:');
if (options.small) console.log('- small pizza size');
if (options.pizzaType) console.log(`- ${options.pizzaType}`);

// Try the following:
//    node options-common.js -p
//    node options-common.js -d -s -p vegetarian
//    node options-common.js --pizza-type=cheese

try {
	const file = fs.readFileSync('./config/sample.yml', 'utf8');
	console.log(yaml.parse(file));
} catch {
	console.error('Can\'t read configuration file.');
	process.exit(1);
}

const inputOptions = {
	input: './src/js/main.js',
};

const bundle = await rollup.rollup(inputOptions);
const { output } = await bundle.generate({});
const renderedJs = output[0].code.trim();

const renderedCss = sass.renderSync({
  file: './src/sass/main.scss',
  outputStyle: 'compressed',
}).css.toString().trim();

const sha1 = (data) => crypto.createHash('sha1').update(data).digest('hex');

const nginxTemplate = fs.readFileSync('./templates/nginx.conf.ejs', 'utf8');
const renderedNginxTemplate = ejs.render(nginxTemplate, {
	outputDir: '/etc/nginx/sites-available',
	ssl: true,
	port: 443,
	redirectHttpToHttps: true,
	redirectPortFromHttp: 80,
	serverName: 'gallery.forrest79.net.test',
	path: 'show',
	rootDir: '/var/www/static-nginx-gallery/example',
	sslCertificate: '/var/www/static-nginx-gallery/ssl/gallery.forrest79.net.test.crt',
	sslCertificateKey: '/var/www/static-nginx-gallery/ssl/gallery.forrest79.net.test.key',
	css: renderedCss,
	cssSha1: sha1(renderedCss),
	js: renderedJs,
	jsSha1: sha1(renderedJs),
});

//console.log(renderedNginxTemplate);

const xsltTemplate = fs.readFileSync('./templates/static-nginx-gallery.xslt.ejs', 'utf8');
const renderedXsltTemplate = ejs.render(xsltTemplate, {
	path: 'show',
	cssSha1: sha1(renderedCss),
	jsSha1: sha1(renderedJs),
});

fs.writeFileSync('/etc/nginx/sites-available/nginx-static-gallery', renderedNginxTemplate);
fs.writeFileSync('/etc/nginx/sites-available/nginx-static-gallery.xslt', renderedXsltTemplate);
