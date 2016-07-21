module.exports = function(grunt){
	var port = grunt.option('port') || 8080;
	var url = grunt.option('url') || "http://localhost:"+port;

	// Grunt configuration
	grunt.initConfig({
		open: {
			release: {
				// Gets the port from the connect information
				path: url
			},
			debug: {
				path: url + '/app/'
			}
		},
		connect: {
			server: {
				options: {
					base :'./',
					port: port,
					keepalive: true
				}
			}
		},
		useminPrepare: {
			html: 'app/index.html',
			options: {
				dest: 'build/',
				flow: {
					html: {
						steps: {
							js: ['concat'],
							css: ['cssmin']
						},
						post: {}
					}
				}
			}
		},
		usemin: {
			html: ['build/*.html'],
			options: {
				assetsDirs: ['build']
			}
		},
		copy: {
			build: {
				files:[
				{
					expand: true,
				    src: ['build/common/i18n/*.json'],
				    dest: 'dist/app/common/i18n/',
				    flatten: true,
				    filter: 'isFile',
				},
				{
					expand: true,
				    cwd: './app/common/header/',
				    src: 'header.html',
				    dest: 'dist/app/common/header/',
				    flatten: true,
				    filter: 'isFile',
				},
				{
					expand: true,
				    cwd: './app/common/footer/',
				    src: 'footer.html',
				    dest: 'dist/app/common/footer/',
				    flatten: true,
				    filter: 'isFile',
				},
				{
					expand: true,
				    cwd: './app/common/about/',
				    src: 'about.html',
				    dest: 'dist/app/common/about/',
				    flatten: true,
				    filter: 'isFile',
				}]
			},
			fonts:{
				expand: true,
				flatten: true,
				dest: 'build/fonts/',
				src: ['bower_components/bootstrap/fonts/**'],
				filter: 'isFile'
			}
		},
		clean: {
			build: {
				src: ['build/']
			},
			tmp: {
				src:['.tmp']
			},
			css: {
				src:['build/styles/']
			}
		},
		filerev: {
			options: {
				algorithm: 'md5',
				length: 8
			},
			build: {
				src: 'build/{js,css}/**'
			}
		},
		jshint: {
			debug: ['app/**/*.js']
		},
		less: {
			compile: {
				files: {
					'build/styles/custom.bootstrap.css' : 'styles/register.less'
				}
			}
		},
		watch: {
			less: {
				files: [
					'styles/**'
				],
				tasks: [
					'clean:css',
					'less:compile'
				]
			}
		},
		execute: {
			postsConverter: {
				src: [
					'cli/posts.converter.js'
				]
			}
		}
	});

	// Dev tasks 
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.loadNpmTasks('grunt-execute');

	// Tasks definition
	grunt.registerTask('default', ['open:debug','connect:server']);
	grunt.registerTask('check', [
		'jshint:debug'
	]);

	grunt.registerTask('watchLess', [
		'watch:less'
	]);

	grunt.registerTask('convert', [
		'execute:postsConverter'
	]);

	grunt.registerTask('build', [
		'execute:postsConverter',
		'clean:build',
		'useminPrepare',
		'concat',
		'copy',
		'cssmin',
		'filerev',
		'usemin',
		'less:compile',
		'clean:tmp'
	]);

}
