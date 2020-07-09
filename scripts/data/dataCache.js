import fetchApi from '/scripts/data/dataApi.js'

class checkCache extends fetchApi {
    constructor() {
        super();
    }

    async call(path) {
        if ('caches' in window) {
            const check = caches.match(this.base_url + path).then((response) => {
                if (response) {
                    return response.json();
                }
            })
            this.result = await check;
            if (this.result) {
                return this.result;
            }
        }
    }
}

export default checkCache;