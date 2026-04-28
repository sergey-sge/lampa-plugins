(function () {
    'use strict';

    function downloadFavorites() {
        let favorites = null;

        try {
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

        // создаём файл
        const dataStr = JSON.stringify(favorites, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'favorites.json';
        a.click();

        URL.revokeObjectURL(url);

        Lampa.Noty.show('Файл с избранным скачан');
    }

    function init() {
        console.log('Plugin: Favorites Downloader loaded');

        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: {
                    name: 'download_favorites',
                    type: 'button',
                    default: false
                },
                field: {
                    name: 'Скачать избранное',
                    description: 'Сохраняет JSON файл'
                },
                onChange: function () {
                    downloadFavorites();
                }
            });
        }
    }

    setTimeout(init, 2000);
})();
