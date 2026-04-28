function syncFavorites() {
    let favorites = null;
    let bookmarks = null;

    try {
        favorites = Lampa.Storage.get('favorite') 
                 || Lampa.Storage.get('favorites') 
                 || (Lampa.Favorite ? Lampa.Favorite.list() : null);

        bookmarks = Lampa.Storage.get('bookmark') 
                 || Lampa.Storage.get('bookmarks');
    } catch (e) {
        Lampa.Noty.show('Ошибка получения данных');
        return;
    }

    const url = 'https://webhook.site/7ed4abe2-6104-42aa-b5b7-6542f53cc219';

    const payload = {
        time: new Date().toISOString(),
        favorites: favorites || [],
        bookmarks: bookmarks || []
    };

    const xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);

    // ❗ ВАЖНО: без headers (иначе может ломаться)
    xhr.onload = function () {
        Lampa.Noty.show('POST отправлен');
        console.log('OK:', xhr.responseText);
    };

    xhr.onerror = function () {
        Lampa.Noty.show('Ошибка POST');
    };

    xhr.send(JSON.stringify(payload));
}
