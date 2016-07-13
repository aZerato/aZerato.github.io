module.exports = FileHelper = (function(){

    var fs = require('fs');
    var path = require('path');

    var FileHelper = function(debug)
    {
        this.debug = debug;
    };

    FileHelper.prototype.currentPath = function() {
		try 
        {
			return path.dirname(require.main.filename);
		} 
        catch (error)
        {
            logger(error);
			return false;
		}
	};

	FileHelper.prototype.checkIsFile = function(file)
	{
		try 
        {
			fs.statSync(file).isFile();
			return true;
		} 
        catch (error) 
        {
            logger(error);
			return false;
		}
	};

	FileHelper.prototype.getFilesPathFromDir = function(dirPath, extnames) {
		var checkExtension = false;
		var self = this;
        
        if (extnames != undefined ||
			extnames != null || 
			extnames.length > 0)
		{
			checkExtension = true;
		}

        var filesPaths = [];

		// start reading dir.
		var filesNames = fs.readdirSync(dirPath);
        filesNames.filter(function (file) {
            // filtering
            var filePath = path.join(dirPath, file);
            var isFile = self.checkIsFile(filePath);
            
            var isValidExtension = false;
            if(checkExtension) {
                var currentFileExt = path.extname(file);
                extnames.filter(function(extname) {
                    if(currentFileExt == extname)
                    {
                        isValidExtension = true;
                    }
                });
            }
            else {
                // return all files.
                isValidExtension = true;
            }				

            if(isFile && isValidExtension)
            {
                filesPaths.push(filePath);
            }
        });

	    console.log(filesPaths);

        return filesPaths;
	};

    var logger = function(error)
    {
        if(this.debug == true)
        {
            console.log(error);
        }
    };

    return FileHelper;
}());