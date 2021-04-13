import GLightbox from 'glightbox';
import { Viewer } from 'photo-sphere-viewer';
import tippy from 'tippy.js';
import shareon from '../../node_modules/shareon/dist/noinit/shareon';
import exifr from '../../node_modules/exifr/dist/lite.esm';

const exifSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
	<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
	<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
</svg>`;

const mapSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
	<path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
	<path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
</svg>`;

const photo360Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
	<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
</svg>`;

const shareSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
	<path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
</svg>`;

const openSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
	<path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
</svg>`;

const downloadSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
	<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
	<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
</svg>`;

const copySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
	<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
	<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
</svg>`;

const copySvgDone = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
	<path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
	<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
	<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
</svg>`;

const closeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
	<path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
	<path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
</svg>`;

const customLightboxHTML = `
	<div id="glightbox-body" class="glightbox-container">
    	<div class="gloader visible"></div>
    	<div class="goverlay"></div>
    	<div class="gcontainer">
    		<div id="glightbox-slider" class="gslider"></div>
    		<button class="gnext gbtn" tabindex="0" aria-label="Next">{nextSVG}</button>
    		<button class="gprev gbtn" tabindex="1" aria-label="Previous">{prevSVG}</button>
    		<div class="sng-buttons">
				<a id="sng-exif" class="sng-button hidden" tabindex="9" aria-label="Show exif info">${exifSvg}</a>
				<a id="sng-map" class="sng-button hidden" tabindex="8" aria-label="Show on map">${mapSvg}</a>
				<a id="sng-photo360" class="sng-button hidden" tabindex="7" aria-label="Show photoshere">${photo360Svg}</a>
				<a id="sng-share" class="sng-button" tabindex="6"" data-position="3" aria-label="Share">${shareSvg}</a>
				<a id="sng-open" class="sng-button" tabindex="5"" data-position="2" aria-label="Open original in new tab" target="_blank">${openSvg}</a>
				<a id="sng-download" class="sng-button" tabindex="4" data-position="1" aria-label="Download" download>${downloadSvg}</a>
				<a id="sng-copy" class="sng-button" tabindex="3" data-position="1" aria-label="Copy URL to clipboard" download>${copySvg}</a>
			</div>
    		<button class="gclose gbtn" tabindex="2" aria-label="Close">${closeSvg}</button>
		</div>

		<div id="sng-exif-box-container">
			<div id="sng-exif-box"></div>
		</div>

		<div id="sng-map-box-container">
			<div id="sng-map-box"></div>
		</div>

		<div id="sng-share-box-container">
			<div class="shareon" id="sng-share-box">
				<a class="facebook"></a>
				<a class="linkedin"></a>
				<a class="pinterest"></a>
				<a class="pocket"></a>
				<a class="reddit"></a>
				<a class="telegram"></a>
				<a class="twitter"></a>
				<a class="whatsapp"></a>
			</div>
		</div>
	</div>

	<div id="sng-photo360-viewer-box" class="hidden"></div>
`;

const lightbox = GLightbox({
	lightboxHTML: customLightboxHTML,
	touchNavigation: true,
	loop: true,
	autoplayVideos: false,
	plyr: {
		config: {
			captions: {
				active: true,
				language: 'Subtitles',
				update: true,
			},
		},
	},
});

let buttons = null;

let copyButton = null;
let copyTimeout = null;

let exifButton = null;
let mapButton = null;
let photo360Button = null;
let photo360Viewer = null;

let exifTippy = null;
let exifTippyVisible = false;

let mapTippy = null;
let mapTippyVisible = false;

let shareTippy = null;
let shareTippyVisible = false;

const updateButtons = () => {
	let position = 1;
	for (let i = buttons.length - 1; i >= 0; i--) {
		const button = buttons[i];

		if (button.classList.contains('hidden')) {
			button.removeAttribute('data-position');
		} else {
			button.setAttribute('data-position', position.toString());
			position += 1;
		}
	}
};

const destroy = () => {
	copyButton.innerHTML = copySvg;
	if (copyTimeout !== null) {
		clearTimeout(copyTimeout);
		copyTimeout = null;
	}

	if (exifTippy !== null) {
		exifTippy.destroy();
		exifTippy = null;
	}

	if (mapTippy !== null) {
		mapTippy.destroy();
		mapTippy = null;
	}

	if (shareTippy !== null) {
		shareTippy.destroy();
		shareTippy = null;
	}
};

const updateExif = (info, gps) => {
	let html = '';

	if (Object.keys(info).length !== 0) {
		html += '<table>';
		Object.entries(info).forEach(([key, value]) => {
			html += `<tr><th>${key}</th><td>${value}</td></tr>`;
		});
		html += '</table>';
	}

	if (Object.keys(gps).length !== 0) {
		html += '<strong>GPS</strong><table>';
		Object.entries(gps).forEach(([key, value]) => {
			html += `<tr><th>${key}</th><td>${value}</td></tr>`;
		});
		html += '</table>';
	}

	document.getElementById('sng-exif-box').innerHTML = html;
};

const updateMap = (latitude, longitude) => {
	document.getElementById('sng-map-box').innerHTML = `<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=100%25&amp;hl=en&amp;q=${latitude},${longitude}&amp;t=&amp;z=10&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">`;
};

