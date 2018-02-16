var CACHE_NAME = 'k-developer-cache-v1';
var urlsToCache = [
  '/',
  '/roller',
  '/sheets',
  '/show',
  '/stylesheets/main.css',
  '/stylesheets/show.css',
  '/stylesheets/sheets.css',
  '/stylesheets/style.css',
  '/stylesheets/roller.css',
  '/javascripts/main.js',
  '/javascripts/show.js',
  '/javascripts/sheet.js',
  '/javascripts/roller.js',
  '/javascripts/login.js',
  '/javascripts/workers/roller_worker.js',
  '/javascripts/workers/ajax_worker.js',
  '/javascripts/workers/service_worker.js',
];


self.addEventListener('install', function(event) {
  event.waitUntil(
  		caches.open(CACHE_NAME)
  		.then(function(caches){
  			console.log("Opened cache");
  			return caches.addAll(urlsToCache);
  		})
  	);
});