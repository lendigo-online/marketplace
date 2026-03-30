export function buildVerificationEmail(code: string): string {
    const [d1, d2, d3, d4, d5, d6] = code.split("")

    const box = (d: string) =>
        `<td style="padding:0 4px;"><div style="width:48px;height:60px;background:#f5f5f7;border:2px solid #e8e8ed;border-radius:12px;font-size:28px;font-weight:700;color:#1d1d1f;text-align:center;line-height:60px;">${d}</div></td>`

    return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Kod weryfikacyjny Lendigo</title>
</head>
<body style="margin:0;padding:0;background:#fbfbfd;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fbfbfd;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <div style="font-size:26px;font-weight:700;color:#1d1d1f;letter-spacing:-0.5px;">
                Lend<span style="color:#6e6e73;font-weight:300;">igo</span>
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:28px;border:1px solid rgba(0,0,0,0.06);overflow:hidden;">

              <!-- Green header -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#00bf63 0%,#00a855 100%);padding:32px 40px 28px;">
                    <p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:1.2px;">Weryfikacja konta</p>
                    <h1 style="margin:8px 0 0;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">Potwierdź swój adres email</h1>
                  </td>
                </tr>
              </table>

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0">

                <tr>
                  <td style="padding:36px 40px 8px;">
                    <p style="margin:0;font-size:15px;color:#1d1d1f;line-height:1.6;">
                      Witaj! Aby dokończyć rejestrację w Lendigo, wpisz poniższy kod weryfikacyjny w formularzu rejestracji.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px 40px 12px;">
                    <p style="margin:0;font-size:11px;font-weight:600;color:#6e6e73;text-transform:uppercase;letter-spacing:1px;">Twój kod weryfikacyjny</p>
                  </td>
                </tr>

                <!-- Code boxes -->
                <tr>
                  <td align="center" style="padding:0 40px 8px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        ${box(d1)}
                        ${box(d2)}
                        ${box(d3)}
                        <td style="padding:0 8px;"><div style="width:8px;height:2px;background:#d2d2d7;border-radius:2px;margin-top:29px;"></div></td>
                        ${box(d4)}
                        ${box(d5)}
                        ${box(d6)}
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Validity badge -->
                <tr>
                  <td align="center" style="padding:20px 40px 8px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#fff9e6;border:1px solid #ffde59;border-radius:20px;padding:7px 18px;">
                          <span style="font-size:12px;font-weight:600;color:#7a6000;">&#9203; Kod ważny przez 15 minut</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:20px 40px 0;">
                    <div style="height:1px;background:#f0f0f5;"></div>
                  </td>
                </tr>

                <!-- Security note -->
                <tr>
                  <td style="padding:20px 40px 36px;">
                    <p style="margin:0;font-size:13px;color:#6e6e73;line-height:1.6;">
                      Jeśli nie próbowałeś/aś zakładać konta w Lendigo, możesz zignorować tę wiadomość. Twoje dane są bezpieczne i nie zostały udostępnione.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 6px;font-size:12px;color:#aeaeb2;">
                &copy; ${new Date().getFullYear()} Lendigo &nbsp;&middot;&nbsp; Wypożycz cokolwiek
              </p>
              <p style="margin:0;font-size:11px;color:#c7c7cc;">
                Ta wiadomość została wysłana automatycznie &mdash; prosimy na nią nie odpowiadać.
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
