---
title: "Your app was rejected. Here is what resets and what does not"
description: "A rejection rarely costs you the 14 days of closed testing. It costs you a review cycle. Read the policy that was cited, fix only that, and reply with a line-by-line changelog."
date: "2026-07-28"
lang: "en"
tags: ["Google Play", "App Store", "Chính sách"]
---

The email says your app was rejected and gives you a policy name and a paragraph. It is deliberately short, and the first reaction is usually to assume the worst: that fourteen days of closed testing are gone and you start again.

Almost always, they are not.

## What a rejection does not touch

**Your closed testing run.** If twelve testers stayed opted in for fourteen continuous days, that history stands. A listing rejection does not undo it.

**Your tester list.** The testers remain opted in. You do not re-invite anyone.

**Your app's identity.** Same package name, same account, same install base if you had one.

What you lose is a review cycle — days, not weeks.

The exception is a rejection that goes to the account rather than the app: repeated policy violations, or a suspension. That is a different situation and the appeal path is different too.

## Find the actual reason, not the summary

The email is a summary. The detail is in the console.

On Google Play, open **Play Console → Policy status**. It names the specific policy, the affected version, and often the exact element that triggered it.

On the App Store, open **App Store Connect → the rejected submission → Resolution Center**. Apple's reviewers usually cite a numbered guideline and frequently attach a screenshot of what they saw.

That screenshot is worth more than the text. It shows you the state the app was in on their device, which is often not the state you assumed.

## Fix only what was cited

This is the discipline that shortens the next cycle.

If the rejection cites your Data safety declaration, change the Data safety declaration. Do not also rewrite the description, swap the screenshots and bump the target SDK in the same submission.

Two reasons. A reviewer comparing your resubmission against the previous one can verify a small, specific change quickly. And if it is rejected again, you know which change was not enough — with five changes, you know nothing.

## Reply with a changelog, not an apology

In the appeal or resolution note, write what you changed against what was cited. Something like:

> Guideline 5.1.1 — we removed the contacts permission from the manifest and updated the Data safety form to declare no contacts access. The privacy policy at [url] has been updated to match.

Not: "We are sorry, we have fixed the issue, please review again."

Reviewers process a lot of these. A specific note lets them verify in a minute. A vague one sends your app back into the general queue.

## The reasons we actually see

**Data safety mismatch (Google Play).** The most common by a distance. Your declaration does not match your manifest or your bundled SDKs.

**Broken or generic privacy policy URL.** The link 404s, sits behind a login wall, or is a template that contradicts the declaration. Reviewers do open it.

**Guideline 4.2, minimum functionality (App Store).** Apple rejects apps that are essentially a website in a wrapper, or that offer too little to justify being an app. This is the most common first-submission rejection on iOS and the hardest to fix, because the answer is usually "add real functionality" rather than "change a setting".

**Screenshots showing UI that does not exist.** Marketing mockups, or screenshots from a newer build than the one submitted. Apple checks this.

**Content rating that does not match the app.** Under-rating to reach a wider audience is caught, and it looks deliberate.

**Wrong testing track (Google Play).** Internal testing instead of closed. Not strictly a rejection, but it produces the same feeling: the requirement never clears.

## How long the next cycle takes

App Store review is done by a person and typically returns within a day or two. Google Play is largely automated and usually faster, though new personal accounts see longer holds.

Resubmitting several times in short succession does not speed anything up, and on the App Store repeated thin resubmissions can slow you down. Fix it properly once.

## When to appeal instead of resubmit

Resubmit when the rejection is correct and you changed something.

Appeal when you believe the reviewer misread the app — for example, they could not reach a feature because the demo account credentials you supplied had expired, or a region lock hid the main screen.

If you appeal, give them the path: exact steps, working credentials, and what they should see. Do not argue the guideline. Show them what they missed.

## What we do

Send us the rejection text. We will tell you which of the reasons above it is, at no cost — it takes us a few minutes and it saves you a cycle of guessing.

If you want us to handle it, we fix the listing, write the appeal against the cited policy and resubmit. For apps we published, resubmission after a rejection is included; we do not charge again for it.

Google Play $50 · App Store $70 · both stores $100, paid in two steps.

[Send the rejection](https://te2sr.com)
