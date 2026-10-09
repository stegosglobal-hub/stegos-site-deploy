/**
 * Stegos Global — website lead handler (Google Apps Script web app).
 *
 * Receives the free-audit / contact form from stegosglobal.com and:
 *   1. emails the lead to CONFIG.TO as a structured table (reply goes straight to the visitor),
 *   2. logs it as a row in the "Leads" tab of the Google Sheet this script is attached to,
 *   3. (optional) sends the visitor a short confirmation email.
 *
 * Setup and deployment steps: see apps-script/README.md in the website repo.
 * The website only sends data here; nothing else is stored outside your Google account.
 */

const CONFIG = {
  TO: "nishant@stegosglobal.com", // where leads are emailed
  SHEET_NAME: "Leads", // tab in the attached Google Sheet (created automatically)
  SEND_CONFIRMATION: true, // email the visitor a short "we got it" message
  BRAND: "Stegos Global",
};

// Order of the fields in the email and the sheet: [form field, label]
const FIELDS = [
  ["source", "Lead type"],
  ["name", "Name"],
  ["brand", "Brand"],
  ["email", "Email"],
  ["phone", "Phone / WhatsApp"],
  ["marketplaces", "Marketplaces"],
  ["message", "Message"],
  ["page", "Page"],
  ["submitted", "Submitted"],
  ["device", "Device"],
];

/** The website POSTs the form here (application/x-www-form-urlencoded). */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const p = (e && e.parameter) || {};

    // Honeypot: real visitors never fill this hidden field. Pretend success to bots.
    if (p._honey) return json_({ success: true });

    const lead = {};
    FIELDS.forEach(([key, label]) => (lead[label] = clip_(p[key], key === "message" ? 3000 : 300)));
    if (!lead["Marketplaces"]) lead["Marketplaces"] = "Not specified";
    if (!lead["Message"]) lead["Message"] = "(none)";

    if (!lead["Name"] || !isEmail_(lead["Email"]) || digits_(lead["Phone / WhatsApp"]) < 8) {
      return json_({ success: false, message: "Please fill in name, a valid email and a phone number." });
    }

    logToSheet_(lead);
    sendLeadEmail_(lead);
    if (CONFIG.SEND_CONFIRMATION) sendConfirmation_(lead["Email"]);

    return json_({ success: true });
  } catch (err) {
    console.error(err);
    return json_({ success: false, message: "Server error" });
  } finally {
    lock.releaseLock();
  }
}

/** Visiting the web-app URL in a browser shows this — handy to check the deployment is live. */
function doGet() {
  return json_({ ok: true, service: CONFIG.BRAND + " lead form" });
}

/** Run this once from the editor (Run ▸ testSetup) to authorise email + sheet access. */
function testSetup() {
  const lead = {};
  FIELDS.forEach(([, label]) => (lead[label] = "TEST"));
  lead["Email"] = CONFIG.TO;
  lead["Name"] = "Setup test (please ignore)";
  lead["Submitted"] = new Date().toString();
  logToSheet_(lead);
  sendLeadEmail_(lead);
}

// ---------------------------------------------------------------------------

function sendLeadEmail_(lead) {
  const rows = FIELDS.map(([, label]) => {
    const value = escape_(lead[label] || "").replace(/\n/g, "<br>");
    return (
      '<tr><th align="left" style="padding:8px 12px;background:#f5f7fb;border:1px solid #e3e8f3;font:600 13px Arial,sans-serif;color:#5a6683;white-space:nowrap;vertical-align:top">' +
      label +
      '</th><td style="padding:8px 12px;border:1px solid #e3e8f3;font:14px Arial,sans-serif;color:#0a1228">' +
      value +
      "</td></tr>"
    );
  }).join("");
  const html =
    '<div style="font:14px Arial,sans-serif;color:#0a1228">' +
    '<p style="margin:0 0 12px"><strong>New website lead</strong> — reply to this email to answer the visitor directly.</p>' +
    '<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;max-width:640px">' +
    rows +
    "</table></div>";
  const text = FIELDS.map(([, label]) => label + ": " + (lead[label] || "")).join("\n");

  MailApp.sendEmail({
    to: CONFIG.TO,
    replyTo: lead["Email"],
    subject: "New lead: " + (lead["Brand"] || lead["Name"]) + " — " + (lead["Lead type"] || "Website"),
    body: text,
    htmlBody: html,
    name: CONFIG.BRAND + " website",
  });
}

// Deliberately generic (does not repeat anything the visitor typed), so the form
// can't be used to send custom text to arbitrary addresses.
function sendConfirmation_(to) {
  MailApp.sendEmail({
    to: to,
    subject: "We've received your enquiry — " + CONFIG.BRAND,
    body:
      "Hi,\n\nThanks for contacting " + CONFIG.BRAND + ". We've received your enquiry and will get back to you shortly.\n\n" +
      "If you didn't send this, you can ignore this email.\n\n— " + CONFIG.BRAND + "\nhttps://stegosglobal.com",
    name: CONFIG.BRAND,
    replyTo: CONFIG.TO,
  });
}

function logToSheet_(lead) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return; // script not attached to a sheet — email only
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(["Received"].concat(FIELDS.map(([, label]) => label)));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, FIELDS.length + 1).setFontWeight("bold");
  }
  // Prefix values that start with = + - @ so the sheet never treats them as formulas.
  const safe = (v) => (/^[=+\-@]/.test(v) ? "'" + v : v);
  sheet.appendRow([new Date()].concat(FIELDS.map(([, label]) => safe(lead[label] || ""))));
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function clip_(v, max) {
  return String(v == null ? "" : v).trim().slice(0, max);
}
function digits_(v) {
  return String(v || "").replace(/\D/g, "").length;
}
function isEmail_(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ""));
}
function escape_(v) {
  return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
