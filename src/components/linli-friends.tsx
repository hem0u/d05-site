"use client"

import { useState, useEffect } from "react"
import { ExternalLink } from "lucide-react"
import type { Friend } from "@/data/friends"

export function LinliFriends() {
  const [friends, setFriends] = useState<Friend[]>([])

  useEffect(() => {
    fetch("/api/friends")
      .then((r) => r.json())
      .then((data) => setFriends(Array.isArray(data) ? data : (data.friends || [])))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-3 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1 scrollbar-thin">
      {friends.map((friend, idx) => (
        <a
          key={friend.name}
          href={friend.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-xl border border-border/20 hover:border-[hsl(var(--ark-amber)/0.3)] hover:bg-[hsl(var(--ark-amber)/0.03)] transition-all group"
          style={{ animationDelay: `${idx * 60}ms` }}
        >
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--ark-blue)/0.15)] flex items-center justify-center text-xs font-bold text-[hsl(var(--ark-blue))] shrink-0">
            {friend.avatar ? (
              <img src={friend.avatar} alt={friend.name} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              friend.name[0]
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium truncate">{friend.name}</span>
              <ExternalLink className="h-2.5 w-2.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            <p className="text-[10px] text-muted-foreground/50 truncate mt-0.5">{friend.description}</p>
          </div>
        </a>
      ))}
    </div>
  )
}
