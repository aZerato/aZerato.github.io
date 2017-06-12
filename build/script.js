!function(a){"use strict";var b=["ui.router","ngSanitize","ngCookies","pascalprecht.translate","ngDisqus","ngAnimate"],c=a.module("app",b),d=function(a,b,c,d,e,f,g,h){c.state("root",{views:{header:{template:"<header-component></header-component>"},footer:{template:"<footer-component></footer-component>"}}}),c.state("root.about",{url:"/about",views:{"main@":{templateUrl:"/blog/content/pages/about.html"}}}),b.otherwise("/"),a.setType("sessionStorage"),d.useStaticFilesLoader({prefix:"/app/common/i18n/",suffix:".json"}),d.preferredLanguage("fr"),d.useSanitizeValueStrategy("escapeParameters"),e.setPostsEmplacement("/blog/content/posts/posts.json"),f.setFlickrApiKey("ae778d76cb4455923168dcab2bfd7135"),f.setFlickrUserId("78474683@N07"),f.setFlickrUsername("azerato"),f.setMaxPhotos(12),g.setShortname("azerato-github-io"),h.hashPrefix("!")};d.$inject=["dataStoreProvider","$urlRouterProvider","$stateProvider","$translateProvider","articlesServiceProvider","flickrServiceProvider","$disqusProvider","$locationProvider"],c.config(d);var e=function(a,b,c){var d=b.get("acceptCookies");a.acceptCookies=!1,d&&(a.acceptCookies=!0);var e=b.get("favLang");""!==e&&void 0!==e||(e="fr",a.acceptCookies&&b.put("favLang",e)),a.currentLang=e,c.use(e)};e.$inject=["$rootScope","$cookies","$translate"],c.run(e)}(window.angular),function(a){"use strict";var b=a.module("app"),c=function(){this.type="localStorage",this.$get=function(){var a=this.type;return{set:function(b,c){window[a].setItem(b,JSON.stringify(c))},get:function(b){return JSON.parse(window[a].getItem(b))}}},this.setType=function(a){this.type=a}};b.provider("dataStore",c)}(window.angular),function(a){"use strict";var b=a.module("app"),c=function(a,b,c,d){var e=this;e.$onInit=function(){if(e.$state=d,e.$el=$(".cst-header"),e.scrollStart=0,e.$elLimit=$(".cst-container-articles"),e.limitOffset=e.$elLimit.offset(),e.$elLimit.length){e.$elLimit.offset();$(document).scroll(function(){e.$state.is("root.articles")&&(e.scrollStart=$(this).scrollTop(),e.scrollStart>e.limitOffset.top?e.$el.addClass("header-color"):e.$el.removeClass("header-color"))})}},e.changeLang=function(d){b.use(d),a.currentLang=d,1==a.acceptCookies&&c.put("favLang",d)}};c.$inject=["$rootScope","$translate","$cookies","$state"];var d={controller:c,templateUrl:"/app/common/header/header.html"};b.component("headerComponent",d)}(window.angular),function(a){"use strict";var b=a.module("app"),c=function(a){var b=this;b.$onInit=function(){this.acceptCookies=a.acceptCookies}};c.$inject=["$rootScope"];var d={controller:c,templateUrl:"/app/common/footer/footer.html"};b.component("footerComponent",d)}(window.angular),function(a){"use strict";var b=a.module("app"),c=function(a){var b=this;b.$onInit=function(){b.$state=a},b.changePage=function(a){b.$state.go(b.ref,{pageNumber:a})}};c.$inject=["$state"];var d={bindings:{ref:"@",pagesArray:"="},controller:c,templateUrl:"/app/common/pagination/pagination.html"};b.component("paginationComponent",d)}(window.angular),function(a){"use strict";var b=a.module("app"),c=function(a,b,c){var d=this;d.$onInit=function(){d.state=a.acceptCookies},d.validCookiesSub=function(){d.state=!0,a.acceptCookies=!0;var b=new Date;b.setMonth(b.getMonth()+5),c.put("acceptCookies",!0,{expires:b})}};c.$inject=["$rootScope","$translate","$cookies"];var d={controller:c,templateUrl:"/app/common/cookies/cookies.html"};b.component("cookiesComponent",d)}(window.angular),function(a){"use strict";var b=a.module("app"),c=function(a,b,c,d,e,f){var g=this;g.searchForm=!1,g.noResult=!1,g.$onInit=function(){g.$input=$(".cst-search-form-input")},g.research=function(){g.searchForm=!0,window.scrollTo(0,0),setInterval(function(){g.$input.focus()},500)},g.search=function(){g.articles=[],g.noResult=!1,g.searchRequirements=!1,void 0!=g.stringSearch&&""!=g.stringSearch.trim()&&g.stringSearch.length>2?f.search(g.stringSearch.toLowerCase(),a.currentLang,c,d,e).then(function(a){a.length>0?f.getAllBySearchObject(a,c,d,e).then(function(a){g.articles=a}):g.noResult=!0}):g.searchRequirements=!0},g.hideResearch=function(){g.searchForm=!1}};c.$inject=["$rootScope","$translate","$http","$q","$sce","articlesService"];var d={controller:c,templateUrl:"/app/common/search/search.html"};b.component("searchComponent",d)}(window.angular),function(a){"use strict";var b=a.module("app"),c=function(a,b){a.$evalAsync(function(){var a=b[0].getElementsByTagName("pre")[0].getElementsByTagName("code")[0];Prism.highlightElement(a)})};c.$inject=["$scope","$element"];var d={bindings:{"class":"@"},transclude:!0,controller:c,template:'<pre class="{{$ctrl.class}}"><code ng-transclude></code></pre>'};b.component("prismComponent",d)}(window.angular),function(a){"use strict";var b=a.module("app");b.directive("compile",["$compile",function(a){return function(b,c,d){b.$watch(function(a){return a.$eval(d.compile)},function(d){c.html(d),a(c.contents())(b)})}}])}(window.angular),function(a){"use strict";var b=a.module("app"),c=function(a,b,c,d,e,f,g,h,i){var j=this;j.$onInit=function(){j.pageConfig=void 0,j.articles=[],j.articlesLoaded=!1,j.pages=[],h.readPaginationConfig(d,e,f).then(function(a){j.pageConfig=a,void 0!==c.pageNumber?j.changePage(c.pageNumber):j.changePage(1),j.pages=j.pageConfig.pages})},j.changePage=function(a){j.articlesLoaded=!1;var b=0;a>1&&(b=a*j.pageConfig.number_per_page-j.pageConfig.number_per_page);var c=b+j.pageConfig.number_per_page;h.getFromTo(b,c,d,e,f).then(function(a){j.articles=a,j.articlesLoaded=!0})}};c.$inject=["$rootScope","$state","$stateParams","$http","$q","$sce","dataStore","articlesService","$translate"];var d={controller:c,templateUrl:"/app/articles/articles.list.html"};b.component("articlesComponent",d);var e=function(a,b,c,d,e,f,g,h,i){var j=this;j.$onInit=function(){j.article={},j.articleLoaded=!1,g.getById(c.articleId,d,e,f).then(function(a){j.article=a,j.articleLoaded=!0})}};e.$inject=["$rootScope","$state","$stateParams","$http","$q","$sce","articlesService","$translate","$compile"];var f={controller:e,templateUrl:"/app/articles/article.details.html"};b.component("articleDetailsComponent",f);var g=function(a){a.state("root.articles",{url:"/",views:{"intro@":{templateUrl:"/blog/content/pages/intro.html"},"main@":{template:'<articles-component class="cst-container-articles"></articles-component>'}}}),a.state("root.details",{url:"/article/:articleId",views:{"main@":{template:'<article-details-component class="cst-container-articles"></article-details-component>'}}}),a.state("root.articles.pages",{url:"pages/:pageNumber",views:{"intro@":{template:""},"main@":{template:"<articles-component></articles-component>"}}})};g.$inject=["$stateProvider"],b.config(g)}(window.angular),function(a){"use strict";var b=a.module("app"),c=function(){var a=this;a.postsEmplacement="/blog/content/posts/posts.json",a.setPostsEmplacement=function(b){a.postsEmplacement=b},a.paginationConfigEmplacement="/blog/content/posts/pagination.json",a.setPaginationConfigEmplacement=function(b){a.paginationConfigEmplacement=b},a.indexerFREmplacement="/blog/content/posts/indexer.fr.json",a.setIndexerFREmplacement=function(b){a.indexerFREmplacement=b},a.indexerENEmplacement="/blog/content/posts/indexer.en.json",a.setIndexerENEmplacement=function(b){a.indexerENEmplacement=b},a.PaginationConfig={},a.$get=function(){return{getById:function(b,c,d,e){var f=d.defer();return c.get(a.postsEmplacement,{cache:!0}).then(function(a){for(var c={},d=a.data.length-1;d>=0;d--)a.data[d].id==b&&(e.trustAsHtml(a.data[d].fr.summary),e.trustAsHtml(a.data[d].fr.content),e.trustAsHtml(a.data[d].en.summary),e.trustAsHtml(a.data[d].en.content),c=a.data[d]);f.resolve(c)},function(a){console.log("articlesServiceProvider::$get::getById error("+a+")"),f.reject(a)}),f.promise},getAll:function(b,c,d){var e=c.defer();return b.get(a.postsEmplacement,{cache:!0}).then(function(a){for(var b=[],c=from;c<to;c++)d.trustAsHtml(a.data[c].fr.summary),d.trustAsHtml(a.data[c].fr.content),d.trustAsHtml(a.data[c].en.summary),d.trustAsHtml(a.data[c].en.content),b.push(a.data[c]);e.resolve(b)},function(a){console.log("articlesServiceProvider::$get::getAll error("+a+")"),e.reject(a)}),e.promise},readPaginationConfig:function(b,c,d){var e=c.defer();return b.get(a.paginationConfigEmplacement,{cache:!0}).then(function(a){e.resolve(a.data)},function(a){console.log("articlesServiceProvider::$get::readPaginationConfig error("+a+")"),e.reject(a)}),e.promise},getFromTo:function(b,c,d,e,f){var g=e.defer();return d.get(a.postsEmplacement,{cache:!0}).then(function(a){var d=[];c>a.data.length&&(c=a.data.length);for(var e=b;e<c;e++)f.trustAsHtml(a.data[e].fr.summary),f.trustAsHtml(a.data[e].fr.content),f.trustAsHtml(a.data[e].en.summary),f.trustAsHtml(a.data[e].en.content),d.push(a.data[e]);g.resolve(d)},function(a){console.log("articlesServiceProvider::$get::getFromTo error("+a+")"),g.reject(a)}),g.promise},search:function(b,c,d,e,f){var g=e.defer(),h="";return"fr"==c&&(h=a.indexerFREmplacement),"en"==c&&(h=a.indexerENEmplacement),b=b.split(" "),d.get(h,{cache:!0}).then(function(a){for(var c=[],d=a.data.length-1;d>=0;d--)for(var e=b.length-1;e>=0;e--)if(void 0!=a.data[d].word&&a.data[d].word.indexOf(b[e])!=-1){if(0==c.length){c=a.data[d].posts;break}a.data[d].posts.map(function(a){var b=c.find(function(b){return b.id==a.id});void 0!=b?b.force+=a.force:c.push(a)})}g.resolve(c)},function(a){console.log("articlesServiceProvider::$get::search error("+a+")"),g.reject(a)}),g.promise},getAllBySearchObject:function(b,c,d,e){var f=d.defer();return c.get(a.postsEmplacement,{cache:!0}).then(function(a){for(var c=[],d=b.length-1;d>=0;d--)for(var g=a.data.length-1;g>=0;g--)a.data[g].id==b[d].id&&(e.trustAsHtml(a.data[g].fr.summary),e.trustAsHtml(a.data[g].en.summary),a.data[g].force=b[d].force,c.push(a.data[g]));c=c.sort(function(a,b){return b.force-a.force}),f.resolve(c)},function(a){console.log("articlesServiceProvider::$get::search error("+a+")"),f.reject(a)}),f.promise}}}};b.provider("articlesService",c)}(window.angular),function(a){"use strict";var b=a.module("app"),c=function(a,b,c,d,e){var f=this;f.$onInit=function(){f.imgs=[],f.imgsLoaded=!1;var g=e.get("flickr-photos");""===g||void 0===g?d.get(a,b,c).then(function(a){if(f.username=a.username,f.imgs=a.photos,f.imgsLoaded=!0,g={photos:a.photos,username:a.username},f.useCookies){var b=new Date;b.setMinutes(b.getMinutes()+5),e.put("flickr-photos",JSON.stringify(g),{expires:b})}}):(g=JSON.parse(g),f.username=g.username,f.imgs=g.photos,f.imgsLoaded=!0)}};c.$inject=["$http","$q","$sce","flickrService","$cookies"];var d={bindings:{useCookies:"="},controller:c,templateUrl:"/app/flickr/flickr.list.html"};b.component("flickrComponent",d)}(window.angular),function(a){"use strict";var b=a.module("app"),c=function(){var a=this;a.apiKey=null,a.userId=null,a.username=null,a.maxPhotos=5,a.setFlickrApiKey=function(b){a.apiKey=b},a.setFlickrUserId=function(b){a.userId=b},a.setFlickrUsername=function(b){a.username=b},a.setMaxPhotos=function(b){a.maxPhotos=b},a.$get=function(){return{get:function(b,c,d){var e=!1;if(null===a.apiKey&&(console.log("flickrServiceProvider::$get::get no api key specified"),e=!0),null===a.userId&&(console.log("flickrServiceProvider::$get::get no user id specified (use : http://idgettr.com/)"),e=!0),null===a.username&&(console.log("flickrServiceProvider::$get::get no username specified"),e=!0),!e){var f=c.defer();return b.get("https://api.flickr.com/services/rest/?api_key="+a.apiKey+"&nojsoncallback=1&format=json&user_id="+a.userId+"&method=flickr.people.getPublicPhotos&per_page="+a.maxPhotos).then(function(b){for(var c={username:a.username,photos:[]},d=0;d<b.data.photos.photo.length;d++){var e=b.data.photos.photo[d],g="https://farm"+e.farm+".staticflickr.com/"+e.server+"/"+e.id+"_"+e.secret+"_q.jpg",h="https://www.flickr.com/photos/"+a.username+"/"+e.id+"/in/dateposted-public/";c.photos.push({title:e.title,url:g,publicUrl:h})}f.resolve(c)},function(a){console.log("flickrServiceProvider::$get::get error("+a+")"),f.reject(a)}),f.promise}}}}};b.provider("flickrService",c)}(window.angular);