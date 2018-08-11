'use strict';

module.exports = function(grunt) {
  const Livereload = 35729;
  const fs = require('fs');
  const ServeStatic = require('serve-static');

  const dst = 'dst';
  const src = 'src';
  const tmp = '.tmp';
  const app = 'app';

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    /**
     * https://github.com/gruntjs/grunt-contrib-jshint
     * options inside .jshintrc file
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },

      files: [
        `${src}/js/**/*.js`,
        `!${src}/js/vendor/**/*.js`
      ]
    },

    /** 
     */
    clean: {
      build: {
        src: [
          `${app}`,
          `${dst}`,
          `${tmp}`
        ]
      }
    },

    /**
     *
     */
    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: `${src}/js`,
          src: ['main.js'],
          dest: `${app}/js`,
          filter: 'isFile'
        }]
      }
    },

    /**
     * Connect port/livereload
     * https://github.com/gruntjs/grunt-contrib-connect
     */
    connect: {
      options: {
        port: 9000,
        hostname: '*'
      },
      livereload: {
        options: {
          middleware: function(connect, options) {
            return [
              ServeStatic(`${app}`),
              connect().use(`${app}`, ServeStatic(`${app}`)),
              ServeStatic(`${app}`)
            ]
          }
        }
      }
    },

    /**
     * https://github.com/gruntjs/grunt-contrib-watch
     * TODO: all demos are copied if post processing changes, fix this
     */
    watch: {
      options: {
        spawn: true,
        livereload: true
      },
      all: {
        files: [
          `${src}/js/**/*.*`, // build file/js
        ],
        tasks: [
          'copy:dev'
        ],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('default', [
    'copy',
    'connect:livereload',
    'watch'
  ]);
};