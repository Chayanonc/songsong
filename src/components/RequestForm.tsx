"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SuccessIllustration } from "@/components/illustrations/SuccessIllustration";
import { submitSongRequest } from "@/lib/actions";
import {
  IconCoin,
  IconHash,
  IconMicrophone,
  IconMusic,
  IconUser,
} from "@tabler/icons-react";

const schema = z.object({
  songName: z.string().min(1, "พิมพ์ชื่อเพลงที่อยากฟังหน่อยน้า 🎵"),
  bandName: z.string().optional(),
  customerName: z.string().optional(),
  tableNumber: z.string().optional(),
  tipAmount: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface RequestFormProps {
  roomCode: string;
}

export function RequestForm({ roomCode }: RequestFormProps) {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      songName: "",
      bandName: "",
      customerName: "",
      tableNumber: "",
      tipAmount: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setServerError("");

    const formData = new FormData();
    formData.set("roomCode", roomCode);
    formData.set("songName", values.songName);
    if (values.bandName) formData.set("bandName", values.bandName);
    if (values.customerName) formData.set("customerName", values.customerName);
    if (values.tableNumber) formData.set("tableNumber", values.tableNumber);
    if (values.tipAmount) formData.set("tipAmount", values.tipAmount);

    const result = await submitSongRequest(undefined, formData);
    if ("error" in result) {
      setServerError(result.error);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-6 py-10 px-6 text-center bg-card border border-border/80 rounded-2xl shadow-md shadow-primary/[0.01] animate-fade-in">
        <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <SuccessIllustration className="w-16 h-16" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">
            ส่งขอเพลงเรียบร้อยแล้วจ้า! 🎉
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ส่งคำขอเพลงไปถึงพี่นักดนตรีแล้วนะจ๊ะ เตรียมตัวฟินและรอฟังได้เลย! 🎤
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full h-10 rounded-xl font-medium text-xs border-border hover:bg-muted cursor-pointer transition-colors mt-2"
          onClick={() => {
            setSuccess(false);
            setServerError("");
            form.reset();
          }}
        >
          ขอเพลงเพิ่มอีกสักเพลง 🎶
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 bg-card border border-border/80 p-5 rounded-2xl shadow-sm"
      >
        {/* Group 1: Song Info */}
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="songName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <IconMusic className="w-3.5 h-3.5 text-primary" />
                  เพลงที่อยากฟัง 🎵 <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="เช่น วัดปะหล่ะ, เมษา"
                    {...field}
                    className="rounded-xl h-10 border-border focus-visible:ring-primary/20 bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bandName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <IconMicrophone className="w-3.5 h-3.5 text-muted-foreground/70" />
                  ชื่อนักร้อง / วงดนตรี 🎤
                  <span className="text-[10px] text-muted-foreground/50 font-normal ml-1">
                    (ถ้ามี)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="เช่น Three Man Down, Ink Waruntorn"
                    {...field}
                    className="rounded-xl h-10 border-border focus-visible:ring-primary/20 bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="opacity-60" />

        {/* Group 2: User details & Tip */}
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <IconUser className="w-3.5 h-3.5 text-muted-foreground/70" />
                  ชื่อเล่นคนขอ 👤
                  <span className="text-[10px] text-muted-foreground/50 font-normal ml-1">
                    (ไม่บังคับ)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="เช่น น้องส้ม, พี่เอก"
                    {...field}
                    className="rounded-xl h-10 border-border focus-visible:ring-primary/20 bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tableNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <IconHash className="w-3.5 h-3.5 text-muted-foreground/70" />
                  เลขโต๊ะของคุณ 📍
                  <span className="text-[10px] text-muted-foreground/50 font-normal ml-1">
                    (ไม่บังคับ)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="เช่น โต๊ะ 5, โต๊ะ VIP"
                    {...field}
                    className="rounded-xl h-10 border-border focus-visible:ring-primary/20 bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <IconCoin className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />
                  ทิปเล็ก ๆ น้อย ๆ เพื่อสนับสนุนนักดนตรี (บาท) 💸
                  <span className="text-[10px] text-muted-foreground/50 font-normal ml-1">
                    (ไม่บังคับ)
                  </span>
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="ใส่จำนวนเงินที่ต้องการสนับสนุนจ้า"
                      {...field}
                      className="rounded-xl h-10 border-border focus-visible:ring-primary/20 bg-background"
                    />

                    {/* Quick Tip Selection */}
                    <div className="flex gap-2 mt-1">
                      {["20", "50", "100", "200"].map((amount) => {
                        const isSelected = form.watch("tipAmount") === amount;
                        return (
                          <Button
                            key={amount}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              if (isSelected) {
                                form.setValue("tipAmount", "");
                              } else {
                                form.setValue("tipAmount", amount);
                              }
                            }}
                            className={`flex-1 h-8 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary shadow-sm scale-95"
                                : "hover:bg-primary/5 hover:text-primary hover:border-primary/30 border-border text-muted-foreground"
                            }`}
                          >
                            ฿{amount}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {serverError && (
          <p className="text-sm text-destructive text-center font-medium mt-1">
            {serverError}
          </p>
        )}
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full h-11 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/15 active:scale-98 mt-2"
          >
            {form.formState.isSubmitting
              ? "กำลังส่งเพลงขอไปที่เวทีน้า... 🚀"
              : "ส่งคำขอเพลงเลย! 🚀"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="w-full h-11 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-sm"
          >
            กลับหน้าหลัก
          </Button>
        </div>
      </form>
    </Form>
  );
}
