module.exports = function(grunt){
	var port = grunt.option('port') || 8080;
	var url = grunt.option('url') || "http://localhost:"+port;

	// Grunt configuration
	grunt.initConfig({
		open: {
			server: {
				// Gets the port from the connect information
				path: url
			}
		},
		connect: {
			release: {
				options: {
					base :'dist/',
					port: port,
					keepalive: true
				}
			},
			server: {
				options: {
					base :'./',
					port: port,
					keepalive: true
				}
			}
		},
		useminPrepare: {
			html: 'index.html',
			options: {
				dest: 'dist/',
				flow: {
					html: {
						steps: {
							js: ['concat','uglifyjs'],
							css: ['cssmin']
						},
						post: {}
					}
				}
			}
		},
		usemin: {
			html: ['dist/*.html'],
			options: {
				assetsDirs: ['dist']
			}
		},
		copy: {
			dist:{
				files: [{
					expand: true,
				    cwd: './',
				    src: 'index.html',
				    dest: 'dist/',
				    flatten: true,
				    filter: 'isFile',
				},
				{
					expand: true,
				    src: ['app/common/i18n/*.json'],
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
				},
				{
					expand: true,
				    cwd: './app/common/form/',
				    src: 'form.html',
				    dest: 'dist/app/common/form/',
				    flatten: true,
				    filter: 'isFile',
				},
				{
					expand: true,
				    cwd: './app/contacts/',
				    src: 'contacts.html',
				    dest: 'dist/app/contacts/',
				    flatten: true,
				    filter: 'isFile',
				},
				{
					expand: true,
				    cwd: './app/contacts/',
				    src: 'contacts.form.html',
				    dest: 'dist/app/contacts/',
				    flatten: true,
				    filter: 'isFile',
				},
				{
					expand: true,
				    cwd: './app/contacts/',
				    src: 'contacts.list.html',
				    dest: 'dist/app/contacts/',
				    flatten: true,
				    filter: 'isFile',
				}]
			},
			fonts:{
				expand: true,
				flatten: true,
				dest: 'dist/fonts/',
				src: ['bower_components/bootstrap/fonts/**'],
				filter: 'isFile'
			}
		},
		clean: {
			dist: {
				src: ['dist/']
			},
			tmp: {
				src:['.tmp']
			}
		},
		filerev: {
			options: {
				algorithm: 'md5',
				length: 8
			},
			dist: {
				src: 'dist/{js,css}/**'
			}
		},
		jshint: {
			build: ['app/**/*.js']
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


	// Tasks definition
	grunt.registerTask('default', ['open:server','connect:server']);
	grunt.registerTask('check', [
		'jshint:build'
	]);
	grunt.registerTask('build', [
		'clean:dist',
		'useminPrepare',
		'concat',
		'copy',
		'cssmin',
		'uglify',
		'filerev',
		'usemin',
		'clean:tmp',
		'open:server',
		'connect:release'
	]);

}
