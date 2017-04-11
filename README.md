# aZerato.github.io (work in progress)

[My Github.io website](http://aZerato.github.io/)

It's a static site generator written in Node.js and Angular.
- Create your posts with a specific html template
- "Compile" them
- "Index" posts

## More

- Portfolio : Flickr component [link](https://github.com/aZerato/aZerato.github.io/tree/master/app/flickr).
- Comments : Disqus posts link [link](https://github.com/kirstein/angular-disqus).
- Code Highlight : [Prism.js](http://prismjs.com/) component [link](https://github.com/aZerato/aZerato.github.io/blob/master/app/common/others/prism.component.js).

## Site configuration [link](https://github.com/aZerato/aZerato.github.io/blob/master/app/app.config.js)

Edit this file :

> app/app.config.js

Set your posts folder :

> articlesServiceProvider.setPostsEmplacement('/blog/content/posts/');

Set the Flickr provider component configuration :

> flickrServiceProvider.setFlickrApiKey('API_KEY');

> flickrServiceProvider.setFlickrUserId('USER_ID');

> flickrServiceProvider.setFlickrUsername('USERNAME');

> flickrServiceProvider.setMaxPhotos(12);

Set Disqus configuration :

> disqusProvider.setShortname('DISQUS_SITE_ID');

## CLI [link](https://github.com/aZerato/aZerato.github.io/tree/master/cli)

Edit this file :

> cli/program.js

Set your posts folder :

> var postsPath = path.join(currentPath, '../blog/content/posts/');

My posts are in this folder '[blog/content/posts/](https://github.com/aZerato/aZerato.github.io/tree/master/blog/content/posts)'. 
With specific html annotation, i write my posts, and i use a little CLI command for "compile" them to a json file '[blog/content/posts/posts.json](https://github.com/aZerato/aZerato.github.io/blob/master/blog/content/posts/posts.json)'.

'[Sample post structure](https://github.com/aZerato/aZerato.github.io/blob/master/blog/content/posts/2016-08-31-node-js-grunt_execute_commander_cheerio.html)'

## How to start

If not already done :

- Download 'node.js'
- Install 'bower' globally

> npm install bower -g

- Install grunt globally

> npm install grunt-cli -g

## Install dependencies

> npm install

> bower install

## Grunt Tasks 

Run local server & open default browser

> grunt

or

> grunt default

Convert posts

> grunt convert

Index posts

> grunt index

Run jshint

> grunt check

Concat/minify app files in '/build' & 'convert posts'

> grunt build

less Watcher (add/edit less files in "styles/" folder they are auto compiled in one file : "build/styles/custom.bootstrap.css")

> grunt watchLess
