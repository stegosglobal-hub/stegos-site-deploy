/**
 * Single source of truth for site-wide settings.
 * Edit values here — every page reads from this file, so contact details
 * and the form endpoint never need to be changed in the HTML.
 */
window.STEGOS = {
  siteName: "Stegos Global",
  siteUrl: "https://stegosglobal.com", // used for canonical/OG tags in HTML — keep in sync

  // Contact details shown in the contact card, the WhatsApp modal and the footer.
  email: "nishant@stegosglobal.com",
  whatsappNumber: "918796569474", // international format, digits only (no + or spaces)
  whatsappDisplay: "+91 87965 69474",

  // Form delivery via FormSubmit.co (no backend needed).
  // First real submission after deploy triggers an activation email to this address.
  formEndpoint: "https://formsubmit.co/ajax/nishant@stegosglobal.com",
};
