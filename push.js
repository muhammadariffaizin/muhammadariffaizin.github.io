const webPush = require('web-push');
const vapidKeys = {
    "publicKey": "BDmrZoCKUNF2zn5IgK7a-8dQvZ_oZU2hwq_TMU9RC88t8yNIMBYz8QMTr2jSFFZmcK4vBjuXm88UdmxJ-7S4AeI",
    "privateKey": "7xXgnL8SD3d6y9Wjck5XvXlna_FdStwQ4z6Yap61-nY"
};

webPush.setVapidDetails(
    'mailto:muhammadariffaizin@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

const pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/el_knrObgf4:APA91bHgoOQDTMH3COEJ30O1HfESPvEeRPY3HVgQhBh6ojM9iTN8S2o6P_0cFJ36b8CxRcjt6VXGswmxXyOD7ZwwLLGU3RJBJLrrUR6IudAgbt_x50NUCPb24xeRzIj0sactTZgdXRrn",
    "keys": {
        "p256dh": "BE/I2a/gc4IYaHQwNgziivIvQlZgDhhfvMd6Tg5cOgyeQWGq3YFkfASORSKy4d30Fe3y6VWDi3DMUqz6284c9sc=",
        "auth": "eYcguQXa8Mbc5jzuUyZ5Hg=="
    }
};

const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
const options = {
    gcmAPIKey: '585923387957',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);
