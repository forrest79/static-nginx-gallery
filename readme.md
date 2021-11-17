# StaticNginxGallery

Static gallery (images, videos with subtitles, other files) on the top of the nginx web server.

**Based on https://stackoverflow.com/questions/39575873/is-there-a-way-to-create-a-simple-static-image-gallery-in-nginx-without-any-thir.**

Just put your files in the folder and get it instantly in the gallery - no background service is running, files are read directly from your file system. With the XSTL is directory listing converted to an HTML page with some controlling JavaScript and CSS.

![List files](/docs/gallery-list.jpg)

![Image detail](/docs/gallery-image.jpg)

![Video detail](/docs/gallery-video.jpg)

## About gallery

### Features:

- images...
   - reading EXIF (via [exifr](https://github.com/MikeKovarik/exifr))
   - show GPS on the Google Maps
   - view photo sphere panoramas (via [Photo Sphere Viewer](https://photo-sphere-viewer.js.org/))
   - an optional automatic image thumbnails with an optional cache
- videos (via [Plyr](https://plyr.io/)) *with optional auto conversion SRT subtitles to supported VTT*
- other files (just view and download)
- sharing link to the gallery
- sharing on social networks (via [shareon](https://shareon.js.org/))
- as lightbox is used [GLightbox](https://biati-digital.github.io/glightbox/)
- HTTP or HTTPS (Let's encrypt support - via external tools - [dehyhrated](https://dehydrated.io/) for example)
- custom gallery title/favicon and many more settings
- password access (via HTTP Basic Auth)

### What do I need?

[nginx](https://www.nginx.com/) to run gallery and [node.js](https://nodejs.org) version 16 or greater with npm to generate configuration. Nothing more, really. This tool generates nginx configuration and one XSLT, JS and CSS file to control whole gallery and all supported tools.

You need nginx with the [XSTL module](http://nginx.org/en/docs/http/ngx_http_xslt_module.html). In Debian/Ubuntu world this is the `nginx-full` package.

If you want an automatic image thumbnail (with a cache) you need also the [images filter module](http://nginx.org/en/docs/http/ngx_http_image_filter_module.html). Still the `nginx-full` in Debian/Ubuntu.

For an automatic SRT to VTT conversion you need the [lua module](https://github.com/openresty/lua-nginx-module). This is the `nginx-extras` package.

> This configuration generator was tested on the linux only.

## How to use it

Clone this repository or download source files from GitHub and install npm modules with `npm install`.

Then you need configuration file in YAML:

```yaml
nginxConfDir: /etc/nginx/sites-available/
nginxAppDir: /etc/nginx/apps/static-nginx-gallery/
serverName: gallery.test
galleryDir: /var/www/gallery
```

These are the only 4 required items you always must specify:
- `nginxConfDir` - where nginx configuration file will be generated (file will have `static-nginx-gallery` name) - don't forget to enable configuration in nginx, when it's not generated into included files - in Debian `sudo ln -s /etc/nginx/sites-available/static-nginx-gallery /etc/nginx/sites-enabled/static-nginx-gallery` and `sudo service nginx reload`
- `nginxAppDir` - where the other (`XSLT`, `JS` and `CSS`) files will be stored
- `serverName` - domain where the gallery will be accessible
- `galleryDir` - root directory with all your files (you can access also all subdirectories)

There are some more optional options:

```yaml
path: null # /path/
port: null # null = use default - 80 for HTTP, 443 for HTTPS
thumbnails: false # bool - yes/no or string with cache directory
lightTheme: false # bool - yes/no
title: 'Gallery' # <h1> and <title>
favicon: false # or string with a path to custom favicon (in PNG format)
subtitles:
  convertSrtToVtt: false
ssl: false # explain later
httpAuth: false # or string with htpasswd auth file
```

- `path` - by default, gallery is accessible at serverName host `/`, this can change the default path to `path` (for example `http://gallery.test/some-path/` it you set `serverName: gallery.test` and `path: 'some-path'`) 
- `port` - `null` is used for default value - `80` for HTTP or `443` for HTTPS version, but you can use your own, if you need
- `thumbnails` - by default, thumbnail images in the list are original images, this could cause to download a lot of data for one page. When you set this to `true`, nginx will generate for all images smaller thumbnails on the fly, so data usage will be less, but more processor time will be used to generate thumbnails on every request. The last option is to provide a `string` with a directory, where this thumbnails will be cached, so every thumbnail will be generated just once. This has just one disadvantage: when a thumbnail is generated, it's never regenerated, even if the original image is changed. You must remove cached thumbnail to regenerate it. *`images` module is needed in nginx for this*
- `lightTheme` - gallery is by default in dark theme, set this to `true` and light theme will be used
- `title` - can change default `<title>` and `<h1>` which is `Gallery`
- `favicon` - can change default favicon file, use path to a PNG image
- `subtitels` -> `convertSrtToVtt` - if set to `true` try to automatically convert existing SRT subtitles to VTT (only VTT subtitles are supported in video player) - *`LUA` module is needed in nginx*
- `httpAuth` - use can specify a `string` with a path to htpasswd file for enabling user/password access to the gallery

> How to generate `htpasswd` file? In linux with installed `openssl` you can use `printf "USER:$(openssl passwd -crypt PASSWORD)\n" >> .htpasswd` - just change `USER` with the correct username and `PASSWORD` with the correct password. `.htpasswd` is path to the generated file.

In most cases, you want to run your gallery on HTTPS protocol. You can also use own HTTPS (or other, for example for access restriction I can recommend [oauth2-proxy](https://github.com/oauth2-proxy/oauth2-proxy)) proxy and keep running gallery on HTTP:

```yaml
ssl:
  certificate: '/etc/letsencrypt/certs/gallery.test/fullchain.pem' # required if ssl is set
  certificateKey: '/etc/letsencrypt/certs/gallery.test/privkey.pem' # required if ssl is set
  redirectHttpToHttps: true # bool - yes/no
  httpPort: 80 # HTTP port to redirect to HTTPS or for Let's encrypt (if Let's encrypt is used, must be 80)
  letsEncrypt: false # or string with a path to directory to store ACME challenge
```

- `certificate` - path to SSL certificate, required
- `certificateKey` - path to SSL certificate key, required
- `redirectHttpToHttps` - by default, for HTTPS is also generated a HTTP block, that just redirect HTTP to HTTPS. If you don't need this, set config to `false`
- `httpPort` - belongs to the previous config, set port for HTTP block for redirect, default is `80`. If you use Let's encrypt config, you must keep it to `80`.
- `letsEncrypt` - when `string` path is provided, to HTTP block is generated snippet to enable auto generating Let's encrypt certificates. You also need some tool to generate certificates, for example [dehyhrated](https://dehydrated.io/). Before first certificate is generated, you must comment SSL certificate and SSL certificate key lines.

### Build configuration

So, we have `config.yml` with our configuration, now just run:

```bash
bin/build config.yml
``` 

or:

```bash
npm run build config.yml
``` 

You will probably need `root` rights to proper save configuration, so use:

```bash
sudo bin/build config.yml
```

And after that don't forget to reload your nginx configuration. In Debian/Ubuntu like this:

```bash
sudo service nginx reload
```

You can also add `-d` or `--debug` option to disable JS and CSS minimization.

### Preferable nginx configuration

It's recommended to add this option to main nginx configuration, the `http` section:

```
variables_hash_max_size 4096
```

In Debian/Ubuntu in file `/etc/nginx/nginx.conf`.

## Development

You can make your own changes in CSS, JavaScript and HTML structure.

CSS is in the [src/sass/main.scss](/src/sass/main.scss) file and is compiled with the [SASS preprocessor](https://sass-lang.com/).

JavaScript is in the [src/js/main.js](/src/js/main.js) file and is compiled with the [Rollup](https://rollupjs.org/).

HTML can be changed in the [XSLT template](/src/templates/xslt.ejs).

And the generated nginx configurations can be updated in the [configuration](/src/templates/conf.ejs).

XSLT and nginx configurations are generated with the [EJS templates](https://ejs.co/).

To check your JS coding standard, run [eslint](https://eslint.org/).

```bash
npm run eslint
```

### Tests

In this repository, there are some tests configurations. They expected Debian/Ubuntu linux with installed `nginx-extras` package, symlinked directory [tests](/tests) to the `/var/www/static-nginx-gallery/` and pointed host `gallery.test` to the nginx. Self-signed certificate is used for SSL configuration.

You can run `sudo tests/run-tests` that will try all test configurations one by one.
