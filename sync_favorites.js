(function () {
    'use strict';

    const URL = 'https://webhook.site/7ed4abe2-6104-42aa-b5b7-6542f53cc219';

    function safeGet(key) {
        try {
            return Lampa.Storage.get(key);
        } catch (e) {
            return null;
        }
    }

    function collectRaw() {

        const storage = safeGet('favorite') || safeGet('favorites') || {};

        const keys = [
            'card',
            'like',
            'book',
            'look',
            'scheduled',
            'continued',
            'history',
            'wath',
            'viewed'
        ];

        let fromStorage = [];

        keys.forEach(k => {
            if (Array.isArray(storage[k])) {
                fromStorage.push(...storage[k]);
            }
        });

        const fromAPI = (Lampa.Favorite && Lampa.Favorite.list)
            ? Lampa.Favorite.list()
            : [];

        return [...fromStorage, ...fromAPI];
    }

    function normalize(items) {

        const map = new Map();

        items.forEach(i => {
            if (!i || !i.id) return;

            const id = i.id;

            map.set(id, {
                id: id,

                // НЕ завязываемся на next_episode (это ломало всё)
                type: i.number_of_seasons ? 'tv' : 'movie',

                title:
                    i.title ||
                    i.name ||
                    i.original_title ||
                    i.original_name ||
                    'Unknown',

                poster: i.poster_path || null,

                status: i.status || null,

                // сохраняем если есть, но НЕ используем как фильтр
                next_episode: i.next_episode_to_air || null
            });
        });

        return [...map.values()];
    }

    function send(payload) {

        const data = JSON.stringify(payload);

        try {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', URL, true);

            xhr.onload = function () {
                Lampa.Noty.show('v5 POST OK');
                console.log('v5 SENT');
            };

            xhr.onerror = function () {
                fallback(data);
            };

            xhr.send(data);

        } catch (e) {
            fallback(data);
        }
    }

    function fallback(data) {
        const img = new Image();
        img.src = URL + '?data=' + encodeURIComponent(data);

        Lampa.Noty.show('v5 fallback sent');
    }

    function sync() {

        const raw = collectRaw();
        const items = normalize(raw);

        console.log('RAW:', raw.length);
        console.log('FINAL:', items.length);

        if (!items.length) {
            Lampa.Noty.show('Пусто');
            return;
        }

        const payload = {
            time: new Date().toISOString(),
            count: items.length,
            items: items
        };

        send(payload);
    }

    function init() {

        console.log('Lampa v5 tracker loaded');

        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: {
                    name: 'sync_v5',
                    type: 'button',
                    default: false
                },
                field: {
                    name: '📡 Sync ALL v5 (FULL)',
                    description: 'Полный сбор без потерь'
                },
                onChange: sync
            });
        }
    }

    setTimeout(init, 3000);

})();
