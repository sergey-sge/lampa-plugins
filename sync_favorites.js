(function () {
    'use strict';

    function syncFavorites() {

        let favorites = null;
        let bookmarks = null;

        try {
            // favorites
            favorites =
                Lampa.Storage.get('favorite') ||
                Lampa.Storage.get('favorites') ||
                (Lampa.Favorite ? Lampa.Favorite.list() : null);

            // bookmarks
            bookmarks =
                Lampa.Storage.get('bookmark') ||
                Lampa.Storage.get('bookmarks');

        } catch (e) {
            Lampa.Noty.show('Ошибка получения данных');
            return;
        }

        if (!favorites && !bookmarks) {
            Lampa.Noty.show('Нет данных');
            return;
        }

        const url = 'https://webhook.site/7ed4abe2-6104-42aa-b5b7-6542f53cc219';

        const payload = {
            time: new Date().toISOString(),
            favorites: favorites || [],
            bookmarks: bookmarks || []
        };

        try {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', url, true);

            // ❗ важно: НЕ ставим headers вообще
            // РАБОЧАЯ ВЕРСИЯ!!!
            xhr.onload = function () {
                Lampa.Noty.show('POST отправлен');
                console.log('RESPONSE:', xhr.responseText);
            };

            xhr.onerror = function () {
                Lampa.Noty.show('Ошибка POST');
            };

            xhr.send(JSON.stringify(payload));

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
                    name: '📡 Отправить избранное',
                    description: 'POST sync favorites + bookmarks'
                },
                onChange: function () {
                    syncFavorites();
                }
            });
        }
    }

    // запуск с задержкой (чтобы Lampa успела загрузиться)
    setTimeout(init, 3000);

})();
