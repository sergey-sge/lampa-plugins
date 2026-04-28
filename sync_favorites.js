(function () {
    'use strict';

    function getData() {
        let favorite = [];
        let bookmarks = [];

        try {
            favorite =
                Lampa.Storage.get('favorite') ||
                Lampa.Storage.get('favorites') ||
                [];
        } catch (e) {}

        try {
            bookmarks =
                Lampa.Storage.get('bookmark') ||
                Lampa.Storage.get('bookmarks') ||
                [];
        } catch (e) {}

        return { favorite, bookmarks };
    }

    function normalize(list) {
        if (!Array.isArray(list)) return [];

        return list
            .filter(i => i && i.id)
            .map(i => ({
                id: i.id,
                type: i.type || i.media_type || 'unknown',
                title: i.title || i.name || ''
            }));
    }

    function mergeUnique(a, b) {
        const map = new Map();

        [...a, ...b].forEach(item => {
            map.set(item.id, item);
        });

        return Array.from(map.values());
    }

    function sync() {
        const raw = getData();

        const fav = normalize(raw.favorite);
        const book = normalize(raw.bookmarks);

        const merged = mergeUnique(fav, book);

        const payload = {
            time: new Date().toISOString(),
            count: merged.length,
            items: merged
        };

        const url = 'https://webhook.site/7ed4abe2-6104-42aa-b5b7-6542f53cc219';

        const img = new Image();
        img.src = url + '?data=' + encodeURIComponent(JSON.stringify(payload));

        Lampa.Noty.show('Синхронизация отправлена');
        console.log('SYNC PAYLOAD', payload);
    }

    function init() {
        console.log('Lampa Sync Plugin loaded');

        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: {
                    name: 'sync_all',
                    type: 'button',
                    default: false
                },
                field: {
                    name: '📡 Sync Favorites + Bookmarks',
                    description: 'Отправка всех закладок'
                },
                onChange: function () {
                    sync();
                }
            });
        }
    }

    setTimeout(init, 3000);
})();
