# aZerato.github.io

[My Github.io website](http://aZerato.github.io/)

This angular app uses Github API.

## How to configure

Edit this file :

> app/app.config.js

Set your github username :

> articlesServiceProvider.setGithubUsername('aZerato');

Set your posts folder :

> articlesServiceProvider.setPostsEmplacement('/blog/content/posts/');

With this app i load dynamically my posts in html from a local folder thanks to github api.
For me, my posts are in this folder '[blog/content/posts/](https://github.com/aZerato/aZerato.github.io/tree/master/blog/content/posts)'.

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

Concat/minify app files in '/build'

> grunt build

less Watcher (add/edit less files in "styles/" folder they are auto compiled in one file : "build/styles/custom.bootstrap.css")

> grunt watchLess
