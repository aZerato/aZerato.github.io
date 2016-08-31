module.exports = FileHelper = (function(){

    /*
     * Modules dependencies.
     */
    var fs = require('fs');
    var path = require('path');

    /*
     * Constructor.
     */
    var FileHelper = function(debug)
    {
        this.debug = debug;
    };

    /*
     * Return current path of the file where you exec this method
     * @return String
     */
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

    /*
     * Return current path of the file where you exec this method
     * @return Boolean
     */
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

    /*
     * Return all files for a specific directory path.
     * @param String : dirPath - directory path.
     * @param String : extnames - array of file extensions (filtering). 
     * @return Array[File] : Array of files.
     */
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

    /*
     * Internal logger error.
     * @param String : error - message.
     */
    var logger = function(error)
    {
        if(this.debug == true)
        {
            console.log(error);
        }
    };

    return FileHelper;
}());