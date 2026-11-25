# MDX Markdown Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ganti renderer markdown buatan sendiri dengan pipeline MDX penuh agar artikel Wiki UMK bisa memuat tabel, footnote, code block, math, dan diagram mermaid — tetap abu-abu persis wireframe.

**Architecture:** `MDXRemote` dari `next-mdx-remote/rsc` merender string konten yang tetap tinggal di `src/lib/data.ts`. Peta `mdxComponents` memegang seluruh styling dan menyediakan jembatan ke dua client component (`CodeBlock`, `Mermaid`) lewat intercept pada `<figure>` yang dihasilkan `rehype-pretty-code`.

**Tech Stack:** Next 16.4.6, React 19.3.0, Tailwind 4.3.3, pnpm 12

**Spec:** `docs/superpowers/specs/2026-11-25-mdx-markdown-pipeline-design.md` — rencana ini berargumen dari spec; eksekutor membaca keduanya.

## Global Constraints

- **Tepat sembilan dependency, dipin ke versi ini.** Jangan `pnpm add` versi mentah: mermaid terbaru menuntut `katex@^0.18` dan akan memasang dua salinan katex.

  | Paket | Versi |
  |---|---|
  | `next-mdx-remote` | `^6.0.0` |
  | `remark-gfm` | `^4.0.1` |
  | `remark-math` | `^6.0.0` |
  | `rehype-katex` | `^7.0.1` |
  | `rehype-pretty-code` | `^0.14.5` |
  | `rehype-slug` | `^6.0.0` |
  | `shiki` | `^4.5.0` |
  | `katex` | `^0.16.47` |
  | `mermaid` | `^12.2.0` |

- **Tanpa dependency lain.** `lucide-react`, helper clipboard, dan framework uji dilarang — anti-goal spec melarang dependency di luar daftar di atas. Verifikasi memakai `pnpm lint` + `pnpm build` + pemeriksaan HTML, sesuai daftar verifikasi spec.
- **Hanya token greyscale:** `paper`, `line`, `ink`, `muted`, `chrome`, `fill`, `dark`. Tidak ada kelas warna lain; `text-primary`, `bg-surface-*`, `border-border-hairline` adalah milik porto dan tidak ada di `@theme` wikiumk.
- **`blockJS: false`** pada `options` `MDXRemote`. `blockDangerousJS` dibiarkan default `true`.
- **Tanpa `transpilePackages`** di `next.config.ts` kecuali build gagal karena transpilasi.
- **Konten tetap di `data.ts`.** Tidak ada file `.mdx` yang dibaca dari disk.
- Route dan URL Indonesia; identifier dan nama berkas Inggris; komentar bahasa Indonesia.
- Branch `feat/wireframe-sprint-1`. Jangan sentuh `main`.

## Review Focus

Lima hal yang paling mungkin menggigit pemakai, dan uji yang menguncinya di tugas pemiliknya:

1. **Kelas porto ikut terbawa saat menyalin.** `text-primary` dan sejenisnya akan jadi kelas mati dan artikel tampil tanpa warna yang benar. → Task 1, langkah pemeriksaan sumber.
2. **`blockJS` tidak benar-benar nonaktif**, sehingga `width={1200}` dipotong diam-diam dan kasus JSX-props lulus tanpa menguji apa pun. → Task 2, langkah verifikasi.
3. **Geseran heading merusak artikel lama.** `## Latar belakang` saat ini dirender `<h3>` (terbukti di payload RSC: `["$","h3","0",{"children":"Latar belakang"}]`); setelah perubahan harus `<h2>`. → Task 1, langkah verifikasi.
4. **CSS KaTeX tidak diimpor**, sehingga math tampil sebagai LaTeX mentah. → Task 2, langkah verifikasi.
5. **Intercept mermaid gagal**, sehingga diagram tampil sebagai blok kode teks biasa. → Task 3, langkah verifikasi.

## File Structure

