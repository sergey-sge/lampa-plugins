(function () {
    'use strict';

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
            'wath',
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

            const id = i.id;

            map.set(id, {
                id: id,
                type: i.number_of_seasons ? 'tv' : 'movie',
                title: i.title || i.name || i.original_title || i.original_name,
                status: i.status || null,
                next_episode_to_air: i.next_episode_to_air || null,
                poster: i.poster_path || null
            });
        });

        return [...map.values()];
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

        const url = 'https://webhook.site/7ed4abe2-6104-42aa-b5b7-6542f53cc219';

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);

        xhr.onload = function () {
            Lampa.Noty.show('Синхронизация отправлена');
            console.log('SYNC OK', payload);
        };

        xhr.onerror = function () {
            Lampa.Noty.show('Ошибка отправки');
        };

        xhr.send(JSON.stringify(payload));
    }

    function init() {
        console.log('Lampa Sync v2 loaded');

        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: {
                    name: 'sync_all_v2',
                    type: 'button',
                    default: false
                },
                field: {
                    name: '📡 Sync ALL (v2)',
                    description: 'Полный экспорт всех списков'
                },
                onChange: function () {
                    sync();
                }
            });
        }
    }

    setTimeout(init, 3000);

})();
