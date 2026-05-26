"use client"

import { useMemo } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from "recharts"

const COLORS = {
  amber: "hsl(39, 70%, 50%)",
  amberDim: "hsl(39, 40%, 35%)",
  emerald: "hsl(160, 40%, 45%)",
  sky: "hsl(200, 40%, 50%)",
  rose: "hsl(350, 40%, 55%)",
  violet: "hsl(260, 30%, 55%)",
  slate: "hsl(220, 10%, 40%)",
}

type Props = {
  stats: { posts: number; comments: number; messages: number; users: number }
  blogPosts: { date: string }[]
  users: { createdAt: string }[]
}

function groupByMonth(items: { date?: string; createdAt?: string }[], getDate: (d: string) => Date) {
  const map = new Map<string, number>()
  items.forEach((item) => {
    const raw = item.date || item.createdAt
    if (!raw) return
    const d = getDate(raw)
    if (isNaN(d.getTime())) return
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    map.set(key, (map.get(key) || 0) + 1)
  })
  const sorted = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  return sorted.slice(-12).map(([month, count]) => ({ month, count }))
}

function formatMonth(label: string) {
  const [y, m] = label.split("-")
  return `${y.slice(2)}/${m}`
}

export function DashboardCharts({ stats, blogPosts, users }: Props) {
  const pieData = useMemo(() => [
    { name: "博客文章", value: stats.posts, color: COLORS.amber },
    { name: "评论", value: stats.comments, color: COLORS.emerald },
    { name: "留言", value: stats.messages, color: COLORS.sky },
    { name: "用户", value: stats.users, color: COLORS.rose },
  ], [stats])

  const blogMonthly = useMemo(
    () => groupByMonth(blogPosts, (d) => new Date(d)),
    [blogPosts],
  )

  const userMonthly = useMemo(
    () => groupByMonth(users, (d) => new Date(d)),
    [users],
  )

  const empty = pieData.every((d) => d.value === 0)

  return (
    <div className="space-y-4">
      {empty ? (
        <div className="text-center py-12 text-xs text-muted-foreground/30">
          暂无数据可供图表展示
        </div>
      ) : (
        <>
          {/* Row 1: Pie + Blog monthly */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Content distribution */}
            <div className="p-4 rounded-xl border border-border/20 bg-card/60">
              <h3 className="text-[10px] tracking-widest text-muted-foreground/40 mb-3 uppercase">内容分布</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData.filter((d) => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="transparent"
                    >
                      {pieData.filter((d) => d.value > 0).map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(0 0% 8% / 0.95)",
                        border: "1px solid hsl(0 0% 20%)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "hsl(0 0% 80%)",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", color: "hsl(0 0% 50%)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Blog posts by month */}
            <div className="p-4 rounded-xl border border-border/20 bg-card/60">
              <h3 className="text-[10px] tracking-widest text-muted-foreground/40 mb-3 uppercase">月度文章发布</h3>
              <div className="h-56">
                {blogMonthly.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={blogMonthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={formatMonth}
                        tick={{ fontSize: 10, fill: "hsl(0 0% 35%)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "hsl(0 0% 35%)" }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(0 0% 8% / 0.95)",
                          border: "1px solid hsl(0 0% 20%)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "hsl(0 0% 80%)",
                        }}
                        labelFormatter={(l) => l as string}
                      />
                      <Bar dataKey="count" fill={COLORS.amber} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground/25">暂无数据</div>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: User registrations */}
          <div className="p-4 rounded-xl border border-border/20 bg-card/60">
            <h3 className="text-[10px] tracking-widest text-muted-foreground/40 mb-3 uppercase">用户注册趋势</h3>
            <div className="h-48">
              {userMonthly.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userMonthly}>
                    <defs>
                      <linearGradient id="userFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.sky} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.sky} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
                    <XAxis
                      dataKey="month"
                      tickFormatter={formatMonth}
                      tick={{ fontSize: 10, fill: "hsl(0 0% 35%)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "hsl(0 0% 35%)" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(0 0% 8% / 0.95)",
                        border: "1px solid hsl(0 0% 20%)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "hsl(0 0% 80%)",
                      }}
                      labelFormatter={(l) => l as string}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke={COLORS.sky}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#userFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground/25">暂无数据</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
