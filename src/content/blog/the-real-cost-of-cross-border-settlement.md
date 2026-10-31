---
title: "The real cost of cross-border settlement"
slug: the-real-cost-of-cross-border-settlement
category: Knowledge Base
author: Research Desk
date: 2026-10-19
readMins: 7
excerpt: Correspondent banking, FX spread, and days of float — itemising what a cross-border payment actually costs, and what stablecoin rails do differently.
hero: /blog/the-real-cost-of-cross-border-settlement/hero.png
tags: [cross-border, fx, correspondent-banking, treasury]
draft: true
---

# The real cost of cross-border settlement

Ask a CFO what a cross-border payment costs and they'll usually quote the headline fee — the $15–50 wire charge. That's the part on the invoice. It is rarely the expensive part.

This post itemises where the money actually goes when value crosses a border the traditional way, and what changes on stablecoin rails.

## The correspondent chain

When you send a payment across borders, your money doesn't go straight from your bank to theirs. It usually hops through one or more correspondent banks — intermediaries that hold accounts with each other to pass value along.

Every hop adds three things: a fee, a delay, and a cut-off time. A payment started after the cut-off waits until the next business day. A payment that crosses two correspondent banks waits twice.

The result is the shape most treasury teams know by heart: a payment leaves the account instantly and arrives three to five days later.

## Where the cost hides

**FX spread.** On many corridors, the spread between the rate your bank buys at and the rate it sells at is 3–8%. On a $100,000 payment, that's $3,000–8,000 that never appears on any fee line — it's priced into the rate.

**Intermediary fees.** Each correspondent bank in the chain can deduct a fee as the payment passes through. You don't approve these; you discover them when the recipient receives less than you sent.

**Float.** Money in transit is capital you can't use. Three days of float on a payroll run or a supplier invoice is real cost — it's cash locked out of your own accounts, and it compounds across every payment you make in a month.

**Cut-offs and exceptions.** A payment that misses the cut-off, or gets held for a compliance review, doesn't just arrive late — someone on your team spends time chasing it.

## The scale of the problem

Cross-border settlement matters because the flows are enormous — and growing. Sub-Saharan Africa alone saw roughly $205 billion in crypto-driven volume, with Nigeria accounting for about $92 billion of it, at a time when merchant tools and affordable rails lagged badly behind.

The volume is there. The infrastructure has been the bottleneck.

## What stablecoin rails do differently

On a stablecoin rail, there is no correspondent chain. Value moves as a digital dollar or euro that settles in minutes, 24/7, on open infrastructure.

The line items that disappear are exactly the ones above:

- **Spread** is compressed to the actual conversion cost, not a bank's retail margin.
- **Intermediary fees** drop to zero — there are no correspondent banks.
- **Float** shrinks from days to minutes, because settlement is near-instant.
- **Cut-offs** stop mattering, because the rails never close.

The last mile — landing in a real bank account someone can use — is handled through local clearing: ACH, SEPA, PIX, SPEI, Interac, and NGN rails, so the speed isn't lost at the destination.

## The question worth asking

Most teams have never added up the true cost of a cross-border payment. When you do — spread plus intermediary fees plus float — the case for a faster rail isn't a technology preference. It's arithmetic.

[Book a call](https://calendly.com/jefferyokesamuel1/30min) to see the numbers for your own corridors.

---

*Posts are for general information only and are not financial, legal, or investment advice. Corridor figures reflect Coinomad's live operating footprint at time of writing.*
