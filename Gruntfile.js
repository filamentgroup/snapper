/*global module:false*/
module.exports = function(grunt) {

	var os = require( 'os' ),
		path = require( 'path' ),
		isWindows = os.platform().toLowerCase().indexOf( 'win' ) === 0; // watch out for 'darwin'

	require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );


	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',

		meta: {
			banner: '/*! snapper  - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> Filament Group */'
		},

    copy: {
			js: {
				files: [
					{ expand: true, cwd: "src", src: ["*.js"], dest: "dist/" },
          { expand: true, cwd: 'node_modules/jquery/dist', src: [ "jquery.js" ], dest: "src/lib"},
          { expand: true, cwd: 'node_modules/fg-toss/src', src: [ "toss.js" ], dest: "src/lib"}
				]
			}
    },

		sass: {
      options: {
				banner: '<%= meta.banner %>'
			},
			src: {
				files: [{
					expand: true,
					cwd: 'src',
					src: [ '**/*.scss' ],
					dest: 'dist/',
					ext: '.css'
				}]
			}
		},
		qunit: {
			files: ['test/**/*.html']
		}

	});

	grunt.registerTask('test', ['qunit']);

	grunt.registerTask('default', [
    'copy',
		'sass',
		'test'
	]);

	grunt.registerTask('stage', [
    'default'
	]);

};
