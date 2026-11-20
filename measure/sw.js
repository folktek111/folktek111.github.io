/*
Made by:  Claude
Model:    Claude Opus 5.5
Version:  v1.2.1
Created:  2026-11-20 CET (Europe/Stockholm, UTC+1)
About:    Service worker (offline cache) for AR Tape Measure — WebXR measuring tool for Android phones with ARCore (distance, area, height). Part of the Folktek Vibe Coding Lab, live at folktek.org/measure.
Prompt:   Review and fix the AR tape measure proposal, publish it so it runs on a Pixel, make the buttons pink, add version tags and export to VIBE/V.

Changelog:
  v1.2.1 (2026-11-20) Version bump with the start screen requirements and clearer AR messages in index.html.
  v1.2.0 (2026-11-20) Caches the bundled fonts too; version bump with the new tools in index.html.
  v1.1.0 (2026-11-20) Version bump with the palette and hue slider in index.html.
  v1.0.2 (2026-11-20) Version bump with the colour change in index.html.
  v1.0.1 (2026-11-19) Buttons pink (#ff9ecf) instead of yellow.
  v1.0.0 (2026-11-19) Reviewed and fixed version first published at folktek.org/measure:
                      shared reference space for hits and camera, height mode base point + lock,
                      reset on re-entering AR, auto-fitting labels, three.js bundled locally,
                      app manifest, icons and offline support.
*/
// Offline support: try the network first (so updates arrive), fall back to the saved copy.
const CACHE = 'ar-measure-v1.2.1';
const FILES = ['./', './index.html', './vendor/three.module.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './fonts/ibm-plex-mono-latin-500-normal.woff2', './fonts/source-serif-4-latin-600-normal.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request)));
});
