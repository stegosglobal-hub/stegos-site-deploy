/**
 * Case-study data. The homepage "Results" grid and the full case-studies page
 * are both rendered from this list, so adding a case = adding one object here.
 *
 * Fields
 *   id          URL anchor (case-studies.html#<id>) — lowercase, hyphenated, unique
 *   marketplace "amazon" | "flipkart" | "myntra"
 *   category    Anonymised product category (never the brand name)
 *   window      Reporting window label
 *   scope       Short label for what Stegos managed in this account
 *   summary     Plain-language read-out
 *   stats       Exactly three { value, label } pairs
 */
window.STEGOS_CASES = [
  {
    id: "clothing",
    marketplace: "amazon",
    category: "Clothing",
    window: "Live account · Jun–Aug",
    scope: "Amazon Ads",
    summary:
      "Ad spend scaled aggressively while ACOS held steady — paid growth pulled organic sales up with it instead of cannibalising it.",
    stats: [
      { value: "+119%", label: "Spend scaled" },
      { value: "4.02x", label: "ROAS (Aug)" },
      { value: "+91%", label: "Sales growth" },
    ],
  },
  {
    id: "stationery-amazon",
    marketplace: "amazon",
    category: "Stationery",
    window: "Live account · May–Aug",
    scope: "Amazon Ads",
    summary:
      "ACOS wobbled through a mid-year test before settling back down, while TACOS and daily run rate improved through the same window.",
    stats: [
      { value: "+44%", label: "Spend scaled" },
      { value: "4.22x", label: "ROAS (Aug)" },
      { value: "+55%", label: "Sales growth" },
    ],
  },
  {
    id: "stationery-flipkart",
    marketplace: "flipkart",
    category: "Stationery",
    window: "Live account · Jun–Aug",
    scope: "Flipkart Ads",
    summary:
      "Spend scaled 5.7x in three months to capture more inventory. Efficiency softened as expected with that scale, but total sales still grew well ahead of it.",
    stats: [
      { value: "5.7x", label: "Spend scaled" },
      { value: "7.68x", label: "TROI (Aug)" },
      { value: "+127%", label: "Sales growth" },
    ],
  },
  {
    id: "home-decor",
    marketplace: "amazon",
    category: "Home Decor",
    window: "Ads-metrics scope · Dec–Feb",
    scope: "Ads efficiency only",
    summary:
      "A larger portfolio brand where Stegos's mandate is ads efficiency only, not overall business growth. Rising ACOS here is informing the current optimisation plan.",
    stats: [
      { value: "+15%", label: "Ad spend" },
      { value: "22.8%", label: "ACOS (Feb)" },
      { value: "Ads-only", label: "Scope" },
    ],
  },
  {
    id: "phone-cover",
    marketplace: "amazon",
    category: "Phone Cover",
    window: "Live account · Feb–Apr",
    scope: "Amazon Ads",
    summary:
      "Spend scaled faster than total sales through a seasonal test window, with TACoS drifting up as the account leaned further into paid share.",
    stats: [
      { value: "+15%", label: "Ad spend" },
      { value: "15.85%", label: "TACoS (Apr)" },
      { value: "+4%", label: "Sales growth" },
    ],
  },
];

window.STEGOS_MARKETPLACES = {
  amazon: { label: "Amazon ads", dot: "" },
  flipkart: { label: "Flipkart ads", dot: "blue" },
  myntra: { label: "Myntra ads", dot: "pink" },
};
