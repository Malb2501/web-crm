import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL ?? 'PipeFlow CRM <noreply@pipeflow.app>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function sendInviteEmail({
  to,
  inviterName,
  workspaceName,
  token,
}: {
  to: string
  inviterName: string
  workspaceName: string
  token: string
}) {
  const inviteUrl = `${APP_URL}/invite/${token}`

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Convite PipeFlow CRM</title>
</head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1E3A5F;padding:28px 40px;text-align:left;">
              <span style="display:inline-flex;align-items:center;gap:8px;">
                <span style="background:#2563EB;border-radius:6px;padding:4px 8px;font-size:13px;font-weight:700;color:#fff;letter-spacing:0.5px;">PF</span>
                <span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">PipeFlow</span>
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#1E3A5F;line-height:1.3;">
                Você foi convidado para o workspace <span style="color:#2563EB;">${workspaceName}</span>
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#4B5563;line-height:1.6;">
                <strong style="color:#1E3A5F;">${inviterName}</strong> convidou você para colaborar no PipeFlow CRM.
                Clique no botão abaixo para aceitar o convite e começar a usar a plataforma.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#2563EB;border-radius:8px;">
                    <a href="${inviteUrl}"
                       style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;letter-spacing:0.1px;">
                      Aceitar convite →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#9CA3AF;">
                Ou copie e cole este link no seu navegador:
              </p>
              <p style="margin:0;font-size:13px;color:#2563EB;word-break:break-all;">
                <a href="${inviteUrl}" style="color:#2563EB;">${inviteUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:20px 40px;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.5;">
                Este convite expira em <strong>7 dias</strong>.
                Se você não esperava receber este e-mail, pode ignorá-lo com segurança.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  return resend.emails.send({
    from: FROM,
    to,
    subject: `${inviterName} convidou você para o workspace "${workspaceName}" no PipeFlow`,
    html,
  })
}
