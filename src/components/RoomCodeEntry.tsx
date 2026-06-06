"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RoomCodeEntry() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("กรุณาใส่รหัสห้อง");
      return;
    }
    router.push(`/room/${trimmed}/request`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        value={code}
        onChange={(e) => {
          setCode(e.target.value.toUpperCase());
          setError("");
        }}
        placeholder="เช่น AX7K2P"
        maxLength={6}
        className="text-center font-semibold tracking-widest uppercase"
      />
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
      <Button type="submit" variant="outline" className="w-full">
        เข้าห้อง
      </Button>
    </form>
  );
}
