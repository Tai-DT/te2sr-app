---
title: "Screenshot and graphic sizes for Google Play and the App Store"
description: "Every image size both stores require, the rules reviewers actually enforce, and the screenshot mistakes that get a submission rejected."
date: "2026-07-28"
lang: "en"
tags: ["Google Play", "App Store", "ASO"]
---

Store listing rejections are rarely about the app. They are about the images. This is the reference we work from.

One caveat before the numbers: **both stores change required sizes periodically**, Apple more often than Google. Treat this page as the shape of the problem, and confirm the exact required device sizes in App Store Connect and Play Console before you export. The rules below are the part that does not change.

## Google Play

**Phone screenshots** — at least 2, up to 8. JPEG or 24-bit PNG without alpha. Each side between 320 px and 3840 px, and the longest side no more than twice the shortest. Portrait or landscape, kept consistent within a set.

**Tablet screenshots** — a separate set for 7-inch and 10-inch. You do not have to supply them, but without them your app is not surfaced properly to tablet users, and Play Console will warn you about it.

**App icon** — 512 × 512, 32-bit PNG with alpha. This is the listing icon, separate from the launcher icon in your build.

**Feature graphic** — 1024 × 500, JPEG or 24-bit PNG without alpha. This one is required. The form may let you save a draft without it, which leads people to believe it is optional; it is not, and submission will be blocked later.

Keep important content away from the edges of the feature graphic. It gets cropped at different ratios across surfaces, and text near the border is the first thing to disappear.

## App Store

**iPhone screenshots** — required. Apple asks for the current largest display size and scales down from there for smaller devices, so in practice you supply one high-resolution set. Check the exact pixel dimensions in App Store Connect; the required device class changes when Apple ships new hardware.

**iPad screenshots** — required if your app supports iPad. Not optional. A universal app with no iPad screenshots does not pass.

**App icon** — 1024 × 1024, PNG, no alpha channel, no rounded corners, no transparency. Apple applies the mask. Supplying pre-rounded corners produces a visible double-rounding artifact.

**App previews** — optional video, up to three per size. If you supply them, they must be captured from the device, not screen-recorded from a simulator with a marketing overlay.

## The rules reviewers enforce

These cause more rejections than wrong pixel counts.

**Screenshots must show the app that was submitted.** Not a newer build, not a design mockup, not a feature that is coming next month. Apple checks this and rejects for it specifically. If your screenshots show a dark mode you have not shipped, that is a rejection.

**No device frames around non-app content.** A photo of a person with a phone bezel drawn around it is marketing material, not a screenshot.

**No pricing, awards or store badges in the images.** "Editor's Choice", "#1 in Productivity", "50% off" — none of these belong in screenshots. Prices change, awards you did not receive are misleading, and Apple treats store badges inside screenshots as a policy issue.

**No "Download now" or arrows pointing at the install button.** The user is already on the page.

**Text has to be legible at thumbnail size.** Search results show screenshots small. Caption text below 60 px in a 2796 px tall image is unreadable where it matters most.

## What to actually put in them

The first two screenshots are the only ones most people see. Search results show two or three; the rest require a deliberate swipe.

Put the single clearest statement of what the app does in screenshot one. Not your prettiest screen — your most explanatory one. Screenshot two shows the main action a user takes.

Captions help, if they say something. "Home screen" is wasted space. "Track every set without opening a spreadsheet" is not.

## The mistakes we see most

**Exporting at the wrong scale.** A screenshot taken on a smaller device and upscaled looks soft, and Apple can reject for image quality.

**Alpha channel left in the icon.** Google wants alpha in the 512 icon; Apple forbids it in the 1024 icon. Same asset, opposite requirement. Export twice.

**Status bar clutter.** A screenshot with 14% battery, three notification badges and a carrier called "No Service" reads as unfinished. Clean it up before capturing.

**One set for all locales.** If you localise your listing, screenshots with English captions in the Vietnamese listing are allowed but perform noticeably worse.

## What we do

Send us the build and we produce every required size for both stores, cleaned status bars, captions written to be readable at thumbnail size, plus the feature graphic and both icon exports.

App Store or Google Play publishing is $70 for one store, $100 for both, paid in two steps. If the listing is rejected for an image issue after we submit, we fix and resubmit at no extra cost.

[Send us your app](https://te2sr.com)
