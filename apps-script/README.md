# Lead form backend (Google Apps Script)

The website's forms send leads to a small Google Apps Script that runs on **your own Google
account**. It emails each lead to `nishant@stegosglobal.com` as a table (reply goes straight to
the visitor), logs it in a Google Sheet, and sends the visitor a short confirmation email.
No other company receives the form data.

## One-time setup (about 5 minutes)

1. Sign in to Google as **nishant@stegosglobal.com** and create a new Google Sheet
   (sheets.new). Name it e.g. **Stegos Website Leads**.
2. In the sheet: **Extensions → Apps Script**.
3. Delete the sample code, paste the whole of [`Code.gs`](Code.gs), and click **Save**.
4. Authorise it once: choose **testSetup** in the function dropdown and click **Run**.
   - Google asks for permission → **Review permissions** → pick your account.
   - If you see "Google hasn't verified this app": **Advanced → Go to … (unsafe)** → **Allow**.
     (It's your own script, so this warning is expected.)
   - You should receive a "New lead: …" test email, and a **Leads** tab appears in the sheet.
5. **Deploy → New deployment** → gear icon → **Web app**:
   - Description: `Website leads`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
6. Put that URL in `assets/js/config.js` as `formEndpoint`, then build and push.

## Changing the script later

Edit `Code.gs` in the Apps Script editor, then **Deploy → Manage deployments → ✏️ Edit →
Version: New version → Deploy**. The URL stays the same, so the website needs no change.

## Limits

Built-in abuse protection (edit `LIMITS` in `Code.gs`): a hidden spam-trap field, a minimum
time-to-submit, at most 3 leads per email address per hour, 10 per minute and 40 per 6 hours
overall, and one confirmation email per address per 6 hours. Over-limit visitors are shown the
WhatsApp / email fallback with their details prefilled.

Google allows about 100 emails/day on a free Gmail account and 1,500/day on Google Workspace
(each lead uses 2: the lead + the confirmation). Set `SEND_CONFIRMATION: false` in `Code.gs` to
halve that.
