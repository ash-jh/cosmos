"use client"
"use client";

import { useAuthActions } from "@convex-dev/auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function NavUser({ name, email, avatarUrl }: { name: string, email: string, avatarUrl?: string }) {
  const { signOut } = useAuthActions()
export function NavUser({ userEmail }: { userEmail?: string }) {
  const { signOut } = useAuthActions();

  return (
    <div className="flex items-center gap-3 p-4 border-t bg-slate-50">
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8 border border-slate-700">
        <AvatarFallback className="bg-slate-800 text-blue-400 font-bold">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1 overflow-hidden">
        <span className="text-sm font-medium truncate">{name}</span>
        <span className="text-xs text-gray-500 truncate">{email}</span>
      <div className="hidden md:flex flex-col text-left">
        <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
          {userEmail || "Operator (RVCE)"}
        </span>
        <span className="text-[10px] text-slate-400">Flight Engineer</span>
      </div>
      <Button variant="ghost" size="icon" onClick={() => void signOut()}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => signOut()}
        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-slate-800"
        title="Sign Out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
  );
}
