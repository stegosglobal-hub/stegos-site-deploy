/**
 * Long-form copy for each case-study page, keyed by the case `id` in assets/js/data.js.
 * The numbers (stats, window, scope) always come from data.js; this file only adds the
 * narrative around them. Keep claims inside what the data supports.
 *
 *   headline   Page <h1>
 *   guides     Slugs of the blog guides that explain this case's metrics (shown as "Learn the metrics")
 *   situation  Array of paragraphs: the starting point and the question
 *   approach   Array of bullets: what the work consisted of
 *   reading    Array of { label, text }: plain-language read-out of each number
 *   outcome    Array of paragraphs: what happened
 *   lessons    Array of bullets: what we took from it
 *   next       One paragraph: what is being watched going forward
 */
export const stories = {
  clothing: {
    headline: "Clothing on Amazon: spend up 119%, ACOS held steady.",
    guides: ["acos-roas-tacos-explained", "scale-ad-spend-without-losing-control", "amazon-sponsored-products-structure"],
    situation: [
      "This is a live Amazon Ads account in the Clothing category, reported over June to August. The question was a common one for apparel sellers: can ad spend be scaled hard without letting the cost of sales run away?",
      "Clothing is competitive and seasonal, so the risk when spend rises is that new budget buys expensive, low-intent clicks. The aim was to grow volume while keeping ACOS in a range the account could carry.",
    ],
    approach: [
      "Structure first: campaigns separated by purpose (discovery, proven terms, product targeting) so budget could be moved with confidence.",
      "Weekly search-term review: converting terms moved into exact campaigns, wasteful terms blocked.",
      "Spend reallocated each week toward the products and campaigns that were converting, rather than raised evenly everywhere.",
      "Budget watched daily on the strongest campaigns so they were not running dry before the day ended.",
    ],
    reading: [
      { label: "Spend scaled +119%", text: "Ad spend more than doubled over the window. Scaling at this rate normally puts pressure on efficiency, which is why the next two numbers matter." },
      { label: "ROAS 4.02x (Aug)", text: "In August the account was credited with about ₹4.02 of ad-attributed sales for every ₹1 of ad spend. That corresponds to an ACOS of roughly 25%." },
      { label: "Sales growth +91%", text: "Total sales grew 91% across the window. Sales grew a little less than spend, which is typical when scaling, and it was achieved with ACOS holding steady." },
    ],
    outcome: [
      "Spend was scaled aggressively while ACOS held steady. The paid growth also pulled organic sales up with it instead of cannibalising them, which is the healthiest pattern to see when scaling advertising.",
      "The takeaway is not that scaling is free. It is that, with a readable structure and a weekly review, a large increase in spend can still land inside an efficiency range you chose in advance.",
    ],
    lessons: [
      "Scale in step with structure: a readable account makes it clear where extra budget is safe.",
      "Watch total sales and organic movement, not only ad-attributed return.",
      "Hold the line on a target ACOS range and treat a move outside it as a signal to pause, not to push.",
    ],
    next: "We continue to review the account weekly, with attention on how much of the sales growth is holding organically as the seasonal pattern changes.",
  },

  "stationery-amazon": {
    headline: "Stationery on Amazon: a mid-year test, a wobble, and a recovery.",
    guides: ["acos-roas-tacos-explained", "search-term-review-negative-keywords", "scale-ad-spend-without-losing-control"],
    situation: [
      "This is a live Amazon Ads account in the Stationery category, reported over May to August. Stationery has clear seasonal peaks, and the account ran a test through the middle of the year to see how much more it could scale.",
      "Tests do not always go in a straight line, and we think it is useful to show one that did not.",
    ],
    approach: [
      "A deliberate mid-year test with increased spend, set up so it could be measured and reversed.",
      "Weekly review of search terms and budgets to find where the test was and was not paying back.",
      "Tightening and re-allocating once ACOS moved, rather than letting the test run unchecked.",
      "Tracking TACoS and daily run rate alongside ACOS to see the effect on the whole account.",
    ],
    reading: [
      { label: "Spend scaled +44%", text: "Spend grew by 44% across the window, a more measured increase than in some of our other accounts." },
      { label: "ROAS 4.22x (Aug)", text: "In August the account was credited with about ₹4.22 of ad-attributed sales for every ₹1 spent, roughly a 24% ACOS." },
      { label: "Sales growth +55%", text: "Total sales grew 55%, ahead of the 44% increase in spend." },
    ],
    outcome: [
      "ACOS wobbled through the mid-year test before settling back down. Over the same window, TACoS and the daily run rate improved.",
      "Sales growth finished ahead of spend growth, which suggests the extra investment was productive overall, even though the path included a rough patch.",
    ],
    lessons: [
      "A temporary rise in ACOS during a test is not necessarily a failure. Judge it against the whole window.",
      "TACoS and run rate tell you whether the account is healthier, not only whether the ads are.",
      "Define in advance how long you will tolerate a wobble before correcting.",
    ],
    next: "Next steps focus on holding the improved run rate and identifying which of the test's additions are worth keeping permanently.",
  },

  "stationery-flipkart": {
    headline: "Stationery on Flipkart: spend scaled 5.7x, sales up 127%.",
    guides: ["flipkart-ads-getting-started", "scale-ad-spend-without-losing-control", "acos-roas-tacos-explained"],
    situation: [
      "This is a live Flipkart Ads account in the Stationery category, reported over June to August. The goal was to capture more inventory opportunity on Flipkart, which meant scaling spend quickly.",
      "We are upfront that efficiency softened as spend grew. This case is about whether the trade was worth it.",
    ],
    approach: [
      "A staged increase in budgets across the three-month window rather than a single jump.",
      "Campaign architecture and targeting reviewed to put the extra spend behind products with stock and demand.",
      "Placement and budget pacing monitored so spend followed demand instead of running ahead of it.",
      "Seller-level reporting reviewed weekly, with actions agreed and tracked.",
    ],
    reading: [
      { label: "Spend scaled 5.7x", text: "Ad spend grew to 5.7 times its starting level over three months. That is a very large increase and a very different account at the end." },
      { label: "TROI 7.68x (Aug)", text: "Flipkart's total return on ad investment was 7.68x in August. TROI is Flipkart's measure and is not directly comparable to Amazon's ROAS." },
      { label: "Sales growth +127%", text: "Total sales more than doubled, up 127%. Sales grew less than spend did, which is why return per rupee softened." },
    ],
    outcome: [
      "Efficiency softened as expected with that scale, but total sales still grew well ahead of what the account started with.",
      "This is a scale-first outcome: it makes sense where there is stock, demand and margin to support it, and less sense where margins are thin. Whether it is the right trade depends on what the account is trying to achieve.",
    ],
    lessons: [
      "Decide in advance whether you are optimising for efficiency or for scale, because you rarely get both at once.",
      "Large scaling needs inventory depth. Spend behind products that run out is wasted.",
      "Compare Flipkart figures to Flipkart figures; do not read TROI as ROAS.",
    ],
    next: "We are now looking at which of the added spend is most efficient to keep, and where the account can recover some return without giving up the new level of sales.",
  },

  "home-decor": {
    headline: "Home Decor on Amazon: ads-only scope, and a rising ACOS we are working on.",
    guides: ["acos-roas-tacos-explained", "search-term-review-negative-keywords", "fix-listing-before-raising-ad-budget"],
    situation: [
      "This is a larger portfolio brand where Stegos's mandate covers ads efficiency only, not overall business growth. The reporting window runs from December to February.",
      "We include it because it is not a clean win, and because the scope matters when reading the numbers.",
    ],
    approach: [
      "Ads-efficiency work only: structure, search-term control and budget allocation within the existing campaigns.",
      "Monitoring ACOS by campaign to see where the increase was coming from.",
      "Using the rising ACOS as the starting point for the current optimisation plan, not as something to explain away.",
    ],
    reading: [
      { label: "Ad spend +15%", text: "Ad spend rose 15% across the window, a modest increase." },
      { label: "ACOS 22.8% (Feb)", text: "In February the account's ACOS was 22.8%, equivalent to roughly 4.4x ROAS. That is not high in isolation, but the direction of travel is up." },
      { label: "Scope: Ads-only", text: "Stegos does not control pricing, inventory, listings or the wider business here, which limits what ads work alone can fix." },
    ],
    outcome: [
      "ACOS has been rising. That is informing the current optimisation plan, which looks at where efficiency is leaking inside the campaigns we control.",
      "It is a good example of why scope matters: some causes of a rising ACOS, such as price or catalogue issues, sit outside an ads-only mandate and need to be raised with the brand rather than solved in the account.",
    ],
    lessons: [
      "Rising ACOS is a prompt to investigate, not to explain. The first question is always where the increase is concentrated.",
      "When scope is limited, say so, and say which levers are out of reach.",
      "Show the awkward accounts alongside the good ones. It is the only honest way to present results.",
    ],
    next: "The next review focuses on the campaigns driving the increase and on whether any of the causes should be raised with the brand outside the ads scope.",
  },

  "phone-cover": {
    headline: "Phone Cover on Amazon: spend ahead of sales, and what we did about it.",
    guides: ["acos-roas-tacos-explained", "scale-ad-spend-without-losing-control", "fix-listing-before-raising-ad-budget"],
    situation: [
      "This is a live Amazon Ads account in the Phone Cover category, reported over February to April. Phone covers are a fast-moving, price-sensitive category with seasonal and launch-driven spikes.",
      "A seasonal test window saw spend increase faster than total sales, and we think the lesson is more useful than a tidy success story.",
    ],
    approach: [
      "A seasonal test with increased spend, tracked weekly against total sales and TACoS.",
      "Review of where the added budget was and was not converting.",
      "Tightening campaigns that were leaning on paid share while organic stayed flat.",
    ],
    reading: [
      { label: "Ad spend +15%", text: "Spend rose 15% over the window." },
      { label: "TACoS 15.85% (Apr)", text: "In April, ad spend was 15.85% of total sales, organic included. TACoS drifting up means ads were taking a larger share of the account's sales." },
      { label: "Sales growth +4%", text: "Total sales grew only 4%, so spend grew considerably faster than sales." },
    ],
    outcome: [
      "Spend scaled faster than total sales through the test, and TACoS drifted up as the account leaned further into paid share.",
      "That is the signal we look for to say the test has gone far enough. It told us to slow down and tighten rather than push further.",
    ],
    lessons: [
      "If total sales are not moving, extra spend is mostly buying sales you might have had anyway.",
      "TACoS is the early warning that paid share is growing faster than the business.",
      "A test that tells you where the limit is has still done its job.",
    ],
    next: "We are rebalancing toward the products and search terms that grow total sales, and watching TACoS to see whether it settles back.",
  },
};