| Berkas | Aksi | Tanggung jawab |
|---|---|---|
| `src/components/mdx/index.tsx` | buat | Peta `mdxComponents`; seluruh styling elemen prosa |
| `src/components/mdx/CodeBlock.tsx` | buat (Task 3) | Client; pembungkus `<figure>` + tombol salin |
| `src/components/mdx/Mermaid.tsx` | buat (Task 3) | Client; render diagram dari string |
| `src/app/artikel/[slug]/page.tsx` | ubah | Panggil `MDXRemote`; impor CSS KaTeX; buang arbitrary variant |
| `src/lib/markdown.tsx` | hapus | Renderer lama |
| `src/lib/data.ts` | ubah (Task 2) | Artikel uji + `articleCount` kategori `lainnya` |
| `docs/wireframe-halaman.md` | ubah (Task 4) | Dua catatan yang jadi basi |

**Pemisahan client/server dipaksakan oleh platform:** `mdxComponents` dijalankan di server component, sedangkan `CodeBlock` dan `Mermaid` harus `"use client"`. Berkas berbeda karena file dengan direktif `"use client"` di baris pertama membuat seluruh isinya client.

---

### Task 1: Sambungkan MDXRemote ke halaman artikel

**Files:**
- Modify: `package.json` (via `pnpm add`)
- Create: `src/components/mdx/index.tsx`
- Modify: `src/app/artikel/[slug]/page.tsx`
- Delete: `src/lib/markdown.tsx`

**Interfaces:**
- Consumes: `article.content: string` dari `findArticle()` (`src/lib/data.ts`)
- Produces: `export const mdxComponents` dari `@/components/mdx` — peta `Record<string, React.ComponentType<...>>` yang dipakai ulang oleh Task 2 (`img`, `BlogImage`) dan Task 3 (`figure`)

- [ ] **Step 1: Commit design doc dan rencana ini**

```powershell
git add docs/superpowers
git commit -m "docs: spec dan rencana pipeline MDX"
```

- [ ] **Step 2: Pasang sembilan dependency pada versi terpin**

```powershell
pnpm add next-mdx-remote@^6.0.0 remark-gfm@^4.0.1 remark-math@^6.0.0 rehype-katex@^7.0.1 rehype-pretty-code@^0.14.5 rehype-slug@^6.0.0 shiki@^4.5.0 katex@^0.16.47 mermaid@^12.2.0
```

Expected: keluaran menyebut sembilan paket terpasang; `git diff package.json` hanya menambah dependency, tidak mengubah versi Next/React/Tailwind.

- [ ] **Step 3: Buat `src/components/mdx/index.tsx`**

Ekspor `mdxComponents` berisi elemen prosa berikut, tiap elemen membawa kelas dari token greyscale: `h1`–`h6`, `p`, `a`, `ul`, `ol`, `li`, `blockquote`, `hr`, `table`, `th`, `td`, `code`.

Syarat yang harus dipenuhi, bukan pilihan gaya yang ditentukan di sini (spec menyerahkan penempatan kelas ke builder):

- `table` dibungkus div `overflow-x-auto` agar tabel tujuh kolom di artikel uji tidak merusak lebar halaman di layar kecil.
- `a` internal (`href` diawali `/`) memakai `Link` dari `next/link`; `a` eksternal dibuka di tab baru dengan `rel="noopener noreferrer"`.
- `code` membedakan blok kode dari inline: bila props memuat `data-language` atau `data-theme` (tanda `rehype-pretty-code`), biarkan apa adanya tanpa gaya inline; selain itu beri gaya inline (`font-mono`, latar `chrome`, border `line`).
- Penulisan komentar bahasa Inggris untuk identifier, Indonesia untuk penjelasan.

- [ ] **Step 4: Ganti `renderMarkdown` dengan `MDXRemote` di `src/app/artikel/[slug]/page.tsx`**

Impor `MDXRemote` dari `next-mdx-remote/rsc`, `mdxComponents` dari `@/components/mdx`, serta kelima plugin berikut, lalu tambahkan `import "katex/dist/katex.min.css"`:

```typescript
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeKatex from "rehype-katex";
```

Hapus impor `renderMarkdown`. Ganti isi `<div>` di baris 55 menjadi:

```jsx
<div className="mt-[34px] text-[15px] leading-[26px]">
  <MDXRemote
    source={article.content}
    components={mdxComponents}
    options={{
      blockJS: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, { theme: "github-light", keepBackground: false }],
          rehypeKatex,
        ],
      },
    }}
  />
</div>
```

