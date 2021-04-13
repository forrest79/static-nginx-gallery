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
	imageFilterResizeWidth: 800,
	imageFilterResizeHeight: 800,
	imageFilterBuffer: '100M',
	image_filter_jpeg_quality: 85,
	image_filter_webp_quality: 80,
	image_filter_sharpen: 50,
};

export default defaultConfig;
