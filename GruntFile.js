module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		uglify: {
			files: {
				src: "assets/js/dist/*.js", // source files mask
				dest: "assets/js/dist/", // destination folder
				expand: true, // allow dynamic building
				flatten: true, // remove all unnecessary nesting
				ext: ".min.js" // replace .js to .min.js
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
