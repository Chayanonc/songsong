<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

# Project: SongSong

ระบบขอเพลงสำหรับนักดนตรีสด — นักดนตรีสร้างห้อง แชร์ QR code ลูกค้าสแกนแล้วขอเพลง นักดนตรีเห็น real-time บน dashboard

## Stack

| Layer         | Tech                                                                               |
| ------------- | ---------------------------------------------------------------------------------- |
| Framework     | Next.js 16.2.7 — App Router, React Server Components                               |
| Language      | TypeScript 5, strict mode                                                          |
| Styling       | Tailwind CSS v4 (no config file — uses CSS-first config in `globals.css`)          |
| UI Components | shadcn (style: `radix-luma`, baseColor: `mist`) via `@/components/ui/`             |
| Icons         | `@tabler/icons-react`                                                              |
| Font          | Prompt (Thai + Latin, weight 300–700) + Geist Mono — loaded via `next/font/google` |
| ORM           | Prisma 7 — uses `prisma.config.ts` for DB config (NOT `schema.prisma`)             |
| Database      | PostgreSQL via `@prisma/adapter-pg`                                                |
| Real-time     | SSE (Server-Sent Events) via App Router Route Handler                              |
| QR Code       | `react-qr-code` (renders inline SVG)                                               |
| Room codes    | `nanoid` — 6-char uppercase                                                        |
| Toast         | `sonner` via shadcn                                                                |

## Key Conventions

### Prisma 7 — Breaking Changes

- DB connection URL lives in `prisma.config.ts`, **not** in `schema.prisma` (`url = env(...)` is removed)
- Generated client output: `prisma/generated/prisma/` — import via `@prisma/client` alias (see tsconfig)
- `PrismaClient` must be constructed with `new PrismaClient({ adapter })` using `PrismaPg`
- Run migrations: `pnpm prisma:migrate` (wraps `prisma migrate dev`)

### Path Aliases (tsconfig.json)

- `@/*` → `./src/*`
- `@prisma/*` → `./prisma/generated/prisma/*`

### Tailwind CSS v4

- No `tailwind.config.ts` — configuration is in `src/app/globals.css` via `@import "tailwindcss"`
- shadcn CSS variables use OKLCH color space
- Dark mode via `.dark` class (not `media`)

### App Router params

- `params` in page/layout components is `Promise<{ ... }>` — always `await params`
- Example: `const { code } = await params`

### Server Actions

- All actions in `src/lib/actions.ts` with `"use server"` at top
- Use `useActionState` (React 19) on client forms — not the old `useFormState`

### Illustrations

- Inline SVG React components in `src/components/illustrations/`
- All use `stroke="currentColor"` `fill="none"` — color via Tailwind `text-*` classes
- No third-party icon/illustration libraries for custom art

## Project Structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout — Prompt font, <Toaster />
│   ├── page.tsx                 # Landing — create room / enter room code
│   ├── not-found.tsx            # Global 404 page
│   ├── room/[code]/
│   │   ├── layout.tsx           # Validates room exists (notFound() if expired)
│   │   ├── page.tsx             # Musician dashboard (SSE real-time)
│   │   └── request/
│   │       └── page.tsx         # Customer song request form
│   └── api/room/[code]/events/
│       └── route.ts             # SSE endpoint — polls DB every 2s, pushes diffs
├── components/
│   ├── ui/                      # shadcn components
│   ├── illustrations/           # SVG line-art components
│   ├── DashboardClient.tsx      # "use client" — SSE consumer + QR modal
│   ├── RequestCard.tsx          # "use client" — single request card + status buttons
│   ├── RequestForm.tsx          # "use client" — customer form, slip→base64
│   └── RoomCodeEntry.tsx        # "use client" — room code input on landing page
└── lib/
    ├── actions.ts               # Server Actions (createRoom, submitSongRequest, etc.)
    ├── prisma.ts                # Prisma singleton with PrismaPg adapter
    └── utils.ts                 # cn() helper

prisma/
├── schema.prisma                # Models: Room, SongRequest, enum RequestStatus
├── prisma.config.ts             # DB URL from DATABASE_URL env var (Prisma 7 style)
└── generated/prisma/            # Generated client (import via @prisma/client)
```

## Database Models

```prisma
enum RequestStatus { PENDING, PLAYING, DONE, REJECTED }

model Room {
  id        String        @id @default(cuid())
  code      String        @unique   // 6-char nanoid uppercase
  createdAt DateTime      @default(now())
  expiresAt DateTime                // now() + 24h on create
  requests  SongRequest[]
}

model SongRequest {
  id           String        @id @default(cuid())
  roomId       String
  songName     String
  bandName     String?
  customerName String?
  tableNumber  String?
  tipAmount    Int?                  // stored in satang (×100), avoid float
  slipBase64   String?              // data:image/... base64, max ~375 KB
  status       RequestStatus @default(PENDING)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}
```

## Design System

- **Style**: Minimal, line-art / vector illustration aesthetic
- **Primary color**: Single accent (`--primary` from shadcn mist theme — violet)
- **Font**: Prompt — rounded, friendly, full Thai support
- **Mono**: Geist Mono — used for room codes (`font-mono tracking-widest`)
- **Components**: shadcn only — Card, Input, Label, Badge, Dialog, Separator, Textarea, Sonner, Button
- **Illustrations**: `text-primary` for accent, `text-muted-foreground` for secondary positions
