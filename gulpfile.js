var gulp = require("gulp");
var htmlmin = require("gulp-htmlmin");
var csso = require("gulp-csso");
var sync = require("browser-sync").create();
var del = require("del");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");


const imagemin = require('gulp-imagemin');
const webp = require("gulp-webp");

 // Server

 gulp.task("server", function() {
  sync.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false,
    port: 3000
  })
});
// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("html"));
}

// Styles

gulp.task("clean", function () {
  return del("build");
});

 gulp.task("copy", function() {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**",
      "source/js/**"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});


gulp.task("style", function() {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
});


gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"))
});

gulp.task("js", function () {
  return gulp.src("source/js/**/*.js")
    .pipe(jsmin())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("build/js"))
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("build/img"))
});

gulp.task("sprite", function () {
  return gulp.src("sourse/img/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

 gulp.task("build", gulp.series(
   "clean", "copy", "html", "style", "images", "sprite",
));


gulp.task("start", gulp.series(
  "build", "server",
));
