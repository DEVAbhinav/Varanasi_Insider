// let cacheData = "taxiV1";
// self.addEventListener("install", (event) => {
//     event.waitUntil(
//         caches.open(cacheData).then((cache) => {
//             return cache.addAll([
//                 '/static/js/main.chunk.js',
//                 '/static/js/0.chunk.js',
//                 '/static/js/bundle.js',
//                 '/static/css/main.chunk.css',
//                 '/static/css/2.d9ad5f5c.chunk.css',
//                 '/static/css/main.8a6c865b.chunk.css',                
//                 '/static/media/AvenirNextLTPro-Medium.751cdac5.otf',
//                 '/static/media/packageOne.f2c3006e.png',
//                 '/static/media/packageThree.eeaf4f47.png',
//                 '/static/media/packageFour.64b87d66.png',
//                 '/static/media/packageTwo.e90e30a1.png',
//                 '/bootstrap.min.css',
//                 '/index.html',
//                 '/images/loader.gif',
//                 '/images/seden.png',
//                 '/images/xuv.png',
//                 '/images/miniBus.png',
//                 '/images/bus.png',
//                 '/',
//                 "/about",
//                 "/places",
//                 "/kashiVishwanath",
//                 "/carHire",
//                 "/taxiService",
//                 "/contact",
//                 "/static/js/2.5e777c3a.chunk.js"
//             ])
//         })
//     )
// })
// self.addEventListener("fetch", (event) => {
//     if (!navigator.onLine) {        
//         event.respondWith(
//             // fetch(event.request).catch(() => {
//             //     return caches.match(event.request);
//             // })
//             caches.open(cacheData).then((cache) => {
//                 return cache.match(event.request).then((response) => {
//                     return response || fetch(event.request).then((response) => {
//                         cache.put(event.request, response.clone());
//                         return response;
//                     })
//                 })
//             })            
//         )
//     }
// }) 