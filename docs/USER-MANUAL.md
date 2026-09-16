# User Manual

For Carlo, Kristinne, and whoever is looking after the site for them. No
technical knowledge needed. If a word in here does not make sense, that is the
manual's fault, not yours: tell Erick and he will fix the wording.

Everything in Part 1 is also inside the site itself, one click from the
dashboard, at `/admin/manual`.

Last updated: 16 September 2026.

---

## 1. What this site is

Your wedding website. Guests use it to:

- read the details of the day, the dress code and the full programme
- reply to the invitation
- leave you a message
- after the wedding, upload the photographs they took and download everyone
  else's at full size

The web address goes on the printed invitations, so it is part of the
invitation and not an extra.

## 2. The pages, and what each is for

| Page | What it does |
|---|---|
| Home | The date, a live countdown, and a short version of everything else |
| Our Story | Who the two of you are, and what the hashtag means |
| Details | Venues, dress code, parking, the rain plan, and the questions guests ask |
| Programme | The whole day, from the seven in the morning start to the send-off at about half past eleven |
| Entourage | Everyone standing with you |
| Gallery | The shared photo album, and where guests upload |
| Guestbook | The wishing wall |
| RSVP | The reply form |
| Privacy | What the site does with what guests give it. Required, because the RSVP form asks about allergies |

## 3. The most important thing to know

**Nothing a guest writes or uploads appears in public until you approve it.**

Messages and photographs arrive as *pending*. They sit in the dashboard under
"Waiting for you" until you press Publish. Nothing is lost and nobody is told
either way. An open upload box on a public address needs a human looking at
it, and that human is you.

## 4. Logging in

1. Go to your site address followed by `/admin`.
2. Enter the password. Erick has it. Keep it somewhere you can find it.
3. You stay signed in for eight hours.

Sign out from the button at the top of the dashboard when you are done on a
borrowed or shared device. Five wrong passwords in a row lock the login for
fifteen minutes.

## 5. The dashboard, screen by screen

**Overview.** Days to go, how many seats are confirmed out of 100, how many
replies you have had, and how many things are waiting for you.

**Replies.** Every RSVP, newest first, with names, contact details, dietary
notes and song requests. The Download CSV button is here.

**Messages.** The guestbook. Publish puts a message on the public wall. Hide
takes it down again without deleting it.

**Photographs.** Guest uploads. Publish adds one to the public album, where
anyone can view and download it at full size. Delete removes the actual file
as well as the record and cannot be undone.

**Manual.** This guide, inside the site.

## 6. Handling what comes in

### Replies (RSVPs)

Replies cannot be edited by guests once sent. If somebody needs to change
theirs, they message Erick and he changes it in the database. If somebody
replied twice, delete the older one. Deleting is permanent, so read both
first.

### The number the caterer needs

On the Replies page, press **Download CSV**. That gives you a spreadsheet that
opens in Excel, Numbers or Google Sheets, with a row per reply and a column
for dietary notes. That file is what you send to the caterer, and what you
build the seating plan from.

Do this about two weeks before the wedding, and again the day before in case
of late replies. The reply deadline printed on the site is 30 September 2026.

### Messages

Read each one. Publish the ones you want on the wall. Anything you would
rather not publish, simply leave as pending. It stays invisible and the
writer is not told.

### Photographs

These arrive after the wedding, mostly in the week after. Check the
Photographs page daily that week. Publish the good ones. Hide anything that
should not be in the album. Use Delete only if it must be gone from storage
entirely.

You upload your own photographs the same way a guest does, on the Gallery
page, then approve them in the dashboard. One process to learn instead of two.

## 7. Where emails go

The site sends one kind of email: a notification to Erick's inbox each time a
guest replies to the invitation, with everything they typed. Guests do not
receive any email from the site.

If those notifications stop arriving, replies are still being saved. The site
always saves the reply to the database first and only then tries to send the
email, so a broken email service can never lose a reply. Check the Replies
page in the dashboard; it is the source of truth.

## 8. Changing what the site says

