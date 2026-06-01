"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard, FileText, BookOpen, Calendar, Heart, Users,
  MessageSquare, Link2, Clock, LogOut, Menu, X, Trash2, Shield,
} from "lucide-react"
import { BlogEditor } from "@/components/blog-editor"
import { HobbyEditor } from "@/components/hobby-editor"
import { DashboardCharts } from "@/components/dashboard-charts"

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function tomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

type Section = "dashboard" | "blog" | "records" | "schedule" | "hobbies" | "friends" | "guestbook" | "users" | "changelog"

const sections: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard", label: "仪表盘", icon: <LayoutDashboard className="h-4 w-4" /> },
  { key: "blog", label: "博客管理", icon: <FileText className="h-4 w-4" /> },
  { key: "records", label: "记录管理", icon: <BookOpen className="h-4 w-4" /> },
  { key: "schedule", label: "日程管理", icon: <Calendar className="h-4 w-4" /> },
  { key: "hobbies", label: "好物管理", icon: <Heart className="h-4 w-4" /> },
  { key: "friends", label: "友链管理", icon: <Link2 className="h-4 w-4" /> },
  { key: "guestbook", label: "留言管理", icon: <MessageSquare className="h-4 w-4" /> },
  { key: "users", label: "用户管理", icon: <Users className="h-4 w-4" /> },
  { key: "changelog", label: "更新记录", icon: <Clock className="h-4 w-4" /> },
]

