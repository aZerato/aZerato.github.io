# aZerato.github.io

[My Github.io website](http://aZerato.github.io/)

This angular app use Github API.

## How to configure

Edit this file :

> app/app.config.js

Set your username :

> articlesServiceProvider.setGithubUsername('aZerato');

Set your posts folder :

> articlesServiceProvider.setPostsEmplacement('/blog/content/posts/');

Load posts files through Github API or directly from local folder.

> articlesServiceProvider.setLocalPostsEmplacement(true);

## How to start

If not already done :

- Download node.js
- Install bower globally

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
