import { supabase } from "./supabase";

export interface WhatsappPayload {
  ministryName: string;
  requesterName: string;
  requesterPhone: string;
  reason: string;
  aim: string;
}

const ministryWhatsappMap: Array<{ matcher: RegExp; number: string; label: string }> = [
  { matcher: /children/i, number: '+233257966923', label: "Children's Ministry" },
  { matcher: /youth/i, number: '+233257966923', label: "Youth Ministry" },
  { matcher: /men/i, number: '+233257966923', label: "Men's Ministry" },
  { matcher: /women/i, number: '+233257966923', label: "Women's Ministry" },
  { matcher: /music/i, number: '+233257966923', label: "Music Ministry" },
  { matcher: /worship/i, number: '+233257966923', label: "Worship Ministry" },
  { matcher: /ushering/i, number: '+233257966923', label: "Ushering Ministry" },
  { matcher: /media/i, number: '+233257966923', label: "Media Ministry" },
  { matcher: /technical/i, number: '+233257966923', label: "Technical Ministry" },
  { matcher: /prayer/i, number: '+233257966923', label: "Prayer Ministry" },
  { matcher: /evangelism/i, number: '+233257966923', label: "Evangelism Ministry" },
  { matcher: /outreach/i, number: '+233257966923', label: "Outreach Ministry" },
  { matcher: /welfare/i, number: '+233257966923', label: "Welfare Ministry" },
  // Add further ministry mappings below when available.
];

export function getMinistryWhatsappNumber(ministryName: string) {
  const mapping = ministryWhatsappMap.find((item) => item.matcher.test(ministryName));
  return mapping ? mapping.number : null;
}

export function formatWhatsAppMessage(payload: WhatsappPayload) {
  return `New ministry join request received.\n\nMinistry: ${payload.ministryName}\nName: ${payload.requesterName}\nPhone: ${payload.requesterPhone}\nReason: ${payload.reason}\nMain Aim: ${payload.aim}`;
}

export function getWhatsAppUrl(payload: WhatsappPayload) {
  const number = getMinistryWhatsappNumber(payload.ministryName);
  if (!number) {
    console.info(`No WhatsApp number configured for ministry: ${payload.ministryName}`);
    return null;
  }

  const message = formatWhatsAppMessage(payload);
  const encodedMessage = encodeURIComponent(message);
  const cleanNumber = number.replace(/\D/g, ''); // Remove all non-digits

  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

export async function notifyDepartmentHeadWhatsapp(payload: WhatsappPayload) {
  const whatsappUrl = getWhatsAppUrl(payload);
  if (!whatsappUrl) {
    console.info(`No WhatsApp number configured for ministry: ${payload.ministryName}`);
    return { success: false, error: 'No WhatsApp number configured' };
  }

  // Store the notification in the database for admin dashboard
  try {
    const { error } = await supabase.from('whatsapp_notifications').insert([
      {
        ministry_name: payload.ministryName,
        recipient_number: getMinistryWhatsappNumber(payload.ministryName),
        message: formatWhatsAppMessage(payload),
        whatsapp_url: whatsappUrl,
        status: 'sent', // Mark as sent since we're opening WhatsApp automatically
        sent_at: new Date().toISOString()
      }
    ]);

    if (error) {
      console.error('Error storing WhatsApp notification:', error);
    }
  } catch (err) {
    console.error('Failed to store WhatsApp notification:', err);
  }

  // Automatically open WhatsApp with the pre-filled message
  console.log('Opening WhatsApp automatically:', {
    ministry: payload.ministryName,
    number: getMinistryWhatsappNumber(payload.ministryName),
    url: whatsappUrl
  });

  // Open WhatsApp in a new tab/window
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

  return { success: true, whatsappUrl };
}

