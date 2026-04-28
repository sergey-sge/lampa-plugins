(function () {
    'use strict';

    function syncFavorites() {
        let favorites = null;

        try {
            // Пробуем разные варианты хранения
            favorites = Lampa.Storage.get('favorite') 
                     || Lampa.Storage.get('favorites') 
                     || (Lampa.Favorite ? Lampa.Favorite.list() : null);
        } catch (e) {
            Lampa.Noty.show('Ошибка получения избранного');
            return;
        }

        if (!favorites) {
            Lampa.Noty.show('Избранное не найдено');
            return;
        }

        try {
            const url = 'https://webhook.site/7ed4abe2-6104-42aa-b5b7-6542f53cc219';

            const payload = {
                time: new Date().toISOString(),
                favorites: favorites
            };

            const encoded = encodeURIComponent(JSON.stringify(payload));

            // 🚀 отправка через Image (без CORS)
            const img = new Image();
            img.src = url + '?data=' + encoded;

            Lampa.Noty.show('Отправлено!');
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
                    description: 'Отправка на webhook'
                },
                onChange: function () {
                    syncFavorites();
                }
            });
        }
    }

    // Гарантированный запуск
    setTimeout(init, 3000);

})();