const addSubtitles = (url) => {
	const track = document.createElement('track');
	track.kind = 'captions';
	track.label = 'Subtitles';
	track.srclang = 'Subtitles';
	track.default = true;
	track.src = url;
	document.querySelector('.gslide.loaded.current video').appendChild(track);
};

lightbox.on('open', () => {
	buttons = document.querySelectorAll('div.sng-buttons .sng-button');

	copyButton = document.getElementById('sng-copy');
	copyButton.addEventListener('click', (event) => {
		event.stopPropagation();

		navigator.clipboard.writeText(window.location.toString()).then(() => {
			copyButton.innerHTML = copySvgDone;
			setTimeout(() => {
				copyButton.innerHTML = copySvg;
			}, 2000);
		});
	});

	exifButton = document.getElementById('sng-exif');
	exifButton.addEventListener('click', (event) => {
		event.stopPropagation();

		if (exifTippy === null) {
			exifTippy = tippy(exifButton, {
				trigger: 'manual',
				interactive: true,
				appendTo: document.body,
				zIndex: 999999,
				content: document.getElementById('sng-exif-box-container').innerHTML,
				allowHTML: true,
				onShown() {
					exifTippyVisible = true;
				},
				onHidden() {
					exifTippyVisible = false;
				},
			});
		}

		if (exifTippyVisible) {
			exifTippy.hide();
		} else {
			exifTippy.show();
		}
	});

	mapButton = document.getElementById('sng-map');
	mapButton.addEventListener('click', (event) => {
		event.stopPropagation();

		if (mapTippy === null) {
			mapTippy = tippy(mapButton, {
				trigger: 'manual',
				interactive: true,
				appendTo: document.body,
				zIndex: 999999,
				content: document.getElementById('sng-map-box-container').innerHTML,
				allowHTML: true,
				onShown() {
					mapTippyVisible = true;
				},
				onHidden() {
					mapTippyVisible = false;
				},
			});
		}

		if (mapTippyVisible) {
			mapTippy.hide();
		} else {
			mapTippy.show();
		}
	});

	const photo360ViewerBox = document.getElementById('sng-photo360-viewer-box');
	photo360Button = document.getElementById('sng-photo360');
	photo360Button.addEventListener('click', (event) => {
		event.stopPropagation();

		photo360ViewerBox.classList.remove('hidden');
		if (photo360Viewer === null) {
			photo360Viewer = new Viewer({
				container: photo360ViewerBox,
				panorama: photo360Button.getAttribute('data-url'),
				caption: photo360Button.getAttribute('data-title'),
				touchmoveTwoFingers: true,
				mousewheelCtrlKey: true,
				navbar: [
					'autorotate',
					'zoom',
					'move',
					'fullscreen',
					'caption',
					{
						content: 'Close',
						onClick: () => {
							photo360ViewerBox.classList.add('hidden');
						},
					},
				],
			});
		} else {
			photo360Viewer.setPanorama(photo360Button.getAttribute('data-url')).then(() => {
				photo360ViewerBox.querySelector('.psv-caption-content').innerHTML = photo360Button.getAttribute('data-title');
			});
		}
	});

	const shareButton = document.getElementById('sng-share');
	shareButton.addEventListener('click', (event) => {
		event.stopPropagation();

		if (shareTippy === null) {
			shareon();
			shareTippy = tippy(shareButton, {
				trigger: 'manual',
				interactive: true,
				appendTo: document.body,
				zIndex: 999999,
				maxWidth: 186,
				content: document.getElementById('sng-share-box-container').innerHTML,
				allowHTML: true,
				onShown() {
					shareTippyVisible = true;
				},
				onHidden() {
					shareTippyVisible = false;
				},
			});
		}

		if (shareTippyVisible) {
			shareTippy.hide();
		} else {
			shareTippy.show();
		}
	});
});

