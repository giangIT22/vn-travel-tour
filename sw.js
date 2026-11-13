/* Sổ tay chuyến đi: lưu sẵn trang để mở được khi mất sóng.
   Đặt file này cùng thư mục với index.html. Khi sửa index.html không cần sửa file này;
   chỉ khi đổi danh sách file bên dưới mới cần tăng số phiên bản VERSION. */
const VERSION = 'so-tay-v1';
const SHELL = ['./', './index.html', './manifest.json', './icon-180.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
const SDK = 'https://www.gstatic.com/firebasejs/13.2.0/';
const LIBS = [SDK + 'firebase-app.js', SDK + 'firebase-auth.js', SDK + 'firebase-firestore.js'];
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap';
const NET_WAIT = 3500; // sóng yếu quá 3,5 giây thì mở bản đã lưu luôn

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await Promise.allSettled(SHELL.map(u => c.add(new Request(u, {cache: 'reload'}))));
    await Promise.allSettled(LIBS.map(u => c.add(new Request(u, {mode: 'cors'}))));
    try {
      const r = await fetch(FONT_CSS, {mode: 'cors'});
      if (r.ok) {
        const css = await r.clone().text(), urls = [];
        /* chỉ lấy bộ chữ cần cho tiếng Việt */
        css.replace(/\/\*\s*(vietnamese|latin-ext|latin)\s*\*\/[^}]*?url\((https:[^)]+)\)/g, (m, s, u) => { urls.push(u); return m; });
        await c.put(FONT_CSS, r);
        await Promise.allSettled(urls.map(u => c.add(new Request(u, {mode: 'cors'}))));
      }
    } catch (err) {}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

async function fromCache(req) {
  const c = await caches.open(VERSION);
  return (await c.match(req, {ignoreSearch: true})) || (await c.match('./index.html')) || (await c.match('./'));
}
/* Trang chính: lấy bản mới khi có mạng, mất mạng hoặc sóng quá yếu thì dùng bản đã lưu */
async function page(req) {
  const c = await caches.open(VERSION);
  const net = fetch(req).then(r => { if (r && r.ok) { c.put(req, r.clone()); c.put('./index.html', r.clone()); } return r; });
  net.catch(() => {});
  const slow = new Promise(res => setTimeout(res, NET_WAIT, null));
  try {
    const r = await Promise.race([net, slow]);
    if (r && r.ok) return r;
  } catch (err) {}
  const cached = await fromCache(req);
  if (cached) return cached;
  return net; // chưa có bản lưu nào: đành chờ mạng
}
/* Thư viện, phông chữ có số phiên bản cố định: dùng bản đã lưu, chưa có thì tải rồi lưu */
async function stable(req) {
  const c = await caches.open(VERSION), hit = await c.match(req);
  if (hit) return hit;
  const r = await fetch(req);
  if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone());
  return r;
}
/* File nhỏ của trang (biểu tượng, manifest): trả bản đã lưu ngay, cập nhật ngầm */
async function fresh(req) {
  const c = await caches.open(VERSION), hit = await c.match(req);
  const net = fetch(req).then(r => { if (r && r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
  return hit || (await net) || Response.error();
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate' && url.origin === location.origin) { e.respondWith(page(req)); return; }
  if (url.origin === location.origin) { e.respondWith(fresh(req)); return; }
  if ((url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/'))
      || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') { e.respondWith(stable(req)); return; }
  /* Firestore, đăng nhập, Google Maps: để trình duyệt và Firebase tự xử lý */
});
