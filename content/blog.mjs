/**
 * Blog posts. To add a post: append an object to `posts`, then run
 *   npm run generate && npm run stamp
 * Each post becomes blog-<slug>.html and appears on blog.html and the home page teaser.
 *
 * Fields
 *   slug         URL part  → blog-<slug>.html (lowercase, hyphenated, unique)
 *   title        Page <h1> and <title>
 *   description  ~150 characters, used for the meta description and the card
 *   tag          "Amazon" | "Flipkart" | "Myntra" | "Strategy"
 *   date         YYYY-MM-DD publication date (edit freely)
 *   takeaways    3 short bullets shown in the summary box
 *   body         HTML (h2, p, ul/ol, strong, a). Do not include an h1.
 */
export const posts = [
  {
    slug: "acos-roas-tacos-explained",
    title: "ACOS, ROAS and TACoS: which number should you actually manage to?",
    description:
      "Three metrics, three different questions. Here is what each one tells you, how they relate, and how to set a target from your own margin.",
    tag: "Strategy",
    date: "2026-10-08",
    takeaways: [
      "ROAS and ACOS describe the same ratio from opposite ends. TACoS adds your organic sales to the picture.",
      "Your break-even ACOS comes from your margin before ads, not from a benchmark.",
      "Watch TACoS to see whether ads are lifting the whole account or just renting sales.",
    ],
    body: `
<p>Open any marketplace ads dashboard and you will meet the same three acronyms. They are easy to mix up, and managing to the wrong one is one of the most common reasons good accounts drift.</p>

<h2>ROAS: how many rupees of sales per rupee of ads</h2>
<p><strong>Return on ad spend</strong> is ad-attributed sales divided by ad spend. A ROAS of 4.0x means every ₹1 spent is credited with ₹4 of sales. It is the number most people quote because bigger feels better.</p>
<div class="formula">ROAS = ad sales ÷ ad spend<small>Example: ₹40,000 of ad sales from ₹10,000 of spend = 4.0x</small></div>

<h2>ACOS: the same ratio, upside down</h2>
<p><strong>Advertising cost of sales</strong> is ad spend divided by ad-attributed sales, shown as a percentage. It is simply the inverse of ROAS: a 25% ACOS is a 4.0x ROAS. Neither is more correct. Pick one and use it consistently so the team is not translating in meetings.</p>
<div class="formula">ACOS = ad spend ÷ ad sales = 1 ÷ ROAS<small>Example: ₹10,000 of spend on ₹40,000 of ad sales = 25%</small></div>

<h2>TACoS: ads against the whole business</h2>
<p><strong>Total advertising cost of sales</strong> is ad spend divided by <em>total</em> sales, organic included. ROAS and ACOS only look at sales the ad gets credit for. TACoS asks a bigger question: as I spend on ads, is the whole account getting healthier?</p>
<p><div class="formula">TACoS = ad spend ÷ total sales (ad + organic)<small>Example: ₹10,000 of spend on ₹80,000 of total sales = 12.5%</small></div>
<p>If TACoS falls while sales grow, ads are helping products rank and convert organically. If TACoS climbs while total sales stay flat, you are mostly paying for sales that would have come anyway.</p>

<h2>Set the target from margin, not from a benchmark</h2>
<p>Your break-even ACOS is the share of the selling price left after product cost, marketplace fees, shipping and returns, before ads. A simple illustration:</p>
<ul>
  <li>Selling price ₹1,000. After cost, fees and shipping you keep ₹300.</li>
  <li>Break-even ACOS is 30%. Break-even ROAS is 1 ÷ 0.30, about 3.3x.</li>
  <li>Spending to a 30% ACOS means the ad sale makes no profit, but it may still be worth it for a new product that needs rank and reviews.</li>
</ul>
<div class="callout"><b>Worked example</b>Price ₹1,000, ₹300 left after cost, fees and shipping. Break-even ACOS = 300 ÷ 1,000 = 30%. Any campaign running above 30% ACOS loses money on each ad-attributed sale, unless it is deliberately buying rank or reviews.</div>
<p>The right target is usually different by product and by goal. A mature bestseller should run well below break-even. A launch can run above it for a defined period.</p>

<h2>A practical way to use all three</h2>
<ol>
  <li>Use <strong>ACOS or ROAS</strong> to judge individual campaigns and keywords.</li>
  <li>Use <strong>TACoS</strong> to judge the account and the overall budget.</li>
  <li>Review all three together weekly, and write down what you changed because of them.</li>
</ol>
<p>If you would like these numbers read against your own account, that is exactly what the free audit does.</p>
`,
  },
  {
    slug: "amazon-sponsored-products-structure",
    title: "How to structure Amazon Sponsored Products so you can actually read them",
    description:
      "A clean campaign structure turns an ad account from a pile of numbers into something you can act on every week. Here is a simple, repeatable layout.",
    tag: "Amazon",
    date: "2026-10-01",
    takeaways: [
      "Separate discovery from proven keywords so each has its own budget and target.",
      "Name campaigns so anyone can tell the product, match type and purpose at a glance.",
      "Move winners from discovery into exact campaigns, and block them in the source.",
    ],
    body: `
<p>Most struggling Amazon ad accounts do not have a bidding problem. They have a structure problem: one campaign holding many products, many match types and no clear purpose, so nobody can say what is working.</p>

<h2>Start with the job each campaign does</h2>
<p>Give every campaign one job. A common, readable layout for a product line looks like this:</p>
<ul>
  <li><strong>Discovery (auto):</strong> lets Amazon match your listing to searches and products you did not think of. Lower bids, treated as research.</li>
  <li><strong>Broad / phrase:</strong> explores variations around keywords you already believe in.</li>
  <li><strong>Exact:</strong> only proven search terms. This is where you spend with confidence and bid for position.</li>
  <li><strong>Product targeting:</strong> your own ASINs (defence) and selected competitor or complementary ASINs.</li>
</ul>

<h2>Keep branded and non-branded apart</h2>
<p>Searches for your brand name convert differently and cost less than generic searches. Mixed together, branded terms flatter the averages and hide how generic campaigns are really performing. Run them as separate campaigns so each has an honest ACOS.</p>

<h2>Group by economics, not by convenience</h2>
<p>Products with very different margins or prices should not share a budget. A high-margin item can afford a higher ACOS than a thin-margin one. Putting both in one campaign forces a single target that is wrong for at least one of them.</p>

<h2>Name things so they explain themselves</h2>
<p>A simple convention pays for itself within a month. For example: <em>Product line | Match type | Purpose</em>, such as "Notebooks | Exact | Proven". Anyone opening the account, including you in six months, can read it without a guide.</p>

<h2>The weekly loop that makes the structure work</h2>
<ol>
  <li>Review the search-term report of the discovery and broad campaigns.</li>
  <li>Take terms that convert at an acceptable ACOS and add them to the exact campaign.</li>
  <li>Add those same terms as negative exact in the source campaign, so the two do not bid against each other.</li>
  <li>Add clear non-converters as negatives.</li>
  <li>Check that your best campaigns are not running out of budget before the day ends.</li>
</ol>

<h2>Sponsored Brands and Display</h2>
<p>Sponsored Brands (which requires Brand Registry) and Sponsored Display are useful layers once Sponsored Products is stable. Add them after the basics are readable, not instead of them.</p>
<p>A structure like this is the starting point of our account audit: before changing a single bid, we map what each campaign is for.</p>
`,
  },
  {
    slug: "search-term-review-negative-keywords",
    title: "Stop paying for clicks that cannot convert: a weekly search-term review",
    description:
      "A simple weekly routine for finding wasted spend in your Amazon search-term report, with a way to decide when a term has had enough chances.",
    tag: "Amazon",
    date: "2026-09-24",
    takeaways: [
      "Wasted spend hides in search terms, not in the keywords you chose.",
      "Decide how many clicks a term gets from your own conversion rate, not from a rule of thumb.",
      "Negatives are protective, but review them too so you do not block real demand.",
    ],
    body: `
<p>The search-term report shows the actual words shoppers typed before clicking your ad. It is the most honest document in your account, and it is usually where the most avoidable waste sits.</p>

<h2>Set a click budget per term from your own conversion rate</h2>
<div class="formula">Click budget ≈ (1 ÷ conversion rate) × 2<small>Example: 10% conversion → about 10 clicks per order → judge a term after ~20 clicks</small></div>
<p>If your product converts about 10% of clicks into orders, you would expect roughly one order per ten clicks. A term that has taken two or three times that many clicks with no order has had a fair chance. The same term with only four clicks has not.</p>
<p>Work this out per product. A high-priced item with a low conversion rate needs far more clicks before you can judge a term than a cheap, easy-to-buy one.</p>

<h2>The weekly routine</h2>
<ol>
  <li><strong>Export</strong> the last 14 to 30 days of search terms for your discovery and broad campaigns.</li>
  <li><strong>Sort by spend.</strong> Start with the terms that cost the most; small amounts can wait.</li>
  <li><strong>Mark winners:</strong> terms converting at or better than your target ACOS. These graduate to your exact campaign.</li>
  <li><strong>Mark losers:</strong> terms past their click budget with no orders. Add them as negative exact (or negative phrase if the whole idea is wrong).</li>
  <li><strong>Mark the undecided:</strong> not enough data yet. Leave them and look again next week.</li>
</ol>

<h2>Three kinds of waste to look for</h2>
<ul>
  <li><strong>Irrelevant intent:</strong> the shopper wanted something your product is not (wrong size, type or use).</li>
  <li><strong>Competitor brand names</strong> that you did not choose to target and that rarely convert.</li>
  <li><strong>Overlap:</strong> the same term bidding in two of your own campaigns, so you compete with yourself.</li>
</ul>

<h2>Be careful with negatives</h2>
<div class="callout"><b>Watch out</b>Seasonal terms can look dead in the off-season and be valuable in-season. Log every negative with the date and the reason, and review the log each quarter.</div>
<p>A negative keyword is a permanent door closed until someone reopens it. Prefer negative exact over negative phrase when you are unsure, keep a log of what you added and why, and review the log every quarter. Seasonal terms in particular can look dead in the off-season and be valuable in-season.</p>
<p>This is the kind of habit that separates an account that gets steadily cleaner from one that just keeps spending.</p>
`,
  },
  {
    slug: "flipkart-ads-getting-started",
    title: "Flipkart Ads for sellers: what to get right before you raise the budget",
    description:
      "Advertising on Flipkart rewards a healthy catalogue and steady pacing. A practical checklist of what to check first and what to watch after launch.",
    tag: "Flipkart",
    date: "2026-09-17",
    takeaways: [
      "An ad can only amplify the listing it points to: fix images, price and stock first.",
      "Pace budgets deliberately; Flipkart traffic moves hard around sale events.",
      "Judge the account by Flipkart's own return figure and by your total sales trend.",
    ],
    body: `
<p>Flipkart is a different auction from Amazon, with its own shopper habits, its own ad products and its own reporting terms. The most common mistake we see is treating it as Amazon with a different logo.</p>

<h2>Check the listing before the campaign</h2>
<p>Ads put more eyes on your product page. If the page is weak, you pay to show it to more people. Before launching, check:</p>
<ul>
  <li><strong>Images:</strong> clear, complete and consistent across variants.</li>
  <li><strong>Title and attributes:</strong> accurate, searchable and fully filled in, because they drive discovery.</li>
  <li><strong>Price:</strong> competitive against similar products shown next to yours.</li>
  <li><strong>Stock:</strong> enough to last the campaign. Running ads on a product that goes out of stock wastes the momentum.</li>
</ul>

<h2>Understand the report you are reading</h2>
<p>Flipkart reports return in its own terms, and the definitions differ from Amazon's. On our case studies we use TROI, Flipkart's total return on ad investment, in place of ROAS. Whatever figure you use, make sure everyone reading the report means the same thing by it, and compare like with like over time.</p>

<h2>Plan for sale-event swings</h2>
<p>Traffic and competition spike around major sale events, and costs usually move with them. Decide in advance how much you are willing to spend per day, what return you need to keep spending, and who checks the account while the event runs. Raising budgets in steps and watching the result is safer than a single large jump.</p>

<h2>Scaling honestly</h2>
<p>When spend grows quickly, efficiency often softens before it recovers, and that is not automatically a failure if total sales grow ahead of it. One of our Flipkart accounts is a good example: spend scaled 5.7x over three months, return per rupee fell as expected, and total sales still grew 127%. The point is to decide the trade-off on purpose and measure it, rather than discover it later.</p>

<h2>A simple first-month rhythm</h2>
<ol>
  <li>Week 1: listing check, campaign setup, conservative budgets.</li>
  <li>Week 2: review what is getting impressions and clicks; trim obvious waste.</li>
  <li>Week 3: shift budget toward products that convert.</li>
  <li>Week 4: decide what to scale next month, and write down why.</li>
</ol>
`,
  },
  {
    slug: "myntra-ads-fashion-seasonality",
    title: "Planning Myntra advertising around fashion seasonality",
    description:
      "Fashion demand moves in waves. How to line up assortment, size availability and ad budgets so Myntra spend meets demand instead of chasing it.",
    tag: "Myntra",
    date: "2026-09-10",
    takeaways: [
      "In fashion, availability (especially sizes) decides whether an ad can convert.",
      "Plan spend by season and drop, then review at SKU level, not just at brand level.",
      "Returns matter: a sale that comes back is not a sale.",
    ],
    body: `
<p>Fashion shoppers do not browse a catalogue so much as follow moments: a new season, a festive week, a wedding calendar, a weather change. Advertising on Myntra works best when budgets follow that rhythm rather than staying flat all year.</p>

<h2>Start with the assortment, not the budget</h2>
<p>Before deciding how much to spend, look at what you actually have to sell. Which styles are new, which are in-season, which are being cleared? Putting the same budget behind everything wastes money on items that will not convert and starves the ones that will.</p>

<h2>Sizes decide conversion</h2>
<p>A product with a broken size run looks available but frustrates the shopper who cannot find their size. Click-through can look healthy while conversion quietly drops. Check size availability before putting spend behind a style, and pause or reduce spend when the popular sizes run out.</p>

<h2>Plan by season and by drop</h2>
<ul>
  <li><strong>Lead-in:</strong> build visibility a little before demand peaks, so products have impressions and history when shoppers arrive.</li>
  <li><strong>Peak:</strong> move budget toward the styles that are converting and have stock depth.</li>
  <li><strong>Tail:</strong> reduce spend as demand fades, and decide deliberately which styles you are clearing.</li>
</ul>

<h2>Review at SKU level</h2>
<p>Averages hide a lot in fashion. A few hero styles often carry most of the result while many others only add cost. Looking at each style on its own lets you keep the budget where the demand is and stop paying for the rest.</p>

<h2>Do not ignore returns</h2>
<p>Fashion has naturally higher returns than many categories. When judging an ad result, think about the sales that stay sold. A style that converts well but returns often may be worth less than its headline return suggests.</p>

<h2>A weekly Myntra review</h2>
<ol>
  <li>Which styles drove the result this week, and do they still have size depth?</li>
  <li>Which styles took spend without converting?</li>
  <li>What is coming next in the season, and does the budget plan match it?</li>
</ol>
`,
  },
  {
    slug: "fix-listing-before-raising-ad-budget",
    title: "Fix the listing before you raise the ad budget",
    description:
      "Ads send shoppers to your product page. If the page does not convert, more spend just buys more of the same result. A pre-spend checklist.",
    tag: "Strategy",
    date: "2026-09-03",
    takeaways: [
      "Conversion rate is the multiplier on every rupee of ad spend.",
      "Images, title, price, reviews and stock are checked before budgets go up.",
      "Run a catalogue health check as part of every audit, not as an afterthought.",
    ],
    body: `
<p>When an account is not performing, the instinct is to look at the ads: bids, keywords, budgets. Often the real leak is one step later, on the product page itself.</p>

<h2>Conversion rate multiplies everything</h2>
<p>Imagine two sellers pay the same for the same clicks. One page converts 5% of visitors, the other 10%. The second seller gets twice the orders, so their cost per order is half. Improving conversion lowers your ACOS without touching a single bid.</p>

<h2>The pre-spend checklist</h2>
<ul>
  <li><strong>Images:</strong> a clear main image, then images that show size, use, detail and what is in the box.</li>
  <li><strong>Title and bullets:</strong> written for the shopper first and search second. Accurate, specific and complete.</li>
  <li><strong>A+ / enhanced content:</strong> where available, it can answer questions before they are asked.</li>
  <li><strong>Price:</strong> compared with the products shown beside yours, not in isolation.</li>
  <li><strong>Ratings and reviews:</strong> read the low ones. They tell you what the page does not explain.</li>
  <li><strong>Stock and delivery:</strong> advertise only what you can ship promptly.</li>
  <li><strong>Variations and compliance:</strong> broken variation families and missing attributes quietly cost you visibility.</li>
</ul>

<h2>Use ad data to find listing problems</h2>
<p>A product with plenty of impressions and clicks but few orders is telling you something. Either the traffic is wrong (a search-term problem) or the page is wrong (a listing problem). Compare conversion across similar products: if one converts well and another does not, the difference is usually on the page.</p>

<h2>Where cataloguing fits</h2>
<p>This is why we offer cataloguing as an add-on across all marketplaces: listing creation and optimisation, A+ content coordination, catalogue health audits, and variation and compliance fixes. When the listing and the ads are looked at together, each makes the other cheaper to run.</p>
`,
  },
  {
    slug: "scale-ad-spend-without-losing-control",
    title: "How to scale ad spend without losing control of efficiency",
    description:
      "Growing spend usually costs some efficiency. The goal is to choose how much, watch the right signals, and know when to hold. A calm approach to scaling.",
    tag: "Strategy",
    date: "2026-08-27",
    takeaways: [
      "Expect efficiency to soften as spend grows, and decide in advance how much is acceptable.",
      "Scale in steps and give each step time before judging it.",
      "Judge scaling by total sales and TACoS, not by ad-attributed ROAS alone.",
    ],
    body: `
<p>Every ad account eventually hits the same question: can we spend more? The honest answer is usually yes, with a trade-off. The first dollar of spend goes to your best opportunities; the next goes to slightly worse ones. Scaling means deliberately moving down that curve.</p>

<h2>Decide the trade-off before you start</h2>
<p>Write down two numbers: how much extra spend you want to try, and the least efficiency you will accept in return. For example, "up to 30% more spend, as long as ACOS stays below break-even." Without that line, every wobble becomes a debate.</p>

<h2>Scale in steps</h2>
<p>Large jumps change many things at once: more competition, more placements, new search terms. Smaller steps make the cause of any change visible. After each step, wait long enough to see a full cycle of your demand before the next one; a week is the minimum for most products.</p>

<h2>Scale what is already working</h2>
<ul>
  <li>Raise budgets first on campaigns that are limited by budget and hitting target.</li>
  <li>Widen reach on proven keywords before opening many new ones.</li>
  <li>Keep discovery running at a modest level so new opportunities keep arriving.</li>
</ul>

<h2>Look at the whole account</h2>
<p>Ad-attributed return will often dip as you scale. The question is what happens to total sales. In one of our Amazon accounts, spend grew 119% while ACOS held steady and sales grew 91%, with paid growth pulling organic sales up alongside it. In another account, spend scaled faster than total sales and TACoS drifted up, which told us to slow down and tighten. Same method, different signals, different decisions.</p>

<h2>Know when to hold or pull back</h2>
<ol>
  <li>TACoS rising while total sales stay flat.</li>
  <li>Stock running low on the products receiving the extra budget.</li>
  <li>Conversion rate falling on the products you scaled.</li>
</ol>
<p>Any of these is a reason to pause the next step, fix the cause and resume. Scaling is a series of small, reversible decisions, not one big bet.</p>
`,
  },
  {
    slug: "festive-season-ad-planning",
    title: "Festive-season ad planning for Amazon and Flipkart sellers",
    description:
      "The big sale events reward preparation. A before, during and after plan for inventory, listings, budgets and monitoring.",
    tag: "Strategy",
    date: "2026-08-20",
    takeaways: [
      "Most festive-season results are decided in the weeks before the sale starts.",
      "Inventory and listings come first; budgets and bids come second.",
      "Agree your daily spend limits and who is watching before the event begins.",
    ],
    body: `
<p>The big festive sale events on Amazon and Flipkart compress months of demand into days. Sellers who prepare tend to be the ones who benefit; sellers who start on the first day mostly pay for the competition.</p>

<h2>Before: the preparation window</h2>
<ul>
  <li><strong>Inventory:</strong> estimate demand honestly and make sure stock is in the right place with some buffer. Running out in the middle of the event is the costliest mistake.</li>
  <li><strong>Listings:</strong> refresh images, titles and content for your top products. Fix any listing errors or suppressed variations now.</li>
  <li><strong>Promotions:</strong> decide which products carry deals or coupons, and what discount your margin can bear.</li>
  <li><strong>Campaigns:</strong> build and test them ahead of time so they already have history. Keep proven keywords in exact campaigns and have budgets ready to raise.</li>
</ul>

<h2>During: monitor, do not just spend</h2>
<p>During the event, search volume and bids move quickly. Agree beforehand:</p>
<ol>
  <li>The daily spend ceiling for the account and for each key product.</li>
  <li>The efficiency level below which you will pull back.</li>
  <li>Who checks the account, and how often, each day of the event.</li>
</ol>
<p>Check that your best campaigns are not out of budget early in the day, and that products getting ad spend are still in stock.</p>

<h2>After: do not switch off blindly</h2>
<p>Demand falls after the event, and so should spend, but do it deliberately. Reduce budgets in steps, review which products and search terms actually delivered, and write down what you would repeat. The learnings are the real asset going into the next season.</p>

<h2>Keep expectations grounded</h2>
<p>Event-period results are not a forecast of normal months. Judge the event on its own terms: total sales, TACoS and what it did to your organic ranking afterwards, not only on ad-attributed return.</p>
`,
  },
];

