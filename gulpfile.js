const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');
const insert = require('gulp-insert');
const plumber = require('gulp-plumber');

gulp.task('default', ['watch']);

gulp.task('watch', ['build'], () =>
  gulp.watch('src/**/*.+(js|json)', ['build']));

gulp.task('build', ['transpile', 'copy'], () =>
  gulp.src('bin/app.js')
    .pipe(insert.prepend('#!/usr/bin/env node\n'))
    .pipe(rename('radio-player.js'))
    .pipe(gulp.dest('bin')));

gulp.task('transpile', () =>
  gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest('bin')));

gulp.task('copy', () =>
  gulp.src('src/**/*.!(js)')
    .pipe(gulp.dest('bin')));

gulp.task('lint', () =>
  gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));
