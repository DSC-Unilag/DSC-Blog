module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		uglify: {
			options: {
				mangle: false
			},
			my_target: {
				files: {
					"assets/js/dist/bundle.min.js": ["assets/js/dist/bundle.js"]
				}
			}
		},
		cssmin: {
			target: {
				files: [
					{
						expand: true,
						cwd: "assets/css",
						src: ["*.css", "!*.min.css"],
						dest: "assets/css",
						ext: ".min.css"
					}
				]
			}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-cssmin");

	// Default task(s).
	grunt.registerTask("default", ["uglify", "cssmin"]);
};
