import nodemailer from "nodemailer"

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter

  const host = process.env.EMAIL_HOST
  const port = Number(process.env.EMAIL_PORT || 465)
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS

  if (!host || !user || !pass) {
    console.warn("[mail] EMAIL_HOST/EMAIL_USER/EMAIL_PASS not configured, emails will only be logged")
    return null
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: { user, pass },
  })

  return transporter
}

export async function sendVerificationCode(email: string, code: string): Promise<boolean> {
  const transport = getTransporter()
  if (!transport) {
    console.log(`[mail] VERIFICATION CODE for ${email}: ${code}`)
    return false
  }

  try {
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "D05 小站 — 邮箱验证码",
      text: `您的验证码是：${code}，有效期 10 分钟。\n\n—— D05`,
      html: `
        <div style="max-width:480px;margin:0 auto;padding:32px;font-family:sans-serif;background:#0f1117;border-radius:12px;border:1px solid #1e2230;">
          <h2 style="color:#f59e0b;text-align:center;letter-spacing:0.1em;">D05</h2>
          <p style="color:#888;text-align:center;font-size:14px;">邮箱验证码</p>
          <div style="background:#1a1d28;border-radius:8px;padding:24px;text-align:center;margin:20px 0;">
            <span style="font-size:36px;font-weight:bold;color:#f59e0b;letter-spacing:8px;">${code}</span>
          </div>
          <p style="color:#666;font-size:12px;text-align:center;">有效期 10 分钟，如非本人操作请忽略此邮件。</p>
        </div>
      `,
    })
    console.log(`[mail] Sent verification code to ${email}`)
    return true
  } catch (e) {
    console.error(`[mail] Failed to send to ${email}:`, e)
    return false
  }
}
