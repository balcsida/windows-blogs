module.exports = function ( grunt ) {

	// Project configuration
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
				        ' * <%= pkg.homepage %>\n' +
				        ' * Copyright (c) <%= grunt.template.today("yyyy") %>;' +
				        ' * Licensed GPLv2+' +
				        ' */\n'
			},
			main: {
				src: [
					'assets/js/vendor/fitvids/jquery.fitvids.js',
					'assets/js/vendor/picturefill/picturefill.js',
					'assets/js/vendor/hc-sticky/jquery.hc-sticky.js',
					'assets/js/src/helpers.js',
					'assets/js/src/filters.js',
					'assets/js/src/equal-columns.js',
					'assets/js/src/windows-blogs.js',
					'assets/js/src/age-gate-client.js'
				],
				dest: 'assets/js/windows-blogs.js'
			},
			admin: {
				src: [
					'assets/js/src/admin/content-blocks.js',
					'assets/js/vendor/js-cookie/js-cookie.js',
					'assets/js/vendor/unveil/jquery.unveil.js',
				],
				dest: 'assets/js/windows-blogs-admin.js'
			},
			admin_no_deps: {
				src: [
					'assets/js/src/admin-no-deps/*.js'
				],
				dest: 'assets/js/windows-blogs-admin-no-deps.js'
			},
			contentblocks: {
				src: [
					'assets/js/src/content-blocks/*.js'
				],
				dest: 'assets/js/content-blocks.js'
			},
			characterCount: {
				src: [
					'assets/js/vendor/countable/Countable.js',
					'assets/js/src/admin/character-count.js'
				],
				dest: 'assets/js/character-count.js'
			},
			contextAssignment: {
				src: [
					'assets/js/src/admin/context-assignment.js'
				],
				dest: 'assets/js/context-assignment.js'
			}
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'assets/js/src/**/*.js',
				'assets/js/test/**/*.js'
			]
		},
		uglify: {
			all: {
				files: {
					'assets/js/windows-blogs.min.js': ['assets/js/windows-blogs.js'],
					'assets/js/windows-blogs-admin.min.js': ['assets/js/windows-blogs-admin.js'],
					'assets/js/content-blocks.min.js': ['assets/js/content-blocks.js'],
					'assets/js/windows-blogs-admin-no-deps.min.js': ['assets/js/windows-blogs-admin-no-deps.js']
				},
				options: {
					banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
					        ' * <%= pkg.homepage %>\n' +
					        ' * Copyright (c) <%= grunt.template.today("yyyy") %>;' +
					        ' * Licensed GPLv2+' +
					        ' */\n',
					mangle: {
						except: ['jQuery']
					}
				}
			}
		},

		sass: {
			all: {
				files: {
					'assets/css/editor.css': 'assets/css/sass/editor.scss',
					'assets/css/admin.css': 'assets/css/sass/admin.scss',
					'assets/css/windows-blogs.css': 'assets/css/sass/windows-blogs.scss',
					'assets/css/teaser.css': 'assets/css/sass/teaser/teaser.scss',
					'assets/css/content-blocks.css': 'assets/css/sass/content-blocks/content-blocks.scss',
					/**
					 * Add new event & admin specific stylesheets
					 *
					 * Example:
					 * // New event name
					 * 'assets/css/events/new-event-name.css': 'assets/css/sass/events/new-event-name/new-event-name.scss',
					 * 'assets/css/events/new-event-name-admin.css': 'assets/css/sass/events/new-event-name/new-event-name-admin.scss'
					 */

					// 2015 October event
					'assets/css/events/event-october-2015.css': 'assets/css/sass/events/event-october-2015/event-october-2015.scss',
					'assets/css/events/event-october-2015-admin.css': 'assets/css/sass/events/event-october-2015/event-october-2015-admin.scss'
				}
			}
		},


		postcss: {
			options: {
				processors: [
					require('autoprefixer-core')({browsers: ['last 3 versions', 'Firefox > 4'] }),
				]
			},
			files: {
				'assets/css/editor.css': ['assets/css/editor.css'],
				'assets/css/admin.css': ['assets/css/admin.css'],
				'assets/css/windows-blogs.css': ['assets/css/windows-blogs.css'],
				'assets/css/teaser.css': ['assets/css/teaser.css'],
				'assets/css/content-blocks.css': ['assets/css/content-blocks.css'],

				// 2015 October event
				'assets/css/events/event-october-2015.css': 'assets/css/sass/events/event-october-2015/event-october-2015.scss',
				'assets/css/events/event-october-2015-admin.css': 'assets/css/sass/events/event-october-2015/event-october-2015-admin.scss'
			}
		},

		cssmin: {
			options: {
				banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
				        ' * <%=pkg.homepage %>\n' +
				        ' * Copyright (c) <%= grunt.template.today("yyyy") %>;' +
				        ' * Licensed GPLv2+' +
				        ' */\n'
			},
			minify: {
				expand: true,

				cwd: 'assets/css/',
				src: ['windows-blogs.css', 'content-blocks.css', 'events/*.css'],

				dest: 'assets/css/',
				ext: '.min.css'
			}
		},
		watch: {
			livereload: {
				files: ['assets/css/*.css', 'assets/css/events/*.css'],
				options: {
					livereload: true
				}
			},
			styles: {
				files: ['assets/css/sass/**/*.scss'],
				tasks: ['sass', 'postcss', 'cssmin'],
				options: {
					debounceDelay: 500
				}
			},
			scripts: {
				files: ['assets/js/src/**/*.js', 'assets/js/vendor/**/*.js'],
				tasks: ['jshint', 'concat', 'uglify'],
				options: {
					debounceDelay: 500
				}
			}
		},
		clean: {
			main: ['release/<%= pkg.version %>']
		},
		copy: {
			// Copy the theme to a versioned release directory
			main: {
				src: [
					'**',
					'!**/.*',
					'!**/readme.md',
					'!node_modules/**',
					'!vendor/**',
					'!tests/**',
					'!release/**',
					'!assets/css/sass/**',
					'!assets/css/src/**',
					'!assetsjs/src/**',
					'!images/src/**',
					'!bootstrap.php',
					'!bower.json',
					'!composer.json',
					'!composer.lock',
					'!Gruntfile.js',
					'!package.json',
					'!phpunit.xml',
					'!phpunit.xml.dist'
				],
				dest: 'release/<%= pkg.version %>/'
			}
		},
		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: './release/wb.<%= pkg.version %>.zip'
				},
				expand: true,
				cwd: 'release/<%= pkg.version %>/',
				src: ['**/*'],
				dest: 'wb/'
			}
		},
		phpunit: {
			classes: {
				dir: 'tests/phpunit/'
			},
			options: {
				bin: 'vendor/bin/phpunit',
				bootstrap: 'bootstrap.php',
				colors: true
			}
		},
		qunit: {
			all: ['tests/qunit/**/*.html']
		}
	} );

	// Load tasks
	require( 'load-grunt-tasks' )( grunt );

	// Register tasks
	grunt.registerTask( 'default', ['jshint', 'concat', 'uglify', 'sass', 'postcss', 'cssmin'] );
	grunt.registerTask( 'js', ['jshint', 'concat', 'uglify'] );
	grunt.registerTask( 'css', ['sass', 'postcss', 'cssmin'] );
	grunt.registerTask( 'build', ['default', 'clean', 'copy', 'compress'] );
	grunt.registerTask( 'test', ['phpunit', 'qunit'] );

	grunt.util.linefeed = '\n';
};
