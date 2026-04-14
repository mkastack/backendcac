# WhatsApp Integration Setup Guide

## Overview
This application automatically opens WhatsApp with pre-filled messages for ministry department heads when someone joins a ministry through the website. **No third-party services required** - uses WhatsApp's built-in wa.me links.

## Current Status
- ✅ Frontend automatically detects join requests
- ✅ WhatsApp automatically opens with pre-filled message
- ✅ Admin dashboard shows sent notifications
- ✅ Status tracking with view functionality

## How It Works

1. **User submits join request** on Ministries page
2. **Request saved** to Supabase database
3. **WhatsApp automatically opens** with pre-filled message in new tab
4. **Notification stored** in `whatsapp_notifications` table as "sent"
5. **Admin sees notification** in dashboard with "Auto-Sent" status
6. **Admin can view** the sent message anytime

## Ministry WhatsApp Numbers

Currently configured (all ministries use the same number):
- **All Ministries**: `+233257966923` (Ghana format: 0257966923)

The system automatically matches ministry names using regex patterns. All common ministry types are configured to use this WhatsApp number.

If you need different numbers for different ministries, update the mapping in `src/lib/whatsapp.ts`:

```typescript
const ministryWhatsappMap: Array<{ matcher: RegExp; number: string; label: string }> = [
  { matcher: /children/i, number: '+233257966923', label: "Children's Ministry" },
  { matcher: /youth/i, number: '+233257966923', label: "Youth Ministry" },
  // Add custom numbers for specific ministries as needed
];
```

## Database Schema

The `whatsapp_notifications` table stores:
- `ministry_name`: Which ministry the request is for
- `recipient_number`: WhatsApp number to send to
- `message`: Formatted message text
- `whatsapp_url`: Pre-built wa.me link
- `status`: 'pending' | 'sent' | 'failed'
- `sent_at`: Timestamp when marked as sent

## Admin Dashboard Features

- **Automatic opening**: WhatsApp opens immediately when user submits
- **Status tracking**: All notifications marked as "Auto-Sent"
- **View messages**: Click "View Message" to see what was sent
- **Real-time updates**: New notifications appear instantly

## Message Format

```
New ministry join request received.

Ministry: Children's Ministry
Name: John Doe
Phone: +1234567890
Reason: I want to serve in children's ministry
Main Aim: To help teach and guide children
```

## User Experience

When a user submits a ministry join request:
- ✅ Form data is saved to the database
- ✅ WhatsApp automatically opens in a new tab with the pre-filled message
- ✅ User sees: "Request submitted successfully! WhatsApp opened automatically with your message - please click Send to notify the ministry head."
- ✅ Admin can view all notifications in the dashboard

## Troubleshooting

**No notifications appearing?**
- Check that ministry has a configured WhatsApp number
- Verify database table `whatsapp_notifications` exists
- Check browser console for errors

**wa.me link not working?**
- Ensure WhatsApp is installed on the device
- Check that the phone number format is correct (+XXXXXXXXXX)
- Try opening the link directly in browser

**Status not updating?**
- Check database permissions
- Verify Supabase connection
- Check browser network tab for failed requests

**WhatsApp not opening automatically?**
- Check browser popup blocker settings
- Ensure the site is allowed to open popups
- Try disabling popup blocker temporarily

## Future Enhancements

- Bulk send multiple notifications
- Message templates per ministry
- Delivery confirmation (manual check)
- Message history and archiving
- Integration with WhatsApp Business API (if needed later)
