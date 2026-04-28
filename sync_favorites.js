(function () {
    'use strict';

    function syncFavorites() {
        let favorites = null;
        let bookmarks = null;

        try {
            // Избранное
            favorites = Lampa.Storage.get('favorite') 
                     || Lampa.Storage.get('favorites') 
                     || (Lampa.Favorite ? Lampa.Favorite.list() : null);

            // Закладки (важно для сериалов)
            bookmarks = Lampa.Storage.get('bookmark') 
                     || Lampa.Storage.get('bookmarks');
        } catch (e) {
            Lampa.Noty.show('Ошибка получения данных');
            return;
        }

        if (!favorites && !bookmarks) {
            Lampa.Noty.show('Нет данных');
            return;
        }

        try {
            const url = 'https://webhook.site/7ed4abe2-6104-42aa-b5b7-6542f53cc219';

            const payload = {
                time: new Date().toISOString(),
                favorites: favorites || [],
                bookmarks: bookmarks || []
            };

            const encoded = encodeURIComponent(JSON.stringify(payload));

            // 🚀 отправка через Image (100% совместимо с Lampa)
            const img = new Image();
            img.src = url + '?data=' + encoded;

            Lampa.Noty.show('Отправлено!');
            console.log('SYNC PAYLOAD', payload);

        } catch (e) {
            Lampa.Noty.show('Ошибка отправки');
        }
    }

    function init() {
        console.log('Favorites Sync Plugin loaded');

        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: {
                    name: 'sync_favorites',
                    type: 'button',
                    default: false
                },
                field: {
                    name: '📡 Отправить избранное + bookmarks',
                    description: 'Синхронизация данных'
                },
                onChange: function () {
                    syncFavorites();
                }
            });
        }
    }

    // Гарантированный запуск
    setTimeout(init, 3000);

})();    function mergeUnique(a, b) {
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
