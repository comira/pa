function getLocation(href) {
    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        href: href,
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7]
    }
}

function getQueryVariable(search, variable) {
    var query = search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return false;
}

function toBase64(u8) {
    return btoa(String.fromCharCode.apply(null, u8));
}

function fromBase64(str) {
    return new Uint8Array(atob(str).split('').map(function (c) {
        return c.charCodeAt(0);
    }));
}


self.addEventListener('install', function (event) {
    self.skipWaiting();
});

self.addEventListener('fetch', function (event) {
    let req = getLocation(event.request.url);
    console.log(req);
    if (event.request.url.endsWith('sw.js')) {
        return;
    }
    let headers = new Headers();
    if (req.pathname.endsWith('index.html')) {
        headers.set('content-type', 'text/html');
        headers.set('power-by', 'BunnyFront');
        event.respondWith(
            new Response(['Hello World<img src="1.jpg"/>'], {headers: headers})
        );
        return;
    }
    //headers.set('content-type', 'image/png');
    headers.set('power-by', 'BunnyFront');
    event.respondWith(fetch('dist/' + req.pathname.replace('/pa/','/') + '.txt').then(r => r.text()).then(r => {
        let blob = new Blob([fromBase64(r)], {});
        return  new Response(blob, {headers: headers})
    }));
});
