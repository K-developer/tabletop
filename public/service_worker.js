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
  '/service_worker.js',
];


self.addEventListener('install', function(event) {
  event.waitUntil(
  		caches.open(CACHE_NAME)
  		.then(function(cache){
  			console.log("Opened cache");
  			return cache.addAll(urlsToCache);
  		})
  	);
});

self.addEventListener('fetch', function(event){
	event.respondWith(
		caches.match(event.request)
			.then(function(response){
				if(response){
					return response;
				}
				var fetchRequest = event.request.clone();


				return fetch(fetchRequest).then(
						function(response){
							if(!response || response.status !== 200 || response.type !== 'basic'){
								return response;
							}

							var responseToCache = response.clone();

							caches.open(CACHE_NAME	)
							.then(function(cache){
								cache.put(event.request, responseToCache);
							});
							return response;
						}
					);
			})
		)
})

self.addEventListener('activate', function(event) {
  console.log("Activating ...");
  var cacheWhitelist = ['k-developer-cache-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});