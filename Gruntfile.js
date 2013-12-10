module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    rig: {
      wrap: {
        src: ['src/wrapper.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/**\n' +
              ' * <%= pkg.title %> v<%= pkg.version %>\n' +
              ' *\n' +
              ' * Copyright (c) <%= grunt.template.today("yyyy") %>' +
              '<%= pkg.author %>\n' +
              ' * Distributed under MIT License\n' +
              ' *\n' +
              ' * Documentation and full license available at:\n' +
              ' * <%= pkg.homepage %>\n' +
              ' *\n' +
              ' */\n',
        report: 'gzip',
        mangle: {
          except: ['Mixologist']
        }
      },
      browser: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      }
    },

    watch: {
      files: '<%= jshint.files %>',
      tasks: ['default']
    },

    jshint: {
      files: ['Gruntfile.js', 'js/src/*.js', 'js/src/!(lib)**/*.js', 'spec/*.js', 'spec/!(lib)**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        jquery: true,
        globals: {
          Mixologist: false,
          _: false,
          Backbone: false,
          $: false,
          jQuery: false,
          console: false,
          expect: false,
          describe: false,
          before: false,
          beforeEach: false,
          afterEach: false,
          it: false,
          setup: false,
          suite: false,
          teardown: false,
          test: false,
          jasmine: false,
          module: false,
          require: false,
          define: false,
          spyOn: false
        }
      }
    },

    jasmine: {
      test: {
        options: {
          specs: 'spec/*Spec.js',
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfig: {
              baseUrl: '.',
              paths: {
                "mixologist": "dist/mixologist",
                "underscore": "bower_components/underscore/underscore",
                "backbone": "bower_components/backbone/backbone",
                "jquery": "bower_components/jquery/jquery"
              }
            }
          }
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('build', [
    'jshint',
    'rig',
    'uglify'
  ]);
  grunt.registerTask('test', ['build', 'jasmine']);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-rigger');
};
