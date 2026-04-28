(function () {
    'use strict';

    function getFavorites() {
        let favorites = null;

        try {
            // Попытка 1 (чаще всего)
            favorites = Lampa.Storage.get('favorite');

            // Попытка 2 (альтернатива)
            if (!favorites) {
                favorites = Lampa.Storage.get('favorites');
            }

            // Попытка 3 (иногда используется)
            if (!favorites) {
                favorites = Lampa.Favorite ? Lampa.Favorite.list() : null;
            }

        } catch (e) {
            console.error('Ошибка получения избранного:', e);
        }

        console.log('=== FAVORITES ===');
        console.log(favorites);

        if (!favorites) {
            Lampa.Noty.show('Не удалось получить избранное');
        } else {
            Lampa.Noty.show('Избранное выведено в консоль');
        }

        return favorites;
    }

    function init() {
        console.log('Plugin: Sync Favorites loaded');

        // Добавляем кнопку в настройки
        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: {
                    name: 'sync_favorites',
                    type: 'button',
                    default: false
                },
                field: {
                    name: 'Синхронизировать избранное',
                    description: 'Выводит избранное в консоль'
                },
                onChange: function () {
                    getFavorites();
                }
            });
        }
    }

    // Ждём загрузки Lampa
    if (window.appready) {
        init();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                init();
            }
        });
    }

})();
