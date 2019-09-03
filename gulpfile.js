"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var svgSprites = require("gulp-svg-sprites");
var rename = require("gulp-rename");
var csso = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var del = require("del");
var htmlmin = require("gulp-htmlmin");
var jsmin = require("gulp-uglify");

gulp.task("css", function() {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("server", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/*.html", gulp.series("html"));
});

gulp.task("inline-svg", function() {
  return gulp.src("source/img/inline-svg/*.svg")
    .pipe(imagemin([imagemin.svgo()]))
    .pipe(svgSprites({
      mode: "symbols"
    }))
    .pipe(gulp.dest("source/img"));
});

gulp.task("imagemin", function() {
  return gulp.src("source/img/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function() {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest("build/img"));
});

gulp.task("jsmin", function() {
    return gulp.src("source/js/*.js")
        .pipe(jsmin())
        .pipe(gulp.dest("build/js/"))
});

gulp.task("copy", function() {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/js/**/*.js",
      "source/*.ico",
      "source/img/svg/*.svg"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
});

gulp.task("compressImage", gulp.series("imagemin", "webp"));
gulp.task("build", gulp.series("clean", "html", "jsmin", "compressImage", "inline-svg", "copy", "css"));
gulp.task("start", gulp.series("build", "server"));
