/* Kotoba Studio v4.6.0 - installable offline app shell */
const CACHE='kotoba-studio-shell-v4.6.0';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('kotoba-studio-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const r=event.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 if(r.mode==='navigate'){
  event.respondWith(fetch(r).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(r,copy));}return response}).catch(()=>caches.match(r).then(x=>x||caches.match('./index.html'))));
 }else{
  event.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(r,copy));}return response})));
 }
});
