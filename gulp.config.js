module.exports = function() {
  'use strict';
  var client = './src/client/';
  var clientApp = client + 'app/';
  var root = './';
  var report = './report/';
  var server = './src/server/';
  var source = './src/';
  var tmp = './tmp/';
  var wiredep = require('wiredep');
  var bowerFiles = wiredep({devDependencies: true})['js'];

    var config = {

      /**
       * File Paths
       */
      index: client + 'index.html',
      // Aoll the js that i want to vet
      alljs: [
        '!./gulpfile.md.js',
        './src/**/*.js',
        './src/**/**/*.js',
        './*.js'
      ],
      build: './build/',
      client: client,
      // TODO:   referring to compiled css in temp folder per tutorial
      css: [
        client + 'css/*.css',
        client + 'css/**/*.css'
      ],
      htmltemplates: [
        clientApp + '**/**/*.html',
        clientApp + '**/*.html',
        clientApp + '*.html'
      ],
      images: [
        client + 'images/*.*',
        client + 'images/**/*.*'
      ],
      js: [
        '!' + clientApp + 'other/**',
        clientApp + '*.module.js',
        '!' + clientApp + '*.spec.js',
        clientApp + '**/*.module.js',
        '!' + clientApp + '**/*.spec.js',
        '!' + clientApp + '**/*.spec-*.js',
        clientApp + '**/*.js'
      ],

      /**
       * optimize files
       */
      optimized: {
        app: 'app.js',
        lib: 'lib.js'
      },
      pdfs: [
        client + 'pdfs/*.*',
        client + 'pdfs/**/*'
      ],
      report: report,
      root: root,
      templateCache: {
        file: 'templates.js',
        options: {
          module: 'kindred',
          standAlone: false,
          root: 'app/'
        }
      },
      server: server,
      source: source, // i think this is right above
      tmp: tmp,
      /**
       * Bower & npm locations
       */
       bower: {
         json: require('./bower.json'),
         directory: './bower_components/',
         ignorePath: '../..'
       },
       packages: [
         './package.json'
        //  './bower.json' optional
      ],

      /**
       * browsersync
       */
       browserReloadDelay: 1000,

       /**
        *  Karma settings
        */
        serverIntegrationSpecs: [client + 'tests/server-integration/**/*.spec.js'],
        specHelpers: [client + 'test-helpers/*.js'],

       /**
        * Node Settings
        */
        defaultPort: 7203,
        nodeServer: './src/server/app.js'


  };
  config.getWiredepDefaultOptions = function () {
      var options = {
        bowerJson: config.bower.json,
        directory: config.bower.directory,
        ignorePath: config.bower.ignorePath
      };
      return options;
  };

  config.karma = getKarmaOptions();

  config.getSnapshotOptions = function () {
      var options = {
            input: "sitemap",
            source: "./build/assets/sitemap.xml",
            outputDir: "./build/snapshots",
            outputDirClean: true,
            selector: ".content-wrapper",
          };
      return options;
  };



  return config;

  //////////

  function getKarmaOptions() {
      var options = {
        files: [].concat(
          bowerFiles,
          config.specHelpers,
          client + '**/*.module.js',
          client + '**/**/*.module.js',
          client + '**/*.js',
          client + '**/**/*.js',
          tmp + config.templateCache.file,
          config.serverIntegrationSpecs
        ),
        exclude: [clientApp + 'other/**'],
        coverage: {
          dir: report + 'coverage',
          reporters: [
            {type: 'html', subdir: 'report-html'},
            {type: 'lcov', subdir: 'report-lcov'},
            {type: 'text-summary'}
          ]
        },
        preprocessors: {}
      };
      options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
      return options;
  }
};
