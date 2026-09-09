---
title: "The Data safety form is why your app got rejected"
description: "Google cross-checks what you declare against what your app actually does. Third-party SDKs count as your collection. Here is how to fill the form so it matches your build."
date: "2026-07-28"
lang: "en"
tags: ["Google Play", "Chính sách"]
---

When an app is rejected on Google Play, developers usually start looking at the code. Nine times out of ten the code is fine and the Data safety form is wrong.

The form is the section of your store listing where you declare what data your app collects, what it shares, and why. Google does not take your word for it. It compares your answers against the permissions in your manifest, the SDKs bundled in your build, and the network traffic the app produces during review.

Any mismatch is a rejection. And unlike a code bug, a mismatch can get a live app removed months later.

## Third-party SDKs count as your collection

This is the single biggest source of wrong answers.

If you ship Firebase Analytics, AdMob, Crashlytics, Facebook SDK, OneSignal, an attribution SDK, or almost any analytics library, that library collects data. Google treats it as *your app* collecting data, because from the user's point of view it is.

"I don't collect anything, I just have crash reporting" is a declaration that will not survive review. Crash reports typically include device identifiers and, depending on configuration, an app instance ID. That is collection, and sending it to a vendor is sharing.

Before you fill the form, list every dependency in your build that touches the network. Then read each vendor's own data disclosure — most publish one specifically to help you complete this form.

## Collected and shared are different questions

The form asks both, and people answer them as if they were one.

- **Collected** — the data leaves the user's device and reaches you or a service acting for you.
- **Shared** — the data is transferred to a *third party*, meaning a separate company.

Sending crash logs to Firebase is collection. Firebase is Google, but it is still a separate service acting on your behalf, and depending on how you configure it, this can be sharing.

The safe method: for each data type, ask "does it leave the device?" and then "does another company end up with it?" Answer both honestly rather than trying to reach a tidy conclusion.

## Data processed only on the device

There is an exemption, and it is narrower than people hope.

If data is processed entirely on the device and never transmitted, you do not declare it as collected. A photo editor that resizes an image locally does not collect the photo.

But if that same editor uploads the photo to a server to apply a filter, even temporarily, even without storing it, that is collection. "We delete it immediately" does not change the answer.

## Optional data still counts

If the app *can* collect something under some circumstances, it collects it.

A feature that only runs when the user grants location permission still means the app collects location. You declare it and mark it optional. Leaving it out because most users never enable it is a mismatch waiting to be found.

## The permission cross-check

Google reads your manifest. Some permissions imply data types, and declaring nothing while requesting them is an immediate contradiction:

- `ACCESS_FINE_LOCATION` or `ACCESS_COARSE_LOCATION` implies location
- `READ_CONTACTS` implies contacts
- `RECORD_AUDIO` implies audio
- `CAMERA` plus network access implies photos or video may leave the device
- `READ_PHONE_STATE` implies device identifiers

If you request a permission you no longer use, remove it. Leftover permissions from a library you dropped or a feature you abandoned generate contradictions you then have to explain.

## Loan apps and contact harvesting

A specific warning, because we are asked about it often and we turn this work down.

Apps in the personal loan category have a separate, much stricter policy. Accessing contacts or photos in a loan app is prohibited outright, regardless of what you declare or what the user consents to. Declaring it accurately does not make it permitted.

Apps doing this get removed and the developer account gets terminated. There is no version of the Data safety form that saves it.

## Your privacy policy has to agree

The form is one of three things that must say the same story:

1. The Data safety form
2. The privacy policy at the URL you provide
3. What the app actually does

Reviewers open the privacy policy link. If it 404s, sits behind a login, or is a generic template that contradicts your declaration, that alone is a rejection.

Write the policy after you complete the form, using the same list of data types, so the two cannot drift apart.

## If you have already been rejected

Do not guess. Open **Play Console → Policy status**. The specific policy cited is there, in more detail than the email gives you.

Then fix only what it cites. Changing five unrelated things alongside the fix makes the next review slower and makes it harder to tell what worked.

In your appeal, state what you changed, line by line, against the policy quoted. Reviewers are reading many of these; being specific gets you through faster than being apologetic.

## What we do

We fill this form against your actual manifest and dependency list, not against a description of what the app is supposed to do. We read the disclosures for every SDK in your build, write a privacy policy that matches, and host it at a working URL.

If the app is rejected after we submit, we read the policy cited, fix it and resubmit at no extra cost.

App Store and Google Play publishing is $70 for one store, $100 for both.

[Send us your app](https://te2sr.com) and we will tell you which declarations are wrong before you submit.
