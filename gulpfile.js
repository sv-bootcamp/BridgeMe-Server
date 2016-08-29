const gulp = require('gulp');
const tape = require('gulp-tape');
const faucet = require('faucet');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const server = require('gulp-develop-server');
const runSequence = require('run-sequence');
const install = require('gulp-install');
const apidoc = require('gulp-apidoc');
const jscs = require('gulp-jscs');
const originalJs = './src/**/**/*.js';
const unitest = require('unitest');

gulp.task('server:start', () => {
  server.listen({
    path: 'server',
  });
});

gulp.task('server:restart', () => {
  gulp.watch(['server'], server.restart);
});

gulp.task('babel', () => {
  return gulp.src(originalJs)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist-server'));
});

gulp.task('install', () => {
  gulp.src('./package.json')
    .pipe(install());
});

gulp.task('lint', () => {
  return gulp.src(originalJs)
    .pipe(eslint({
      configFile: './.eslintrc.json',
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('apidoc', (done) => {
  apidoc({
    src: 'src/',
    dest: 'apidoc/',
  }, done);
});

gulp.task('test:index', () => {
  return gulp.src('./dist-server/test/index.js')
    .pipe(tape({
      reporter: faucet(),
    }));
});

gulp.task('test:test', () => {
  const output = unitest({
    // browser: 'dist-test/test/browser/index.js',
    node: 'dist-server/test/index.js',
    report: ['text']
  }, (exitCode) => {
    if (exitCode !== 0) {
      console.error('Tests failed! - Test script exited with non-zero status code.');
    }
    return true;
  });
  output.pipe(process.stdout);
});


gulp.task('test', () => {
  runSequence('babel','test:index');
});

gulp.task('jscs', () => {
  return gulp.src('src/**/*.js')
    .pipe(jscs({ fix: true }))
    .pipe(gulp.dest('src'));
});

gulp.task('default', () => {
  runSequence('babel', 'server:start');
});
