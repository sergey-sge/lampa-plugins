(function () {
    'use strict';

    const URL = 'https://webhook.site/7ed4abe2-6104-42aa-b5b7-6542f53cc219';

    function collectAll(raw) {
        if (!raw) return [];

        const keys = [
            'card',
            'like',
            'book',
            'look',
            'viewed',
            'scheduled',
            'continued',
            'history'
        ];

        const all = [];

        keys.forEach(k => {
            if (Array.isArray(raw[k])) {
                raw[k].forEach(i => all.push(i));
            }
        });

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
                next: i.next_episode_to_air || null
            });
        });

        return [...map.values()];
    }

    function send(payload) {
        const data = JSON.stringify(payload);

        // 🥇 Попытка POST (основной способ)
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', URL, true);

            xhr.onload = function () {
                Lampa.Noty.show('POST OK');
                console.log('POST OK');
            };

            xhr.onerror = function () {
                fallback(data);
            };

            xhr.send(data);

            return;
        } catch (e) {
            fallback(data);
        }
    }

    function fallback(data) {
        // 🥈 запасной вариант (100% работает)
        const img = new Image();
        img.src = URL + '?data=' + encodeURIComponent(data);

        Lampa.Noty.show('Sent (fallback)');
        console.log('FALLBACK SENT');
    }

    function sync() {
        let raw = null;

        try {
            raw =
                Lampa.Storage.get('favorite') ||
                Lampa.Storage.get('favorites') ||
                (Lampa.Favorite ? Lampa.Favorite.list() : {});
        } catch (e) {
            Lampa.Noty.show('Ошибка получения данных');
            return;
        }

        const all = collectAll(raw);
        const normalized = normalize(all);

        if (!normalized.length) {
            Lampa.Noty.show('Нет данных');
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
        console.log('Lampa Sync v3 loaded');

        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: {
                    name: 'sync_all_v3',
                    type: 'button',
                    default: false
                },
                field: {
                    name: '📡 Sync ALL (v3)',
                    description: 'Стабильная синхронизация'
                },
                onChange: function () {
                    sync();
                }
            });
        }
    }

    setTimeout(init, 3000);

})();
