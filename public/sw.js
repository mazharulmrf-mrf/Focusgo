// FocusGo — অফলাইনে অ্যাপ শেল (HTML/JS/CSS) লোড করার জন্য Service Worker।
// এইটা শুধু static asset ক্যাশ করে; কোনো "Add to Home Screen"/install prompt দেখায় না।
//
// ⚠️ নতুন ভার্সন ডিপ্লয় করলে অবশ্যই CACHE_NAME বদলাও (যেমন v2, v3...) — নাহলে ইউজার
// পুরনো ক্যাশড ভার্সনই দেখতে থাকবে, নতুন আপডেট পাবে না।
const CACHE_NAME = "focusgo-shell-v2";

// এই লিস্টে তোমার বিল্ড আউটপুটের আসল ফাইলনেম বসাতে হবে (Vite/CRA বিল্ড করলে
// dist/build ফোল্ডারে hashed filename পাবে, যেমন /assets/index-a1b2c3.js) —
// build script দিয়ে অটোমেটিক জেনারেট করাই সবচেয়ে নিরাপদ (নিচের নোট দেখো)।
const APP_SHELL = [
  "/",
  "/index.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for same-origin static assets: সবসময় আগে নেটওয়ার্ক থেকে সবশেষ ভার্সন আনার
// চেষ্টা হয় (deploy করার সাথে সাথেই ইউজার আপডেট পায়, রিফ্রেশ দুইবার দিতে হয় না), শুধু
// নেটওয়ার্ক ব্যর্থ হলে/অফলাইনে থাকলে cache থেকে সার্ভ করা হয়।
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req)) // অফলাইন হলে ক্যাশড ভার্সন
  );
});
