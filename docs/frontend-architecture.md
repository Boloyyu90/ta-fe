# Frontend Architecture Documentation

> **Project:** Prestige Academy CPNS Exam System
> **Version:** 1.0.0
> **Last Updated:** January 2025

---

## Table of Contents

1. [Overview](#1-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Routing Architecture](#4-routing-architecture)
5. [Component Architecture](#5-component-architecture)
6. [State Management](#6-state-management)
7. [API Layer](#7-api-layer)
8. [Styling System](#8-styling-system)
9. [Type System](#9-type-system)
10. [Configuration Files](#10-configuration-files)
11. [Testing Infrastructure](#11-testing-infrastructure)

---

## 1. Overview

Prestige Academy Frontend adalah aplikasi web modern untuk sistem ujian CPNS online dengan fitur AI-powered proctoring. Aplikasi ini dibangun menggunakan **Next.js 16 App Router** dengan arsitektur **feature-based modular**.

### 1.1 Architecture Highlights

```
+-------------------------------------------------------------------+
|                    PRESTIGE ACADEMY FRONTEND                       |
+-------------------------------------------------------------------+
|  Framework     : Next.js 16.0.3 (App Router)                      |
|  UI Library    : React 19.2.0                                     |
|  Language      : TypeScript 5                                     |
|  Styling       : Tailwind CSS 3.4.18                              |
|  State         : Zustand 5.0.8 (Client) + React Query 5.90.9      |
|  Components    : shadcn/ui (Radix UI based)                       |
|  HTTP Client   : Axios 1.13.2                                     |
|  Form          : React Hook Form 7.66.0 + Zod 4.1.12              |
|  Animations    : Framer Motion 12.23.24 + Lottie React 2.4.1      |
+-------------------------------------------------------------------+
```

### 1.2 High-Level Architecture

```
+----------------------------------------------------------------------+
|                        PRESENTATION LAYER                             |
|   +----------------------------------------------------------------+ |
|   |     Next.js App Router (Pages + Layouts + Route Groups)        | |
|   +----------------------------------------------------------------+ |
|                                 |                                     |
|   +----------------------------------------------------------------+ |
|   |  Feature Modules           |  Shared Components                 | |
|   |  +--------------------+    |  +------------------------------+  | |
|   |  | auth               |    |  | UI Components (shadcn/ui)    |  | |
|   |  | dashboard          |    |  | PageHeaderTitle, BackButton  |  | |
|   |  | exams              |    |  | ScrollReveal, SectionWrapper |  | |
|   |  | exam-sessions      |    |  +------------------------------+  | |
|   |  | proctoring         |    |                                    | |
|   |  | questions          |    |                                    | |
|   |  | users              |    |                                    | |
|   |  | landing            |    |                                    | |
|   |  +--------------------+    |                                    | |
|   +----------------------------------------------------------------+ |
+----------------------------------------------------------------------+
                                 |
                                 v
+----------------------------------------------------------------------+
|                          STATE LAYER                                  |
|   +---------------------------+  +--------------------------------+   |
|   |   Server State            |  |   Client State                 |   |
|   |   (React Query)           |  |   (Zustand)                    |   |
|   |   -------------------     |  |   -------------------------    |   |
|   |   - Data fetching         |  |   - Auth Store                 |   |
|   |   - Caching               |  |   - Proctoring Store           |   |
|   |   - Sync & Mutations      |  |   - UI State                   |   |
|   +---------------------------+  +--------------------------------+   |
+----------------------------------------------------------------------+
                                 |
                                 v
+----------------------------------------------------------------------+
|                          API LAYER                                    |
|   +----------------------------------------------------------------+ |
|   |              TypedApiClient (Axios Singleton)                   | |
|   |   - JWT Auto-injection                                         | |
|   |   - Token Refresh (401 handling)                               | |
|   |   - Error Transformation                                       | |
|   |   - Response Unwrapping                                        | |
|   +----------------------------------------------------------------+ |
|                                 |                                     |
|   +----------------------------------------------------------------+ |
|   |  Feature APIs:  auth.api | exams.api | sessions.api | ...      | |
|   +----------------------------------------------------------------+ |
+----------------------------------------------------------------------+
                                 |
                                 v
+----------------------------------------------------------------------+
|                    BACKEND API (External)                             |
|                    http://localhost:3001/api/v1                       |
+----------------------------------------------------------------------+
```

---

## 2. Technology Stack

### 2.1 Core Dependencies

| Category           | Technology           | Version  | Purpose                              |
|--------------------|----------------------|----------|--------------------------------------|
| **Framework**      | Next.js              | 16.0.3   | React framework with App Router      |
| **UI Library**     | React                | 19.2.0   | Component-based UI                   |
| **Language**       | TypeScript           | 5.x      | Type safety                          |
| **Styling**        | Tailwind CSS         | 3.4.18   | Utility-first CSS                    |
| **State (Server)** | TanStack React Query | 5.90.9   | Server state management              |
| **State (Client)** | Zustand              | 5.0.8    | Client state management              |
| **HTTP Client**    | Axios                | 1.13.2   | API communication                    |
| **Form**           | React Hook Form      | 7.66.0   | Form state management                |
| **Validation**     | Zod                  | 4.1.12   | Schema validation                    |
| **Animation**      | Framer Motion        | 12.23.24 | UI animations                        |
| **Icons**          | Lucide React         | 0.553.0  | Icon library                         |
| **Date**           | date-fns             | 4.1.0    | Date manipulation                    |
| **Toast**          | Sonner               | 2.0.7    | Notifications                        |
| **Theme**          | next-themes          | 0.4.6    | Dark/light mode                      |

### 2.2 UI Component Dependencies (Radix UI)

| Package                          | Purpose                   |
|----------------------------------|---------------------------|
| @radix-ui/react-alert-dialog     | Modal konfirmasi          |
| @radix-ui/react-checkbox         | Checkbox input            |
| @radix-ui/react-dialog           | Modal dialog              |
| @radix-ui/react-dropdown-menu    | Dropdown menus            |
| @radix-ui/react-label            | Form labels               |
| @radix-ui/react-progress         | Progress bar              |
| @radix-ui/react-radio-group      | Radio buttons             |
| @radix-ui/react-scroll-area      | Custom scrollbars         |
| @radix-ui/react-select           | Select dropdown           |
| @radix-ui/react-separator        | Visual separator          |
| @radix-ui/react-tabs             | Tab navigation            |

### 2.3 Styling Utilities

| Package                  | Version | Purpose                   |
|--------------------------|---------|---------------------------|
| class-variance-authority | 0.7.1   | Component variant styling |
| clsx                     | 2.1.1   | Conditional class names   |
| tailwind-merge           | 3.4.0   | Merge Tailwind classes    |
| tailwindcss-animate      | 1.0.7   | Animation utilities       |
| lottie-react             | 2.4.1   | Lottie animations         |

### 2.4 Development Dependencies

| Package                    | Version | Purpose               |
|----------------------------|---------|----------------------|
| Vitest                     | 4.0.16  | Test runner          |
| @testing-library/react     | 16.3.1  | React testing        |
| @testing-library/jest-dom  | 6.9.1   | DOM matchers         |
| jsdom                      | 27.3.0  | DOM environment      |

---

## 3. Project Structure

```
frontend/
├── docs/                              # Documentation
│   └── frontend-architecture.md       # This document
│
├── public/                            # Static assets
│   ├── images/                        # Image files
│   └── lottie/                        # Lottie animation JSON files
│
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (admin)/                   # Admin route group
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       ├── exams/
│   │   │       ├── questions/
│   │   │       ├── sessions/
│   │   │       ├── results/
│   │   │       └── users/
│   │   ├── (auth)/                    # Auth route group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (participant)/             # Participant route group
│   │   │   ├── dashboard/
│   │   │   ├── exams/
│   │   │   ├── exam-sessions/
│   │   │   ├── results/
│   │   │   └── profile/
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Landing page (/)
│   │
│   ├── features/                      # Feature modules
│   │   ├── auth/                      # Authentication
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── store/
│   │   │   └── types/
│   │   ├── dashboard/                 # Dashboard
│   │   ├── exam-sessions/             # Exam sessions
│   │   ├── exams/                     # Exams
│   │   ├── landing/                   # Landing page
│   │   ├── proctoring/                # AI proctoring
│   │   ├── questions/                 # Questions
│   │   └── users/                     # User management
│   │
│   ├── shared/                        # Shared resources
│   │   ├── components/
│   │   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── BackButton.tsx
│   │   │   ├── PageHeaderTitle.tsx
│   │   │   ├── ScrollReveal.tsx
│   │   │   └── SectionWrapper.tsx
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   ├── api.ts                 # API client
│   │   │   ├── providers.tsx          # React providers
│   │   │   ├── queryClient.ts         # React Query config
│   │   │   ├── storage.ts             # Storage utilities
│   │   │   ├── errors.ts              # Error utilities
│   │   │   ├── status-config.ts       # Status configurations
│   │   │   └── utils.ts               # General utilities
│   │   └── types/
│   │       ├── api.types.ts           # API types
│   │       ├── common.types.ts        # Common types
│   │       ├── enum.types.ts          # Enum types
│   │       └── index.ts               # Type exports
│   │
│   └── test/                          # Test setup
│       └── setup.ts
│
├── .env.example                       # Environment template
├── components.json                    # shadcn/ui config
├── next.config.ts                     # Next.js config
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vitest.config.ts
```

### 3.1 Feature Module Structure

Setiap feature module mengikuti struktur konsisten:

```
features/{feature-name}/
├── api/                # API functions
│   └── {feature}.api.ts
├── components/         # React components
│   ├── ComponentA.tsx
│   └── index.ts        # Barrel export
├── hooks/              # Custom React hooks
│   ├── use{Hook}.ts
│   └── index.ts
├── store/              # Zustand store (if needed)
│   └── {feature}.store.ts
├── types/              # TypeScript types
│   └── {feature}.types.ts
└── utils/              # Utility functions (if needed)
    └── {feature}.utils.ts
```

### 3.2 Path Aliases

Konfigurasi di `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/features/*": ["./src/features/*"],
      "@/app/*": ["./src/app/*"]
    }
  }
}
```

**Usage:**

```typescript
// Import dari shared
import { Button } from '@/shared/components/ui/button';
import { apiClient } from '@/shared/lib/api';

// Import dari features
import { useCurrentUser } from '@/features/auth/store/auth.store';
import { examsApi } from '@/features/exams/api/exams.api';

// Import types
import type { ApiResponse } from '@/shared/types/api.types';
```

---

## 4. Routing Architecture

### 4.1 Route Groups

Next.js App Router menggunakan route groups untuk memisahkan layout tanpa mempengaruhi URL:

```
src/app/
├── (admin)/            # Admin area - memerlukan role ADMIN
├── (auth)/             # Auth pages - halaman login/register
├── (participant)/      # Participant area - memerlukan role PARTICIPANT
├── layout.tsx          # Root layout (providers, fonts)
└── page.tsx            # Landing page (/)
```

### 4.2 Complete Route Map

#### Public Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Landing page |

#### Auth Routes `(auth)`

| Route | File | Description |
|-------|------|-------------|
| `/login` | `app/(auth)/login/page.tsx` | Login page |
| `/register` | `app/(auth)/register/page.tsx` | Registration page |

#### Admin Routes `(admin)` - Requires ADMIN role

| Route | File | Description |
|-------|------|-------------|
| `/admin/dashboard` | `app/(admin)/admin/dashboard/page.tsx` | Admin dashboard |
| `/admin/exams` | `app/(admin)/admin/exams/page.tsx` | Exam list |
| `/admin/exams/create` | `app/(admin)/admin/exams/create/page.tsx` | Create exam |
| `/admin/exams/[id]` | `app/(admin)/admin/exams/[id]/page.tsx` | Exam detail |
| `/admin/exams/[id]/edit` | `app/(admin)/admin/exams/[id]/edit/page.tsx` | Edit exam |
| `/admin/exams/[id]/questions` | `app/(admin)/admin/exams/[id]/questions/page.tsx` | Manage questions |
| `/admin/questions` | `app/(admin)/admin/questions/page.tsx` | Question bank |
| `/admin/questions/create` | `app/(admin)/admin/questions/create/page.tsx` | Create question |
| `/admin/questions/[id]` | `app/(admin)/admin/questions/[id]/page.tsx` | Question detail |
| `/admin/questions/[id]/edit` | `app/(admin)/admin/questions/[id]/edit/page.tsx` | Edit question |
| `/admin/sessions` | `app/(admin)/admin/sessions/page.tsx` | Session list |
| `/admin/sessions/[id]` | `app/(admin)/admin/sessions/[id]/page.tsx` | Session detail |
| `/admin/sessions/[id]/proctoring` | `app/(admin)/admin/sessions/[id]/proctoring/page.tsx` | Proctoring monitor |
| `/admin/results` | `app/(admin)/admin/results/page.tsx` | Results overview |
| `/admin/users` | `app/(admin)/admin/users/page.tsx` | User management |
| `/admin/users/create` | `app/(admin)/admin/users/create/page.tsx` | Create user |
| `/admin/users/[id]` | `app/(admin)/admin/users/[id]/page.tsx` | User detail |
| `/admin/users/[id]/edit` | `app/(admin)/admin/users/[id]/edit/page.tsx` | Edit user |

#### Participant Routes `(participant)` - Requires PARTICIPANT role

| Route | File | Description |
|-------|------|-------------|
| `/dashboard` | `app/(participant)/dashboard/page.tsx` | Participant dashboard |
| `/exams` | `app/(participant)/exams/page.tsx` | Available exams |
| `/exams/[id]` | `app/(participant)/exams/[id]/page.tsx` | Exam detail |
| `/exams/[id]/history` | `app/(participant)/exams/[id]/history/page.tsx` | Attempt history |
| `/exam-sessions` | `app/(participant)/exam-sessions/page.tsx` | My sessions |
| `/exam-sessions/[id]` | `app/(participant)/exam-sessions/[id]/page.tsx` | Session detail |
| `/exam-sessions/[id]/take` | `app/(participant)/exam-sessions/[id]/take/page.tsx` | Take exam |
| `/exam-sessions/[id]/review` | `app/(participant)/exam-sessions/[id]/review/page.tsx` | Review answers |
| `/results` | `app/(participant)/results/page.tsx` | My results |
| `/results/[id]` | `app/(participant)/results/[id]/page.tsx` | Result detail |
| `/profile` | `app/(participant)/profile/page.tsx` | User profile |

### 4.3 Route Protection

Route protection diimplementasikan di level layout:

**Admin Layout** (`src/app/(admin)/layout.tsx`):

```typescript
"use client";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();

    // Redirect unauthenticated users to login
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    // Redirect non-admin users to participant dashboard
    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.role === "PARTICIPANT") {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading) return <LoadingSpinner />;
    if (!isAuthenticated || user?.role !== "ADMIN") return null;

    return <>{children}</>;
}
```

**Participant Layout** (`src/app/(participant)/layout.tsx`):

```typescript
"use client";

export default function ParticipantLayout({ children }) {
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();
    const pathname = usePathname();

    // Redirect unauthenticated users to login
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    // Redirect admin users to admin dashboard
    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.role === "ADMIN") {
            router.push("/admin/dashboard");
        }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading) return <LoadingSpinner />;
    if (!isAuthenticated || user?.role !== "PARTICIPANT") return null;

    // Hide navbar during exam taking
    const hideNavbar = /^\/exam-sessions\/\d+\/take/.test(pathname);

    return (
        <div className="min-h-screen bg-muted/30">
            {!hideNavbar && <ParticipantNavbar />}
            <main>{children}</main>
        </div>
    );
}
```

---

## 5. Component Architecture

### 5.1 Component Hierarchy

```
+---------------------------------------------------------------------+
|  PAGES (src/app/**/page.tsx)                                         |
|  - Route entry points                                                |
|  - Data fetching (server components atau hooks)                      |
|  - Layout composition                                                |
+---------------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------------+
|  FEATURE COMPONENTS (src/features/**/components/)                    |
|  - Domain-specific components                                        |
|  - Business logic                                                    |
|  - Connected to feature hooks/stores                                 |
|                                                                      |
|  Examples: ExamCard, QuestionDisplay, WebcamCapture, LoginForm       |
+---------------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------------+
|  SHARED COMPONENTS (src/shared/components/)                          |
|  - Reusable across features                                          |
|  - No business logic                                                 |
|  - Configurable via props                                            |
|                                                                      |
|  Custom: BackButton, PageHeaderTitle, ScrollReveal, SectionWrapper   |
+---------------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------------+
|  UI PRIMITIVES (src/shared/components/ui/)                           |
|  - shadcn/ui components (Radix UI based)                             |
|  - Fully accessible                                                  |
|  - Styled with Tailwind + CSS variables                              |
|                                                                      |
|  Components: button, input, card, dialog, table, form, etc.          |
+---------------------------------------------------------------------+
```

### 5.2 shadcn/ui Components

Komponen UI yang tersedia di `src/shared/components/ui/`:

| Component       | File                 | Description              |
|-----------------|----------------------|--------------------------|
| AlertDialog     | `alert-dialog.tsx`   | Modal konfirmasi         |
| Alert           | `alert.tsx`          | Alert messages           |
| Badge           | `badge.tsx`          | Status badges            |
| Button          | `button.tsx`         | Buttons dengan variants  |
| Card            | `card.tsx`           | Card container           |
| Checkbox        | `checkbox.tsx`       | Checkbox input           |
| Dialog          | `dialog.tsx`         | Modal dialog             |
| DropdownMenu    | `dropdown-menu.tsx`  | Dropdown menus           |
| Form            | `form.tsx`           | Form dengan React Hook Form |
| Input           | `input.tsx`          | Text input               |
| Label           | `label.tsx`          | Form labels              |
| Progress        | `progress.tsx`       | Progress bar             |
| RadioGroup      | `radio-group.tsx`    | Radio button group       |
| ScrollArea      | `scroll-area.tsx`    | Custom scrollable area   |
| Select          | `select.tsx`         | Select dropdown          |
| Separator       | `separator.tsx`      | Visual separator         |
| Sheet           | `sheet.tsx`          | Slide-out panel          |
| Skeleton        | `skeleton.tsx`       | Loading placeholder      |
| Sonner          | `sonner.tsx`         | Toast notifications      |
| Table           | `table.tsx`          | Data tables              |
| Tabs            | `tabs.tsx`           | Tab navigation           |
| Textarea        | `textarea.tsx`       | Multiline text input     |

### 5.3 Feature Components Overview

#### Auth Feature

```
features/auth/
├── api/auth.api.ts           # Login, register, refresh, logout
├── components/               # Login/Register forms
├── hooks/
│   ├── useAuth.ts            # Auth state hook
│   └── index.ts
├── store/auth.store.ts       # Zustand auth store
└── types/auth.types.ts       # Auth types
```

#### Exams Feature

```
features/exams/
├── api/exams.api.ts          # Exam CRUD, attach questions
├── components/
│   └── index.ts
├── hooks/
│   ├── useExams.ts           # Get exams list
│   ├── useExam.ts            # Get single exam
│   ├── useAdminExams.ts      # Admin: get exams
│   ├── useCreateExam.ts      # Admin: create exam
│   ├── useUpdateExam.ts      # Admin: update exam
│   ├── useDeleteExam.ts      # Admin: delete exam
│   ├── useAttachQuestions.ts # Admin: attach questions
│   ├── useDetachQuestions.ts # Admin: detach questions
│   └── index.ts
└── types/exams.types.ts
```

#### Exam Sessions Feature

```
features/exam-sessions/
├── api/admin-sessions.api.ts # Admin session endpoints
├── components/
│   ├── UserExamCard.tsx
│   ├── AnswerReviewCard.tsx
│   └── ...
├── hooks/
│   ├── useExamSession.ts     # Get session
│   ├── useExamQuestions.ts   # Get questions
│   ├── useExamAnswers.ts     # Answer management
│   ├── useStartExam.ts       # Start exam
│   ├── useTimer.ts           # Exam timer
│   ├── useAdminSessions.ts   # Admin: sessions list
│   └── ...
└── types/
```

#### Proctoring Feature

```
features/proctoring/
├── api/proctoring.api.ts     # Face analysis, event logging
├── components/               # Webcam, violation alerts
├── hooks/
│   ├── useAnalyzeFace.ts     # Face analysis mutation
│   ├── useLogEvent.ts        # Log proctoring event
│   ├── useProctoringEvents.ts
│   └── index.ts
├── store/proctoring.store.ts # Webcam & violations state
├── types/proctoring.types.ts
└── utils/webcam.utils.ts
```

#### Questions Feature

```
features/questions/
├── api/questions.api.ts      # Question CRUD
├── components/
│   ├── QuestionCard.tsx
│   └── index.ts
├── hooks/
│   ├── useQuestions.ts       # Get questions list
│   ├── useQuestion.ts        # Get single question
│   ├── useCreateQuestion.ts  # Create question
│   ├── useUpdateQuestion.ts  # Update question
│   ├── useDeleteQuestion.ts  # Delete question
│   └── index.ts
└── types/questions.types.ts
```

#### Users Feature

```
features/users/
├── api/users.api.ts          # User CRUD
├── hooks/
│   ├── useUsers.ts           # Get users list
│   ├── useUser.ts            # Get single user
│   ├── useProfile.ts         # Current user profile
│   ├── useCreateUser.ts      # Create user
│   ├── useUpdateUser.ts      # Update user
│   ├── useDeleteUser.ts      # Delete user
│   └── index.ts
└── types/
```

---

## 6. State Management

### 6.1 State Management Strategy

```
+---------------------------------------------------------------------+
|                      SERVER STATE                                    |
|                   (React Query / TanStack Query)                     |
+---------------------------------------------------------------------+
|  Purpose:                                                            |
|  - Data fetching & caching                                           |
|  - Server synchronization                                            |
|  - Optimistic updates                                                |
|  - Background refetching                                             |
|                                                                      |
|  Use Cases: Exams, Users, Questions, Sessions, Results               |
+---------------------------------------------------------------------+

+---------------------------------------------------------------------+
|                      CLIENT STATE                                    |
|                        (Zustand)                                     |
+---------------------------------------------------------------------+
|  Purpose:                                                            |
|  - Global UI state                                                   |
|  - User session                                                      |
|  - Cross-component state                                             |
|                                                                      |
|  Stores:                                                             |
|  - Auth Store: user, tokens, authentication state                    |
|  - Proctoring Store: webcam, violations, analysis                    |
+---------------------------------------------------------------------+

+---------------------------------------------------------------------+
|                      LOCAL STATE                                     |
|                   (React useState/useReducer)                        |
+---------------------------------------------------------------------+
|  Purpose:                                                            |
|  - Component-specific state                                          |
|  - Form state (with React Hook Form)                                 |
|  - UI interactions (modals, toggles)                                 |
+---------------------------------------------------------------------+
```

### 6.2 React Query Configuration

**File:** `src/shared/lib/queryClient.ts`

```typescript
import { QueryClient } from "@tanstack/react-query";

const shouldRetryQuery = (failureCount: number, error: unknown): boolean => {
    const apiError = error as ApiError;
    const status = apiError?.status;

    // Never retry these status codes
    if (status === 429 || status === 401 || status === 403 || status === 404) {
        return false;
    }

    // Retry network errors and server errors (5xx) up to 2 times
    return failureCount < 2;
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: shouldRetryQuery,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: shouldRetryMutation,
            retryDelay: 500,
        },
    },
});
```

### 6.3 Auth Store (Zustand)

**File:** `src/features/auth/store/auth.store.ts`

```typescript
interface AuthStore {
    // State
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setAuth: (user: User, tokens: TokensData, rememberMe?: boolean) => void;
    updateUser: (updates: Partial<User>) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    ...getInitialState(),

    setAuth: (user, tokens, rememberMe = true) => {
        const storageType = rememberMe ? 'local' : 'session';
        saveToStorage(user, tokens, storageType);
        set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
        });
    },

    clearAuth: () => {
        clearStorage();
        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
        });
    },
    // ...
}));

// Selector hooks
export const useCurrentUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useAccessToken = () => useAuthStore((s) => s.accessToken);
export const useIsAdmin = () => useAuthStore((s) => s.user?.role === 'ADMIN');
export const useIsParticipant = () => useAuthStore((s) => s.user?.role === 'PARTICIPANT');
```

### 6.4 Proctoring Store (Zustand)

**File:** `src/features/proctoring/store/proctoring.store.ts`

```typescript
interface ProctoringStore {
    // Webcam state
    webcam: ExtendedWebcamState;

    // Violations
    violations: Violation[];
    violationCount: number;
    highViolationCount: number;

    // Analysis
    isAnalyzing: boolean;
    lastAnalysis: FaceAnalysisResult | null;

    // Actions
    setWebcam: (state: Partial<ExtendedWebcamState>) => void;
    addViolation: (violation: Violation) => void;
    clearViolations: () => void;
    setAnalyzing: (analyzing: boolean) => void;
    setLastAnalysis: (result: FaceAnalysisResult | null) => void;
    incrementViolationCount: () => void;
    incrementHighViolationCount: () => void;
    reset: () => void;
}

// Selector hooks
export const useWebcamState = () => useProctoringStore((s) => s.webcam);
export const useViolations = () => useProctoringStore((s) => s.violations);
export const useViolationCounts = () => useProctoringStore((s) => ({
    total: s.violationCount,
    high: s.highViolationCount,
}));
export const useShouldCancelExam = () => useProctoringStore((s) => s.highViolationCount >= 3);
```

### 6.5 Provider Setup

**File:** `src/shared/lib/providers.tsx`

```typescript
"use client";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthInit />
            {children}
        </QueryClientProvider>
    );
}
```

**Root Layout** (`src/app/layout.tsx`):

```typescript
export default function RootLayout({ children }) {
    return (
        <html lang="id">
            <body className={`${poppins.variable} font-sans antialiased`}>
                <Providers>
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
```

---

## 7. API Layer

### 7.1 API Client Architecture

**File:** `src/shared/lib/api.ts`

```
+---------------------------------------------------------------------+
|                    TypedApiClient (Singleton)                        |
+---------------------------------------------------------------------+
|                                                                      |
|  +---------------------------------------------------------------+  |
|  |                    REQUEST INTERCEPTOR                        |  |
|  |  1. Get access token from auth store                          |  |
|  |  2. Inject Authorization header: Bearer {token}               |  |
|  +---------------------------------------------------------------+  |
|                              |                                       |
|                              v                                       |
|  +---------------------------------------------------------------+  |
|  |                      AXIOS INSTANCE                           |  |
|  |  Base URL: NEXT_PUBLIC_API_URL/api/v1                         |  |
|  |  Timeout: 30s                                                 |  |
|  |  Headers: Content-Type: application/json                      |  |
|  +---------------------------------------------------------------+  |
|                              |                                       |
|                              v                                       |
|  +---------------------------------------------------------------+  |
|  |                   RESPONSE INTERCEPTOR                        |  |
|  |                                                               |  |
|  |  Success: Unwrap response.data (ApiResponse<T>)               |  |
|  |                                                               |  |
|  |  Error 401:                                                   |  |
|  |  - Attempt token refresh (with mutex to prevent race)         |  |
|  |  - Queue concurrent requests                                  |  |
|  |  - Retry original request                                     |  |
|  |  - If refresh fails -> logout                                 |  |
|  |                                                               |  |
|  |  Other Errors: Transform to ApiError                          |  |
|  +---------------------------------------------------------------+  |
|                                                                      |
+---------------------------------------------------------------------+
```

### 7.2 API Response Types

**File:** `src/shared/types/api.types.ts`

```typescript
// Standard API response wrapper
interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
    timestamp: string;
}

// Error response
interface ApiError {
    message: string;
    errorCode?: string;
    errors?: Array<{ field: string; message: string }>;
    status?: number;
    response?: any;
}

// Pagination
interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}
```

### 7.3 Feature API Examples

#### Auth API

```typescript
// src/features/auth/api/auth.api.ts
export const authApi = {
    login: async (credentials: LoginRequest): Promise<AuthPayload> => {
        const response = await apiClient.post<AuthPayload>('/auth/login', credentials);
        return response.data;
    },

    register: async (credentials: RegisterRequest): Promise<AuthPayload> => {
        const response = await apiClient.post<AuthPayload>('/auth/register', credentials);
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<RefreshTokenPayload> => {
        const response = await apiClient.post<RefreshTokenPayload>('/auth/refresh', { refreshToken });
        return response.data;
    },

    logout: async (refreshToken: string): Promise<LogoutPayload> => {
        const response = await apiClient.post<LogoutPayload>('/auth/logout', { refreshToken });
        return response.data;
    },

    getCurrentUser: async (): Promise<MePayload> => {
        const response = await apiClient.get<MePayload>('/me');
        return response.data;
    },
};
```

#### Exams API

```typescript
// src/features/exams/api/exams.api.ts
export const examsApi = {
    // Participant endpoints
    getExams: async (params?: ExamsQueryParams): Promise<ExamsListResponse> => { ... },
    getExam: async (examId: number): Promise<ExamDetailResponse> => { ... },
    startExam: async (examId: number): Promise<StartExamResponse> => { ... },

    // Admin endpoints
    getAdminExams: async (params?: AdminExamsQueryParams): Promise<AdminExamsListResponse> => { ... },
    getAdminExam: async (examId: number): Promise<AdminExamDetailResponse> => { ... },
    createExam: async (data: CreateExamRequest): Promise<CreateExamResponse> => { ... },
    updateExam: async (examId: number, data: UpdateExamRequest): Promise<UpdateExamResponse> => { ... },
    deleteExam: async (examId: number): Promise<DeleteExamResponse> => { ... },
    attachQuestions: async (examId: number, data: AttachQuestionsRequest): Promise<AttachQuestionsResponse> => { ... },
    detachQuestions: async (examId: number, data: DetachQuestionsRequest): Promise<DetachQuestionsResponse> => { ... },
    getExamQuestions: async (examId: number, params?: { type?: QuestionType }): Promise<ExamQuestionsListResponse> => { ... },
};
```

### 7.4 Token Refresh Flow

```
    Request A  ---+
    Request B  ---+---> API Call ---> 401 Unauthorized
    Request C  ---+         |
                            v
                  +------------------+
                  | Is refreshing?   |
                  +--------+---------+
                           |
              +------------+------------+
              |                         |
         NO   v                    YES  v
    +------------------+      +------------------+
    | Set refreshing   |      | Queue request    |
    | = true           |      | Wait for result  |
    +--------+---------+      +--------+---------+
             |                        |
             v                        |
    +------------------+              |
    | Call /refresh    |              |
    +--------+---------+              |
             |                        |
    +--------+--------+               |
    |                 |               |
SUCCESS            FAIL               |
    |                 |               |
    v                 v               |
+---------+    +-------------+        |
| Update  |    | Clear auth  |        |
| tokens  |    | Redirect to |        |
+---------+    | /login      |        |
    |          +-------------+        |
    |                                 |
    v                                 |
+------------------+                  |
| Process queue    |<-----------------+
| Retry requests   |
+------------------+
```

---

## 8. Styling System

### 8.1 Tailwind Configuration

**File:** `tailwind.config.js`

Key configurations:

```javascript
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
            },
            colors: {
                // CSS variables based colors
                primary: { DEFAULT: "hsl(var(--primary))", foreground: "..." },
                secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "..." },
                tertiary: { DEFAULT: "hsl(var(--tertiary))", foreground: "..." },
                success: { DEFAULT: "hsl(var(--success))", foreground: "..." },
                warning: { DEFAULT: "hsl(var(--warning))", foreground: "..." },
                info: { DEFAULT: "hsl(var(--info))", foreground: "..." },
                destructive: { ... },

                // Proctoring severity colors
                severity: {
                    high: "hsl(var(--severity-high))",
                    medium: "hsl(var(--severity-medium))",
                    low: "hsl(var(--severity-low))",
                },
            },
            animation: {
                "fade-in": "fade-in 0.5s ease-out 0.1s both",
                "fade-in-up": "fade-in-up 0.5s ease-out 0.1s both",
                "slide-in-bottom": "slide-in-bottom 0.6s ease-out",
                "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "float": "float 3s ease-in-out infinite",
                "shake": "shake 0.5s ease-in-out",
                // ... more animations
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
```

### 8.2 CSS Variables (Theme System)

**File:** `src/app/globals.css`

```css
@layer base {
    :root {
        /* Primary: #327498 (Blue) */
        --primary: 213 50% 40%;
        --primary-foreground: 0 0% 100%;

        /* Secondary: #F0A245 (Orange) */
        --secondary: 33 85% 61%;
        --secondary-foreground: 0 0% 100%;

        /* Tertiary: #F0E144 (Yellow) */
        --tertiary: 55 85% 60%;
        --tertiary-foreground: 222.2 84% 4.9%;

        /* Status colors */
        --success: 142 76% 36%;
        --warning: 38 92% 50%;
        --info: 199 89% 48%;
        --destructive: 0 84.2% 60.2%;

        /* Proctoring severity */
        --severity-high: 0 84.2% 60.2%;
        --severity-medium: 38 92% 50%;
        --severity-low: 220 14% 71%;

        --radius: 0.5rem;
    }

    .dark {
        /* Dark mode overrides */
        --background: 222.2 84% 4.9%;
        --foreground: 210 40% 98%;
        /* ... */
    }
}
```

### 8.3 Custom Utility Classes

```css
@layer utilities {
    /* Status badges */
    .status-live { @apply bg-destructive text-destructive-foreground; }
    .status-monitoring { @apply bg-primary text-primary-foreground; }
    .status-completed { @apply bg-success text-success-foreground; }
    .status-warning { @apply bg-warning text-warning-foreground; }

    /* Gradient backgrounds */
    .gradient-primary { @apply bg-gradient-to-br from-primary/10 to-primary/5; }
    .gradient-success { @apply bg-gradient-to-br from-success/10 to-success/5; }

    /* Shadow utilities */
    .shadow-soft { box-shadow: var(--shadow-soft); }
    .shadow-medium { box-shadow: var(--shadow-medium); }
    .shadow-large { box-shadow: var(--shadow-large); }

    /* Animation delays */
    .delay-0 { animation-delay: 0ms; }
    .delay-100 { animation-delay: 100ms; }
    /* ... up to delay-800 */
}

@layer components {
    .interactive {
        @apply transition-all duration-300 ease-out;
    }
    .interactive:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-soft);
    }
    .card-hover { @apply interactive; }
}
```

---

## 9. Type System

### 9.1 Shared Enum Types

**File:** `src/shared/types/enum.types.ts`

```typescript
// User roles (matches backend Prisma enum)
export type UserRole = 'ADMIN' | 'PARTICIPANT';

// Exam session status
export type ExamStatus = 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED' | 'TIMEOUT';

// CPNS question types
export type QuestionType = 'TIU' | 'TKP' | 'TWK';

// Answer options
export type AnswerOption = 'A' | 'B' | 'C' | 'D' | 'E' | null;

// Proctoring
export type ProctoringEventType = 'FACE_DETECTED' | 'NO_FACE_DETECTED' | 'MULTIPLE_FACES' | 'LOOKING_AWAY';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH';

// Constants for dropdowns/validation
export const USER_ROLES: readonly UserRole[] = ['ADMIN', 'PARTICIPANT'];
export const EXAM_STATUSES: readonly ExamStatus[] = ['IN_PROGRESS', 'FINISHED', 'CANCELLED', 'TIMEOUT'];
export const QUESTION_TYPES: readonly QuestionType[] = ['TIU', 'TKP', 'TWK'];
export const SEVERITY_LEVELS: readonly Severity[] = ['LOW', 'MEDIUM', 'HIGH'];

// Display labels for UI
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
    TIU: 'TIU - Tes Intelegensia Umum',
    TKP: 'TKP - Tes Karakteristik Pribadi',
    TWK: 'TWK - Tes Wawasan Kebangsaan',
};
```

### 9.2 Common Types

**File:** `src/shared/types/common.types.ts`

Shared types used across features (User, Exam, Question structures).

### 9.3 API Types

**File:** `src/shared/types/api.types.ts`

Types for API responses, pagination, and error handling (see Section 7.2).

---

## 10. Configuration Files

### 10.1 package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "test:ui": "vitest --ui"
  }
}
```

### 10.2 TypeScript Configuration

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/features/*": ["./src/features/*"],
      "@/app/*": ["./src/app/*"]
    }
  }
}
```

### 10.3 shadcn/ui Configuration

**File:** `components.json`

```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/shared/components",
    "utils": "@/shared/lib/utils",
    "ui": "@/shared/components/ui",
    "lib": "@/shared/lib",
    "hooks": "@/shared/hooks"
  }
}
```

### 10.4 Environment Variables

**File:** `.env.example`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

---

## 11. Testing Infrastructure

### 11.1 Test Configuration

**File:** `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
```

### 11.2 Test Setup

**File:** `src/test/setup.ts`

```typescript
import '@testing-library/jest-dom';

// Global mocks and setup
```

### 11.3 Running Tests

```bash
# Watch mode
pnpm test

# Single run
pnpm test:run

# With UI
pnpm test:ui
```

---

## Quick Reference

### Common Import Paths

```typescript
// UI Components
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

// API
import { apiClient } from '@/shared/lib/api';
import { examsApi } from '@/features/exams/api/exams.api';

// State
import { useAuthStore, useCurrentUser, useIsAdmin } from '@/features/auth/store/auth.store';
import { useProctoringStore } from '@/features/proctoring/store/proctoring.store';

// Types
import type { ApiResponse, ApiError } from '@/shared/types/api.types';
import type { UserRole, ExamStatus, QuestionType } from '@/shared/types/enum.types';

// Utils
import { cn } from '@/shared/lib/utils';
```

### Common Patterns

```typescript
// Protected API call with React Query
const { data, isLoading, error } = useQuery({
    queryKey: ['exams', params],
    queryFn: () => examsApi.getExams(params),
    enabled: isAuthenticated,
});

// Form with validation
const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ... },
});

// Conditional styling with cn()
<div className={cn(
    'base-classes',
    isActive && 'active-classes',
    variant === 'primary' && 'primary-classes'
)} />
```

---

*Document Version: 1.0.0*
*Last Updated: January 2025*
