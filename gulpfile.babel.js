import path from 'path';
import gulp from 'gulp';
import rimraf from 'rimraf';
import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();
import {Instrumenter} from 'isparta';
import webpackStream from 'webpack-stream';
import {Server} from 'karma';
import package_json from './package.json';
import webpack_config from './webpack.config.js';
import esdoc_json from './esdoc.json';

const files = {
  src: {
    js: 'src/**/*.js',
  },
  test: {
    js: 'test/**/*.js',
  },
  mock: {
    js: 'mock/**/*.js',
  },
  conf: {
    js: '*.js',
  },
  doc: 'doc/**/*',
};

const dirs = {
  src: 'src',
  dst: '.',
  webpack_dst: 'dist',
  doc: 'doc',
};

const year = new Date().getFullYear();
const license = `/* (C) ${year} Narazaka : Licensed under The MIT License - https://narazaka.net/license/MIT?${year} */\n`;

function notify_success(title, message = '<%= file.relative %>', onLast = false, sound = false) {
  return $.notify({ title: title, message: message, onLast: onLast, sound: false })
}

function notify_end(title, sound = false) {
  return notify_success(title, 'complete', true, sound);
}

function notify_error(title, sound = true) {
  return $.notify.onError({ title: title, message: 'Error: <%= error.message %>', sound: sound });
}

gulp.task('default', ['build']);

gulp.task('js', ['nodejs', 'webpack']);

gulp.task('nodejs', () =>
  gulp.src(files.src.js, {base: dirs.src})
    .pipe($.plumber({ errorHandler: notify_error('nodejs') }))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.header(license))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(dirs.dst))
    .pipe(notify_end('nodejs'))
);

gulp.task('webpack', () =>
  gulp.src(files.src.js)
    .pipe($.plumber({ errorHandler: notify_error('webpack') }))
    .pipe(webpackStream(webpack_config))
    .pipe($.header(license))
    .pipe(gulp.dest(dirs.webpack_dst))
    .pipe(notify_end('webpack'))
);

gulp.task('build', ['js', 'test', 'lint', 'doc']);

gulp.task('test', ['test-node', 'test-browser']);

gulp.task('test-cli', ['test-node', 'test-browser-cli']);

gulp.task('pre-test', function() {
  return gulp.src(files.src.js)
    .pipe($.istanbul({instrumenter: Instrumenter}))
    .pipe($.istanbul.hookRequire())
    .pipe(gulp.dest('test-tmp'));
});

gulp.task('test-node', ['pre-test'], () =>
  gulp.src(files.test.js, {read: false})
    .pipe($.plumber({ errorHandler: notify_error('test-node') }))
    .pipe($.mocha({ui: 'mocha-lazy-bdd'}))
    .pipe($.istanbul.writeReports())
    .pipe(notify_end('test-node'))
);

gulp.task('test-browser', ['pre-test'], function(done) {
  return new Server(
    {
      configFile: path.join(__dirname, '/karma.conf.js'),
      singleRun: true,
    },
    done
  ).start();
});

gulp.task('test-browser-cli', ['pre-test'], function(done) {
  return new Server(
    {
      configFile: path.join(__dirname, '/karma.conf.js'),
      singleRun: true,
      frameworks: ['mocha'],
      browsers: ['PhantomJS'],
    },
    done
  ).start();
});

gulp.task('test-browser-watch', ['pre-test'], function(done) {
  return new Server(
    {
      configFile: path.join(__dirname, '/karma.conf.js'),
    },
    done
  ).start();
});

gulp.task('lint', function() {
  return gulp.src(
    [files.src.js, files.test.js, files.mock.js, files.conf.js],
    {base: '.'}
  )
    .pipe($.eslint({useEslintrc: true}))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('lint-fix', function() {
  return gulp.src(
    [files.src.js, files.test.js, files.mock.js, files.conf.js]
  )
    .pipe($.eslint({useEslintrc: true, fix: true}))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
    .pipe(gulp.dest('.'));
});

gulp.task('clean-doc', function(done) {
  return rimraf(files.doc, done);
});

gulp.task('doc', ['clean-doc'], function() {
  esdoc_json.destination = dirs.doc;
  return gulp.src(dirs.src, {read: false, base: dirs.src})
    .pipe($.esdoc(esdoc_json));
});

gulp.task('watch', function() {
  gulp.start(['js', 'test-node', 'test-browser-watch', 'lint', 'doc']);
  return $.watch([files.src.js, files.test.js], function() {
    return gulp.start(['js', 'test-node', 'lint', 'doc']);
  });
});

