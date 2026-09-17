import { cn } from "@/lib/utils"

export function StatusBadge({
  status,
  className,
}: {
  status: "nominal" | "warning" | "critical" | "offline" | "active" | "planning" | "completed" | string
  className?: string
}) {
  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "nominal":
      case "active":
        return "bg-green-500"
      case "warning":
      case "planning":
        return "bg-yellow-500"
      case "critical":
        return "bg-red-500"
      case "offline":
      case "archived":
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className={cn("inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium border", className)}>
      <div className={cn("w-2 h-2 rounded-full", getStatusColor(status))} />
      <span className="capitalize">{status}</span>
    </div>
  )
}
