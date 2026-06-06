"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MusicNoteIllustration } from "@/components/illustrations/MusicNoteIllustration";
import { QrFrameIllustration } from "@/components/illustrations/QrFrameIllustration";
import { RequestCard } from "@/components/RequestCard";
import { closeRoom } from "@/lib/actions";
import { SongRequest } from "@prisma/client";
import {
  IconCoin,
  IconCopy,
  IconDoorExit,
  IconDownload,
  IconQrcode,
} from "@tabler/icons-react";
import { RoomSettingsDialog } from "@/components/RoomSettingsDialog";

const ROOM_KEY = "musician_room_code";

interface RoomSettings {
  musicianName: string | null;
  bankName: string | null;
  bankAccount: string | null;
  bankAccountName: string | null;
  paymentQrBase64: string | null;
}

interface DashboardClientProps {
  code: string;
  requestUrl: string;
  initialRequests: SongRequest[];
  initialSettings: RoomSettings;
}

export function DashboardClient({
  code,
  requestUrl,
  initialRequests,
  initialSettings,
}: DashboardClientProps) {
  const router = useRouter();
  const qrRef = useRef<HTMLDivElement>(null);
  const [requests, setRequests] = useState<SongRequest[]>(initialRequests);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    localStorage.setItem(ROOM_KEY, code);
  }, [code]);

  useEffect(() => {
    const es = new EventSource(`/api/room/${code}/events`);

    es.onmessage = (e) => {
      const msg = JSON.parse(e.data) as {
        type: "snapshot" | "added" | "updated";
        requests: SongRequest[];
      };

      if (msg.type === "snapshot") {
        setRequests(msg.requests);
      } else if (msg.type === "added") {
        setRequests((prev) => [...msg.requests, ...prev]);
      } else if (msg.type === "updated") {
        setRequests((prev) =>
          prev.map((r) => {
            const updated = msg.requests.find((u) => u.id === r.id);
            return updated ?? r;
          }),
        );
      }
    };

    return () => es.close();
  }, [code]);

  async function handleCloseRoom() {
    setIsClosing(true);
    const result = await closeRoom(code);
    if ("success" in result) {
      localStorage.removeItem(ROOM_KEY);
      router.push("/");
    } else {
      setIsClosing(false);
      setCloseDialogOpen(false);
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(requestUrl);
    toast.success("คัดลอกลิงก์สำหรับขอเพลงแล้ว!");
  }

  function handleDownloadQR() {
    const svgEl = qrRef.current?.querySelector("svg");
    if (!svgEl) return;
    const size = 512;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = `songsong-qr-${code}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = url;
  }

  const pending = requests.filter((r) => r.status === "PENDING");
  const playing = requests.filter((r) => r.status === "PLAYING");
  const done = requests.filter(
    (r) => r.status === "DONE" || r.status === "REJECTED",
  );

  // Statistics calculation
  const totalTipsSatang = requests
    .filter((r) => r.status !== "REJECTED")
    .reduce((acc, r) => acc + (r.tipAmount ?? 0), 0);
  const totalTipsDisplay = `฿${(totalTipsSatang / 100).toLocaleString("th-TH")}`;
  const totalRequests = requests.length;
  const completedRequests = requests.filter((r) => r.status === "DONE").length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              ห้องเปิดอยู่
            </span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-mono font-bold tracking-widest text-primary">
              {code}
            </h1>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg cursor-pointer hover:bg-primary/5 hover:text-primary transition-colors border-border shrink-0"
              onClick={handleCopyLink}
              title="คัดลอกลิงก์ขอเพลง"
            >
              <IconCopy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {/* Settings Dialog */}
          <RoomSettingsDialog code={code} initialSettings={initialSettings} />

          {/* QR Code Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-lg text-xs font-medium gap-1.5 border-border cursor-pointer"
              >
                <IconQrcode className="w-4 h-4" />
                <span className="hidden sm:inline">QR Code</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center gap-4 p-6 max-w-xs bg-background/95 backdrop-blur border-border rounded-2xl">
              <DialogHeader className="text-center">
                <DialogTitle className="text-base font-semibold">
                  สแกนเพื่อขอเพลง
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ลูกค้าสแกน QR Code นี้เพื่อเปิดหน้าจอส่งคำขอเพลง
                </p>
              </DialogHeader>
              <div className="relative flex items-center justify-center bg-white p-3 rounded-xl border border-muted/20 shadow-inner">
                <QrFrameIllustration className="absolute inset-0 w-full h-full text-primary opacity-30" />
                <div className="p-3" ref={qrRef}>
                  <QRCode value={requestUrl} size={160} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  รหัสสำหรับพิมพ์เข้าห้อง
                </p>
                <p className="font-mono text-xl font-bold tracking-widest text-primary mt-0.5">
                  {code}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 cursor-pointer"
                onClick={handleDownloadQR}
              >
                <IconDownload className="w-4 h-4" />
                ดาวน์โหลด QR Code
              </Button>
            </DialogContent>
          </Dialog>

          {/* Close Room */}
          <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="text-muted-foreground border-border hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 h-9 px-3 rounded-lg text-xs font-medium cursor-pointer transition-colors gap-1.5"
              >
                <IconDoorExit className="w-4 h-4" />
                <span className="hidden sm:inline">ปิดห้อง</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs rounded-2xl p-6 gap-4">
              <DialogHeader>
                <DialogTitle className="text-base font-semibold">
                  ปิดห้องนี้?
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  คำขอเพลงทั้งหมดในห้อง{" "}
                  <span className="font-mono font-bold text-foreground">
                    {code}
                  </span>{" "}
                  จะถูกลบถาวร และลูกค้าจะไม่สามารถเข้าห้องนี้ได้อีก
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-row gap-2 sm:justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isClosing}
                  onClick={() => setCloseDialogOpen(false)}
                  className="flex-1 sm:flex-none cursor-pointer"
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isClosing}
                  onClick={handleCloseRoom}
                  className="flex-1 sm:flex-none cursor-pointer"
                >
                  {isClosing ? "กำลังปิด..." : "ปิดห้อง"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator />

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="flex flex-col p-3.5 rounded-xl border border-border bg-card shadow-sm">
          <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            คิวเพลงทั้งหมด
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl font-bold font-mono text-foreground leading-none">
              {totalRequests}
            </span>
            <span className="text-xs text-muted-foreground">
              (เสร็จ {completedRequests})
            </span>
          </div>
        </div>

        <div className="flex flex-col p-3.5 rounded-xl border border-border bg-card shadow-sm">
          <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <IconCoin className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />
            ยอดทิปสะสม
          </span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 leading-none">
              {totalTipsDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* Playing now */}
      {playing.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
              กำลังเล่นอยู่
            </h2>
            <Badge className="px-1.5 py-0 text-[10px] rounded-full bg-primary/10 text-primary hover:bg-primary/20 border-none font-semibold">
              {playing.length}
            </Badge>
          </div>
          <div className="flex flex-col gap-2.5">
            {playing.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        </section>
      )}

      {/* Pending queue */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            คิวเพลงขอ
          </h2>
          <Badge
            variant="secondary"
            className="px-1.5 py-0 text-[10px] rounded-full bg-muted text-muted-foreground border-none font-semibold"
          >
            {pending.length}
          </Badge>
        </div>
        {pending.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground bg-muted/10 rounded-2xl border border-dashed border-border">
            <div className="p-4 rounded-full bg-muted/20 text-muted-foreground/50 border border-muted/20">
              <MusicNoteIllustration className="w-10 h-10" />
            </div>
            <div className="text-center px-4">
              <p className="text-sm font-medium text-foreground/80">
                ยังไม่มีคำขอเพลง
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                คัดลอกลิงก์หรือเปิด QR Code ด้านบนให้ลูกค้าสแกนเพื่อเริ่มขอเพลง
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {pending.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </section>

      {/* Done / Rejected */}
      {done.length > 0 && (
        <section className="flex flex-col gap-3">
          <Separator className="my-2" />
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              ประวัติเพลงที่เล่นแล้ว
            </h2>
            <Badge
              variant="outline"
              className="px-1.5 py-0 text-[10px] rounded-full text-muted-foreground/80 border-muted font-semibold"
            >
              {done.length}
            </Badge>
          </div>
          <div className="flex flex-col gap-2.5">
            {done.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