lightbox.on('close', () => {
	destroy();

	const uri = window.location.toString();
	if (uri.indexOf('#') > 0) {
		window.history.replaceState(null, null, uri.substring(0, uri.indexOf('#')));
	}
});

lightbox.on('slide_changed', ({ current }) => {
	updateButtons();

	destroy();

	// Prev and current are objects that contain the following data
	const { slideConfig } = current;

	const url = slideConfig.href;
	const fileName = slideConfig.title; // in title is the file name, in href is complete URL

	window.history.replaceState(null, null, '#file-' + btoa(fileName));

	// Exif + Map + Photo360
	exifButton.classList.add('hidden');
	mapButton.classList.add('hidden');
	photo360Button.classList.add('hidden');

	if (slideConfig.type === 'image') {
		exifr.parse(url, {
			// Segments (JPEG APP Segment, PNG Chunks, HEIC Boxes, etc...)
			tiff: true,
			xmp: true,
			// Sub-blocks inside TIFF segment
			ifd0: true, // aka image
			ifd1: false, // aka thumbnail
			exif: true,
			gps: true,
			interop: false,
			// Formatters
			translateKeys: true,
			translateValues: true,
			reviveValues: true,
			sanitize: true,
			mergeOutput: false,
			silentErrors: true,
		}).then((data) => {
			const info = {};
			const gps = {};

			if (data.exif) {
				Object.entries(data.exif).forEach(([key, value]) => {
					info[key] = value.toString();
				});
			}

			if (data.ifd0) {
				Object.entries(data.ifd0).forEach(([key, value]) => {
					info[key] = value.toString();
				});
			}

			if (data.gps) {
				const { latitude, longitude } = data.gps;
				updateMap(latitude, longitude);
				mapButton.classList.remove('hidden');

				Object.entries(data.gps).forEach(([key, value]) => {
					gps[key] = value.toString();
				});
			}

			if (info !== {} || gps !== {}) {
				updateExif(info, gps);
				exifButton.classList.remove('hidden');
			}

			if (data.GPano) {
				if (data.GPano.IsPhotosphere || data.GPano.UsePanoramaViewer) {
					photo360Button.setAttribute('data-url', url);
					photo360Button.setAttribute('data-title', fileName);
					photo360Button.classList.remove('hidden');
				}
			}

			updateButtons();
		});
	} else if (slideConfig.type === 'video') {
		if (!slideConfig.subtitlesChecked) {
			slideConfig.subtitlesChecked = true;

			const subtitlesUrl = url.split('.').slice(0, -1).join('.') + '.vtt';

			fetch(subtitlesUrl).then((response) => {
				if (response.status === 200) {
					addSubtitles(subtitlesUrl);
					slideConfig.subtitlesUrl = subtitlesUrl;
				}
			});
		} else if (slideConfig.subtitlesUrl) {
			addSubtitles(slideConfig.subtitlesUrl);
		}
	}

	// Activate sharing
	const shareBox = document.getElementById('sng-share-box');
	shareBox.setAttribute('data-url', url);
	shareBox.setAttribute('data-title', fileName);

	// Activate open in new tab and download
	document.getElementById('sng-download').setAttribute('href', url);
	document.getElementById('sng-open').setAttribute('href', url);
});

// open file by hash
if (window.location.hash.startsWith('#file-')) {
	try {
		const filename = atob(window.location.hash.substr(6));
		const items = document.querySelectorAll('a.glightbox');
		const itemCount = items.length;
		for (let i = 0; i < itemCount; i++) {
			if (items[i].getAttribute('href') === filename) {
				lightbox.openAt(i);
				break;
			}
		}
	} catch (e) {
		console.error(e);
	}
}
