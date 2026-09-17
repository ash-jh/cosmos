import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "./status-badge"
import { Zap, Compass, Cpu, Radio, Package, Thermometer } from "lucide-react"

interface SubsystemCardProps {
  name: "EPS" | "ADCS" | "OBC" | "COMM" | "PAYLOAD" | "THERMAL" | string
  status: string
  metricHighlights?: string
  channelCount?: number
  onViewDetails?: () => void
}

export function SubsystemCard({ name, status, metricHighlights, channelCount, onViewDetails }: SubsystemCardProps) {
  const getIcon = (n: string) => {
    switch (n) {
      case "EPS": return <Zap className="w-5 h-5" />
      case "ADCS": return <Compass className="w-5 h-5" />
      case "OBC": return <Cpu className="w-5 h-5" />
      case "COMM": return <Radio className="w-5 h-5" />
      case "PAYLOAD": return <Package className="w-5 h-5" />
      case "THERMAL": return <Thermometer className="w-5 h-5" />
      default: return <Cpu className="w-5 h-5" />
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {getIcon(name)}
          {name}
        </CardTitle>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {metricHighlights || `${channelCount || 0} channels`}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
