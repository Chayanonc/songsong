# SongSong

ระบบขอเพลงสำหรับนักดนตรีสด — นักดนตรีสร้างห้อง แชร์ QR code ลูกค้าสแกนแล้วขอเพลง นักดนตรีเห็น real-time บน dashboard

## Features

- **นักดนตรี** — สร้างห้อง รับ QR code แชร์ให้ลูกค้า จัดการคิวเพลง real-time
- **ลูกค้า** — สแกน QR หรือพิมพ์รหัสห้อง ขอเพลงพร้อมระบุโต๊ะ ชื่อ และทิป
- **คิวเพลง** — สถานะ PENDING → PLAYING → DONE / REJECTED อัปเดต real-time ผ่าน SSE
- **ตั้งค่าห้อง** — นักดนตรีกรอกชื่อ บัญชีธนาคาร และอัปโหลด QR รับเงิน
- **ข้อมูลการชำระเงิน** — ลูกค้าเห็น QR + เลขบัญชี + ปุ่มคัดลอกในหน้าขอเพลง

## Tech Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16.2.7 — App Router, RSC |
| Language | TypeScript 5 strict |
| Styling | Tailwind CSS v4 (CSS-first, no config file) |
| UI | shadcn `radix-luma` / `mist` |
| Icons | `@tabler/icons-react` |
| Font | IBM Plex Sans Thai + Geist Mono |
| Forms | react-hook-form + zod + `@hookform/resolvers/standard-schema` |
| ORM | Prisma 7 (`prisma.config.ts` สำหรับ DB URL) |
| Database | PostgreSQL via `@prisma/adapter-pg` |
| Real-time | SSE (Server-Sent Events) |
| QR Code | `react-qr-code` |

## Getting Started

### 1. ติดตั้ง dependencies

```bash
pnpm install
```

### 2. ตั้งค่า environment variable

```bash
cp .env.example .env
# แก้ DATABASE_URL ให้ตรงกับ PostgreSQL ของคุณ
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/songsong"
```

### 3. สร้าง database และ generate client

```bash
pnpm prisma:migrate   # รัน migration
npx prisma generate   # generate Prisma client
```

### 4. รัน dev server

```bash
pnpm dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## User Flow

```
นักดนตรี                              ลูกค้า
   │                                     │
   ├─ กดสร้างห้อง                        │
   ├─ ได้รหัส 6 หลัก + QR code          │
   ├─ ตั้งค่า: ชื่อ / บัญชี / QR รับเงิน │
   │                                     │
   │          แชร์ QR ─────────────────► │
   │                                     ├─ สแกน QR / พิมพ์รหัส
   │                                     ├─ ขอเพลง + ระบุทิป
   │                                     └─ เห็น QR/บัญชีนักดนตรี
   │
   ├─ เห็นคิวใหม่ real-time (SSE)
   ├─ เปลี่ยนสถานะ PLAYING / DONE / REJECTED
   └─ ดูยอดทิปสะสม
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                      # Landing
│   ├── room/[code]/
│   │   ├── page.tsx                  # Musician dashboard
│   │   └── request/page.tsx          # Customer request form
│   └── api/room/[code]/events/
│       └── route.ts                  # SSE endpoint
├── components/
│   ├── DashboardClient.tsx           # Dashboard (SSE + QR modal + settings)
│   ├── RoomSettingsDialog.tsx        # ตั้งค่าห้อง (ชื่อ, บัญชี, QR อัปโหลด)
│   ├── PaymentInfoCard.tsx           # แสดงข้อมูลชำระเงินให้ลูกค้า
│   ├── RequestCard.tsx               # Card คิวเพลง + ปุ่มเปลี่ยนสถานะ
│   ├── RequestForm.tsx               # ฟอร์มขอเพลง
│   ├── HomeTabs.tsx                  # Tab นักดนตรี/ลูกค้าบนหน้า landing
│   └── illustrations/               # SVG line-art components
└── lib/
    ├── actions.ts                    # Server Actions ทั้งหมด
    ├── prisma.ts                     # Prisma singleton
    └── utils.ts                     # cn() helper
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm prisma:migrate` | รัน `prisma migrate dev` |
| `npx prisma generate` | Regenerate Prisma client หลังแก้ schema |
| `npx prisma studio` | เปิด Prisma Studio |
