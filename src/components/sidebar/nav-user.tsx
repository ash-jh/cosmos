"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function NavUser({ userEmail }: { userEmail?: string }) {
  const { signOut } = useAuthActions();

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8 border border-slate-700">
        <AvatarFallback className="bg-slate-800 text-blue-400 font-bold">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="hidden md:flex flex-col text-left">
        <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
          {userEmail || "Operator (RVCE)"}
        </span>
        <span className="text-[10px] text-slate-400">Flight Engineer</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          try {
            signOut();
          } catch (e) {
            console.log("Sign out triggered", e);
          }
        }}
        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-slate-800"
        title="Sign Out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
