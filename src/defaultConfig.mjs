const defaultConfig = {
	// required
	nginxConfDir: null,
	nginxAppDir: null,
	serverName: null,
	galleryDir: null,
	// optional
	path: null,
	port: null,
	thumbnails: false,
	videoThumbnails: false,
	lightTheme: false,
	title: 'Gallery',
	favicon: false,
	subtitlesConvertSrtToVtt: false,
	ssl: false,
	sslCertificate: null,
	sslCertificateKey: null,
	sslRedirectHttpToHttps: true,
	sslHttpPort: 80,
	sslLetsEncrypt: false,
	httpAuth: false,
	// can't be rewritten in user configuration
	thumbnailsResizeWidth: 800,
	thumbnailsResizeHeight: 800,
	imageFilterBuffer: '100M',
	imageFilterJpegQuality: 85,
	imageFilterWebpQuality: 80,
	imageFilterSharpen: 50,
};

export default defaultConfig;
