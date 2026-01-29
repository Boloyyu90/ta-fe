Lakukan FULL AUDIT konsistensi penggunaan design system di seluruh codebase frontend ini.

## Design System Reference

### 1. COLOR TOKENS (Wajib Gunakan)

**Primary Colors:**
- `primary` / `bg-primary` / `text-primary` → Blue #327498 (HSL 213 50% 40%)
- `primary-foreground` → White untuk text di atas primary
- `primary-700` → Darker variant (HSL 213 50% 30%)

**Secondary Colors:**
- `secondary` / `bg-secondary` / `text-secondary` → Orange #F0A245 (HSL 33 85% 61%)
- `secondary-foreground` → White

**Tertiary Colors:**
- `tertiary` / `bg-tertiary` / `text-tertiary` → Yellow #F0E144 (HSL 55 85% 60%)
- `tertiary-foreground` → Dark text untuk kontras

**Semantic Colors:**
- `success` → Green (HSL 142 76% 36%) - untuk LULUS, pass states
- `warning` → Amber (HSL 38 92% 50%) - medium severity
- `info` → Sky blue (HSL 199 89% 48%) - neutral notifications
- `destructive` → Red (HSL 0 84.2% 60.2%) - errors, TIDAK LULUS

**Proctoring Severity:**
- `severity-high` → Red (sama dengan destructive)
- `severity-medium` → Amber (sama dengan warning)
- `severity-low` → Gray

**Neutral Colors:**
- `background` / `foreground` → Base colors
- `muted` / `muted-foreground` → Subtle backgrounds/text
- `card` / `card-foreground` → Card surfaces
- `border` / `input` → Border colors
- `ring` → Focus ring color

**Special:**
- `rating` → Gold/Yellow untuk rating stars
- `accent` → Sama dengan secondary

### 2. SPACING (Tailwind Scale)

**Allowed values:**
- `p-0, p-1, p-2, p-3, p-4, p-5, p-6, p-8, p-10, p-12, p-16, p-20, p-24`
- `m-0, m-1, m-2, m-3, m-4, m-5, m-6, m-8, m-10, m-12, m-16, m-20, m-24`
- `gap-0, gap-1, gap-2, gap-3, gap-4, gap-5, gap-6, gap-8`
- `space-x-*, space-y-*` dengan nilai yang sama

**FORBIDDEN:**
- Arbitrary values: `p-[18px]`, `m-[22px]`, `gap-[15px]`
- Pixel values langsung dalam style

### 3. BORDER RADIUS

**Allowed:**
- `rounded-sm` → calc(var(--radius) - 4px)
- `rounded-md` → calc(var(--radius) - 2px)
- `rounded-lg` → var(--radius) = 0.5rem
- `rounded-full` → untuk circles/pills
- `rounded-none` → untuk sharp corners

**FORBIDDEN:**
- `rounded-[8px]`, `rounded-[12px]` arbitrary values

### 4. SHADOWS

**Custom Shadow Classes (gunakan ini):**
- `shadow-soft` → Subtle elevation
- `shadow-medium` → Medium elevation
- `shadow-large` → High elevation
- `shadow-colored-primary` → Primary-tinted shadow
- `shadow-colored-secondary` → Secondary-tinted shadow

**Allowed Tailwind shadows:**
- `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`

**FORBIDDEN:**
- Inline box-shadow styles
- Arbitrary shadow values

### 5. TYPOGRAPHY

**Font Family:**
- `font-sans` → Poppins (configured in tailwind)

**Font Sizes (Tailwind scale):**
- `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`

**Font Weights:**
- `font-normal`, `font-medium`, `font-semibold`, `font-bold`

### 6. PRE-BUILT UTILITY CLASSES

**Status Badges:**
- `.status-live` → bg-destructive (untuk live exam)
- `.status-monitoring` → bg-primary
- `.status-completed` → bg-success
- `.status-warning` → bg-warning

**Border Accents:**
- `.border-accent-success` → border-l-4 border-l-success
- `.border-accent-warning` → border-l-4 border-l-warning
- `.border-accent-danger` → border-l-4 border-l-destructive

**Gradients:**
- `.gradient-primary` → bg-gradient-to-br from-primary/10 to-primary/5
- `.gradient-success` → bg-gradient-to-br from-success/10 to-success/5
- `.gradient-warning` → bg-gradient-to-br from-warning/10 to-warning/5

