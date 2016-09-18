var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});
var _ = require('lodash');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var fs = require('fs');
var path = require('path');
var port = process.env.PORT  || config.defaultPort;
var wiredep = require('gulp-wiredep');
//NOTE: for blog tests keeping your as an example on how to segment/modularize gulp
// var requireDir = require('require-dir');
// var dir = requireDir('./gulp-blog-building-tasks');

// TODO: things like site map an http access, README?


/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default',['help']);


 /*****
  * First Stage Dev & Serve Dev
  * Before Opitmized Build
  * NOTE: some subtasks used in build
  *****/

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('test', ['vet', 'templatecache'],  function () {
    startTests(true /* singleRun */, done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
gulp.task('autotest', ['vet', 'templatecache'],  function () {
    startTests(false /* singleRun */, done);
});

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function () {
  log('Analyzing source with JSHint and JSCS');

  return gulp
    .src(config.alljs)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', {verbose: true}));
    // .pipe($.jshint.reporter('fail'));

});

/**
 * serve the dev environment
 * --nosync TODO: need to confirm this works & fix inject
 */
gulp.task('serve-dev', ['inject'], function () {
  serve(true /* isDev */);
});


/**
 * Injects css and js; adds templatecache file
 * Cleans code (not images or fonts) in build
 *
 */
 gulp.task('inject', ['wiredep', 'templatecache'], function () {
     log('Wire up the app css into the html, and call wiredep ');

     return gulp
       .src(config.index)
       .pipe($.inject(gulp.src(config.css)))
       .pipe(gulp.dest(config.client));
 });

 /**
  * Wire-up/inject the bower dependencies & js & css
  * @return {Stream}
  */
 gulp.task('wiredep', function () {
   log('Wire up the bower css js and our app js into the html');

   var options = config.getWiredepDefaultOptions();

   return gulp
     .src(config.index)
     .pipe(wiredep(options))
     .pipe($.inject(gulp.src(config.js)))
     .pipe(gulp.dest(config.client));
 });

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', ['clean-code'], function () {
  log('Creating an AngularJS $templateCache');

  return gulp
    .src(config.htmltemplates)
    .pipe($.minifyHtml({empty: true}))
    .pipe($.angularTemplatecache(
        config.templateCache.file,
        config.templateCache.options
    ))
    .pipe(gulp.dest(config.tmp));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', ['clean-images', 'pdfs'], function () {
  log('Copying and compressing the images');

  return gulp
    .src(config.images)
    .pipe($.imagemin({optimizationLevel: 4}))
    .pipe(gulp.dest(config.build + 'images'));
});

/**
 * Move pdfs  TODO: clean pdfs
 * @return {Stream}
 */
gulp.task('pdfs', ['clean-pdfs'], function () {
  log('Cleaning & Moving pdfs');

  return gulp
    .src(config.pdfs)
    .pipe(gulp.dest(config.build + 'pdfs'));
});

// gulp.task('styles', ['clean-styles'], function() {
// gulp.task('fonts', ['clean-fonts'], function() {

gulp.task('less-watcher', function() {
    gulp.watch([config.less], ['styles']);
});

/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-code', function () {

  var deleteConfig = [].concat(
      config.tmp,
      config.build + 'js',
      config.build + 'css'
    );
  log('Cleaning: ' + $.util.colors.blue(deleteConfig));
  del(deleteConfig).then(log('Done'));
});


gulp.task('clean-images', function () {
  var files = [].concat(
    config.build + 'images/**/*.*',
    config.build + 'images/*.*'
  );
  clean(files, done);
});

gulp.task('clean-pdfs', function () {
  var files = [].concat(
    config.build + 'pdfs/**/*.*',
    config.build + 'pdfs/*.*'
  );
  clean(files, done);
});

/**
 * Remove all fonts from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-fonts', function(done) {
    clean(config.build + 'fonts/**/*.*', done);
});

/**
 * Remove all styles from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-styles', function(done) {
    var files = [].concat(
        config.temp + '**/*.css',
        config.build + 'styles/**/*.css'
    );
    clean(files, done);
});


  /*****
   * Second Stage: Build & Server Build
   *****/


/**
* Remove all files from the build, temp, and reports folders
* Clean images as well. Don't need all the time.
* @param  {Function} done - callback when complete
*/
gulp.task('clean', function () {
   var delconfig = [].concat(config.build, config.temp);
   log('Cleaning: ' + $.util.colors.yellow(delconfig));
   del(delconfig).then(log('Done'));
});

/**
* serve the build environment
* --nosync
* dependency open toy should be build(but images don't need to be rebuilt every time)
*/
gulp.task('serve-build', ['optimize'], function () {
 serve(false /* isDev */);
});

/**
 * Build everything
 * This is separate so we can run tests on
 * optimize before handling image or fonts
 */
gulp.task('build', ['optimize', 'images'], function () {
  log('Building everything');

  var msg = {
    title: 'gulp build',
    subtitle: 'Deployed to the build folder',
    message: 'Running `gulp serve-build`'
  };
  del(config.tmp);
  log(msg);
  notify(msg);

});

