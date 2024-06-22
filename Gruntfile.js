const path = require('path');
const sass = require('sass');
const webpackConfig = require('./webpack.config.js');

module.exports = function (grunt) {
  const config = {
    jasmine: {
      components: {
        src: ['bin/materialize.js'],
        options: {
          styles: 'bin/materialize.css',
          specs: 'tests/spec/**/*Spec.js',
          helpers: 'tests/spec/helper.js',
          keepRunner: true,
          page: {
            viewportSize: {
              width: 1400,
              height: 735
            }
          },
          sandboxArgs: {
            args: ['--no-sandbox']
          }
        }
      }
    },

    sass: {
      // Global options
      options: {
        implementation: sass
      },
      // Task
      expanded: {
        // Target options
        options: {
          outputStyle: 'expanded',
          sourcemap: false
        },
        files: {
          'dist/css/materialize.css': 'sass/materialize.scss'
        }
      },

      min: {
        options: {
          outputStyle: 'compressed',
          sourcemap: false
        },
        files: {
          'dist/css/materialize.min.css': 'sass/materialize.scss'
        }
      },

      // Compile bin css
      bin: {
        options: {
          outputStyle: 'expanded',
          sourcemap: false
        },
        files: {
          'bin/materialize.css': 'sass/materialize.scss'
        }
      }
    },

    postcss: {
      options: {
        processors: [require('autoprefixer')()]
      },
      expanded: {
        src: 'dist/css/materialize.css'
      },
      min: {
        src: 'dist/css/materialize.min.css'
      },
      bin: {
        src: 'bin/materialize.css'
      }
    },

    webpack: {
      options: {
        /*stats: !process.env.NODE_ENV || process.env.NODE_ENV === "development",*/
      },

      dev: Object.assign({}, webpackConfig, {
        mode: 'development'
      }),

      dev_watch: Object.assign({}, webpackConfig, {
        mode: 'development',
        watch: true
      }),

      dev_dist: Object.assign({}, webpackConfig, {
        mode: 'development',
        devtool: false,
        optimization: {
          minimize: false
        },
        output: {
          filename: 'materialize.js',
          path: path.resolve(__dirname, 'dist/js'),
          libraryTarget: 'umd',
          globalObject: 'this'
        }
      }),

      prod_min: Object.assign({}, webpackConfig, {
        mode: 'production',
        devtool: 'source-map',
        optimization: {
          minimize: true
        },
        output: {
          filename: 'materialize.min.js',
          path: path.resolve(__dirname, 'dist/js'),
          libraryTarget: 'umd',
          globalObject: 'this'
        }
      })
    },

    compress: {
      main: {
        options: {
          archive: 'bin/materialize.zip',
          level: 6
        },
        files: [
          { expand: true, cwd: 'dist/', src: ['**/*'], dest: 'materialize/' },
          { expand: true, cwd: './', src: ['LICENSE', 'README.md'], dest: 'materialize/' }
        ]
      },

      src: {
        options: {
          archive: 'bin/materialize-src.zip',
          level: 6
        },
        files: [
          { expand: true, cwd: 'sass/', src: ['materialize.scss'], dest: 'materialize-src/sass/' },
          { expand: true, cwd: 'sass/', src: ['components/**/*'], dest: 'materialize-src/sass/' },
          { expand: true, cwd: 'src/', src: ['**/*'], dest: 'materialize-src/ts/' },
          { expand: true, cwd: 'dist/js/', src: ['**/*'], dest: 'materialize-src/js/bin/' },
          { expand: true, cwd: './', src: ['LICENSE', 'README.md'], dest: 'materialize-src/' }
        ]
      }
    },

    watch: {
      sass: {
        files: ['sass/**/*'],
        tasks: ['sass_compile'],
        options: {
          interrupt: false,
          spawn: false
        }
      }
    },

    concurrent: {
      options: {
        logConcurrentOutput: true,
        limit: 10
      },
      monitor: {
        tasks: ['webpack:dev_watch', 'sass_compile', 'watch:sass']
      }
    },

    // Replace text to update the version string
    replace: {
      version: {
        src: ['bower.json', 'package.js', 'src/global.ts'],
        overwrite: true,
        replacements: [
          {
            from: grunt.option('oldver'),
            to: grunt.option('newver')
          }
        ]
      },
      package_json: {
        src: ['package.json'],
        overwrite: true,
        replacements: [
          {
            from: '"version": "' + grunt.option('oldver'),
            to: '"version": "' + grunt.option('newver')
          }
        ]
      }
    },

    // Create Version Header for files
    usebanner: {
      release: {
        options: {
          position: 'top',
          banner:
            '/*!\n * Materialize v' +
            grunt.option('newver') +
            ' (https://materializeweb.com)\n * Copyright 2014-' +
            new Date().getFullYear() +
            ' Materialize\n * MIT License (https://raw.githubusercontent.com/materializecss/materialize/master/LICENSE)\n */',
          linebreak: true
        },
        files: {
          src: ['dist/css/*.css', 'dist/js/*.js']
        }
      }
    },

    rename: {
      rename_src: {
        src: 'bin/materialize-src.zip',
        dest: 'bin/materialize-src-v' + grunt.option('newver') + '.zip',
        options: {
          ignore: true
        }
      },
      rename_compiled: {
        src: 'bin/materialize.zip',
        dest: 'bin/materialize-v' + grunt.option('newver') + '.zip',
        options: {
          ignore: true
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 9001,
          protocol: 'http',
          middleware: function (connect, options, middlewares) {
            middlewares.unshift(function (req, res, next) {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Credentials', true);
              res.setHeader(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
              );
              res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
              next();
            });
            return middlewares;
          }
        }
      }
    }
  };

  grunt.initConfig(config);

  // load tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-rename-util');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // define tasks
  grunt.registerTask('monitor', ['concurrent:monitor']); // DEV
  grunt.registerTask('sass_compile', ['sass:bin', 'postcss:bin']);
  grunt.registerTask('jas_test', ['connect', 'jasmine']);
  grunt.registerTask('test', ['webpack:dev', 'sass_compile', 'jas_test']);
  grunt.registerTask('release', [
    'replace:version', // before webpack
    'sass:expanded',
    'sass:min',
    'postcss:expanded',
    'postcss:min',
    'webpack:dev_dist',
    'webpack:prod_min',
    'usebanner:release',
    'compress:main',
    'compress:src',
    'replace:version', // again because of cdn
    'replace:package_json',
    'rename:rename_src',
    'rename:rename_compiled'
  ]);
};
