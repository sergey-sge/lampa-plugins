(function () {
    'use strict';

    function get() {
        try {
            const fav = Lampa.Storage.get('favorite') || {};

            return fav.card || fav.like || fav.book || [];
        } catch (e) {
            return [];
        }
    }

    function send(data) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://webhook.site/7ed4abe2-6104-42aa-b5b7-6542f53cc219', true);
        xhr.send(JSON.stringify(data));
    }

    function sync() {
        const items = get();

        const payload = {
            time: new Date().toISOString(),
            count: items.length,
            items: items.map(i => ({
                id: i.id,
                title: i.title || i.name,
                type: i.number_of_seasons ? 'tv' : 'movie'
            }))
        };

        send(payload);
        Lampa.Noty.show('sync ok');
    }

    function init() {
        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: { name: 'sync_final', type: 'button', default: false },
                field: { name: '📡 Sync final', description: 'stable version' },
                onChange: sync
            });
        }
    }

    setTimeout(init, 3000);

})();
