"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { updateRequestStatus } from "@/lib/actions";
import { SongRequest, RequestStatus } from "@prisma/client";
import {
  IconCheck,
  IconClock,
  IconEye,
  IconPlayerPlay,
  IconPlayerSkipForward,
} from "@tabler/icons-react";

const STATUS_LABEL: Record<RequestStatus, string> = {
  PENDING: "รอคิว 🕒",
  PLAYING: "กำลังเล่น 🎤",
  DONE: "เล่นจบแล้ว 🎉",
  REJECTED: "ข้ามไปก่อน",
};

const STATUS_VARIANT: Record<
  RequestStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  PLAYING: "default",
  DONE: "secondary",
  REJECTED: "destructive",
};

export function RequestCard({ request }: { request: SongRequest }) {
  const [status, setStatus] = useState<RequestStatus>(request.status);
  const [loading, setLoading] = useState(false);

  async function changeStatus(next: RequestStatus) {
    setLoading(true);
    const result = await updateRequestStatus(request.id, next);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      setStatus(next);
    }
    setLoading(false);
  }

  const tipDisplay =
    request.tipAmount != null
      ? `฿${(request.tipAmount / 100).toFixed(0)}`
      : null;

  const timeString = new Date(request.createdAt).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Styles based on status
  const isPlaying = status === "PLAYING";
  const isDoneOrRejected = status === "DONE" || status === "REJECTED";

  if (isPlaying) {
    return (
      <Card className="w-full border-primary/20 bg-primary/[0.015] shadow-md shadow-primary/[0.02] transition-all duration-300">
        <CardContent className="p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left Section: Song details & Meta info */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            {/* Active status indicator */}
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                กำลังเล่นอยู่จ้า 🎤
              </span>
            </div>

            {/* Song Title & Artist */}
            <div>
              <h3 className="font-semibold text-lg leading-tight tracking-tight text-foreground">
                {request.songName}
              </h3>
              {request.bandName && (
                <p className="text-sm text-muted-foreground font-medium mt-0.5">
                  {request.bandName}
                </p>
              )}
            </div>

            {/* Meta Row */}
            <div className="flex items-center flex-wrap gap-2.5 text-xs text-muted-foreground mt-0.5">
              {request.tableNumber && (
                <span className="font-medium text-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
                  โต๊ะ {request.tableNumber}
                </span>
              )}
              {request.customerName && (
                <span>
                  ขอโดยคุณ{" "}
                  <span className="font-medium text-foreground/80">
                    {request.customerName}
                  </span>
                </span>
              )}
              <span className="text-muted-foreground/30">•</span>
              <span
                className="font-mono flex items-center gap-1 text-[11px]"
                suppressHydrationWarning
              >
                <IconClock className="w-3.5 h-3.5 opacity-60" />
                {timeString}
              </span>
            </div>
          </div>

          {/* Right Section: Tip & Finish Button */}
          <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t border-muted/20 pt-3 md:border-none md:pt-0">
            {tipDisplay && (
              <div className="flex flex-col items-start md:items-end">
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                  ทิป
                </span>
                <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 leading-tight">
                  {tipDisplay}
                </span>
              </div>
            )}

            <Button
              size="sm"
              onClick={() => changeStatus("DONE")}
              disabled={loading}
              className="gap-1.5 h-9 px-3 sm:px-4 rounded-lg font-medium text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 cursor-pointer shadow-sm active:scale-98 ml-auto md:ml-0"
            >
              <IconCheck className="w-4 h-4" />
              <span className="hidden sm:inline">เล่นจบแล้วจ้า 🎉</span>
              <span className="sm:hidden">จบเพลง</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Layout for PENDING or DONE/REJECTED
  return (
    <Card
      className={`w-full overflow-hidden transition-all duration-300 border ${
        isDoneOrRejected
          ? "opacity-60 bg-muted/30 border-muted"
          : "border-border hover:border-muted-foreground/15 hover:shadow-sm"
      }`}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        {/* Top: Song Info & Tip/Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[15px] md:text-base leading-tight tracking-tight text-foreground truncate">
              {request.songName}
            </h3>
            {request.bandName && (
              <p className="text-xs md:text-sm text-muted-foreground font-medium truncate mt-0.5">
                {request.bandName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {tipDisplay && (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm mr-1">
                +{tipDisplay}
              </span>
            )}
            <Badge
              variant={STATUS_VARIANT[status]}
              className="text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-full"
            >
              {STATUS_LABEL[status]}
            </Badge>
          </div>
        </div>

        {/* Middle: Meta Row */}
        <div className="flex items-center justify-between gap-2 border-t border-muted/20 pt-2.5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {request.tableNumber && (
              <span className="font-medium text-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
                โต๊ะ {request.tableNumber}
              </span>
            )}
            {request.customerName && (
              <span>
                ขอโดยคุณ{" "}
                <span className="font-medium text-foreground/80">
                  {request.customerName}
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 text-muted-foreground/60 text-[10px] md:text-xs font-mono"
              suppressHydrationWarning
            >
              <IconClock className="w-3 h-3" />
              <span>{timeString}</span>
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        {status === "PENDING" && (
          <div className="flex gap-2 pt-1.5 border-t border-muted/20">
            <Button
              size="sm"
              onClick={() => changeStatus("PLAYING")}
              disabled={loading}
              className="flex-1 gap-1 h-8 rounded-lg font-medium text-xs transition-all duration-200 cursor-pointer shadow-sm active:scale-98"
            >
              <IconPlayerPlay className="w-3.5 h-3.5 fill-current" />
              ร้องเพลงนี้เลย 🎤
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => changeStatus("DONE")}
              disabled={loading}
              className="flex-1 gap-1 h-8 rounded-lg font-medium text-xs hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/20 transition-all duration-200 cursor-pointer"
            >
              <IconCheck className="w-3.5 h-3.5" />
              เล่นจบแล้ว 🎉
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => changeStatus("REJECTED")}
              disabled={loading}
              className="gap-1 h-8 px-2.5 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 cursor-pointer"
            >
              <IconPlayerSkipForward className="w-3.5 h-3.5" />
              ข้ามไปก่อน
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
