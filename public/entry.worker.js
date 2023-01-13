// node_modules/@remix-run/server-runtime/dist/esm/responses.js
var json = (data, init = {}) => {
  let responseInit = typeof init === "number" ? {
    status: init
  } : init;
  let headers = new Headers(responseInit.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(JSON.stringify(data), {
    ...responseInit,
    headers
  });
};

// app/entry.worker.ts
var STATIC_ASSETS = ["/build/", "/icons/", "/favicons/", "/images/", "/locales/", "/"];
var ASSET_CACHE = "asset-cache";
var DATA_CACHE = "data-cache";
var DOCUMENT_CACHE = "document-cache";
function debug(...messages) {
  if (true) {
    console.debug(...messages);
  }
}
function isMethod(request, methods) {
  return methods.includes(request.method.toLowerCase());
}
function isAssetRequest(request) {
  return isMethod(request, ["get"]) && STATIC_ASSETS.some((publicPath) => request.url.startsWith(publicPath));
}
function isLoaderRequest(request) {
  const url = new URL(request.url);
  return isMethod(request, ["get"]) && url.searchParams.get("_data");
}
function isDocumentGetRequest(request) {
  return isMethod(request, ["get"]) && request.mode === "navigate";
}
async function appHandleFetch(event, {
  response
}) {
  return response;
}
async function handleInstall(event) {
  debug("Service worker installed");
}
async function handleActivate(event) {
  debug("Service worker activated");
}
async function handleMessage(event) {
  const cachePromises = /* @__PURE__ */ new Map();
  if (event.data.type === "REMIX_NAVIGATION") {
    const { isMount, location, matches, manifest } = event.data;
    const documentUrl = location.pathname + location.search + location.hash;
    const [dataCache, documentCache, existingDocument] = await Promise.all([
      caches.open(DATA_CACHE),
      caches.open(DOCUMENT_CACHE),
      caches.match(documentUrl)
    ]);
    if (!existingDocument || !isMount) {
      debug("Caching document for", documentUrl);
      cachePromises.set(
        documentUrl,
        documentCache.add(documentUrl).catch((error) => {
          debug(`Failed to cache document for ${documentUrl}:`, error);
        })
      );
    }
    if (isMount) {
      for (const match of matches) {
        if (manifest.routes[match.id].hasLoader) {
          const params = new URLSearchParams(location.search);
          params.set("_data", match.id);
          let search = params.toString();
          search = search ? `?${search}` : "";
          const url = location.pathname + search + location.hash;
          if (!cachePromises.has(url)) {
            debug("Caching data for", url);
            cachePromises.set(
              url,
              dataCache.add(url).catch((error) => {
                debug(`Failed to cache data for ${url}:`, error);
              })
            );
          }
        }
      }
    }
  }
  await Promise.all(cachePromises.values());
}
async function handleFetch(event) {
  const url = new URL(event.request.url);
  if (isAssetRequest(event.request)) {
    const cached = await caches.match(event.request, {
      cacheName: ASSET_CACHE,
      ignoreVary: true,
      ignoreSearch: true
    });
    if (cached) {
      debug("Serving asset from cache", url.pathname);
      return cached;
    }
    debug("Serving asset from network", url.pathname);
    const response = await fetch(event.request);
    if (response.status === 200) {
      const cache = await caches.open(ASSET_CACHE);
      await cache.put(event.request, response.clone());
    }
    return response;
  }
  if (isLoaderRequest(event.request)) {
    try {
      debug("Serving data from network", url.pathname + url.search);
      const response = await fetch(event.request.clone());
      const cache = await caches.open(DATA_CACHE);
      await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      debug("Serving data from network failed, falling back to cache", url.pathname + url.search);
      const response = await caches.match(event.request);
      if (response) {
        response.headers.set("X-Remix-Worker", "yes");
        return response;
      }
      return json(
        { message: "Network Error" },
        {
          status: 500,
          headers: { "X-Remix-Catch": "yes", "X-Remix-Worker": "yes" }
        }
      );
    }
  }
  if (isDocumentGetRequest(event.request)) {
    try {
      debug("Serving document from network", url.pathname);
      const response = await fetch(event.request);
      const cache = await caches.open(DOCUMENT_CACHE);
      await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      debug("Serving document from network failed, falling back to cache", url.pathname);
      const response = await caches.match(event.request);
      if (response) {
        return response;
      }
      throw error;
    }
  }
  return fetch(event.request.clone());
}
var handlePush = async (event) => {
  const data = JSON.parse(event == null ? void 0 : event.data.text());
  const title = data.title ? data.title : "Sora PWA";
  const options = {
    body: data.body ? data.body : "Notification Body Text",
    icon: data.icon ? data.icon : "/favicons/android/android-launchericon-96-96.png",
    badge: data.badge ? data.badge : "/favicons/android/android-launchericon-48-48.png",
    dir: data.dir ? data.dir : "auto",
    image: data.image ? data.image : void 0,
    silent: data.silent ? data.silent : false
  };
  self.registration.showNotification(title, {
    ...options
  });
};
self.addEventListener("install", (event) => {
  event.waitUntil(handleInstall(event).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(handleActivate(event).then(() => self.clients.claim()));
});
self.addEventListener("message", (event) => {
  event.waitUntil(handleMessage(event));
});
self.addEventListener("push", (event) => {
  event.waitUntil(handlePush(event));
});
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const result = {};
      try {
        result.response = await handleFetch(event);
      } catch (error) {
        result.error = error;
      }
      return appHandleFetch(event, result);
    })()
  );
});
