import type { ChangelogEntry } from "@/lib/changelog-db"

const typeConfig: Record<string, { label: string; color: string }> = {
  feat: { label: "新功能", color: "bg-emerald-500/15 text-emerald-400" },
  fix: { label: "修复", color: "bg-amber-500/15 text-amber-400" },
  update: { label: "更新", color: "bg-blue-500/15 text-blue-400" },
}

export function LinliUpdates({ entries }: { entries: ChangelogEntry[] }) {
  return (
    <div className="space-y-0">
      {entries.map((entry, idx) => {
        const config = typeConfig[entry.type] ?? typeConfig.update
        return (
          <div
            key={entry.id}
            className="relative pl-5 pb-4 animate-fade-in"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            {/* Timeline line */}
            {idx < entries.length - 1 && (
              <div className="absolute left-[7px] top-3 bottom-0 w-px bg-border/30" />
            )}
            {/* Dot */}
            <div className="absolute left-1 top-2 w-1.5 h-1.5 rounded-full bg-[hsl(var(--ark-amber)/0.4)]" />

            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium tracking-wider ${config.color}`}>
                {config.label}
              </span>
              <span className="text-[10px] text-muted-foreground/40">{entry.date}</span>
            </div>
            <p className="text-xs text-muted-foreground/70 leading-relaxed">{entry.content}</p>
          </div>
        )
      })}
    </div>
  )
}
