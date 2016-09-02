module.exports = CheerioHelper = (function(){

    var cheerio = require('cheerio');

    /*
     * CheerioHelper constructor.
     */
    var CheerioHelper = function()
    {
        this.invalidChars = [];
        this.correctChars = [];
    };

    /*
    * Replace invalid chars in code tags.
    * @param String : $ - current cheerio/jQuery file instance.
    * @param String : $cheerioEl - element with <code> tag.
    * @return $cheerioEl : a cheerio element with <code> tag cleaned.
    */
    CheerioHelper.prototype.replaceCharsInnerCodeTags = function($, $cheerioEl) {
        try
        {
            this.checkCheerioHelperConfiguration();

            var codeTags = $cheerioEl.find('code');
            if(codeTags.length > 0)
            {
                for(var i = 0; i < codeTags.length; i++)
                {
                    var $code = $(codeTags[i]);
                    var codeTagContent = $code.html();

                    for(var j = 0; j < this.invalidChars.length; j++)
                    {
                        var reg = RegExp(this.invalidChars[j], 'g')
                        codeTagContent = codeTagContent
                                            .replace(reg, this.correctChars[j]);
                    }
                    
                    $code.html(codeTagContent);
                }
            }
        }
        catch (error)
        {
            throw new Error('CheerioHelper::replaceCharsInnerCodeTags error('+ error +')');
        }

        return $cheerioEl;     
    };

    /*
    * Check if CheerioHelper is correctly configurate.
    * @throw error.
    */
    CheerioHelper.prototype.checkCheerioHelperConfiguration = function() 
    {
        try
        {
            if (this.invalidChars.length == 0 ||
                this.correctChars.length == 0 ||
                this.invalidChars.length != this.correctChars.length)
            {
                throw new Error('CheerioHelper::Global error(Please set correctly CheerioHelper params (array of invalid chars & array of correct char, same length))');
            }
        }
        catch (error)
        {
            throw new Error('CheerioHelper::Global error(Please set correctly CheerioHelper params (array of invalid chars & array of correct char, same length))');
        }
    };

    return CheerioHelper;
}());