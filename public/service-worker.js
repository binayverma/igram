importScripts('workbox-sw.prod.v2.1.3.js');
importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

const workboxSW = new self.WorkboxSW();

workboxSW.router.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'google-fonts',
  cacheExpiration: {
    maxEntries: 3,
    maxAgeSeconds: 60 * 60 * 24 * 30
  }
}));

workboxSW.router.registerRoute('https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css', workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'material-css'
}));

workboxSW.router.registerRoute(/.*(?:firebasestorage\.googleapis)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'post-images'
}));

workboxSW.router.registerRoute(routeData => {
  return (routeData.event.request.headers.get('accept').includes('text/html'));
}, args => {
  return caches.match(args.event.request)
    .then(function(response) {
      if(response) {
        return response;
      } else {
        return fetch(args.event.request)
          .then(function(res) {
            return caches.open('dynamic')
              .then(function(cache) {
                cache.put(args.event.request.url, res.clone());
                return res
              })
          })
          .catch(function(err) {
            return caches.match('/offline.html')
              .then(res => res);
          });
      }
    })
});

workboxSW.precache([
  {
    "url": "favicon.ico",
    "revision": "2cab47d9e04d664d93c8d91aec59e812"
  },
  {
    "url": "index.html",
    "revision": "f8af7d28b5098058ca0ec221eaab5821"
  },
  {
    "url": "manifest.json",
    "revision": "d0d89817d9636f97bdf84faf200d74e1"
  },
  {
    "url": "offline.html",
    "revision": "4f1cfb764e8d6d8b81f52120e3cebdfc"
  },
  {
    "url": "service-worker.js",
    "revision": "20af683c7d1c685db5119caa7d886035"
  },
  {
    "url": "src/css/app.css",
    "revision": "f27b4d5a6a99f7b6ed6d06f6583b73fa"
  },
  {
    "url": "src/css/feed.css",
    "revision": "a0bb4adbab3259672f824c4ae9a9d922"
  },
  {
    "url": "src/css/help.css",
    "revision": "1c6d81b27c9d423bece9869b07a7bd73"
  },
  {
    "url": "src/js/app.js",
    "revision": "74b84910a3acdcff1aadee910026718c"
  },
  {
    "url": "src/js/feed.js",
    "revision": "0da04e48166fbcdf59e6db0731f46e30"
  },
  {
    "url": "src/js/fetch.js",
    "revision": "6b82fbb55ae19be4935964ae8c338e92"
  },
  {
    "url": "src/js/idb.js",
    "revision": "017ced36d82bea1e08b08393361e354d"
  },
  {
    "url": "src/js/material.min.js",
    "revision": "713af0c6ce93dbbce2f00bf0a98d0541"
  },
  {
    "url": "src/js/promise.js",
    "revision": "10c2238dcd105eb23f703ee53067417f"
  },
  {
    "url": "src/js/utility.js",
    "revision": "a604035b8e4e3f007deee5502da4accf"
  },
  {
    "url": "sw-base.js",
    "revision": "6c0b875d6ba143c37b384e9e7055cdae"
  },
  {
    "url": "sw.js",
    "revision": "65551cd8d8bc098ec9449c7301858c23"
  },
  {
    "url": "workbox-sw.prod.v2.1.3.js",
    "revision": "a9890beda9e5f17e4c68f42324217941"
  },
  {
    "url": "src/images/main-image-lg.jpg",
    "revision": "31b19bffae4ea13ca0f2178ddb639403"
  },
  {
    "url": "src/images/main-image-sm.jpg",
    "revision": "c6bb733c2f39c60e3c139f814d2d14bb"
  },
  {
    "url": "src/images/main-image.jpg",
    "revision": "5c66d091b0dc200e8e89e56c589821fb"
  },
  {
    "url": "src/images/sf-boat.jpg",
    "revision": "0f282d64b0fb306daf12050e812d6a19"
  }
]);