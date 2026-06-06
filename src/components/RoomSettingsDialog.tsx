"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IconSettings, IconUpload, IconTrash } from "@tabler/icons-react";
import { updateRoomSettings } from "@/lib/actions";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomSettings {
  musicianName: string | null;
  bankName: string | null;
  bankAccount: string | null;
  bankAccountName: string | null;
  paymentQrBase64: string | null;
}

interface RoomSettingsDialogProps {
  code: string;
  initialSettings: RoomSettings;
}

export function RoomSettingsDialog({
  code,
  initialSettings,
}: RoomSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [musicianName, setMusicianName] = useState(
    initialSettings.musicianName ?? "",
  );
  const [bankName, setBankName] = useState(initialSettings.bankName ?? "");
  const [bankAccount, setBankAccount] = useState(
    initialSettings.bankAccount ?? "",
  );
  const [bankAccountName, setBankAccountName] = useState(
    initialSettings.bankAccountName ?? "",
  );
  const [paymentQr, setPaymentQr] = useState<string | null>(
    initialSettings.paymentQrBase64,
  );
  const [qrChanged, setQrChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleQrUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาเลือกเฉพาะไฟล์รูปภาพน้า 📸");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 512;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        setPaymentQr(canvas.toDataURL("image/jpeg", 0.85));
        setQrChanged(true);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveQr() {
    setPaymentQr(null);
    setQrChanged(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave() {
    if ((bankName || bankAccount) && !bankAccountName.trim()) {
      toast.error("อย่าลืมกรอกชื่อบัญชีธนาคารให้ครบถ้วนด้วยนะจ๊ะ");
      return;
    }
    setIsSaving(true);
    const result = await updateRoomSettings(code, {
      musicianName,
      bankName,
      bankAccount,
      bankAccountName,
      ...(qrChanged && { paymentQrBase64: paymentQr }),
    });
    setIsSaving(false);
    if ("success" in result) {
      toast.success("เย้! บันทึกข้อมูลเรียบร้อยแล้ว ✨");
      setQrChanged(false);
      setOpen(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 rounded-lg text-xs font-medium gap-1.5 border-border cursor-pointer"
        >
          <IconSettings className="w-4 h-4" />
          <span className="hidden sm:inline">ตั้งค่า</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-5 p-6 max-w-sm bg-background/95 backdrop-blur border-border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            ตั้งค่าห้องเพลงของคุณ ⚙️
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            เพิ่มรายละเอียดนักดนตรีและช่องทางการสนับสนุน (ทิป)
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Musician name */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">
              ชื่อพี่นักดนตรี / ชื่อวง 🎸
            </Label>
            <Input
              placeholder="เช่น วง The Acoustic, DJ สมชาย"
              value={musicianName}
              onChange={(e) => setMusicianName(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <Separator />

          {/* Bank info */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              ช่องทางการรับเงิน (ทิป)
            </p>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">เลือกธนาคาร / พร้อมเพย์</Label>
              <Select value={bankName} onValueChange={setBankName}>
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="ธนาคาร" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="กสิกรไทย">กสิกรไทย</SelectItem>
                    <SelectItem value="ไทยพาณิชย์">ไทยพาณิชย์</SelectItem>
                    <SelectItem value="กรุงเทพ">กรุงเทพ</SelectItem>
                    <SelectItem value="กรุงไทย">กรุงไทย</SelectItem>
                    <SelectItem value="ทหารไทยธนชาต">ทหารไทยธนชาต</SelectItem>
                    <SelectItem value="กรุงศรีอยุธยา">กรุงศรีอยุธยา</SelectItem>
                    <SelectItem value="ออมสิน">ออมสิน</SelectItem>
                    <SelectItem value="ธ.ก.ส.">ธ.ก.ส.</SelectItem>
                    <SelectItem value="พร้อมเพย์">พร้อมเพย์</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">เลขบัญชี / เบอร์พร้อมเพย์</Label>
              <Input
                placeholder="เช่น 123-4-56789-0"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="h-9 text-sm font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">
                ชื่อบัญชีผู้รับเงิน{" "}
                {(bankName || bankAccount) && (
                  <span className="text-destructive">*</span>
                )}
              </Label>
              <Input
                placeholder="กรอกชื่อ-นามสกุลผู้รับเงิน"
                value={bankAccountName}
                onChange={(e) => setBankAccountName(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* Payment QR */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              รูป QR Code รับเงิน (เช่น พร้อมเพย์)
            </p>
            {paymentQr ? (
              <div className="flex flex-col gap-2 items-center">
                <div className="relative w-40 h-40 border border-border rounded-xl overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={paymentQr}
                    alt="QR Code รับเงิน"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/5 gap-1.5 cursor-pointer"
                  onClick={handleRemoveQr}
                >
                  <IconTrash className="w-3.5 h-3.5" />
                  ลบรูป QR Code ออก 🗑️
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 py-6 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/40 hover:text-primary/60 transition-colors cursor-pointer"
              >
                <IconUpload className="w-6 h-6" />
                <span className="text-xs">กดตรงนี้เพื่ออัปโหลดรูป QR Code รับเงิน 📸</span>
                <span className="text-[10px] text-muted-foreground/60">
                  รองรับไฟล์ PNG และ JPG จ้า
                </span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleQrUpload}
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-9 text-sm font-medium cursor-pointer"
        >
          {isSaving ? "กำลังบันทึกข้อมูล... 💾" : "บันทึกข้อมูล ✨"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
