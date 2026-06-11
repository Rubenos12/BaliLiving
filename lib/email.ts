import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = "BaliLiving <noreply@baliliving.nl>";
const ADMIN_EMAIL = "info@baliliving.nl";

export async function sendBookingConfirmation(booking: {
  id: string;
  guest_name: string;
  guest_email: string;
  villa_name: string;
  check_in: string;
  check_out: string;
  total_nights: number;
  total_price: number;
  guest_count: number;
}) {
  if (!resend) return;

  const ref = booking.id.slice(0, 8).toUpperCase();
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

  await Promise.allSettled([
    // Guest confirmation
    resend.emails.send({
      from: FROM,
      to: booking.guest_email,
      subject: `Boekingsaanvraag ontvangen — ${booking.villa_name} (ref. ${ref})`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; color: #2E2E2E;">
          <h1 style="font-size: 22px; color: #1C2B1E;">Bedankt voor je aanvraag, ${booking.guest_name}.</h1>
          <p>We hebben je boekingsaanvraag ontvangen en nemen <strong>binnen 24 uur</strong> contact met je op ter bevestiging.</p>
          <table style="width:100%; border-collapse:collapse; margin: 24px 0;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color:#888;">Villa</td><td style="padding:8px 0; border-bottom:1px solid #eee;"><strong>${booking.villa_name}</strong></td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color:#888;">Inchecken</td><td style="padding:8px 0; border-bottom:1px solid #eee;">${fmt(booking.check_in)}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color:#888;">Uitchecken</td><td style="padding:8px 0; border-bottom:1px solid #eee;">${fmt(booking.check_out)}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color:#888;">Nachten</td><td style="padding:8px 0; border-bottom:1px solid #eee;">${booking.total_nights}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color:#888;">Gasten</td><td style="padding:8px 0; border-bottom:1px solid #eee;">${booking.guest_count}</td></tr>
            <tr><td style="padding: 8px 0; color:#888;">Totaalprijs</td><td style="padding:8px 0;"><strong>€${booking.total_price.toLocaleString("nl-NL")}</strong></td></tr>
          </table>
          <p style="color:#888; font-size:13px;">Referentienummer: <strong>${ref}</strong></p>
          <p>Heb je vragen? Stuur een e-mail naar <a href="mailto:${ADMIN_EMAIL}" style="color:#C9A84C;">${ADMIN_EMAIL}</a></p>
          <hr style="border:none; border-top:1px solid #eee; margin:32px 0;">
          <p style="color:#aaa; font-size:12px;">BaliLiving · Exclusieve Bali Ervaringen</p>
        </div>
      `,
    }),
    // Admin notification
    resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `Nieuwe boekingsaanvraag — ${booking.villa_name} (ref. ${ref})`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; color: #2E2E2E;">
          <h1 style="font-size: 20px; color: #1C2B1E;">Nieuwe boekingsaanvraag</h1>
          <table style="width:100%; border-collapse:collapse; margin: 20px 0;">
            <tr><td style="padding:8px 0; border-bottom:1px solid #eee; color:#888;">Referentie</td><td style="padding:8px 0; border-bottom:1px solid #eee;"><strong>${ref}</strong></td></tr>
            <tr><td style="padding:8px 0; border-bottom:1px solid #eee; color:#888;">Gast</td><td style="padding:8px 0; border-bottom:1px solid #eee;">${booking.guest_name}</td></tr>
            <tr><td style="padding:8px 0; border-bottom:1px solid #eee; color:#888;">E-mail</td><td style="padding:8px 0; border-bottom:1px solid #eee;"><a href="mailto:${booking.guest_email}">${booking.guest_email}</a></td></tr>
            <tr><td style="padding:8px 0; border-bottom:1px solid #eee; color:#888;">Villa</td><td style="padding:8px 0; border-bottom:1px solid #eee;"><strong>${booking.villa_name}</strong></td></tr>
            <tr><td style="padding:8px 0; border-bottom:1px solid #eee; color:#888;">Inchecken</td><td style="padding:8px 0; border-bottom:1px solid #eee;">${fmt(booking.check_in)}</td></tr>
            <tr><td style="padding:8px 0; border-bottom:1px solid #eee; color:#888;">Uitchecken</td><td style="padding:8px 0; border-bottom:1px solid #eee;">${fmt(booking.check_out)}</td></tr>
            <tr><td style="padding:8px 0; border-bottom:1px solid #eee; color:#888;">Gasten</td><td style="padding:8px 0; border-bottom:1px solid #eee;">${booking.guest_count}</td></tr>
            <tr><td style="padding:8px 0; color:#888;">Totaalprijs</td><td style="padding:8px 0;"><strong>€${booking.total_price.toLocaleString("nl-NL")}</strong></td></tr>
          </table>
          <a href="https://www.baliliving.nl/admin/bookings" style="display:inline-block; background:#C9A84C; color:#1C2B1E; padding:10px 20px; text-decoration:none; font-size:14px;">Bekijk in admin panel</a>
        </div>
      `,
    }),
  ]);
}

export async function sendBookingStatusUpdate(booking: {
  guest_name: string;
  guest_email: string;
  villa_name: string;
  check_in: string;
  check_out: string;
  id: string;
  status: "accepted" | "rejected";
  admin_notes?: string;
}) {
  if (!resend) return;

  const ref = booking.id.slice(0, 8).toUpperCase();
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

  const subject =
    booking.status === "accepted"
      ? `Boeking bevestigd — ${booking.villa_name} (ref. ${ref})`
      : `Boeking helaas niet mogelijk — ${booking.villa_name} (ref. ${ref})`;

  const body =
    booking.status === "accepted"
      ? `<p>Geweldig nieuws, ${booking.guest_name}! Je boeking voor <strong>${booking.villa_name}</strong> (${fmt(booking.check_in)} – ${fmt(booking.check_out)}) is <strong style="color:#2e7d32;">bevestigd</strong>.</p><p>We nemen binnenkort contact met je op voor de betaalgegevens en verdere details.</p>`
      : `<p>Helaas kunnen we je boeking voor <strong>${booking.villa_name}</strong> (${fmt(booking.check_in)} – ${fmt(booking.check_out)}) niet verwerken${booking.admin_notes ? `: ${booking.admin_notes}` : "."}</p><p>Neem contact op via <a href="mailto:${ADMIN_EMAIL}" style="color:#C9A84C;">${ADMIN_EMAIL}</a> — we helpen je graag aan een alternatief.</p>`;

  await resend.emails.send({
    from: FROM,
    to: booking.guest_email,
    subject,
    html: `
      <div style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; color: #2E2E2E;">
        ${body}
        <p style="color:#aaa; font-size:12px; margin-top:32px;">Referentie: ${ref} · BaliLiving · Exclusieve Bali Ervaringen</p>
      </div>
    `,
  }).catch(() => {});
}
