// Keep the existing ClustrMaps account, but load only its static image.
// Start after the page has loaded; a slow provider cannot delay window.load.
(function () {
    'use strict';

    const map = document.getElementById('visitor-map');
    const status = document.getElementById('visitor-map-status');
    const retry = document.getElementById('visitor-map-retry');
    if (!map || !status || !retry) return;

    let loading = false;

    function loadMap() {
        if (loading) return;
        loading = true;
        map.hidden = true;
        status.hidden = false;
        status.textContent = 'Loading visitor map…';
        retry.hidden = true;

        let finished = false;
        const timeout = window.setTimeout(function () { finish(false); }, 8000);

        function finish(success) {
            if (finished) return;
            finished = true;
            loading = false;
            window.clearTimeout(timeout);
            map.onload = null;
            map.onerror = null;
            map.hidden = !success;
            status.hidden = success;
            retry.hidden = success;
            if (!success) {
                map.removeAttribute('src');
                status.textContent = 'Visitor map is temporarily unavailable.';
            }
        }

        map.onload = function () { finish(map.naturalWidth > 0); };
        map.onerror = function () { finish(false); };
        map.src = map.dataset.src;
    }

    function scheduleMap() {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(loadMap, { timeout: 2000 });
        } else {
            window.setTimeout(loadMap, 1000);
        }
    }

    retry.addEventListener('click', loadMap);
    if (document.readyState === 'complete') {
        scheduleMap();
    } else {
        window.addEventListener('load', scheduleMap, { once: true });
    }
}());