/**
 * Learning-path metadata (kept separate so the posts stay easy to read).
 *   order     lesson number in the recommended reading order
 *   level     "Beginner" | "Intermediate"
 *   practice  the "Try it yourself" task at the end of the lesson
 */
export const meta = {
  "acos-roas-tacos-explained": {
    order: 1,
    level: "Beginner",
    practice:
      "Open your ads report for the last 30 days. Write down ad spend, ad sales and total sales, then calculate your ROAS, ACOS and TACoS. Work out your break-even ACOS from your own margin and mark every campaign that sits above it.",
  },
  "amazon-sponsored-products-structure": {
    order: 2,
    level: "Beginner",
    practice:
      "List your campaigns in a sheet with three columns: product line, match type and purpose. Any campaign you cannot describe in one line is a candidate for splitting. Add the naming convention you will use from now on.",
  },
  "search-term-review-negative-keywords": {
    order: 3,
    level: "Intermediate",
    practice:
      "Pull 30 days of search terms. For your top five products, work out a click budget (1 ÷ conversion rate × 2) and mark every term that is past it with no orders. Add those as negatives and log the date and reason.",
  },
  "fix-listing-before-raising-ad-budget": {
    order: 4,
    level: "Beginner",
    practice:
      "Pick your three highest-spend products. Score each listing from 1 to 5 on images, title, price, reviews and stock. Fix the lowest score before you change a single bid.",
  },
  "scale-ad-spend-without-losing-control": {
    order: 5,
    level: "Intermediate",
    practice:
      "Write your scaling rule on one line: how much extra spend you will try, and the least efficiency you will accept in return. Then choose the one budget-limited campaign you would raise first.",
  },
  "flipkart-ads-getting-started": {
    order: 6,
    level: "Beginner",
    practice:
      "Check stock, price and images on your top Flipkart products. Then find where your Flipkart report shows return, and write down its exact name and definition so everyone reads it the same way.",
  },
  "myntra-ads-fashion-seasonality": {
    order: 7,
    level: "Intermediate",
    practice:
      "For your top ten styles, list which sizes are in stock. Mark any style with a broken size run and decide whether to pause it or reduce its spend until stock is back.",
  },
  "festive-season-ad-planning": {
    order: 8,
    level: "Intermediate",
    practice:
      "Make a one-page plan with three columns: before, during and after. For each, list inventory, listing fixes, the daily spend ceiling and who checks the account.",
  },
};