Konfigurasi ini persis seperti di spec — nilai `theme` dan `keepBackground` sudah diputuskan di sana dan tidak boleh diubah tanpa alasan. Tanpa kelima plugin itu tidak ada GFM, math, heading ber-id, highlight, maupun KaTeX.

Buang arbitrary variant `[&_h2]`, `[&_h3]`, `[&_li]`, `[&_ul]` — styling pindah ke `mdxComponents`.

- [ ] **Step 5: Hapus `src/lib/markdown.tsx`**

```powershell
git rm src/lib/markdown.tsx
```

- [ ] **Step 6: Verifikasi**

```powershell
pnpm lint
```
Expected: keluaran kosong, exit 0.

```powershell
pnpm build
```
Expected: exit 0. Lalu hitung route:
```powershell
node -e "console.log(Object.keys(require('./.next/prerender-manifest.json').routes).length)"
```
Expected: `53` (belum berubah — artikel uji baru di Task 2).

Pemeriksaan heading — bukti regresi dan perbaikan sekaligus:
```powershell
$h = Get-Content '.next\server\app\artikel\beasiswa-ppm-2026.html' -Raw
$h -match '<h2[^>]*>Latar belakang</h2>'
$h -match '<h3[^>]*>Latar belakang</h3>'
```
Expected: `True` lalu `False`. Kalau salah satunya tidak cocok, periksa markup sebenarnya dengan `Select-String -Path '.next\server\app\artikel\beasiswa-ppm-2026.html' -Pattern 'Latar belakang'` sebelum menyimpulkan gagal.

Pemeriksaan Review Focus #1 — kelas porto tidak boleh ikut terbawa:
```powershell
Select-String -Path 'src\components\mdx\*.tsx' -Pattern '-primary|-secondary|-surface|-headline|-body-|-label-|border-hairline|lucide-react|#[0-9a-fA-F]{6}|(text|bg|border)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|gray|slate|zinc|neutral|stone|white|black)'
```
Expected: tidak ada hasil. Satu kecocokan pun berarti kelas mati tertempel.

Pola ini sudah diuji sebelum rencana ditulis: menangkap 8/8 kasus pelanggaran sintetis (`text-primary`, `bg-[#ff0000]`, `border-border-hairline`, `lucide-react`, `text-gray-500`, `bg-surface-container-low`, `text-headline-xl`, `text-body-lg`), bersih terhadap seluruh `src` yang ada, dan tidak mencocokkan identifier TypeScript seperti `variant = "primary"` — sebab itu tiap nama porto diberi awalan `-`.

- [ ] **Step 7: Commit**

```powershell
git add src package.json pnpm-lock.yaml
git commit -m "feat: render artikel dengan pipeline MDX"
```

---

### Task 2: Artikel uji + BlogImage

**Files:**
- Modify: `src/lib/data.ts`
- Modify: `src/components/mdx/index.tsx` (tambah `BlogImage` dan petakan `img`)

**Interfaces:**
- Consumes: `mdxComponents` dari Task 1
- Produces: `BlogImage({ src, alt?, title?, width?, height? })` di `@/components/mdx`; `ujiContent: string` di `src/lib/data.ts`; artikel slug `uji-markdown`

- [ ] **Step 1: Unduh sumber file uji ke folder sementara**

```powershell
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/dxnz-id/porto/main/src/content/blog/markdown-test.mdx' -OutFile "$env:TEMP\markdown-test.mdx"
```

- [ ] **Step 2: Hasilkan blok `const ujiContent` yang sudah di-escape**

Perintah ini sudah diuji round-trip: blok keluarannya berhasil di-parse kembali menjadi 6994 karakter dengan fence utuh, baris `import TidakDipakai` sudah hilang, dan nol backtick liar tersisa.

