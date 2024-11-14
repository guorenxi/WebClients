declare const self: ServiceWorkerGlobalScope;

interface DownloadConfig {
    stream: ReadableStream<Uint8Array>;
    filename: string;
    mimeType: string;
    size?: number;
}

const SECURITY_HEADERS = {
    'Content-Security-Policy': "default-src 'none'",
    'X-Content-Security-Policy': "default-src 'none'",
    'X-WebKit-CSP': "default-src 'none'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'deny',
    'X-XSS-Protection': '1; mode=block',
    'X-Permitted-Cross-Domain-Policies': 'none',
};

/**
 * Open a stream of data passed over MessageChannel.
 * Every download has it's own stream from app to SW.
 *
 * @param port MessageChannel port to listen on
 */
function createDownloadStream(port: MessagePort) {
    return new ReadableStream({
        start(controller: ReadableStreamDefaultController) {
            port.onmessage = ({ data }) => {
                switch (data?.action) {
                    case 'end':
                        return controller.close();
                    case 'download_chunk':
                        return controller.enqueue(data?.payload);
                    case 'abort':
                        return controller.error(data?.reason);
                    default:
                        console.error(`received unknown action "${data?.action}"`);
                }
            };
        },
        cancel() {
            port.postMessage({ action: 'download_canceled' });
        },
    });
}

const CACHE_NAME = 'webpack-cache-v1';
let CACHE_FILES: Set<string> = new Set();

const fetchAndCacheAssets = () => {
    /*
        Response is a JSON in such format:
        {
            "pre.js": "/assets/static/pre.cb365dbf.js?v=5.0.999.999",
            "index.css": "/assets/static/index.8cbd8c36.css?v=5.0.999.999",
            "index.js": "/assets/static/index.ee53b6bf.js?v=5.0.999.999",
        }
    */
    void fetch('/assets/offline.json')
        .then((response) => response.json())
        .then((manifest) => {
            const filesToCache = Object.values(manifest)
                .filter((path) => typeof path === 'string')
                .map((path) => (path.startsWith('/') ? path : `/${path}`));

            void caches.open(CACHE_NAME).then(async (cache) => {
                CACHE_FILES = new Set([...filesToCache]);

                const existingFiles = await cache.keys();
                const existingUrls = new Set();

                for (const file of existingFiles) {
                    const url = new URL(file.url);
                    const manifestUrl = file.url.split(url.origin)[1];

                    if (!CACHE_FILES.has(manifestUrl)) {
                        // Delete files not in new manifest
                        void cache.delete(file);
                    } else {
                        // Keep track of existing files that are still needed
                        existingUrls.add(manifestUrl);
                    }
                }

                const newFilesToCache = filesToCache.filter((file) => !existingUrls.has(file));
                if (newFilesToCache.length) {
                    return cache.addAll(newFilesToCache);
                }
            });
        });
};

/**
 * Service worker that listens for client-generated file data
 * and generates a unique link for downloading the data as a file stream.
 */
class DownloadServiceWorker {
    pendingDownloads = new Map<string, DownloadConfig>();

    /**
     * A counter used to generate IDs for `pendingDownloads`
     */
    downloadId = 1;

    constructor() {
        self.addEventListener('install', this.onInstall);
        self.addEventListener('activate', this.onActivate);
        self.addEventListener('message', this.onMessage);
        self.addEventListener('fetch', this.onFetch);
    }

    private generateUID = () => {
        if (this.downloadId > 9000) {
            this.downloadId = 0;
        }

        return this.downloadId++;
    };

    onInstall = () => {
        void self.skipWaiting();
    };

    onActivate = (event: ExtendableEvent) => {
        event.waitUntil(self.clients.claim());
    };

    /**
     * Intercepts requests on the generated download url
     * and responds with a stream, that client itself controls.
     */
    onFetch = (event: FetchEvent) => {
        const url = new URL(event.request.url);

        /** If request intercepted is an url from the webpack assets manifest, return the cache version if available */
        const maybeManifestUrl = event.request.url.split(url.origin)[1];
        if (maybeManifestUrl && CACHE_FILES.has(maybeManifestUrl)) {
            return event.respondWith(
                caches.match(event.request).then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                })
            );
        }

        // Our service worker is registered on the global scope
        // We currently only care about the /sw/* scope
        if (!url.pathname.startsWith('/sw')) {
            return;
        }

        // The main thread periodically wakes up the service worker with a ping
        if (url.pathname.endsWith('/sw/ping')) {
            return event.respondWith(new Response('pong', { headers: new Headers(SECURITY_HEADERS) }));
        }

        // URL format: /sw/ID
        const chunks = url.pathname.split('/').filter((item) => !!item);
        const id = chunks[chunks.length - 1];

        const pendingDownload = this.pendingDownloads.get(id);

        // Return a 404 if we can't find the download.
        // In some cases, the download ID is not added to the map on time.
        // If we were to simply return, this query would get sent to the real network.
        if (!pendingDownload) {
            return event.respondWith(
                new Response(undefined, {
                    status: 404,
                    headers: new Headers(SECURITY_HEADERS),
                })
            );
        }

        const { stream, filename, size, mimeType } = pendingDownload;

        this.pendingDownloads.delete(id);

        const headers = new Headers({
            ...(size ? { 'Content-Length': `${size}` } : {}),
            'Content-Type': mimeType,
            'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
            ...SECURITY_HEADERS,
        });

        event.respondWith(new Response(stream, { headers }));
    };

    /**
     * Called once before each download, opens a stream for file data
     * and generates a unique download link for the app to call to download file.
     */
    onMessage = (event: ExtendableMessageEvent) => {
        if (event.data?.action === 'cache_assets') {
            fetchAndCacheAssets();
            return;
        }

        if (event.data?.action !== 'start_download') {
            return;
        }

        const id = this.generateUID();

        const { filename, mimeType, size } = event.data.payload;
        const downloadUrl = new URL(`/sw/${id}`, self.registration.scope);

        const port = event.ports[0];

        this.pendingDownloads.set(`${id}`, {
            stream: createDownloadStream(port),
            filename,
            mimeType,
            size,
        });

        port.postMessage({ action: 'download_started', payload: downloadUrl.toString() });
    };
}

export default new DownloadServiceWorker();