Almost every fact on the public pages lives in one file, `lib/constants.ts`:
venue names, times, the programme, the entourage, the dress code, the
questions and answers.

Anything not decided yet is marked as pending in that file, and the site shows
a small **To be confirmed** chip in its place. Fill in the real value and the
chip disappears by itself.

Things currently showing that chip:

- the church name and address
- the reception venue name and address
- both map links
- the principal sponsors, secondary sponsors, bridesmaids and groomsmen
- Erick's guest-facing email and phone number
- the on-the-day coordinator

Ask Erick to make these edits. Once the site is connected to its hosting, a
saved change goes live automatically in about a minute; there is no publish
button to press.

### The reception programme

The Programme page shows the full traditional running order from the host's
programme sheet, twenty-six items from the opening dance to the closing
remark. The clock times for the reception are not typed in anywhere: each
item has a length, and the site works every time out from the 7:15 PM doors.
Change one length and everything after it moves by itself.

Two numbers worth knowing: dinner is called at about a quarter to nine, and
the evening finishes at about half past eleven.

## 9. How to check the site is running

1. Open the site address on your phone. If the homepage loads and the
   countdown is ticking, the site is up.
2. Open `/admin` and sign in. If you see the Overview with numbers on it, the
   database is connected.
3. If the dashboard shows a red banner saying **the database is not
   connected**, nothing can be saved. Tell Erick immediately.

There is nothing else to check day to day.

## 10. When something breaks

**A guest says their reply did not go through.**
Check the Replies page first. If it is not there, ask them to try again,
then tell Erick.

**The RSVP form says replies are not switched on.**
The database is disconnected. Same as the red banner. Tell Erick.

**You cannot sign in.**
Five wrong attempts locks you out for fifteen minutes. Wait it out. If the
login page says the admin area is not configured, the password has not been
set on the hosting. Tell Erick.

**The site looks wrong on your phone.**
Pull down to refresh first. If it persists, take a screenshot and send it to
Erick with the page address.

**A photograph or message that should not be public is public.**
Go to the dashboard and press Hide on it. It comes down within a minute.
Then tell Erick if you want it deleted entirely.

## 11. Which dashboard holds what

The site is made of a few separate services. Each has its own login. Erick
holds the logins and can add you to any of them.

| Service | What it does | Where to find it |
|---|---|---|
| **Vercel** | Hosts the website itself and publishes changes | vercel.com. The project is not created yet as of this manual |
| **Supabase** | The database (replies, messages, photo records) and the photo files | supabase.com. Not created yet |
| **Resend** | Sends the reply notification email | resend.com. Optional; the site works without it |
| **GitHub** | Stores the site's code and history | github.com. Not created yet |
| **Domain registrar** | The web address itself | Not bought yet. The site is written for `carloandkristinne.com` |

There are no payments, no analytics, and no advertising anywhere in the site.

## 12. Your routine

**Now until the wedding**
- Check Replies once or twice a week
- Publish any waiting messages
- Glance at the headcount on Overview

**Two weeks before (around 3 October)**
- Download the CSV and send the final number and the allergy list to the
  caterer

**The day before**
- Download the CSV again for late replies

**The week after the wedding**
- Check Photographs daily. This is when the uploads arrive

## 13. Checklist before you tell people about a change

- Open the page on your phone, not just a laptop
- Read it top to bottom for typos
- Press every button on it
- Check that nothing says "To be confirmed" that you have already confirmed

## 14. Questions people ask

**Can guests see the guest list?** No. Only you and Erick can see who replied.

**Can guests edit a reply?** No. They message Erick and he fixes it.

**Do guests need an account to upload photographs?** No. No app, no sign-up.

**How long do the photographs stay up?** As long as the site is paid for. Ask
Erick to download a full backup after the wedding.

**Is the wedding budget on this site anywhere?** No. Nothing about money,
suppliers or negotiations is in the website or its code. That stays in your
workbook.

**Why is there a privacy page?** Because the RSVP form asks about allergies,
which counts as health information under Philippine law, and a hundred guests
handing that over deserve one page that says where it goes.

---

Built with care by [Erick Cabal](https://erickcabal.com).