**Interactive:**
- `.interactive` → transition-all duration-300 ease-out dengan hover effect
- `.card-hover` → interactive dengan shadow-medium on hover

**Animation Delays:**
- `.delay-0` through `.delay-800` (increments of 100ms)

### 7. ANIMATIONS

**Allowed Animation Classes:**
- `animate-fade-in`, `animate-fade-in-up`, `animate-fade-in-down`
- `animate-fade-in-left`, `animate-fade-in-right`
- `animate-slide-in-bottom`
- `animate-pulse-subtle`, `animate-float`, `animate-gradient-x`
- `animate-pulse`, `animate-ping`, `animate-blink`, `animate-shake`
- `animate-accordion-down`, `animate-accordion-up`
- `animate-slide-in-right`, `animate-slide-in-left`
- `animate-slide-out-right`, `animate-slide-out-left`

### 8. CONTAINER

**Standard Container:**
- `container` → center: true, padding: 2rem, max-width: 1400px at 2xl

---

## Audit Tasks

### Task 1: Hardcoded Colors
Cari semua instance di mana warna di-hardcode:
- Hex values: `#327498`, `#F0A245`, `#3B82F6`, dll
- RGB/RGBA: `rgb(...)`, `rgba(...)`
- HSL: `hsl(...)` (kecuali dalam CSS variables)
- Tailwind arbitrary: `bg-[#...]`, `text-[#...]`
- Tailwind colors yang tidak ada di design system: `bg-blue-500`, `text-green-600`, dll

### Task 2: Hardcoded Spacing
Cari arbitrary spacing values:
- `p-[Npx]`, `m-[Npx]`, `gap-[Npx]`
- `w-[Npx]`, `h-[Npx]` (kecuali untuk specific use cases)
- Inline styles dengan pixel values

### Task 3: Inconsistent Border Radius
Cari:
- `rounded-[Npx]` arbitrary values
- Inline border-radius styles

### Task 4: Shadow Inconsistencies
Cari:
- Inline box-shadow styles
- Arbitrary shadow values `shadow-[...]`

### Task 5: Typography Issues
Cari:
- Font families selain Poppins/font-sans
- Arbitrary font sizes `text-[Npx]`
- Inline font styles

### Task 6: Unused Design System Classes
Cek apakah pre-built classes digunakan:
- `.status-*` untuk badges
- `.border-accent-*` untuk accent borders
- `.gradient-*` untuk gradient backgrounds
- `.interactive` dan `.card-hover` untuk hover effects
- `.shadow-*` custom classes

### Task 7: Dark Mode Compatibility
Cari hardcoded colors yang tidak akan bekerja di dark mode

---

## Output Format

Buat report dalam format:

```markdown
# Design System Audit Report - Prestige Academy Frontend

## Executive Summary
- Total files scanned: X
- Total issues found: X
- Critical: X | Warning: X | Info: X

## 🔴 Critical Issues (Must Fix)

### Hardcoded Colors
| File | Line | Current | Should Be |
|------|------|---------|-----------|
| path/to/file.tsx | 45 | `bg-[#3B82F6]` | `bg-primary` |

### Hardcoded Spacing
| File | Line | Current | Should Be |
|------|------|---------|-----------|

## 🟡 Warnings (Should Fix)

### Inconsistent Patterns
...

## 🟢 Recommendations

### Unused Design System Features
- `.status-*` classes not utilized in X files
- Consider using `.interactive` class for hover effects

## ✅ Good Practices Found
- Files correctly using design tokens: X
- Consistent animation usage in: ...
```

---

## Directories to Scan

```
src/
├── app/           # Next.js App Router pages
├── components/    # Shared components
├── features/      # Feature modules
│   ├── auth/
│   ├── exam/
│   ├── proctoring/
│   ├── transactions/
│   └── ...
├── shared/        # Shared utilities & UI
│   ├── ui/        # shadcn/ui components
│   └── ...
└── pages/         # Legacy pages (if any)
```

File extensions to check: `.tsx`, `.ts`, `.css`, `.jsx`, `.js`

---

## Additional Context

- Framework: Next.js 16 with App Router
- UI Library: shadcn/ui (should use design tokens)
- CSS Framework: Tailwind CSS 3.4
- Project: CPNS Exam Simulation with AI Proctoring
- Theme: Supports light/dark mode via `.dark` class
