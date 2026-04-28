(function () {
    'use strict';

    function get() {
        try {
            return (Lampa.Favorite && Lampa.Favorite.list)
                ? Lampa.Favorite.list()
                : [];
        } catch (e) {
            return [];
        }
    }

    function send(data) {

        const url = 'https://webhook.site/7ed4abe2-6104-42aa-b5b7-6542f53cc219';

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.send(JSON.stringify(data));
    }

    function sync() {

        const items = get();

        const payload = {
            time: new Date().toISOString(),
            count: items.length,
            items: items.map(i => ({
                id: i.id,
                title: i.title || i.name || i.original_name || '',
                type: i.number_of_seasons ? 'tv' : 'movie'
            }))
        };

        send(payload);

        Lampa.Noty.show('sync v6');
        console.log(payload);
    }

    function init() {

        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: {
                    name: 'sync_v6',
                    type: 'button',
                    default: false
                },
                field: {
                    name: '📡 Sync v6',
                    description: 'Simple favorites sync'
                },
                onChange: sync
            });
        }
    }

    setTimeout(init, 3000);

})();
