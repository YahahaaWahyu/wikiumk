// Audit overflow horizontal: buka tiap route pada viewport 360px, ukur
// scrollWidth vs lebar viewport, dan cetak elemen yang menembus ke kanan.
// Jalankan: CHROMIUM_PATH=$(which chromium-browser) node scripts/check-overflow.mjs
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const CHROMIUM =
  process.env.CHROMIUM_PATH ?? "/data/data/com.termux/files/usr/bin/chromium-browser";
const OUT = process.env.OUT_DIR ?? "/data/data/com.termux/files/usr/tmp/opencode/overflow";

const routes = [
  ["/", "01-beranda"],
  ["/admin", "02-admin"],
  ["/admin/artikel/baru", "03-admin-baru"],
  ["/login", "04-login"],
  ["/register", "05-register"],
  ["/docs", "06-docs"],
  ["/artikel/uji-markdown", "07-artikel-uji"],
  ["/artikel/beasiswa-ppm-2026", "08-artikel-biasa"],
  ["/artikel/tidak-ada", "09-404"],
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: CHROMIUM,
  headless: true,
  // --no-sandbox & --disable-dev-shm-usage: wajib di Termux (tanpa user namespace
  // dan /dev/shm kecil).
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 360, height: 740 } });

let failed = 0;

for (const [route, name] of routes) {
  try {
    // domcontentloaded, bukan load: artikel uji memuat gambar Unsplash yang
    // bisa menggantung dan menahan event load selamanya.
    await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
    // /docs menarik CSS/JS dari unpkg; artikel menunggu mermaid yang di-import
    // dinamis. Delay kasar lebih sederhana daripada menunggu sinyal per-route.
    await page.waitForTimeout(route === "/docs" ? 6000 : 3000);

    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const bad = [];
      for (const el of document.querySelectorAll("*")) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) continue;
        if (rect.right > vw + 1 || rect.left < -1) bad.push(el);
      }
      // Akar masalahnya: elemen yang menembus tapi tidak punya anak yang ikut
      // menembus — anaknya hanya mewarisi lebar si akar.
      const roots = bad
        .filter((el) => !bad.some((o) => o !== el && el.contains(o)))
        .slice(0, 10)
        .map((el) => {
          const rect = el.getBoundingClientRect();
          const cls = typeof el.className === "string" ? el.className : "";
          return {
            tag: el.tagName.toLowerCase(),
            cls: cls.slice(0, 90),
            right: Math.round(rect.right),
            w: Math.round(rect.width),
          };
        });
      return {
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        vw,
        count: bad.length,
        offenders: roots,
      };
    });

    await page.screenshot({ path: `${OUT}/${name}.png` });

    const overflow = Math.max(r.scrollWidth, r.bodyScrollWidth) > r.vw + 1;
    if (overflow) failed++;
    console.log(
      `${overflow ? "OVERFLOW" : "ok      "} ${route}  scrollWidth=${r.scrollWidth} body=${r.bodyScrollWidth} vw=${r.vw} elemen_menembus=${r.count}`,
    );
    for (const o of r.offenders) {
      console.log(`           <${o.tag} class="${o.cls}"> right=${o.right} w=${o.w}`);
    }
  } catch (err) {
    failed++;
    console.log(`ERROR    ${route}  ${err.message}`);
  }
}

await browser.close();
console.log(`\nRingkasan: ${failed} dari ${routes.length} bermasalah. Screenshot: ${OUT}`);
process.exit(failed > 0 ? 1 : 0);
