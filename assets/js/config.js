/**
 * Single source of truth for site-wide settings.
 * Edit values here — every page reads from this file, so contact details
 * and the form endpoint never need to be changed in the HTML.
 */
window.STEGOS = {

  // Contact details shown in the contact card, the WhatsApp modal and the footer.
  email: "nishant@stegosglobal.com",
  whatsappNumber: "918796569474", // international format, digits only (no + or spaces)
  whatsappDisplay: "+91 87965 69474",

  // Form delivery: Google Apps Script web app on the Stegos Google account (apps-script/Code.gs).
  // It emails each lead to the address in Code.gs and logs it in the "Leads" Google Sheet.
  // Paste the deployment's "Web app URL" (ends in /exec) here. See apps-script/README.md.
  formEndpoint: "https://script.google.com/macros/s/AKfycbyyMmUKANpp1rwPn-LYVMNOdC1i8LTrK9BCNeD8akF96bWLwx6DAbs-FyHMItMF9xj2Yw/exec",
};
