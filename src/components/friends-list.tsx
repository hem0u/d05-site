"use client"

import { useState, useEffect } from "react"
import { ExternalLink } from "lucide-react"
import type { Friend } from "@/data/friends"

export function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([])

  useEffect(() => {
    fetch("/api/friends")
      .then((r) => r.json())
      .then((data) => setFriends(Array.isArray(data) ? data : (data.friends || [])))
      .catch(() => {})
  }, [])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {friends.map((friend, i) => (
        <a
          key={friend.name}
          href={friend.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block animate-slide-up group"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="h-full rounded-xl border border-border/20 bg-card/50 backdrop-blur-sm p-5 hover:border-[hsl(var(--ark-amber)/0.2)] hover:bg-card/70 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[hsl(var(--ark-amber)/0.03)]">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-muted/60 border border-border/30 flex items-center justify-center overflow-hidden mx-auto mb-3 group-hover:border-[hsl(var(--ark-amber)/0.3)] transition-colors duration-500">
              {friend.avatar ? (
                <img src={friend.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-lg font-bold text-muted-foreground/50 group-hover:text-[hsl(var(--ark-amber)/0.6)] transition-colors duration-500">
                  {friend.name[0]}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <h3 className="font-serif text-sm font-bold group-hover:text-[hsl(var(--ark-amber))] transition-colors duration-300">
                  {friend.name}
                </h3>
                <ExternalLink className="h-3 w-3 text-muted-foreground/20 group-hover:text-[hsl(var(--ark-amber)/0.4)] transition-colors shrink-0" />
              </div>
              <p className="text-[11px] text-muted-foreground/50 leading-relaxed">
                {friend.description}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

export function RandomVisit() {
  const [friends, setFriends] = useState<Friend[]>([])

  useEffect(() => {
    fetch("/api/friends")
      .then((r) => r.json())
      .then((data) => setFriends(Array.isArray(data) ? data : (data.friends || [])))
      .catch(() => {})
  }, [])

  const go = () => {
    if (friends.length === 0) return
    const friend = friends[Math.floor(Math.random() * friends.length)]
    window.open(friend.url, "_blank", "noopener noreferrer")
  }

  return (
    <button
      onClick={go}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/20 bg-card/40 backdrop-blur-sm text-xs tracking-widest uppercase text-muted-foreground/50 hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.3)] transition-all duration-300"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="shrink-0">
        <path d="M1 7h10M8 3l4 4-4 4" />
        <path d="M10 5l2 2-2 2" />
      </svg>
      随机串门
    </button>
  )
}
