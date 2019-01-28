"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso"); // для css.min
var rename = require("gulp-rename"); // для css.min
const imagemin = require("gulp-imagemin"); // для min jpg/png/svg
const webp = require("gulp-webp"); // для webp conversion
var rename = require("gulp-rename"); // для svg sprite
var del = require("del"); //для удаления папки build
var htmlmin = require("gulp-htmlmin"); //для минификации html
var uglify = require("gulp-uglify"); // для минификации js

// локальный сервер

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/js/script.js", gulp.series("js", "refresh"));
  gulp.watch("source/js/backend.js", gulp.series("js2", "refresh"));
  gulp.watch("source/js/popup.js", gulp.series("js3", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

// обновление страницы

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

// css.min

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(server.stream())
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

// min jpg/png/svg

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3}),
      imagemin.jpegtran({ progressive: true}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
          {cleanupIDs: true}
        ]
      })
    ]))
    .pipe(gulp.dest("source/img"));
});

// posthtml и min html

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"))
});

// min js

gulp.task("js", function () {
  return gulp.src("source/js/script.js")
  .pipe(plumber())
  .pipe(uglify())
  .pipe(rename("script.min.js"))
  .pipe(gulp.dest("build/js"))
});

gulp.task("js2", function () {
  return gulp.src("source/js/backend.js")
  .pipe(plumber())
  .pipe(uglify())
  .pipe(rename("backend.min.js"))
  .pipe(gulp.dest("build/js"))
});

gulp.task("js3", function () {
  return gulp.src("source/js/popup.js")
  .pipe(plumber())
  .pipe(uglify())
  .pipe(rename("popup.min.js"))
  .pipe(gulp.dest("build/js"))
});
// удаление папки билд

gulp.task("clean", function () {
  return del("build");
});

// копирование

gulp.task("copy", function ()  {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/css/**",
    "source/js/**"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

// запуск билда

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "html",
  "images",
  "js",
  "js2",
  "js3"
));

gulp.task("start", gulp.series("build", "server"));
