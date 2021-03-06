const _PROJECTNAME = 'citodon';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	batch = require('gulp-batch'),
	print = require('gulp-print'),
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	concatCSS = require('gulp-concat-css'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	imageResize = require('gulp-image-resize'),
	tinypng = require('gulp-tinypng'),

	browserSync = require('browser-sync').create();

/*
 * To use the gulp-image-resize, it needs of some dependencies:
 * https://www.npmjs.com/package/gulp-image-resize
 *
 * Or, install:
 *
 * Ubuntu:
 * apt-get install imagemagick
 * apt-get install graphicsmagick
 *
 * Mac:
 * brew install imagemagick
 * brew install graphicsmagick
 *
 * Windows & others:
 * http://www.imagemagick.org/script/binary-releases.php
 * */

const tinypngToken = false;

// Source Content structure

var source = {
	content: '*',
	location: 'src/'
};

source.css = {
	content: '**/*.css',
	location: source.location + 'css/'
};

source.js = {
	content: '*.js',
	location: source.location + 'js/'
};

source.index = {
	content: '**/*.html',
	location: source.location
};

source.images = {
	content: '*.*',
	location: source.location + 'img/'
};

source.images.largePhotos = {
	content: '*.*',
	location: source.images.location + 'largePhotos/'
};

// Source Content structure

var dist = {
	content: '*',
	location: 'public/dist/'
};

dist.css = {
	content: '*.css',
	location: dist.location + 'css/'
};

dist.js = {
	content: '*.js',
	location: dist.location + 'js/'
};

dist.images = {
	content: '*.*',
	location: dist.location + 'img/'
};

// CSS

gulp.task('css', function() {
	gulp.src(source.css.location + source.css.content)
		.pipe(concatCSS(_PROJECTNAME + '.css'))
		.pipe(gulp.dest(dist.css.location))
		.pipe(plumber())
		.pipe(cleanCSS())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(dist.css.location));
});

gulp.task('css-watch', ['css'], function () {
	watch(source.css.location + source.css.content, batch(function (events, done) {
		gulp.start('css', done);
		browserSync.reload();
	}));
});

// JS

gulp.task('js', function() {
	gulp.src(source.js.location + source.js.content)
		.pipe(concat(_PROJECTNAME + '.js'))
		.pipe(gulp.dest(dist.js.location))
		.pipe(plumber())
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest(dist.js.location));
});

gulp.task('js-watch', ['js'], function () {
	watch(source.js.location + source.js.content, batch(function (events, done) {
		gulp.start('js', done);
		browserSync.reload();
	}));
});

// IMAGES

gulp.task('resizePhotos', function () {
	gulp.src(source.images.location + source.images.content)
		.pipe(imageResize({
			height : 960,
			upscale : false
		}))
		.pipe(gulp.dest(dist.location + source.images.location));
});

gulp.task('resizeLargePhotos', function () {
	gulp.src("src/img/largePhotos/*.*")
		.pipe(imageResize({
			height : 960,
			upscale : false
		}))
		.pipe(gulp.dest(dist.images.location));
});

gulp.task('tinyPhotosSource', function () {
	if (tinypngToken)
		gulp.src(source.images.location + source.images.content)
			.pipe(tinypng(tinypngToken))
			.pipe(gulp.dest(source.images.location));
	else
		console.log('TinyPNG Token Required');
});

// SERVER

gulp.task('serve', function () {

	// Serve files from the root of this project
	browserSync.init({
		server: {
			baseDir: "./public/",
			index: "index.html",
			routes: {
				"/home": "./index.html"
			}
		}
	});

	gulp.watch(source.index.content).on('change', browserSync.reload);

});

gulp.task('default', ['serve', 'css-watch', 'js-watch']);

/*----------------------*/
/* FAVICON */

var realFavicon = require('gulp-real-favicon');
var fs = require('fs');

var FAVICON_DATA_FILE = 'faviconData.json';
var MASTER_PICTURE_PATH = 'public/dist/icons/original.png';
var DEST_ICONS = 'public/dist/icons';
var ICONS_PREFIX = 'https://citodon.com.br/dist/icons/';
var APP_NAME = 'Citodon - Palmital';
var BG_COLOR = '#b91d47';
var HTML_INJECT_FILES_PATH = 'public/meta.html';
var HTML_INJECT_FILES_DEST = 'public';

gulp.task('generate-favicon', function(done) {
	realFavicon.generateFavicon({
		masterPicture: MASTER_PICTURE_PATH,
		dest: DEST_ICONS,
		iconsPath: ICONS_PREFIX,
		design: {
			ios: {
				pictureAspect: 'noChange',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: true,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				},
				appName: APP_NAME
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: BG_COLOR,
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				},
				appName: APP_NAME
			},
			androidChrome: {
				pictureAspect: 'shadow',
				themeColor: BG_COLOR,
				manifest: {
					name: APP_NAME,
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'blackAndWhite',
				threshold: 92.96875,
				themeColor: BG_COLOR
			}
		},
		settings: {
			compression: 2,
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false
		},
		markupFile: FAVICON_DATA_FILE
	}, function() {
		done();
	});
});

gulp.task('inject-favicon-markups', function() {
	return gulp.src([HTML_INJECT_FILES_PATH])
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(gulp.dest(HTML_INJECT_FILES_DEST));
});

gulp.task('check-for-favicon-update', function(done) {
	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
	realFavicon.checkForUpdates(currentVersion, function(err) {
		if (err) {
			throw err;
		}
	});
});

