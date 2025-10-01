import { Scale } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated scales icon */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-20">
            <Scale className="w-16 h-16 text-primary" />
          </div>
          <Scale className="w-16 h-16 text-primary animate-pulse" />
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">The Attorney</h2>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    </div>
  )
}
