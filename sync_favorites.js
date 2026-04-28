(function () {
    'use strict';

    function getStorage(key) {
        try {
            return Lampa.Storage.get(key);
        } catch (e) {
            return null;
        }
    }

    function collectFromFavoriteAPI() {
        try {
            return Lampa.Favorite ? Lampa.Favorite.list() : [];
        } catch (e) {
            return [];
        }
    }

    function collectAll() {

        const storage = getStorage('favorite') || getStorage('favorites') || {};

        const fromStorage = [
            ...(storage.card || []),
            ...(storage.like || []),
            ...(storage.book || []),
            ...(storage.look || []),
            ...(storage.scheduled || []),
            ...(storage.continued || []),
            ...(storage.history || [])
        ];

        const fromAPI = collectFromFavoriteAPI();

        const all = [...fromStorage, ...fromAPI];

        return all;
    }

    function normalize(items) {

        const map = new Map();

        items.forEach(i => {
            if (!i || !i.id) return;

            map.set(i.id, {
                id: i.id,
                type: i.number_of_seasons ? 'tv' : 'movie',
                title: i.title || i.name || i.original_title || i.original_name,
                status: i.status || null,
                next_episode: i.next_episode_to_air || null,
                poster: i.poster_path || null
            });
        });

        return Array.from(map.values());
    }

    function send(payload) {

        const url = 'https://webhook.site/7ed4abe2-6104-42aa-b5b7-6542f53cc219';

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);

        xhr.onload = function () {
            Lampa.Noty.show('OK отправлено');
            console.log('SENT', payload);
        };

        xhr.onerror = function () {
            Lampa.Noty.show('Ошибка отправки');
        };

        xhr.send(JSON.stringify(payload));
    }

    function sync() {

        const all = collectAll();
        const normalized = normalize(all);

        console.log('RAW COUNT:', all.length);
        console.log('FINAL COUNT:', normalized.length);

        if (!normalized.length) {
            Lampa.Noty.show('Пусто');
            return;
        }

        const payload = {
            time: new Date().toISOString(),
            count: normalized.length,
            items: normalized
        };

        send(payload);
    }

    function init() {

        console.log('Lampa v4 collector loaded');

        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: {
                    name: 'sync_v4',
                    type: 'button',
                    default: false
                },
                field: {
                    name: '📡 Sync FULL v4',
                    description: 'Полный сбор данных без потерь'
                },
                onChange: sync
            });
        }
    }

    setTimeout(init, 3000);

})();
