"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pencil, LogOut, Heart, Lock } from "lucide-react"
import { HexGrid, Sparkles, ArkDiamond } from "@/components/decorations"

type User = {
  id: number
  email: string
  name: string
  avatar: string | null
  bio: string
  createdAt: string
}

type LikedPost = {
  slug: string
  title: string
  date: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([])
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editBio, setEditBio] = useState("")
  const [editAvatar, setEditAvatar] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  // Password change
  const [pwEditing, setPwEditing] = useState(false)
  const [pwCode, setPwCode] = useState("")
  const [pwNew, setPwNew] = useState("")
  const [pwSending, setPwSending] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState("")

  const sendCode = async () => {
    if (!user) return
    setPwSending(true)
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    })
    const data = await res.json()
    setPwMsg(data.message || data.error || "")
    setPwSending(false)
  }

  const changePassword = async () => {
    if (!user || !pwCode || !pwNew) return
    setPwSaving(true)
    setPwMsg("")
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, code: pwCode, password: pwNew }),
    })
    const data = await res.json()
    if (res.ok) {
      setPwMsg(data.message)
      setPwEditing(false)
      setPwCode("")
      setPwNew("")
    } else {
      setPwMsg(data.error || "修改失败")
    }
    setPwSaving(false)
  }

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const canvas = document.createElement("canvas")
    canvas.width = 200
    canvas.height = 200
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      // Crop to square center
      const size = Math.min(img.width, img.height)
      const sx = (img.width - size) / 2
      const sy = (img.height - size) / 2
      ctx.drawImage(img, sx, sy, size, size, 0, 0, 200, 200)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.75)
      setEditAvatar(dataUrl)
      setAvatarPreview(dataUrl)
    }
    img.src = URL.createObjectURL(file)
  }

  const fetchUser = useCallback(async () => {
    const res = await fetch("/api/auth/me")
    const data = await res.json()
    if (!data.user) {
      router.push("/login")
      return
    }
    setUser(data.user)
    setEditName(data.user.name)
    setEditBio(data.user.bio || "")
    setEditAvatar(data.user.avatar || "")
    setAvatarPreview(data.user.avatar || null)

    // Fetch liked posts
    const likeRes = await fetch(`/api/blog/likes?user=${data.user.id}`)
    if (likeRes.ok) {
      const likeData = await likeRes.json()
      setLikedPosts(likeData.posts || [])
    }
  }, [router])

  useEffect(() => { fetchUser() }, [fetchUser])

  const save = async () => {
    setSaving(true)
    setMsg("")
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, bio: editBio, avatar: editAvatar || null }),
    })
    const data = await res.json()
    if (res.ok) {
      setUser(data.user)
      setEditing(false)
      setMsg("保存成功")
    } else {
      setMsg(data.error || "保存失败")
    }
    setSaving(false)
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-5 h-5 rounded-full border-2 border-[hsl(var(--ark-amber))] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative py-16 px-4 sm:px-6 overflow-hidden min-h-screen">
      <HexGrid opacity={0.03} />
      <Sparkles count={8} />

      <div className="relative z-10 mx-auto max-w-2xl space-y-8">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl border border-border/20 bg-card/80 backdrop-blur-xl">
          {pwEditing ? (
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold">修改密码</h2>
              <p className="text-[11px] text-muted-foreground/50">验证码将发送至 {user.email}</p>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">新密码</label>
                <input
                  type="password"
                  value={pwNew}
                  onChange={(e) => setPwNew(e.target.value)}
                  placeholder="至少6位"
                  className="w-full px-3 py-2 text-sm bg-muted/30 border border-border/20 rounded-lg outline-none focus:border-[hsl(var(--ark-amber)/0.3)]"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">验证码</label>
                <div className="flex gap-2">
                  <input
                    value={pwCode}
                    onChange={(e) => setPwCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6位数字"
                    className="flex-1 px-3 py-2 text-sm bg-muted/30 border border-border/20 rounded-lg outline-none focus:border-[hsl(var(--ark-amber)/0.3)]"
                  />
                  <button
                    onClick={sendCode}
                    disabled={pwSending}
                    className="px-3 py-2 text-xs tracking-wider rounded-lg border border-border/20 text-muted-foreground hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.3)] transition-colors whitespace-nowrap disabled:opacity-40"
                  >
                    {pwSending ? "发送中..." : "发送验证码"}
                  </button>
                </div>
              </div>
              {pwMsg && (
                <p className={`text-xs ${pwMsg.includes("成功") ? "text-emerald-400" : "text-amber-400"}`}>{pwMsg}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={changePassword}
                  disabled={pwSaving || pwCode.length < 6 || pwNew.length < 6}
                  className="px-4 py-1.5 text-xs tracking-wider rounded-lg bg-[hsl(var(--ark-amber)/0.15)] text-[hsl(var(--ark-amber))] hover:bg-[hsl(var(--ark-amber)/0.25)] transition-colors disabled:opacity-30"
                >
                  {pwSaving ? "修改中..." : "确认修改"}
                </button>
                <button
                  onClick={() => { setPwEditing(false); setPwMsg(""); setPwCode(""); setPwNew("") }}
                  className="px-4 py-1.5 text-xs tracking-wider rounded-lg border border-border/20 text-muted-foreground hover:text-foreground transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          ) : editing ? (
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold">编辑资料</h2>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">头像</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[hsl(var(--ark-blue)/0.15)] flex items-center justify-center overflow-hidden border border-border/20 shrink-0">
                    {avatarPreview || user.avatar ? (
                      <img src={avatarPreview || user.avatar || ""} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-[hsl(var(--ark-blue))]">{editName[0] || user.name[0]}</span>
                    )}
                  </div>
                  <label className="flex-1 px-3 py-2 text-xs tracking-wider rounded-lg border border-border/20 text-muted-foreground hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.3)] cursor-pointer transition-colors text-center">
                    {avatarPreview ? "更换图片" : "从电脑选择图片"}
                    <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                  </label>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => { setEditAvatar(""); setAvatarPreview(null) }}
                      className="text-[10px] text-muted-foreground/40 hover:text-red-400 shrink-0"
                    >
                      移除
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">昵称</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value.slice(0, 20))}
                  className="w-full px-3 py-2 text-sm bg-muted/30 border border-border/20 rounded-lg outline-none focus:border-[hsl(var(--ark-amber)/0.3)]"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">简介</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value.slice(0, 100))}
                  rows={2}
                  placeholder="一句话介绍自己..."
                  className="w-full px-3 py-2 text-sm bg-muted/30 border border-border/20 rounded-lg resize-none outline-none focus:border-[hsl(var(--ark-amber)/0.3)]"
                />
                <span className="text-[10px] text-muted-foreground/40">{editBio.length}/100</span>
              </div>
              {msg && <p className={`text-xs ${msg === "保存成功" ? "text-emerald-400" : "text-red-400"}`}>{msg}</p>}
              <div className="flex gap-2">
                <button
                  onClick={save}
                  disabled={saving}
                  className="px-4 py-1.5 text-xs tracking-wider rounded-lg bg-[hsl(var(--ark-amber)/0.15)] text-[hsl(var(--ark-amber))] hover:bg-[hsl(var(--ark-amber)/0.25)] transition-colors disabled:opacity-30"
                >
                  {saving ? "保存中..." : "保存"}
                </button>
                <button
                  onClick={() => { setEditing(false); setMsg("") }}
                  className="px-4 py-1.5 text-xs tracking-wider rounded-lg border border-border/20 text-muted-foreground hover:text-foreground transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-[hsl(var(--ark-blue)/0.15)] flex items-center justify-center overflow-hidden border-2 border-border/20">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-[hsl(var(--ark-blue))]">{user.name[0]}</span>
                )}
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">{user.name}</h2>
                <p className="text-xs text-muted-foreground/50">{user.email}</p>
              </div>
              {user.bio && (
                <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-xs mx-auto">{user.bio}</p>
              )}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs tracking-wider rounded-lg border border-border/20 text-muted-foreground hover:text-[hsl(var(--ark-blue))] hover:border-[hsl(var(--ark-blue)/0.3)] transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  编辑资料
                </button>
                <button
                  onClick={() => setPwEditing(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs tracking-wider rounded-lg border border-border/20 text-muted-foreground hover:text-[hsl(var(--ark-amber))] hover:border-[hsl(var(--ark-amber)/0.3)] transition-colors"
                >
                  <Lock className="h-3 w-3" />
                  修改密码
                </button>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs tracking-wider rounded-lg border border-border/20 text-muted-foreground hover:text-red-400 hover:border-red-400/30 transition-colors"
                >
                  <LogOut className="h-3 w-3" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Liked Posts */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-4 w-4 text-red-400" />
            <h3 className="font-serif text-sm font-bold">点赞的博文</h3>
          </div>
          {likedPosts.length === 0 ? (
            <p className="text-xs text-muted-foreground/40">还没有点赞过博文</p>
          ) : (
            <div className="space-y-2">
              {likedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block p-3 rounded-xl border border-border/15 hover:border-[hsl(var(--ark-amber)/0.2)] bg-muted/10 transition-colors"
                >
                  <span className="text-sm">{post.title}</span>
                  <span className="text-[10px] text-muted-foreground/40 ml-3">{post.date}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center opacity-20">
          <ArkDiamond size={6} />
        </div>
      </div>
    </div>
  )
}