export default function AdminPage() {
  const router = useRouter()
  const [section, setSection] = useState<Section>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [msg, setMsg] = useState("")

  // Blog state
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [blogEditing, setBlogEditing] = useState<any | null>(null)
  const [blogNew, setBlogNew] = useState(false)

  // Records state
  const [diaryEntries, setDiaryEntries] = useState<any[]>([])
  const [diaryEditing, setDiaryEditing] = useState<any | null>(null)
  const [diaryNew, setDiaryNew] = useState(false)
  const [diaryForm, setDiaryForm] = useState<{ date: string; content: string; photos: string[] }>({ date: "", content: "", photos: [] })

  // Schedule state
  const [schedules, setSchedules] = useState<any[]>([])
  const [scheduleForm, setScheduleForm] = useState({ date: "", content: "" })
  const [scheduleEditDate, setScheduleEditDate] = useState<string | null>(null)

  // Hobbies state
  const [hobbies, setHobbies] = useState<any[]>([])
  const [hobbyEditing, setHobbyEditing] = useState<any | null>(null)
  const [hobbyNew, setHobbyNew] = useState(false)

  // Friends state
  const [friends, setFriends] = useState<any[]>([])
  const [friendForm, setFriendForm] = useState({ name: "", url: "", description: "", avatar: "" })
  const [friendEditName, setFriendEditName] = useState<string | null>(null)

  // Guestbook state
  const [messages, setMessages] = useState<any[]>([])

  // Users state
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState({ posts: 0, comments: 0, users: 0, messages: 0 })

  // Changelog state
  const [changelog, setChangelog] = useState<any[]>([])
  const [clForm, setClForm] = useState({ date: today(), content: "", type: "update" as "fix" | "feat" | "update" })

  const toast = (text: string) => {
    setMsg(text)
    setTimeout(() => setMsg(""), 2000)
  }

  const handleDiaryPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const canvas = document.createElement("canvas")
      canvas.width = 1200; canvas.height = 1200
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const img = new Image()
      img.onload = () => {
        const size = Math.min(img.width, img.height)
        const sx = (img.width - size) / 2; const sy = (img.height - size) / 2
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 1200, 1200)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85)
        setDiaryForm((prev) => ({ ...prev, photos: [...prev.photos, dataUrl] }))
      }
      img.src = URL.createObjectURL(file)
    })
    e.target.value = ""
  }

  const removeDiaryPhoto = (idx: number) => {
    setDiaryForm((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }))
  }

  // ---- Data fetchers ----
  const fetchBlogPosts = useCallback(async () => {
    const res = await fetch("/api/blog")
    const data = await res.json()
    setBlogPosts(Array.isArray(data.posts) ? data.posts : [])
  }, [])

  const fetchDiary = useCallback(async () => {
    const res = await fetch("/api/diary")
    const data = await res.json()
    setDiaryEntries(Array.isArray(data.entries) ? data.entries : Array.isArray(data) ? data : [])
  }, [])

  const fetchSchedules = useCallback(async () => {
    const res = await fetch("/api/schedule")
    const data = await res.json()
    const list = Array.isArray(data) ? data : (data.schedules || [])
    setSchedules(Array.isArray(list) ? list : [])
  }, [])

  const fetchHobbies = useCallback(async () => {
    const res = await fetch("/api/hobbies")
    const data = await res.json()
    setHobbies(Array.isArray(data.hobbies) ? data.hobbies : [])
  }, [])

  const fetchFriends = useCallback(async () => {
    const res = await fetch("/api/friends")
    const data = await res.json()
    setFriends(Array.isArray(data.friends) ? data.friends : [])
  }, [])

  const fetchMessages = useCallback(async () => {
    const res = await fetch("/api/guestbook")
    const data = await res.json()
    setMessages(Array.isArray(data.messages) ? data.messages : [])
  }, [])

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users")
    const data = await res.json()
    setUsers(data.users || [])
  }, [])

  const fetchChangelog = useCallback(async () => {
    const res = await fetch("/api/admin/changelog")
    const data = await res.json()
    setChangelog(data.entries || [])
  }, [])

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats")
    const data = await res.json()
    setStats(data)
  }, [])

  useEffect(() => {
    fetchStats()
    fetchBlogPosts()
    fetchDiary()
    fetchSchedules()
    fetchHobbies()
    fetchFriends()
    fetchMessages()
    fetchUsers()
    fetchChangelog()
  }, [])

  // ---- Blog actions ----
  const deletePost = async (slug: string) => {
    if (!confirm("确定删除这篇文章？")) return
    await fetch(`/api/blog/${slug}`, { method: "DELETE" })
    toast("已删除")
    fetchBlogPosts()
  }

  // ---- Diary actions ----
  const saveDiary = async () => {
    const res = await fetch("/api/diary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: diaryForm.date, content: diaryForm.content, photos: diaryForm.photos }),
    })
    if (res.ok) {
      toast("已保存")
      setDiaryNew(false)
      setDiaryEditing(null)
      fetchDiary()
    }
  }

  const deleteDiary = async (date: string) => {
    if (!confirm("确定删除这条记录？")) return
    await fetch("/api/diary", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    })
    toast("已删除")
    fetchDiary()
  }

  // ---- Schedule actions ----
  const saveSchedule = async () => {
    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scheduleForm),
    })
    if (res.ok) {
      toast("已保存")
      setScheduleForm({ date: "", content: "" })
      setScheduleEditDate(null)
      fetchSchedules()
    }
  }

  const deleteSchedule = async (date: string) => {
    if (!confirm("确定删除？")) return
    await fetch("/api/schedule", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    })
    toast("已删除")
    fetchSchedules()
  }

  // ---- Friends actions ----
  const saveFriend = async () => {
    const res = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(friendForm),
    })
    if (res.ok) {
      toast(friendEditName ? "已更新" : "已添加")
      setFriendForm({ name: "", url: "", description: "", avatar: "" })
      setFriendEditName(null)
      fetchFriends()
    }
  }

  const deleteFriend = async (name: string) => {
    if (!confirm("确定删除？")) return
    await fetch(`/api/friends?name=${encodeURIComponent(name)}`, { method: "DELETE" })
    toast("已删除")
    fetchFriends()
  }

  // ---- Guestbook actions ----
  const deleteMessage = async (id: number) => {
    if (!confirm("确定删除这条留言？")) return
    await fetch(`/api/guestbook?id=${id}`, { method: "DELETE" })
    toast("已删除")
    fetchMessages()
  }

  // ---- User actions ----
  const setUserRole = async (userId: number, role: string) => {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    })
    toast("角色已更新")
    fetchUsers()
  }

  const deleteUser = async (userId: number) => {
    if (!confirm("确定删除该用户？此操作不可撤销。")) return
    await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" })
    toast("用户已删除")
    fetchUsers()
  }

  // ---- Changelog actions ----
  const addChangelog = async () => {
    const res = await fetch("/api/admin/changelog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clForm),
    })
    if (res.ok) {
      toast("已添加")
      setClForm({ date: today(), content: "", type: "update" })
      fetchChangelog()
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/"
  }

  // ---- Render helpers ----
  const btnClass = "px-3 py-1.5 text-xs tracking-wider rounded-lg border border-border/30 text-muted-foreground hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.4)] transition-colors"
  const btnPrimary = "px-3 py-1.5 text-xs tracking-wider rounded-lg bg-[hsl(var(--ark-amber)/0.15)] text-[hsl(var(--ark-amber))] hover:bg-[hsl(var(--ark-amber)/0.25)] transition-colors disabled:opacity-30"
  const inputClass = "w-full px-3 py-1.5 text-sm bg-muted/30 border border-border/20 rounded-lg outline-none focus:border-[hsl(var(--ark-amber)/0.3)]"
  const thClass = "text-left text-xs text-muted-foreground/60 font-normal py-2 px-3"
  const tdClass = "py-2 px-3 text-sm border-t border-border/10"

  return (
    <div className="flex min-h-[calc(100vh-6rem)]">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-3 z-50 lg:hidden p-1.5 rounded-lg border border-border/30 text-muted-foreground bg-card/90 backdrop-blur"
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-full lg:h-auto w-52 shrink-0
        border-r border-border/10 bg-card/60 backdrop-blur-xl
        transition-transform lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        pt-16 lg:pt-0 overflow-y-auto
      `}>
        <div className="px-4 py-4">
          <h2 className="text-sm font-bold tracking-widest mb-4 px-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-[hsl(var(--ark-amber))]" />
            管理后台
          </h2>
          <nav className="space-y-0.5">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => { setSection(s.key); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs tracking-wider rounded-lg transition-colors ${
                  section === s.key
                    ? "bg-[hsl(var(--ark-amber)/0.1)] text-[hsl(var(--ark-amber))]"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/20"
                }`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="px-4 pb-4 mt-4 border-t border-border/10 pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs tracking-wider rounded-lg text-muted-foreground/40 hover:text-red-400 hover:bg-red-400/5 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            退出登录
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-background/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 lg:pl-6 pt-2">
        {msg && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-[hsl(var(--ark-amber)/0.15)] text-[hsl(var(--ark-amber))] text-xs tracking-wider shadow-lg">
            {msg}
          </div>
        )}

        {/* === DASHBOARD === */}
        {section === "dashboard" && (
          <div className="space-y-6">
            <h1 className="text-lg font-bold tracking-wider">仪表盘</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "博客文章", value: stats.posts },
                { label: "评论数", value: stats.comments },
                { label: "留言数", value: stats.messages },
                { label: "用户数", value: stats.users },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl border border-border/20 bg-card/60">
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-[10px] text-muted-foreground/40 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <DashboardCharts stats={stats} blogPosts={blogPosts} users={users} />
          </div>
        )}

        {/* === BLOG === */}
        {section === "blog" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold tracking-wider">博客管理</h1>
              <button onClick={() => setBlogNew(true)} className={btnPrimary}>写文章</button>
            </div>

            <div className="space-y-1">
              {blogPosts.map((p: any) => (
                <div key={p.slug} className="flex items-center justify-between p-3 rounded-lg border border-border/10 bg-muted/5">
                  <div className="min-w-0 flex-1">
                    <span className="text-sm truncate block">{p.title}</span>
                    <span className="text-[10px] text-muted-foreground/40">{p.date} · {p.slug}</span>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-3">
                    <button onClick={() => setBlogEditing(p)} className={btnClass}>编辑</button>
                    <button onClick={() => deletePost(p.slug)} className={btnClass}>删除</button>
                  </div>
                </div>
              ))}
              {blogPosts.length === 0 && <p className="text-xs text-muted-foreground/30 py-8 text-center">暂无文章</p>}
            </div>

            {blogNew && (
              <BlogEditor onSaved={() => { setBlogNew(false); fetchBlogPosts() }} onClose={() => setBlogNew(false)} />
            )}
            {blogEditing && (
              <BlogEditor existing={blogEditing} onSaved={() => { setBlogEditing(null); fetchBlogPosts() }} onClose={() => setBlogEditing(null)} />
            )}
          </div>
        )}

        {/* === RECORDS === */}
        {section === "records" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold tracking-wider">记录管理</h1>
              <button onClick={() => { setDiaryForm({ date: today(), content: "", photos: [] }); setDiaryNew(true) }} className={btnPrimary}>新记录</button>
            </div>

            <div className="space-y-1">
              {diaryEntries.map((e: any) => (
                <div key={e.date} className="flex items-center justify-between p-3 rounded-lg border border-border/10 bg-muted/5">
                  <div className="min-w-0 flex-1">
                    <span className="text-sm">{e.date}</span>
                    <span className="text-xs text-muted-foreground/50 ml-2 truncate">{e.content?.slice(0, 40)}</span>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-3">
                    <button onClick={() => { setDiaryForm({ date: e.date, content: e.content, photos: e.photos || [] }); setDiaryEditing(e) }} className={btnClass}>编辑</button>
                    <button onClick={() => deleteDiary(e.date)} className={btnClass}>删除</button>
                  </div>
                </div>
              ))}
              {diaryEntries.length === 0 && <p className="text-xs text-muted-foreground/30 py-8 text-center">暂无记录</p>}
            </div>

            {(diaryNew || diaryEditing) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm" onClick={() => { setDiaryNew(false); setDiaryEditing(null) }}>
                <div className="p-6 rounded-2xl border border-border/20 bg-card/95 backdrop-blur-xl w-full max-w-lg mx-4 space-y-3" onClick={(e) => e.stopPropagation()}>
                  <h2 className="font-bold text-sm">{diaryEditing ? "编辑记录" : "新记录"}</h2>
                  <input value={diaryForm.date} onChange={(e) => setDiaryForm({ ...diaryForm, date: e.target.value })} placeholder="日期 YYYY-MM-DD" className={inputClass} />
                  <textarea value={diaryForm.content} onChange={(e) => setDiaryForm({ ...diaryForm, content: e.target.value })} rows={4} placeholder="内容" className={inputClass} />
                  <div className="space-y-2">
                    <label className="text-[10px] text-muted-foreground/40">照片</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleDiaryPhoto}
                      className="hidden"
                      id="diary-photo-input"
                    />
                    <div className="flex flex-wrap gap-2">
                      {diaryForm.photos.map((src, i) => (
                        <div key={i} className="relative inline-block">
                          <img src={src} alt="" className="w-16 h-16 rounded-lg object-cover border border-border/20" />
                          <button
                            onClick={() => removeDiaryPhoto(i)}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-black/60 hover:bg-black/80 text-white/70 hover:text-white flex items-center justify-center text-[10px] transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => document.getElementById("diary-photo-input")?.click()}
                        className="w-16 h-16 rounded-lg border-2 border-dashed border-border/20 hover:border-[hsl(var(--ark-amber)/0.4)] flex items-center justify-center text-muted-foreground/30 hover:text-[hsl(var(--ark-amber))] transition-all text-2xl"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveDiary} className={btnPrimary}>保存</button>
                    <button onClick={() => { setDiaryNew(false); setDiaryEditing(null) }} className={btnClass}>取消</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === SCHEDULE === */}
        {section === "schedule" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold tracking-wider">日程管理</h1>
              <button onClick={() => { setScheduleForm({ date: tomorrow(), content: "" }); setScheduleEditDate(null) }} className={btnPrimary}>新日程</button>
            </div>

            <div className="space-y-1">
              {schedules.map((s: any) => (
                <div key={s.date} className="flex items-center justify-between p-3 rounded-lg border border-border/10 bg-muted/5">
                  <div className="min-w-0 flex-1">
                    <span className="text-sm">{s.date}</span>
                    <span className="text-xs text-muted-foreground/50 ml-2 truncate">{s.content?.slice(0, 40)}</span>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-3">
                    <button onClick={() => { setScheduleForm({ date: s.date, content: s.content }); setScheduleEditDate(s.date) }} className={btnClass}>编辑</button>
                    <button onClick={() => deleteSchedule(s.date)} className={btnClass}>删除</button>
                  </div>
                </div>
              ))}
              {schedules.length === 0 && <p className="text-xs text-muted-foreground/30 py-8 text-center">暂无日程</p>}
            </div>

            {(scheduleEditDate !== null || scheduleForm.date) && (
              <div className="p-4 rounded-xl border border-border/20 bg-muted/5 space-y-3">
                <h3 className="text-sm font-bold">{scheduleEditDate ? "编辑日程" : "新日程"}</h3>
                <input value={scheduleForm.date} onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })} placeholder="日期" className={inputClass} />
                <textarea value={scheduleForm.content} onChange={(e) => setScheduleForm({ ...scheduleForm, content: e.target.value })} rows={3} placeholder="内容" className={inputClass} />
                <div className="flex gap-2">
                  <button onClick={saveSchedule} className={btnPrimary}>保存</button>
                  <button onClick={() => { setScheduleForm({ date: "", content: "" }); setScheduleEditDate(null) }} className={btnClass}>取消</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === HOBBIES === */}
        {section === "hobbies" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold tracking-wider">好物管理</h1>
              <button onClick={() => setHobbyNew(true)} className={btnPrimary}>添加好物</button>
            </div>

            <div className="space-y-1">
              {hobbies.map((h: any) => (
                <div key={h.id} className="flex items-center justify-between p-3 rounded-lg border border-border/10 bg-muted/5">
                  <div className="min-w-0 flex-1">
                    <span className="text-sm">{h.name}</span>
                    <span className="text-[10px] text-muted-foreground/40 ml-2">{h.category} · {h.id}</span>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-3">
                    <button onClick={() => setHobbyEditing(h)} className={btnClass}>编辑</button>
                    <button onClick={async () => {
                      if (!confirm("确定删除？")) return
                      await fetch(`/api/hobbies/${h.id}`, { method: "DELETE" })
                      toast("已删除")
                      fetchHobbies()
                    }} className={btnClass}>删除</button>
                  </div>
                </div>
              ))}
              {hobbies.length === 0 && <p className="text-xs text-muted-foreground/30 py-8 text-center">暂无可管理的好物</p>}
            </div>

            {hobbyNew && (
              <HobbyEditor onSaved={() => { setHobbyNew(false); fetchHobbies() }} onClose={() => setHobbyNew(false)} />
            )}
            {hobbyEditing && (
              <HobbyEditor existing={hobbyEditing} onSaved={() => { setHobbyEditing(null); fetchHobbies() }} onClose={() => setHobbyEditing(null)} />
            )}
          </div>
        )}

        {/* === FRIENDS === */}
        {section === "friends" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold tracking-wider">友链管理</h1>
              <button onClick={() => { setFriendForm({ name: "", url: "", description: "", avatar: "" }); setFriendEditName(null) }} className={btnPrimary}>添加友链</button>
            </div>

            <div className="space-y-1">
              {friends.map((f: any) => (
                <div key={f.name} className="flex items-center justify-between p-3 rounded-lg border border-border/10 bg-muted/5">
                  <div className="min-w-0 flex-1">
                    <span className="text-sm">{f.name}</span>
                    <span className="text-[10px] text-muted-foreground/40 ml-2 truncate">{f.url}</span>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-3">
                    <button onClick={() => {
                      setFriendForm({ name: f.name, url: f.url, description: f.description || "", avatar: f.avatar || "" })
                      setFriendEditName(f.name)
                    }} className={btnClass}>编辑</button>
                    <button onClick={() => deleteFriend(f.name)} className={btnClass}>删除</button>
                  </div>
                </div>
              ))}
              {friends.length === 0 && <p className="text-xs text-muted-foreground/30 py-8 text-center">暂无友链</p>}
            </div>

            {(friendEditName !== null || (friendForm.name && friendForm.url)) && (
              <div className="p-4 rounded-xl border border-border/20 bg-muted/5 space-y-3">
                <h3 className="text-sm font-bold">{friendEditName ? "编辑友链" : "新友链"}</h3>
                <input value={friendForm.name} onChange={(e) => setFriendForm({ ...friendForm, name: e.target.value })} placeholder="名称" className={inputClass} />
                <input value={friendForm.url} onChange={(e) => setFriendForm({ ...friendForm, url: e.target.value })} placeholder="链接" className={inputClass} />
                <input value={friendForm.description} onChange={(e) => setFriendForm({ ...friendForm, description: e.target.value })} placeholder="简介" className={inputClass} />
                <input value={friendForm.avatar} onChange={(e) => setFriendForm({ ...friendForm, avatar: e.target.value })} placeholder="头像URL（可选）" className={inputClass} />
                <div className="flex gap-2">
                  <button onClick={saveFriend} className={btnPrimary}>保存</button>
                  <button onClick={() => { setFriendForm({ name: "", url: "", description: "", avatar: "" }); setFriendEditName(null) }} className={btnClass}>取消</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === GUESTBOOK === */}
        {section === "guestbook" && (
          <div className="space-y-4">
            <h1 className="text-lg font-bold tracking-wider">留言管理</h1>
            <div className="space-y-1">
              {messages.map((m: any) => (
                <div key={m.id} className="flex items-start justify-between p-3 rounded-lg border border-border/10 bg-muted/5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{m.name}</span>
                      <span className="text-[10px] text-muted-foreground/40">{new Date(m.createdAt).toLocaleString("zh-CN")}</span>
                    </div>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">{m.content}</p>
                  </div>
                  <button onClick={() => deleteMessage(m.id)} className={`${btnClass} shrink-0 ml-3`}>
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {messages.length === 0 && <p className="text-xs text-muted-foreground/30 py-8 text-center">暂无留言</p>}
            </div>
          </div>
        )}

        {/* === USERS === */}
        {section === "users" && (
          <div className="space-y-4">
            <h1 className="text-lg font-bold tracking-wider">用户管理</h1>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={thClass}>ID</th>
                    <th className={thClass}>昵称</th>
                    <th className={thClass}>邮箱</th>
                    <th className={thClass}>角色</th>
                    <th className={thClass}>注册时间</th>
                    <th className={thClass}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id}>
                      <td className={tdClass}>{u.id}</td>
                      <td className={tdClass}>{u.name}</td>
                      <td className={`${tdClass} text-xs text-muted-foreground/60`}>{u.email}</td>
                      <td className={tdClass}>
                        <select
                          value={u.role}
                          onChange={(e) => setUserRole(u.id, e.target.value)}
                          className="text-xs bg-muted/20 border border-border/10 rounded px-2 py-0.5 outline-none"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className={`${tdClass} text-xs text-muted-foreground/40`}>{new Date(u.createdAt).toLocaleDateString("zh-CN")}</td>
                      <td className={tdClass}>
                        <button onClick={() => deleteUser(u.id)} className={btnClass}>删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-xs text-muted-foreground/30 py-8 text-center">暂无用户</p>}
            </div>
          </div>
        )}

        {/* === CHANGELOG === */}
        {section === "changelog" && (
          <div className="space-y-4">
            <h1 className="text-lg font-bold tracking-wider">更新记录</h1>

            <div className="p-4 rounded-xl border border-border/20 bg-muted/5 space-y-3">
              <div className="flex gap-2">
                <input value={clForm.date} onChange={(e) => setClForm({ ...clForm, date: e.target.value })} placeholder="日期" className={`${inputClass} w-32`} />
                <select value={clForm.type} onChange={(e) => setClForm({ ...clForm, type: e.target.value as any })} className={`${inputClass} w-24`}>
                  <option value="feat">feat</option>
                  <option value="fix">fix</option>
                  <option value="update">update</option>
                </select>
              </div>
              <textarea
                value={clForm.content}
                onChange={(e) => setClForm({ ...clForm, content: e.target.value })}
                rows={2}
                placeholder="更新内容"
                className={inputClass}
              />
              <button onClick={addChangelog} disabled={!clForm.content} className={btnPrimary}>添加</button>
            </div>

            <div className="space-y-1">
              {changelog.map((e: any) => (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-lg border border-border/10 bg-muted/5">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-muted-foreground/40 mr-2">{e.date}</span>
                    <span className={`text-[10px] mr-2 ${
                      e.type === "feat" ? "text-emerald-400" : e.type === "fix" ? "text-red-400" : "text-blue-400"
                    }`}>[{e.type}]</span>
                    <span className="text-xs">{e.content}</span>
                  </div>
                  <button onClick={async () => {
                    if (!confirm("确定删除？")) return
                    await fetch(`/api/admin/changelog?id=${e.id}`, { method: "DELETE" })
                    toast("已删除")
                    fetchChangelog()
                  }} className={`${btnClass} shrink-0 ml-3`}>
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {changelog.length === 0 && <p className="text-xs text-muted-foreground/30 py-8 text-center">暂无记录</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