/**
 * Optimize all files, move to a build folder,
 * and inject them into the new index.html
 * @return {Stream}
 */
gulp.task('optimize', ['inject', 'test'], function () {
  log('Optimizing the javascript, css, html');
  log('templateCache');

  var assets = $.useref({searchPath: './'});
  var cssFilter = $.filter(['**/*.css'], {restore: true});
  var jsLibFilter = $.filter(['**/' + config.optimized.lib], {restore: true});
  var jsAppFilter = $.filter(['**/' + config.optimized.app], {restore: true});
  var templateCache = config.tmp + config.templateCache.file;

  return gulp
    .src(config.index)
    .pipe($.plumber())
    .pipe($.inject(gulp.src(templateCache, {read: false}), {
      starttag: '<!-- inject:templates:js -->'
    }))
    .pipe(assets)
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore)
    .pipe(jsLibFilter)
    .pipe($.uglify())
    .pipe(jsLibFilter.restore)
    .pipe(jsAppFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsAppFilter.restore)
     // modify everything but html: cache busting
    .pipe($.if('!*.html', $.rev()))
    .pipe($.revReplace())
    .pipe(gulp.dest(config.build))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.build));
});


/**
 * Bump the version
 * --type=pre will bump pre-release version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will minor will bump the minor version *.x.*
 * --type=major will bump the major version version x.*.*
 * --version=1.2.3 will bump the specific version and ignore the other flags
 */

gulp.task('bump', function () {
  var msg = 'Bumping versions';
  var type = args.type;
  var version = args.version;
  var options = {};
  if (version) {
    options.version = version;
    msg += ' to ' + version;
  } else {
    options.type = type;
    msg += ' for a ' + type;
  }
  log(msg);

  return gulp
    .src(config.packages)
    .pipe($.print())
    .pipe($.bump(options))
    .pipe(gulp.dest(config.root));

});


//////////////


function serve(isDev) {
  var nodeOptions = {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      'PORT': port,
      'NODE_ENV': isDev ? 'dev' : 'build'
    },
    watch: [config.server]
  };

  return $.nodemon(nodeOptions)
    .on('restart', function (ev) {
      log('*** nodemon restarted');
      log('files changed on restart:\n' + ev);
        setTimeout(function () {
          browserSync.notify('reloading now...');
          browserSync.reload({stream: false});
        }, config.browserReloadDelay);
    })
    .on('start', function () {
      log('*** nodemon started');
      startBrowserSync(isDev);
    })
    .on('crash', function () {
      log('*** nodemon crashed: script crashed for some reason');
    })
    .on('exit', function () {
      log('*** nodemon exited cleanly');
    });
}

function changeEvent(event) {
  var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
  log('File' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function notify(options) {
  var notifier = require('node-notifier');
  var notifyOptions = {
    sound: 'Bottle',
    contentImage: path.join(__dirname, 'gulp.png'),
    icon: path.join(__dirname, 'gulp.png')
  };
  _.assign(notifyOptions, options);
  notifier.notify(notifyOptions);
}

function startBrowserSync(isDev) {
  if (args.nosync || browserSync.active) {
      return;
  }
  log('Starting browser sync on port ' + port);

    // See .md file for dev vs build ENV
    if (!isDev) {

      gulp.watch([config.js, config.css, config.htmltemplates], ['optimize', browserSync.reload ])
        .on('change', function (event) {
          changeEvent(event);
        });

      }

    var options = {
      proxy: 'localhost:' + port,
      port: 3000,
      files: isDev ? [config.client + '**/**/*.*'] : [], // NOTE: if less see .md file
      ghostMode: {
        clicks: true,
        location: false,
        forms: true,
        scroll: true
      },
      injectChanges: true,
      logFileChanges: true,
      logLevel: 'debug',
      logPrefix: 'gulp-patterns',
      notify: true,
      reloadDelay: 0 // 1000
    };

   browserSync(options);
}

function startTests(singleRun, done) {
  var karma = require('karma').server;
  var excludeFiles = [];
  var serverSpecs = config.serverIntegrationSpecs;

  excludeFiles = serverSpecs;

  karma.start({
    configFile:  __dirname + '/karma.conf.js', // TODO: how is __dirname recognized
    exclude: excludeFiles,
    singleRun: !!singleRun

  }, karmaCompleted);

  function karmaCompleted(karmaResult) {
      log('Karma completed!');
      if (karmaResult === 1) {
        done('karma: tests failed with code ' + karmaResult);
      } else {
          done();
      }
  }

}

/*****
 * Logs things to gulp processing
 *****/

function log(msg) {
	if(typeof(msg) === 'object') {
		for(var item in msg) {
			if(msg.hasOwnProperty(item)) {
				$.util.log($.util.colors.blue(msg[item]));
			}
		}
	} else {
		$.util.log($.util.colors.blue(msg));
	}
}

function done(x) {
  log('x');
  log('done');
}


function clean(path) {
	log('Cleaning: ' + $.util.colors.blue(path));
	del(path);
}
