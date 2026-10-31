// AUTO-GENERATED from design/spike-003-blog.html — edit the mockup, then re-run design/convert_mockups.py

export default function BlogSections() {
  return (
    <>
    <header className="page-hero">
      <div className="page-hero-inner">
<span className="eyebrow"><span className="dot"></span>Blog</span>
        <h1 className="pg">
Inside <span className="serif">the rails.</span>        </h1>
        <p className="sub">
Settlement, cross-border payments, and regulation — for treasury teams and the platforms that move money.        </p>
      </div>
    </header>
    <main>
      <div className="tabs reveal">
<button className="tab on">All</button><button className="tab">Product</button><button className="tab">OTC & Settlement</button><button className="tab">Regulatory</button><button className="tab">Partners</button><button className="tab">Knowledge Base</button>      </div>
<a className="feat reveal" href="spike-003-article.html">
      <div>
<span className="cat cat-y">Product</span>
        <h2>
US virtual accounts: the quiet <span className="serif">on-ramp</span> for stablecoin businesses        </h2>
        <p>
Stablecoins settle instantly — but most customers still live in bank accounts. Here is how a dedicated US virtual account turns ACH bank transfers into collectible, convertible fiat on the same rails as your crypto checkout.        </p>
        <div className="meta">
<b>Jeffery Oke-Samuel</b><span>Sep 2, 2026</span><span>8 min read</span>        </div>
      </div>
      <div className="cover cover-y">
<span className="glyph">$</span><span className="tag">Collection · USDC · ACH</span>      </div>
</a>
      <div className="grid">
<a className="post reveal" href="spike-003-article.html">
        <div className="cover cover-n">
<span className="glyph">⇄</span><span className="tag cat-n">Knowledge Base</span>        </div>
        <div className="body">
          <h3>
The real cost of SWIFT on the Lagos–London corridor          </h3>
          <p className="ex">
Fees, spread, and three days of float — itemised line by line, next to what the same payment costs on stablecoin rails.          </p>
          <div className="meta">
<b>Research Desk</b><span>Aug 27, 2026</span>          </div>
        </div>
</a> <a className="post reveal" href="spike-003-article.html">
        <div className="cover cover-y">
<span className="glyph">₦</span><span className="tag">Knowledge Base</span>        </div>
        <div className="body">
          <h3>
Seven markets, one payout run: settling payroll for a remote team          </h3>
          <p className="ex">
One API call, seven currencies, no per-country banking relationships. How a payout run actually looks on Coinomad.          </p>
          <div className="meta">
<b>Jethro Ayodele</b><span>Aug 19, 2026</span>          </div>
        </div>
</a> <a className="post reveal" href="spike-003-article.html">
        <div className="cover cover-g">
<span className="glyph">§</span><span className="tag cat-g">Regulatory</span>        </div>
        <div className="body">
          <h3>
Stablecoin regulation is settling — here's how to read it          </h3>
          <p className="ex">
The rules around stablecoin settlement are maturing fast. What treasury teams and platforms should track before they integrate.          </p>
          <div className="meta">
<b>Jeffery Oke-Samuel</b><span>Aug 12, 2026</span>          </div>
        </div>
</a> <a className="post reveal" href="spike-003-article.html">
        <div className="cover cover-n">
<span className="glyph">◉</span><span className="tag cat-n">Knowledge Base</span>        </div>
        <div className="body">
          <h3>
Base, Polygon, or Solana: which network should your checkout support?          </h3>
          <p className="ex">
Gas, finality, and where your customers already hold USDC. A practical matrix for store owners, not protocol maximalists.          </p>
          <div className="meta">
<b>Research Desk</b><span>Aug 4, 2026</span>          </div>
        </div>
</a> <a className="post reveal" href="spike-003-article.html">
        <div className="cover cover-g">
<span className="glyph">⬡</span><span className="tag cat-g">OTC & Settlement</span>        </div>
        <div className="body">
          <h3>
Why a non-custodial desk keeps treasury teams sleeping at night          </h3>
          <p className="ex">
You keep the keys, we move the money. The control model behind Coinomad OTC — and the questions every CFO should ask.          </p>
          <div className="meta">
<b>Jethro Ayodele</b><span>Jul 28, 2026</span>          </div>
        </div>
</a> <a className="post reveal" href="spike-003-article.html">
        <div className="cover cover-y">
<span className="glyph">↗</span><span className="tag">Product</span>        </div>
        <div className="body">
          <h3>
Payment links are still the fastest way to get paid          </h3>
          <p className="ex">
No storefront, no code, no excuses. How one link turned a WhatsApp catalogue into a working checkout.          </p>
          <div className="meta">
<b>Product Team</b><span>Jul 21, 2026</span>          </div>
        </div>
</a>      </div>
    </main>
    <section className="newsletter reveal">
      <div className="nl-box">
        <div>
          <h2>
The Coinomad <span className="serif">pulse.</span>          </h2>
          <p>
Rails, rates, and regulatory shifts — once a month, no noise. Read by the people who move money across borders.          </p>
        </div>
        <form className="nl-form" onSubmit={(e) => e.preventDefault()}>
<input type="email" placeholder="you@company.com" aria-label="Email address" /><button className="btn btn-primary" type="submit">Subscribe</button>        </form>
      </div>
    </section>
    <p className="disclaimer">
Posts are for general information only and are not financial, legal, or investment advice. Corridor figures reflect Coinomad's live operating footprint at time of writing.    </p>
    </>
  );
}
