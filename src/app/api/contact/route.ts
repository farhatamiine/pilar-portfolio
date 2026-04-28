import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── HTML email template ──────────────────────────────────────────────────────

function buildHtml(name: string, email: string, message: string): string {
  const escaped = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New message — pilarolivero.art</title>
</head>
<body style="margin:0;padding:0;background:#f4f0e8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0e8;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid #e8e2d6;">
              <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#8a8078;">
                pilarolivero.art
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 0 0;">
              <p style="margin:0 0 28px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#c8a882;">
                New message from the contact form
              </p>

              <!-- Name -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding-bottom:4px;">
                    <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#8a8078;">Name</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #e8e2d6;">
                    <p style="margin:0;font-size:17px;color:#1a1714;line-height:1.5;">${escaped(name)}</p>
                  </td>
                </tr>
              </table>

              <!-- Email -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding-bottom:4px;">
                    <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#8a8078;">Email address</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #e8e2d6;">
                    <a href="mailto:${escaped(email)}" style="font-size:17px;color:#1a1714;text-decoration:none;">${escaped(email)}</a>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
                <tr>
                  <td style="padding-bottom:4px;">
                    <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#8a8078;">Message</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 0;border-bottom:1px solid #e8e2d6;">
                    <p style="margin:0;font-size:17px;color:#1a1714;line-height:1.8;">${escaped(message)}</p>
                  </td>
                </tr>
              </table>

              <!-- Reply CTA -->
              <a href="mailto:${escaped(email)}"
                 style="display:inline-block;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;background:#1a1714;color:#f4f0e8;padding:14px 28px;text-decoration:none;">
                Reply to ${escaped(name)} →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:48px;border-top:1px solid #e8e2d6;margin-top:48px;">
              <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#8a8078;">
                Sent via pilarolivero.art · ${new Date().getFullYear()}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const { name, email, message } = await request.json()

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return Response.json({ error: 'All fields are required' }, { status: 400 })
  }

  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.CONTACT_EMAIL!,
    replyTo: email,
    subject: `New message from ${name} — pilarolivero.art`,
    html: buildHtml(name, email, message),
    // Plain-text fallback for clients that block HTML
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  })

  if (error) {
    console.error('Resend error:', error)
    return Response.json({ error: 'Failed to send message' }, { status: 500 })
  }

  return Response.json({ success: true })
}
