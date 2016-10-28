module.exports = CheerioHelper = (function(){

    var cheerio = require('cheerio');

    /*
     * CheerioHelper constructor.
     */
    var CheerioHelper = function()
    {
        this.arrayInvalidCorrectChar = [];
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

            var codeTags = $cheerioEl.find('code, prism-component');
            if(codeTags.length > 0)
            {
                for(var i = 0; i < codeTags.length; i++)
                {
                    var $code = $(codeTags[i]);
                    var codeTagContent = $code.html();

                    for(var j = 0; j < this.arrayInvalidCorrectChar.length; j++)
                    {
                        codeTagContent = codeTagContent
                                            .replace(this.arrayInvalidCorrectChar[j].regex, this.arrayInvalidCorrectChar[j].correctChar);
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
    * Add combo invalid/correct chars in array.
    * @param String : invalidChar - the char that needs to be replaced - direclty converted to regex object.
    * @param String : correctChar - the replacement char.
    */
    CheerioHelper.prototype.addInvalidCorrectChar = function(invalidChar, correctChar)
    {
        try
        {
            var reg = RegExp(invalidChar, 'g');
            this.arrayInvalidCorrectChar.push({
                invalidChar: invalidChar,
                regex: reg,
                correctChar: correctChar
            });
        }
        catch (error)
        {
            throw new Error('CheerioHelper::addInvalidCorrectChar error(' + error + ')');
        }
    };

    /*
    * Check if CheerioHelper is correctly configurate.
    * @throw error.
    */
    CheerioHelper.prototype.checkCheerioHelperConfiguration = function() 
    {
        try
        {
            if (this.arrayInvalidCorrectChar.length == 0)
            {
                throw new Error('CheerioHelper::Global error(Please set correctly CheerioHelper params (array of invalid chars & array of correct char, same length))');
            }
        }
        catch (error)
        {
            throw new Error('CheerioHelper::checkCheerioHelperConfiguration error(' + error + ')');
        }
    };

    return CheerioHelper;
}());