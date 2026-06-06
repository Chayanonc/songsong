"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  IconCopy,
  IconCheck,
  IconBuildingBank,
  IconWallet,
} from "@tabler/icons-react";
import Image from "next/image";

interface PaymentInfoCardProps {
  musicianName: string | null;
  bankName: string | null;
  bankAccount: string | null;
  bankAccountName: string | null;
  paymentQrBase64: string | null;
}

export function PaymentInfoCard({
  musicianName,
  bankName,
  bankAccount,
  bankAccountName,
  paymentQrBase64,
}: PaymentInfoCardProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!bankAccount) return;
    navigator.clipboard.writeText(bankAccount);
    setCopied(true);
    toast.success("คัดลอกเลขบัญชีเรียบร้อยแล้ว!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4 bg-card border border-border/80 rounded-2xl p-5 shadow-sm animate-fade-in">
      <div className="flex items-center gap-2 pb-1 border-b border-muted/30">
        <IconWallet className="w-4 h-4 text-emerald-500" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          ช่องทางสนับสนุน & ทิป
        </h3>
      </div>

      {paymentQrBase64 && (
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="bg-white p-3.5 rounded-2xl border border-muted/20 shadow-inner flex items-center justify-center">
            <Image
              width={140}
              height={140}
              src={paymentQrBase64}
              alt="QR Code สำหรับโอนเงิน"
              className="object-contain rounded-lg"
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-center font-medium mt-1">
            สแกน QR Code ด้วยแอปธนาคารเพื่อโอนทิป
          </p>
        </div>
      )}

      {(bankName || bankAccount || bankAccountName) && (
        <div className="flex items-center justify-between gap-4 bg-muted/25 hover:bg-muted/40 transition-colors rounded-xl px-4 py-3 border border-border/50 mt-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-background border border-border text-muted-foreground shrink-0">
              <IconBuildingBank className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold truncate">
                {bankName || "ธนาคาร"}
              </span>
              {bankAccountName && (
                <span className="text-sm font-semibold text-foreground mt-0.5 truncate">
                  {bankAccountName}
                </span>
              )}
              <span className="text-sm font-mono font-bold text-foreground tracking-wider mt-0.5 truncate">
                {bankAccount || "-"}
              </span>
            </div>
          </div>

          {bankAccount && (
            <Button
              variant="outline"
              size="icon"
              type="button"
              className="h-8 w-8 rounded-lg cursor-pointer border-border hover:bg-primary/5 hover:text-primary transition-all duration-200 shrink-0"
              onClick={handleCopy}
              title="คัดลอกเลขบัญชี"
            >
              {copied ? (
                <IconCheck className="w-4 h-4 text-emerald-500" />
              ) : (
                <IconCopy className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
