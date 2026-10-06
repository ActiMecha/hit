// Keep a dated, same-origin map visible even if the counter is slow or offline.
// The official counter image is requested once, after the main page has loaded.
(function () {
    'use strict';

    let map = document.getElementById('visitor-map');
    const status = document.getElementById('visitor-map-status');
    const retry = document.getElementById('visitor-map-retry');
    if (!map || !status || !retry) return;

    const source = map.dataset.src;
    let loading = false;

    function loadMap() {
        if (loading) return;
        loading = true;
        retry.hidden = true;

        // Reuse this exact element on success to avoid requesting/counting twice.
        const liveMap = new Image();
        liveMap.id = map.id;
        liveMap.className = map.className;
        liveMap.width = 400;
        liveMap.height = 205;
        liveMap.alt = 'World map showing visits to this website';
        liveMap.decoding = 'async';
        liveMap.fetchPriority = 'low';

        let finished = false;
        const timeout = window.setTimeout(function () { finish(false); }, 20000);

        function finish(success) {
            if (finished) return;
            finished = true;
            loading = false;
            window.clearTimeout(timeout);
            liveMap.onload = null;
            liveMap.onerror = null;
            retry.hidden = success;
            if (success) {
                map.replaceWith(liveMap);
                map = liveMap;
                status.textContent = 'Updated just now';
            } else {
                // Leave the snapshot and its date intact, without a loading box.
                liveMap.removeAttribute('src');
            }
        }

        liveMap.onload = function () {
            // The provider sometimes returns an invisible 1 × 1 placeholder.
            if (liveMap.naturalWidth <= 1 || liveMap.naturalHeight <= 1) {
                finish(false);
            } else if (typeof liveMap.decode === 'function') {
                liveMap.decode().then(function () { finish(true); }, function () { finish(false); });
            } else {
                finish(true);
            }
        };
        liveMap.onerror = function () { finish(false); };
        liveMap.src = source;
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
