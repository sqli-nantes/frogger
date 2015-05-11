"use strict";
// Include gulp
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps")
var path = require("path");
var browserSync = require("browser-sync").create();
var less = require("gulp-less");
var nodemon = require("gulp-nodemon");
var reload = browserSync.reload;

gulp.task('serve',  ['less', 'nodemon'], function(){
  browserSync.init({
    proxy:'localhost:8080'
  });
  gulp.watch("less/**/*.less", ['less']);
  gulp.watch("./**/*.html").on('change', reload);
  gulp.watch("./*.js").on('change', reload);  
});

gulp.task('less',function(){
  return gulp.src('less/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'))
    .pipe(reload({stream:true}));
});

gulp.task('nodemon', function(cb){
  return nodemon({
    script : 'server.js'
  }).on('start', function(){
    cb();
  })
});

/* Default task */
gulp.task("default", ["serve"]);