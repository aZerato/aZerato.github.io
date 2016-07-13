#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

var postsPath = '../blog/content/posts';

// get all files from a directory.
var postFiles = [];
fs.readdir(postsPath, function(error, files) {
	if(error) {
		throw error;
	}

	files.map(function(filePath) {
		postFiles.push(filePath);
	})
	.filter(function (file) {
		// filtering
		var isFile = fs.statSync(file).isFile();
		var filePath = path.join(postsPath, file);
		if(isFile && path.extname(filePath) == '.html')
		{
			return filePath;
		}
	});

	console.log(postFiles);
});