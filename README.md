This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Animation System

Proyek ini menggunakan sistem animasi berbasis Tailwind CSS dengan dukungan aksesibilitas.

### Utilitas Animasi

Animasi fade-in tersedia langsung melalui kelas Tailwind:

```jsx
// Fade in dari bawah
<div className="animate-fade-in-up">Content</div>

// Fade in dari kiri
<div className="animate-fade-in-left">Content</div>

// Fade in dari kanan
<div className="animate-fade-in-right">Content</div>

// Dengan delay
<div className="animate-fade-in-up delay-200">Content</div>
```

### Komponen ScrollReveal

Untuk animasi yang dipicu saat elemen masuk viewport (scroll reveal), gunakan komponen `ScrollReveal`:

```jsx
import { ScrollReveal } from "@/shared/components/ScrollReveal";

// Animasi default (fade-in-up)
<ScrollReveal>
  <div>Content akan muncul saat di-scroll</div>
</ScrollReveal>

// Dengan arah berbeda
<ScrollReveal direction="left">
  <div>Masuk dari kiri</div>
</ScrollReveal>

// Dengan delay (untuk stagger effect)
<ScrollReveal direction="up" delay={200}>
  <div>Muncul dengan delay 200ms</div>
</ScrollReveal>

// Tanpa once (akan re-animate saat masuk kembali ke viewport)
<ScrollReveal once={false}>
  <div>Re-animates on scroll</div>
</ScrollReveal>
```

#### Props ScrollReveal

| Prop | Type | Default | Deskripsi |
|------|------|---------|-----------|
| `direction` | `"up" \| "down" \| "left" \| "right" \| "fade"` | `"up"` | Arah animasi masuk |
| `delay` | `number` | `0` | Delay animasi dalam ms |
| `threshold` | `number` | `0.1` | Persentase elemen visible untuk trigger (0-1) |
| `once` | `boolean` | `true` | Animasi hanya sekali atau setiap masuk viewport |

### Aksesibilitas (Reduced Motion)

Sistem animasi menghormati preferensi `prefers-reduced-motion`:

- Animasi dekoratif (float, pulse, ping, blink) dinonaktifkan sepenuhnya
- Animasi fade-in menjadi instan (tanpa delay)
- Gunakan prefix `motion-safe:` untuk animasi yang hanya aktif saat motion diizinkan

```jsx
// Animasi hanya aktif jika motion diizinkan
<div className="motion-safe:animate-fade-in-up">Content</div>

// Gaya alternatif untuk reduced motion
<div className="motion-reduce:opacity-100">Content</div>
```
