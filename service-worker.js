importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

urlsToCache = [
    { url: "/", revision: '17' },
    { url: "/index.html", revision: '17' },
    { url: "/manifest.json", revision: '17' },
    { url: "/images/slide1.jpg", revision: '17' },
    { url: "/images/slide2.jpg", revision: '17' },
    { url: "/images/slide3.jpg", revision: '17' },
    { url: "/favicon.png", revision: '17' },
    { url: "/images/icons/icon-32x32.png", revision: '17' },
    { url: "/images/icons/icon-72x72.png", revision: '17' },
    { url: "/images/icons/icon-144x144.png", revision: '17' },
    { url: "/images/icons/icon-192x192.png", revision: '17' },
    { url: "/images/icons/icon-384x384.png", revision: '17' },
    { url: "/images/icons/icon-512x512.png", revision: '17' },
    { url: "/images/logos/2000.svg", revision: '17' },
    { url: "/images/logos/2001.svg", revision: '17' },
    { url: "/images/logos/2002.svg", revision: '17' },
    { url: "/images/logos/2003.svg", revision: '17' },
    { url: "/images/logos/2013.svg", revision: '17' },
    { url: "/images/logos/2014.svg", revision: '17' },
    { url: "/images/logos/2015.svg", revision: '17' },
    { url: "/images/logos/2016.svg", revision: '17' },
    { url: "/images/logos/2017.svg", revision: '17' },
    { url: "/images/logos/2018.svg", revision: '17' },
    { url: "/images/logos/2019.svg", revision: '17' },
    { url: "/images/logos/2021.svg", revision: '17' },
    { url: "/match.html", revision: '17' },
    { url: "/components/nav.html", revision: '17' },
    { url: "/components/pages/home.html", revision: '17' },
    { url: "/components/pages/about.html", revision: '17' },
    { url: "/components/pages/live.html", revision: '17' },
    { url: "/components/pages/saved.html", revision: '17' },
    { url: "/styles/style.css", revision: '17' },
    { url: "/styles/materialize.min.css", revision: '17' },
    { url: "/scripts/register.js", revision: '17' },
    { url: "/scripts/lib/materialize.min.js", revision: '17' },
    { url: "/scripts/lib/idb.js", revision: '17' },
    { url: "/scripts/data/dataApi.js", revision: '17' },
    { url: "/scripts/data/dataCache.js", revision: '17' },
    { url: "/scripts/data/dataDb.js", revision: '17' },
    { url: "/scripts/data/dataLogo.js", revision: '17' },
    { url: "/scripts/helper/date.js", revision: '17' },
    { url: "/scripts/helper/preloader.js", revision: '17' },
    { url: "/scripts/loader/main.js", revision: '17' },
    { url: "/scripts/loader/loadLeague.js", revision: '17' },
    { url: "/scripts/loader/loadMatch.js", revision: '17' },
    { url: "/scripts/loader/loadNav.js", revision: '17' },
    { url: "/scripts/loader/loadPage.js", revision: '17' },
]

if (workbox) {
    console.log(`Workbox berhasil dimuat`);
    console.log(workbox);

    workbox.precaching.precacheAndRoute(urlsToCache, {
        ignoreURLParametersMatching: [/.*/]
    });

    workbox.routing.registerRoute(
        new RegExp('https://api.football-data.org/v2/'),
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'football-api',
        })
    );

    workbox.routing.registerRoute(
        /.*(?:googleapis|gstatic)\.com/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'google-fonts',
        })
    );

    workbox.routing.registerRoute(
        new RegExp('/components/'),
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'pages',
        })
    );

    workbox.routing.registerRoute(
        /.*(?:png|gif|jpg|jpeg|svg)$/,
        workbox.strategies.cacheFirst({
            cacheName: 'images',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200]
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                    maxEntries: 100,
                }),
            ]
        })
    );

    workbox.routing.registerRoute(
        /\.(?:js|css)$/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'static-resources',
        })
    );
} else {
    console.log(`Workbox gagal dimuat`);
}

self.addEventListener('push', (event) => {
    let body;
    if (event.data) {
        body = `${event.data.text()} - GetdeBall`;
    } else {
        body = 'Push message no payload';
    }
    const options = {
        body: body,
        icon: './images/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});