```powershell
node -e 'const fs=require("fs");const p=process.env.TEMP+"\\markdown-test.mdx";let s=fs.readFileSync(p,"utf8");s=s.replace(/^import TidakDipakai from "\.\/tidak-ada";\r?\n+/,"");const body=s.replace(/`/g,"\\`").replace(/\$\{/g,"\\${");const bt=String.fromCharCode(96);fs.writeFileSync(process.env.TEMP+"\\uji-block.txt","const ujiContent = "+bt+body+bt+";");console.log("written")'
```

Expected: `written`. File keluaran di `$env:TEMP\uji-block.txt` adalah satu deklarasi siap tempel.

- [ ] **Step 3: Selipkan blok ke `src/lib/data.ts`**

Tempel isi `$env:TEMP\uji-block.txt` tepat setelah deklarasi `sampleContent`. Backtick di dalam konten sudah di-escape, jadi jangan disentuh ulang secara manual.

- [ ] **Step 4: Tambahkan artikel ke-23 dan naikkan hitungan kategori**

Tambahkan entri ke `articles` dengan nilai: `slug: "uji-markdown"`, `title: "Uji Markdown"`, `summary` satu kalimat yang wajar, `category: { slug: "lainnya", name: "Lainnya" }`, `author: { name: "Admin" }`, `content: ujiContent`, `createdAt` dan `updatedAt` sama, `readCount` wajar.

Ubah `src/lib/data.ts:47`:
```typescript
{ slug: "lainnya", name: "Lainnya", articleCount: 4 },
```

- [ ] **Step 5: Tambahkan `BlogImage` dan petakan `img`**

Di `src/components/mdx/index.tsx`, tambahkan komponen `BlogImage({ src, alt?, title?, width?, height? })` yang me-render `<img>` dengan `loading="lazy"`, `alt` default string kosong, dan kelas `border-line`. Tanpa `width`/`height`, bungkus dalam span `aspect-[3/2]` supaya ruangnya terpesan sebelum gambar dimuat. Lalu petakan `img: BlogImage` dan `BlogImage` di dalam `mdxComponents`.

`width` dan `height` bertipe `string | number` — file uji memakai kedua bentuk, dan yang bentuk `number` (`width={1200}`) justru yang menguji Review Focus #2.

- [ ] **Step 6: Verifikasi**

```powershell
pnpm lint
pnpm build
```
Expected: exit 0 untuk keduanya.

```powershell
node -e "console.log(Object.keys(require('./.next/prerender-manifest.json').routes).length)"
```
Expected: `54`.

Review Focus #2 — properti ekspresi tidak boleh terpotong. Uji ini menghitung, bukan sekadar mencocokkan: file uji memuat tiga `width="1200"` literal dan satu `width={1200}` yang hanya menghasilkan `width="1200"` bila ekspresinya tidak dibuang.
```powershell
$h = Get-Content '.next\server\app\artikel\uji-markdown.html' -Raw
([regex]::Matches($h, 'width="1200"')).Count
```
Expected: `4`. Angka `3` berarti `blockJS: false` tidak sampai ke `serialize` dan properti ekspresi terpotong diam-diam. Angka lain berarti perkiraan jumlah salah — periksa dulu sebelum menyimpulkan gagal.

`-match` tidak dipakai di sini karena ia akan tetap `True` walau ekspresi terpotong, sebab varian string-nya masih ada.

Review Focus #4 — KaTeX terpakai dan CSS-nya termuat. Dua pemeriksaan terpisah karena `class="katex"` hanya membuktikan plugin jalan; tanpa impor CSS, kelas itu tetap ada tetapi math tampil berantakan:
```powershell
$h -match 'class="katex"'
$css = (Get-ChildItem '.next\static' -Recurse -Filter '*.css' | ForEach-Object { Get-Content $_.FullName -Raw }) -join ''
$css -match '\.katex'
```
Expected: `True` lalu `True`.

Struktur konten lain ikut terpasang — satu perintah, tiap bagian `markdown-test.mdx` jadi satu baris. Ini penerimaan utama seluruh fitur:
```powershell
@(
  ($h -match '<strong'),
  ($h -match '<h2'), ($h -match '<h6'),
  ([regex]::Matches($h, 'id="duplicate-heading"')).Count -eq 1,
  ([regex]::Matches($h, '<li[^>]*>(?:(?!</li>)[\s\S])*<ul')).Count -gt 0,
  ($h -match 'checkbox'),
  ($h -match '<blockquote'),
  ($h -match '<table'), ($h -match 'text-align'),
  ($h -match '<pre'), ($h -match '<img'),
  ($h -match 'id="fnref')
) -join "`n"
```
Expected: dua belas baris `True`.

Baris `id="duplicate-heading"` harus tepat `1`: angka `0` berarti `rehype-slug` tidak menambahkan id sama sekali, angka `2` berarti id kembar tidak disaring. Pola yang bergantung pada markup pihak ketiga — footnote dan pengulangan heading — bila tidak cocok, periksa markup sebenarnya dengan `Select-String` sebelum menyimpulkan gagal.

Hitungan kategori:
```powershell
$h2 = Get-Content '.next\server\app\index.html' -Raw
$h2 -match 'Lainnya'
```
Expected: `True` (chip kategori menampilkan angka baru; angka persisnya tidak dikunci karena kartu dipaginasi).

- [ ] **Step 7: Commit**

```powershell
git add src package.json pnpm-lock.yaml
git commit -m "feat: artikel uji pipeline markdown"
```

---

### Task 3: CodeBlock dan Mermaid

**Files:**
- Create: `src/components/mdx/CodeBlock.tsx`
- Create: `src/components/mdx/Mermaid.tsx`
- Modify: `src/components/mdx/index.tsx` (tambah handler `figure`)

**Interfaces:**
- Consumes: `mdxComponents` dari Task 1; output `rehype-pretty-code` berupa `<figure data-rehype-pretty-code-figure>` dengan `<pre data-language>` sebagai anak tunggal
- Produces: `CodeBlock({ children, rawText })` dan `Mermaid({ chart })`, keduanya client component; handler `figure` yang menentukan cabangnya

- [ ] **Step 1: Buat `src/components/mdx/CodeBlock.tsx`**

`"use client"`. Props `{ children: React.ReactNode; rawText: string }`. Tombol salin memakai `navigator.clipboard.writeText(rawText.trimEnd())` langsung — tanpa helper terpisah. Status `copied` kembali ke `false` setelah 2000ms. Ikon salin dan centang berupa SVG inline.

Pembungkus memberi jarak, posisi relatif untuk tombol, dan menyisipkan gaya pada `<pre>` anak lewat arbitrary variant Tailwind — termasuk `grayscale` agar highlight shiki tetap abu-abu. Komentar satu baris menjelaskan alasan grayscale, bukan hanya apa yang dilakukan.

- [ ] **Step 2: Buat `src/components/mdx/Mermaid.tsx`**

`"use client"`. Props `{ chart: string }`. Dynamic `import("mermaid")` di `useEffect`, `theme: "neutral"`, `suppressErrorRendering: true`. Render tiga keadaan: kotak loading, kotak galat bila `mermaid.render` melempar, dan `<div dangerouslySetInnerHTML>` untuk SVG hasilnya.

Jangan dibawa dari porto: modal perbesar, zoom, pan, d-pad, pinch zoom, focus trap, dan `lucide-react` — fitur produk blog portofolio, di luar daftar sembilan dependency, dan tidak ada di wireframe.

- [ ] **Step 3: Tambahkan handler `figure` ke `mdxComponents`**

Handler membaca `data-rehype-pretty-code-figure` dari props. Anak tunggalnya adalah `<pre>` yang membawa `data-language`.

- Bila `data-language === "mermaid"` → kembalikan `<Mermaid chart={teks mentah}/>`; jangan ikut bungkus `CodeBlock`.
- Selain itu → bungkus `<figure>` di dalam `<CodeBlock rawText={teks mentah}>`.

Tolong ambil teks mentah dengan fungsi rekursif yang menyusun ulang `children` (string, angka, array, dan elemen React) — `rawText` itulah yang disalin tombol salin, dan sekaligus isi `chart` untuk mermaid.

- [ ] **Step 4: Verifikasi**

```powershell
pnpm lint
pnpm build
```
Expected: exit 0 untuk keduanya.

Review Focus #5 — intercept mermaid, bukan blok kode teks:
```powershell
$h = Get-Content '.next\server\app\artikel\uji-markdown.html' -Raw
$h -match 'data-language="mermaid"'
```
Expected: `False`. Kecocokan berarti diagram masih berupa `<pre>` biasa.

Tombol salin dan grayscale hadir — dua pemeriksaan terpisah, karena satu pola bergabung hanya membuktikan salah satunya cocok:
```powershell
Select-String -Path 'src\components\mdx\CodeBlock.tsx' -Pattern 'navigator\.clipboard' -Quiet
Select-String -Path 'src\components\mdx\CodeBlock.tsx' -Pattern 'grayscale' -Quiet
```
Expected: `True` lalu `True`.

Pemeriksaan sumber tetap bersih (Review Focus #1):
```powershell
Select-String -Path 'src\components\mdx\*.tsx' -Pattern '-primary|-secondary|-surface|-headline|-body-|-label-|border-hairline|lucide-react|#[0-9a-fA-F]{6}|(text|bg|border)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|gray|slate|zinc|neutral|stone|white|black)'
```
Expected: tidak ada hasil.

> Catatan: hasil visual diagram mermaid tidak bisa dipastikan dari HTML karena dirender di client. Setelah langkah ini, buka `/artikel/uji-markdown` di browser untuk memastikan diagram tampil. Ini satu-satunya pemeriksaan yang menuntut mata.

- [ ] **Step 5: Commit**

```powershell
git add src
git commit -m "feat: blok kode dan diagram mermaid"
```

---

### Task 4: Rapikan dokumen dan sapu akhir

**Files:**
- Modify: `docs/wireframe-halaman.md`

**Interfaces:**
- Consumes: keputusan `blockJS`, ketersediaan dependency, dan hasil Task 1–3
- Produces: dokumen yang tidak lagi mengklaim sesuatu yang sudah tidak benar

- [ ] **Step 1: Luruskan alasan K-5**

K-5 beralasan *"Tanpa dependensi baru, sesuai isi API yang menerima markdown"*. Keputusannya — editor tetap textarea — masih berlaku; hanya alasannya yang basi. Ganti bagian alasan agar tidak menyesatkan, tanpa mengubah isi keputusan.

- [ ] **Step 2: Luruskan catatan tab Pratinjau**

Baris tab `Pratinjau` berbunyi *"render markdown butuh dependensi yang belum ada"*. Dependensinya kini ada. Catat bahwa itu tidak mengubah gambar wireframe — menghidupkan tab pratinjau tetap di luar lingkup.

- [ ] **Step 3: Sapu akhir seluruh verifikasi spec**

```powershell
pnpm lint
pnpm build
node -e "console.log(Object.keys(require('./.next/prerender-manifest.json').routes).length)"
```
Expected: exit 0, lalu `54`.

Daftar periksa akhir — tiap baris harus `True`. Sembilan pemeriksaan, dua di antaranya dipisah tempat di mana satu-satunya kecocokan tidak cukup membuktikan:
```powershell
$a = Get-Content '.next\server\app\artikel\uji-markdown.html' -Raw
$b = Get-Content '.next\server\app\artikel\beasiswa-ppm-2026.html' -Raw
$c = Get-Content '.next\server\app\index.html' -Raw
$css = (Get-ChildItem '.next\static' -Recurse -Filter '*.css' | ForEach-Object { Get-Content $_.FullName -Raw }) -join ''
@(
  ($a -match '<table'),
  ($a -match 'class="katex"'),
  ($css -match '\.katex'),
  (([regex]::Matches($a, 'width="1200"')).Count -eq 4),
  ($a -notmatch 'data-language="mermaid"'),
  ($b -match '<h2[^>]*>Latar belakang</h2>'),
  ($b -notmatch '<h3[^>]*>Latar belakang</h3>'),
  ($c -match 'Lainnya'),
  ((Select-String -Path 'src\components\mdx\*.tsx' -Pattern '-primary|-secondary|-surface|-headline|-body-|-label-|border-hairline|lucide-react|#[0-9a-fA-F]{6}|(text|bg|border)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|gray|slate|zinc|neutral|stone|white|black)' -Quiet) -eq $false)
) -join "`n"
```
Expected: sembilan baris `True`.

Spot-check route lain tidak berubah:
```powershell
Test-Path '.next\server\app\admin.html', '.next\server\app\login.html', '.next\server\app\register.html'
```
Expected: `True True True`.

- [ ] **Step 4: Commit**

```powershell
git add docs/wireframe-halaman.md docs/superpowers
git commit -m "docs: perbarui catatan dependensi markdown"
```

> **Catatan eksekusi:** `main` tidak disentuh dan tidak ada yang di-push. Push hanya bila diminta.
