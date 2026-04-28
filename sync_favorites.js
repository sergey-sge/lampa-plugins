(function () {
    'use strict';

    function syncFavorites() {
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

        // 🔥 твой webhook
        const url = 'https://webhook.site/7ed4abe2-6104-42aa-b5b7-6542f53cc219';

        fetch(url, {
    method: 'POST',
    body: JSON.stringify({
        time: new Date().toISOString(),
        favorites: favorites
    })
})
.then(res => {
    Lampa.Noty.show('Отправлено!');
})
.catch(err => {
    Lampa.Noty.show('Ошибка отправки');
});
    }

    function init() {
        console.log('Plugin: Favorites Sync loaded');

        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: {
                    name: 'sync_favorites',
                    type: 'button',
                    default: false
                },
                field: {
                    name: 'Отправить избранное',
                    description: 'Отправка на webhook'
                },
                onChange: function () {
                    syncFavorites();
                }
            });
        }
    }

    setTimeout(init, 2000);
})();
