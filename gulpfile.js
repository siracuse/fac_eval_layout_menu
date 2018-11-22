//commande d'installation
/*

npm install

// pour souvenir
npm install --save-dev gulp gulp-regex-rename gulp-babel babel-core  babel-preset-env gulp-sass gulp-sourcemaps gulp-autoprefixer gulp-notify gulp-plumber gulp-svg-sprite gulp-svgmin gulp-concat gulp-uglify
ou
npm i -D gulp gulp-regex-rename gulp-sass gulp-babel babel-core  babel-preset-env  gulp-sourcemaps gulp-autoprefixer gulp-notify gulp-plumber gulp-svg-sprite gulp-svgmin gulp-concat gulp-uglify
 */
//Requires
var gulp = require('gulp');

// Include plugins
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var notify       = require("gulp-notify");
var plumber      = require('gulp-plumber');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
const babel      = require('gulp-babel');
var rename       = require('gulp-regex-rename');

// Watcher
gulp.task('watch', function() {
  gulp.watch(['./css/**/*.scss'], ['css'])
	.on('change', function () {
        notify("CSS -> SCSS ==> OK").write('');
	});

  gulp.watch(['./js/a_compresser/*.js'], ['concat_minif'])
	.on('change', function () {
        notify("JS (concat)  ==> OK").write('');
	});
  gulp.watch(['./js/**/*es6.js'], ['js_babel'])
	.on('change', function () {
        notify("JS (babel)  ==> OK").write('');
	});
});

// tache CSS = compile vers mon_site.css et ajoute mon_site.css.map
gulp.task('css', function () {
	var onError = function(err) {
		notify.onError({
			title:    "Gulp",
			subtitle: "Problème!",
			message:  "Erreur CSS: <%= error.message %>",
			sound:    "Beep"
		})(err);
		this.emit('end');
	};
  return gulp.src('./css/mon_site.scss')
    .pipe(plumber({errorHandler: onError}))
	.pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded' // CSS non minifiée plus lisible ('}' à la ligne)
    }))
    .pipe(autoprefixer())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./css'));
});


// Concatener
gulp.task('concat_minif', function() {
	var onError = function(err) {
		notify.onError({
			title:    "Gulp",
			subtitle: "Problème!",
			message:  "Erreur JS: <%= error.message %>",
			sound:    "Beep"
		})(err);
		this.emit('end');
	};
	return gulp.src(['./js/a_compresser/*.js'])
		.pipe(plumber({errorHandler: onError}))
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(concat('mon_site.min.js', {newLine: ';'}))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./js'));
});

gulp.task('js_babel', function() {
	var onError = function(err) {
		notify.onError({
			title:    "Gulp",
			subtitle: "Problème!",
			message:  "Erreur JS babel: <%= error.message %>",
			sound:    "Beep"
		})(err);
		this.emit('end');
	};
	return gulp.src(['js/**/*.es6.js'])
		.pipe(plumber({errorHandler: onError}))
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(rename(/\.es6/, ''))
		.pipe(gulp.dest('./js'));
});



gulp.task('default', ['css', 'concat_minif']);

var svgSprite    = require('gulp-svg-sprite');
//var plumber      = require('gulp-plumber');
var baseDir      = './svg';   // <-- Set to your SVG base directory
//var baseDir      = 'svgmin';   // <-- Set to your SVG base directory
var svgGlob      = '**/*.svg';       // <-- Glob to match your SVG files
var outDir       = './img/';     // <-- Main output directory
var config       = {
	"shape": {
		"spacing": {
			"box": "icon"
		}
	},
	"mode": {
/*		"view": {
			"dest": ".",
			"sprite": "sprite_css_pictos.svg",
			"bust": false
		},
*/
		"symbol": {
			"dest": ".",
			"sprite": "sprite_symbol_pictos.svg",
		}
	}
};

gulp.task('svgsprite', function() {
    return gulp.src(svgGlob, {cwd: baseDir})
        .pipe(plumber())
        .pipe(svgSprite(config)).on('error', function(error){ console.log(error); })
        .pipe(gulp.dest(outDir));
});

var svgmin = require('gulp-svgmin');

gulp.task('svgmin', function () {
    return gulp.src('./svg/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('./svgmin'));
});
