# aZerato.github.io (work in progress)

[My Github.io website](http://aZerato.github.io/)

This angular app is created for blogging.
- Create your posts with a specific html template
- Compile them

## How to configure

Edit this file :

> app/app.config.js

Set your posts folder :

> articlesServiceProvider.setPostsEmplacement('/blog/content/posts/');

Do the same :

> cli/posts.converter.js

Set your posts folder :

> var postsPath = path.join(currentPath, '../blog/content/posts/');

My posts are in this folder '[blog/content/posts/](https://github.com/aZerato/aZerato.github.io/tree/master/blog/content/posts)'. 
With specific html annotation, i write my posts, and i use a little CLI command for compile them to a json file '[blog/content/posts/posts.json](https://github.com/aZerato/aZerato.github.io/tree/master/blog/content/posts/post.json)'.

## Write & compile posts

For sample posts structure '[blog/content/posts/](https://github.com/aZerato/aZerato.github.io/tree/master/blog/content/posts)'.

When it's done, go to 'cli/' folder with your CLI, and run : 

> node posts.converter.js

Or run :

> grunt convert

Or (globally) :

> grunt build

## How to start

If not already done :

- Download 'node.js'
- Install 'bower' globally

> npm install bower -g

- Install grunt globally

> npm install grunt-cli -g

## Init

> npm install

> bower install

## Grunt Tasks 

Run local server & open default browser

> grunt

or

> grunt default

Run jshint

> grunt check

Concat/minify app files in '/build' & 'convert posts'

> grunt build

less Watcher (add/edit less files in "styles/" folder they are auto compiled in one file : "build/styles/custom.bootstrap.css")

> grunt watchLess