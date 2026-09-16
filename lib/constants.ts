/**
 * Every wedding fact lives here. Nothing is hardcoded in a component.
 *
 * Anything the couple has not decided yet is marked `pending: true` (or set
 * to `null`) rather than invented. The UI renders those as an honest
 * "To be confirmed" chip instead of a plausible lie, and the admin manual
 * tells the couple this file is the one place to update.
 *
 * Source: "Tin Carlo Wedding Workbook.docx" and the answered questionnaire,
 * as of 22 July 2026. Budget figures, vendor negotiations and internal
 * planning flags are deliberately NOT in this file. This site is for guests.
 */

export type Pending<T> = { value: T; pending: false } | { value: null; pending: true };

export const tbc = <T,>(): Pending<T> => ({ value: null, pending: true });
export const set = <T,>(value: T): Pending<T> => ({ value, pending: false });

/**
 * Whether undecided facts render as visible "To be confirmed" placeholders.
 *
 * During planning that honesty was useful. Once the site is in front of
 * guests it is not: a live site shows what it knows and says nothing about
 * what it does not. With this false, every pending chip, every "coming soon"
 * frame and every section with no real content is simply not rendered, and
 * nothing is ever invented in its place. Flip it back to true to see, in one
 * glance, everything that is still missing.
 */
export const SHOW_PENDING = false;

/* =========================
   Site
   ========================= */

export const SITE = {
  name: "Carlo & Kristinne",
  longName: "John Carlo & Kristinne",
  tagline: "Kaloob ng Diyos",
  description:
    "John Carlo Alcantara and Kristinne Monzon are getting married on 17 October 2026 in Rosario, Cavite. Ceremony details, the day's programme, RSVP and the shared photo album.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://carloandkristinne.com",
  locale: "en_PH",
  hashtag: "#CARLOobNgdiyoskayKRISTINNE",
  /** Used in the wordmark, where the hashtag is split for emphasis. */
  hashtagParts: { prefix: "#CARLO", middle: "obNgdiyoskay", suffix: "KRISTINNE" },
} as const;

export const COUPLE = {
  groom: {
    firstName: "John Carlo",
    shortName: "Carlo",
    lastName: "Alcantara",
    fullName: "John Carlo Alcantara",
  },
  bride: {
    firstName: "Kristinne",
    shortName: "Tin",
    lastName: "Monzon",
    fullName: "Kristinne Monzon",
  },
} as const;

/* =========================
   The hero photograph
   Every well-liked wedding site leads with one. Until the couple send a
   photograph this stays pending and the hero is set in type alone. Drop a
   file into public/ and set it here; nothing else has to change.
   ========================= */

export const HERO_PHOTO: Pending<{ src: string; alt: string }> = tbc();

/* =========================
   The day
   ========================= */

/** Ceremony start, 4:00 PM Philippine Standard Time (UTC+8). */
export const WEDDING_DATE_ISO = "2026-10-17T16:00:00+08:00";

export const WEDDING_DAY = {
  iso: WEDDING_DATE_ISO,
  dayOfWeek: "Saturday",
  dateLong: "17 October 2026",
  dateShort: "17.10.2026",
  day: "17",
  month: "October",
  year: "2026",
  ceremonyTime: "4:00 in the afternoon",
  guestCount: 100,
  town: "Rosario",
  province: "Cavite",
  country: "Philippines",
} as const;

/* =========================
   Venues
   The church and reception names are not in the workbook yet.
   They render as "To be confirmed" until they are filled in here.
   ========================= */

export type Venue = {
  key: string;
  label: string;
  name: Pending<string>;
  address: Pending<string>;
  time: string;
  note: string;
  mapUrl: Pending<string>;
};

export const VENUES: Venue[] = [
  {
    key: "ceremony",
    label: "The Ceremony",
    name: tbc<string>(),
    address: tbc<string>(),
    time: "4:00 PM",
    note: "Christian rites, officiated by Pastor Jomar. Please be seated by 3:30 PM so the processional can begin on time.",
    mapUrl: tbc<string>(),
  },
  {
    key: "reception",
    label: "The Reception",
    name: tbc<string>(),
    address: tbc<string>(),
    time: "Doors at 7:15 PM",
    note: "There is a gap after the ceremony while the couple finish their photographs and everyone travels over, so please do not head straight here. Doors open at 7:15 PM, the programme starts at 8:00 PM, and parking is available on site.",
    mapUrl: tbc<string>(),
  },
];

export const OFFICIANT = {
  name: "Pastor Jomar",
  rite: "Christian rites",
  note: "A PSA-registered solemnizing officer.",
} as const;

/* =========================
   Dress code
   The couple's own colour coding, verbatim from the workbook.
   ========================= */

export type DressRole = {
  role: string;
  colour: string;
  /** Swatch stops. Rendered as a small gradient chip, never as the only cue. */
  swatch: string[];
};

export const DRESS_CODE: DressRole[] = [
  { role: "The couple", colour: "White", swatch: ["#FFFFFF", "#D6E0E8"] },
  { role: "Best Man", colour: "A blue suit", swatch: ["#3B5068", "#6B8BC9"] },
  { role: "Maid of Honour", colour: "Dusty blue", swatch: ["#5B7590", "#A3B8CF"] },
  { role: "Bridesmaids", colour: "Dusty blue, any shade", swatch: ["#3B5068", "#7A97B3", "#B9C9D6"] },
  { role: "Groomsmen", colour: "Black suit, blue tie", swatch: ["#0B1220", "#7A97B3"] },
  { role: "Our guests", colour: "Blue, violet or black", swatch: ["#6B8BC9", "#7A6B9E", "#0B1220"] },
];

export const DRESS_NOTE =
  "Formal or semi-formal, please. Everyone in the entourage is buying or renting their own outfit, so wear something you genuinely feel good in, as long as it sits within your colour. White is kept for the couple.";

/**
 * The blues, exactly as named on the attire guides the couple sent. These are
 * the swatches guests can hold a dress or a tie up against.
 */
export const ATTIRE_PALETTE: { name: string; hex: string }[] = [
  { name: "Dark steel blue", hex: "#3B5068" },
  { name: "Dusty blue", hex: "#7A97B3" },
  { name: "Ice blue", hex: "#D6E0E8" },
  { name: "Light blue grey", hex: "#B9C9D6" },
  { name: "Cornflower blue", hex: "#6B8BC9" },
];

/* =========================
   The people
   Names confirmed in the workbook are listed. Everything else is pending.
   ========================= */

export type Person = { name: string; role: string; note?: string };

export const ENTOURAGE_GROUPS: {
  key: string;
  title: string;
  blurb: string;
  people: Person[];
  pendingNote?: string;
}[] = [
  {
    key: "principal",
    title: "The Couple",
    blurb: "The two this whole day is for.",
    people: [
      { name: COUPLE.groom.fullName, role: "Groom" },
      { name: COUPLE.bride.fullName, role: "Bride" },
    ],
  },
  {
    key: "officiant",
    title: "Officiating",
    blurb: "Who will marry them.",
    people: [{ name: OFFICIANT.name, role: "Officiant", note: OFFICIANT.rite }],
  },
  {
    key: "honour",
    title: "Best Man & Maid of Honour",
    blurb: "The two standing closest on the day.",
    people: [
      { name: "Erick Cabal", role: "Best Man", note: "Also our host for the evening" },
      { name: "Babie Georgie Monzon", role: "Maid of Honour" },
    ],
  },
  {
    key: "bearers",
    title: "The Bearers",
    blurb: "The smallest members of the party, with the most important jobs.",
    people: [
      { name: "Ruri Chan Monzon", role: "Ring Bearer" },
      { name: "Zephanie Bible Capoon", role: "Bible Bearer" },
      { name: "KD Trey Nicolas", role: "Coin Bearer" },
    ],
  },
  {
    key: "sponsors",
    title: "Principal Sponsors",
    blurb: "Our ninong and ninang.",
    people: [],
    pendingNote: "The list is still being finalised. Names go up here as soon as they are set.",
  },
  {
    key: "secondary",
    title: "Secondary Sponsors",
    blurb: "Candle, veil and cord.",
    people: [],
    pendingNote: "Still being arranged, and worth the wait.",
  },
  {
    key: "party",
    title: "Bridesmaids & Groomsmen",
    blurb: "The half past eleven pictorial crew.",
    people: [],
    pendingNote: "Bridesmaids in shades of blue, groomsmen in black.",
  },
];

export const ENTOURAGE_FOOTNOTE =
  "There are no flower girls this time. The bridesmaids and groomsmen will be scattering the flowers instead, which should be a lot of fun to watch.";

/* =========================
   The programme
   The suggested Filipino reception flow from the workbook, written for guests.

   Two sources, and they are the authority here rather than this file:

   1. The coordinator's on-the-day timeline (Amari Events), which fixes every
      clock time from the 7:00 AM breakfast to the 8:00 PM programme start.
   2. The host's reception programme sheet, which fixes the ORDER of the
      twenty-six reception items.

   An earlier version of this file was a short twelve item programme of our
   own design. The couple chose the full traditional running order instead,
   so that is what is here. If someone later wonders where the short version
   went, it was a deliberate replacement and not a regression.

   How the two sources are joined. The timeline gives three hard anchors:
   doors at 7:15 PM, "grand entrance, reception ready" at 7:30 PM, and
   "programme starts" at 8:00 PM. The programme sheet puts the grand entrance
   at item VI, after the host's welcome, the parents, the sponsors and the
   entourage parade. Those only reconcile one way: the entrance SEQUENCE
   begins at 7:30 and the couple themselves are presented at 8:00, which is
   exactly where the timeline says the programme starts. Amari should confirm
   that reading before anything is printed.

   Durations are ours, not theirs. The programme sheet carries no times at
   all, so every `minutes` value below is an estimate in five minute steps.
   Clock times are derived from the 7:15 PM doors rather than written down, so
   changing one duration moves everything after it and the two can never
   disagree.
   ========================= */

export type ScheduleItem = {
  /** A clock time, for the parts of the day that genuinely have one. */
  time: Pending<string>;
  /**
   * How long this runs. Reception items use this instead of a clock time.
   * The clock is then derived from the 7:15 PM doors.
   * Kept to five minute steps: these are estimates, and false precision
   * would read as a promise.
   */
  minutes?: number;
  title: string;
  detail: string;
  phase: "morning" | "afternoon" | "ceremony" | "between" | "reception";
};

export const SCHEDULE: ScheduleItem[] = [
  /* ---- Morning. From the coordinator's on-the-day timeline. ---- */
  {
    time: set("7:00 AM"),
    title: "The day starts",
    detail:
      "Breakfast for Carlo and Kristinne and the people looking after them. The coordinator and the hair and make-up team arrive at half past.",
    phase: "morning",
  },
  {
    time: set("8:30 AM"),
    title: "Hair and make-up begins",
    detail:
      "The bride first, then the mothers and the groom, running continuously from here until the ceremony look in the afternoon.",
    phase: "morning",
  },
  {
    time: set("10:30 AM"),
    title: "The preparation shoot",
    detail:
      "The photographers and videographers arrive at ten and start with the details and the getting-ready frames. Bridal and groom portraits follow at eleven.",
    phase: "morning",
  },
  {
    time: set("11:30 AM"),
    title: "Entourage photographs",
    detail:
      "Team Bride and Team Groom, both at half past eleven. This is the call time for the wedding party, so please be in your outfit and ready by then rather than arriving at it.",
    phase: "morning",
  },
  {
    time: set("12:00 NN"),
    title: "Lunch",
    detail: "Eat properly now. The next real meal is a long way off.",
    phase: "morning",
  },

  /* ---- Afternoon. ---- */
  {
    time: set("1:00 PM"),
    title: "Into the ceremony look",
    detail:
      "The couple, the family and the entourage change and are retouched. Meanwhile the caterer, stylist and the sound and lighting teams take over the reception venue.",
    phase: "afternoon",
  },
  {
    time: set("1:30 PM"),
    title: "The pre-ceremony shoot",
    detail: "The last quiet frames before it all begins, then an hour of rest at half past two.",
    phase: "afternoon",
  },
  {
    time: set("3:00 PM"),
    title: "Final retouch",
    detail: "Everyone ready and waiting by half past three.",
    phase: "afternoon",
  },

  /* ---- The ceremony. ---- */
  {
    time: set("3:30 PM"),
    title: "Guests are seated",
    detail:
      "The ushers will show you to your seat. The front rows are kept for the parents and the sponsors.",
    phase: "ceremony",
  },
  {
    time: set("4:00 PM"),
    title: "The ceremony",
    detail:
      "Processional, vows, rings and the unity rites, led by Pastor Jomar. Then the pronouncement, the kiss, and the recessional.",
    phase: "ceremony",
  },

  /* ---- The gap between the two venues. ---- */
  {
    time: set("5:00 PM"),
    title: "Photographs at the church",
    detail:
      "The family and entourage groupings, then the couple on their own. This is the part that takes longer than anyone expects, and it is worth it.",
    phase: "between",
  },
  {
    time: set("6:00 PM"),
    title: "Everyone travels to the reception",
    detail:
      "The couple go ahead for the empty-hall photographs and their third look. The doors open to guests at a quarter past seven.",
    phase: "between",
  },

  /* ---- The reception.
     Clock times below are derived from the 7:15 PM doors, using the
     durations on each item, so a change to one moves everything after it.
     The order is the host's own revised sheet of 17 September 2026, twenty
     items, with dinner brought forward to straight after the prayer. ---- */
  {
    time: tbc<string>(),
    minutes: 15,
    title: "The doors open, and we dance",
    detail:
      "Everybody on their feet, ninongs and ninangs very much included. Erick leads it, the music plays, and whoever gives it the most wins the first photograph with Carlo and Kristinne.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 5,
    title: "Welcome from your host",
    detail: "Erick opens the evening properly.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 5,
    title: "The parents",
    detail: "Both sets of parents are acknowledged from where they are sitting.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 5,
    title: "The principal sponsors",
    detail: "The ninongs and ninangs, introduced from their seats.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 15,
    title: "The entourage comes in",
    detail: "The wedding party and the groomsmen enter by group, and take their places.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 5,
    title: "Grand entrance",
    detail:
      "Carlo and Kristinne come in to something loud and happy. Cameras up for this one.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 5,
    title: "The prayer",
    detail: "A word of thanks before the meal, and then we eat.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 45,
    title: "Dinner",
    detail:
      "Called table by table, early on purpose. Please eat properly, there is plenty, and the rest of the evening waits for you.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 5,
    title: "The first dance",
    detail: "The couple, and the floor is theirs.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 15,
    title: "The prosperity dance",
    detail:
      "The music changes and you are invited up to hand your gift to the couple as they dance. Everyone is welcome on the floor.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 10,
    title: "Cake cutting, and everyone sings",
    detail:
      "Carlo and Kristinne slice the cake and blow out the candle while the whole room sings Panalangin to them. You are not an audience for this one, so please do sing.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 5,
    title: "The wine toast",
    detail: "A glass raised to the two of them.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 10,
    title: "The toasts",
    detail: "The best man and the maid of honour, in that order. Bring tissues.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 10,
    title: "How well do you know them?",
    detail:
      "Ten trivia questions about the bride and groom. Anyone who has known either of them for more than a year has no excuse.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 10,
    title: "The parents speak",
    detail: "Whoever would like to say something, and nobody who would rather not.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 10,
    title: "Dance with the parents",
    detail: "The bride with her father, the groom with his mother.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 10,
    title: "The bouquet toss",
    detail:
      "The coordinator brings the sinulid at karayom for the game, and Kristinne has a bouquet set aside to throw. Instructions on the night.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 5,
    title: "The garter",
    detail: "Carlo removes it. You know how this goes.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 15,
    title: "The garter toss, and the Cinderella game",
    detail:
      "Gentlemen, take off your left shoe. Carlo collects them all, carries them to the far side of the room and scatters them. The last man back with his own shoe on is Mr Bachelor.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 10,
    title: "The same-day edit",
    detail: "The film of the day so far, cut while the day was still happening.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 5,
    title: "Thank you, from Carlo and Kristinne",
    detail: "The two of them say their piece, and they mean every word of it.",
    phase: "reception",
  },
  {
    time: tbc<string>(),
    minutes: 5,
    title: "Goodnight",
    detail: "Erick closes the evening, and then we send them off properly.",
    phase: "reception",
  },
];

/**
 * The reception opens when the venue doors do, at 7:15 PM, per the
 * coordinator's on-the-day timeline. Everything after that is derived from
 * the durations above rather than written down twice.
 */
export const RECEPTION_DOORS = "7:15 PM";
const RECEPTION_DOORS_MINUTES = 19 * 60 + 15;

/**
 * The reception, each item carrying both its offset from the doors opening
 * and the clock time that falls on.
 *
 * Derived, so changing any one `minutes` value moves everything after it and
 * the numbers can never drift apart.
 */
export const RECEPTION_TIMELINE: {
  item: ScheduleItem;
  offset: number;
  clockMinutes: number;
}[] = (() => {
  let offset = 0;
  return SCHEDULE.filter((item) => item.phase === "reception").map((item) => {
    const entry = { item, offset, clockMinutes: RECEPTION_DOORS_MINUTES + offset };
    offset += item.minutes ?? 0;
    return entry;
  });
})();

/** Doors to goodnight, in minutes. Currently 255, which is 4 hours 15. */
export const RECEPTION_RUNTIME_MINUTES = RECEPTION_TIMELINE.reduce(
  (total, { item }) => total + (item.minutes ?? 0),
  0,
);

/* =========================
   FAQ
   Answer in the first sentence, then elaborate. Feeds FAQPage schema.
   ========================= */

export const FAQ: { q: string; a: string }[] = [
  {
    q: "When and where is the wedding?",
    a: "Saturday, 17 October 2026, at 4:00 in the afternoon, in Rosario, Cavite. The reception is at a second venue and its doors open at 7:15 PM, so there is a wait in between while the couple finish their photographs and everyone travels over. Exact addresses and maps are on the Details page and will be printed on your invitation.",
  },
  {
    q: "What should I wear?",
    a: "Formal or semi-formal, in blue, violet or black. Please leave white to the couple. If you are in the entourage, your colour is listed on the Details page.",
  },
  {
    q: "Do I need to RSVP, and by when?",
    a: "Yes please, and as early as you can manage. The final headcount goes to the caterer about two weeks before the day, so replying early is a real help. It takes two minutes on the RSVP page.",
  },
  {
    q: "Can I bring a plus one or my children?",
    a: "Only if your invitation names them, and that is purely a numbers problem rather than anything personal. The list is capped at 100 and every seat is already accounted for. If you are not sure who is included in yours, just ask Erick and he will check.",
  },
  {
    q: "What time should I actually arrive?",
    a: "Please be seated by 3:30 PM. The processional begins at 4:00 PM, and it would be a shame to miss the walk down the aisle.",
  },
  {
    q: "Why is there a gap between the ceremony and the reception?",
    a: "Carlo and Kristinne have their photographs taken at the church after the recessional, and the reception is at a second venue that everyone has to travel to. The doors there open at 7:15 PM and the programme starts at 8:00 PM. Please do not drive straight over after the ceremony, and if you are not sure what to do with the time in between, ask Erick.",
  },
  {
    q: "How long does the reception run?",
    a: "Doors open at 7:15 PM, the couple come in at 8:00 PM, and the send-off is at about eleven. Dinner is called early, at about ten past eight, with a full 45 minutes set aside for it. Nobody is counting who leaves early, so please do what suits you.",
  },
  {
    q: "Will there be games?",
    a: "Three, and you are in the first one whether you planned to be or not. The evening opens with a dance that Erick leads, and the winners take the first photograph with Carlo and Kristinne. Later there are ten trivia questions about the couple, and the Cinderella game for the gentlemen after the garter toss.",
  },
  {
    q: "Is it true we have to sing?",
    a: "Yes, once, and it is the loveliest part of the evening. When Carlo and Kristinne cut the cake, the whole room sings Panalangin to them while they slice it and blow out the candle. Nobody is being auditioned, so please just join in. If you do not know it, there is time to learn it before October.",
  },
  {
    q: "Is there parking?",
    a: "Yes, parking is included at the reception venue. Church parking will be confirmed closer to the date.",
  },
  {
    q: "Are you doing a gift registry?",
    a: "There is no registry, and there is no expectation. Having you in the room is genuinely the gift. If you would still like to give something, an envelope at the reception or joining the prosperity dance is more than enough.",
  },
  {
    q: "What is the hashtag?",
    a: "#CARLOobNgdiyoskayKRISTINNE. Please use it on anything you post. It also means the photographs you take can be gathered into the shared album on this site afterwards.",
  },
  {
    q: "Can I post photos during the ceremony?",
    a: "Please put your phone away during the ceremony itself. The photographers have it covered, and Carlo and Kristinne would love to look out and see your faces. Everything after that is fair game.",
  },
  {
    q: "It is October. What happens if it rains?",
    a: "Both the ceremony and the reception are indoors and the reception venue is air-conditioned, so rain changes the photographs and not much else. Bring an umbrella for the walk between cars and you will be perfectly fine.",
  },
  {
    q: "Where do I upload the photos I took?",
    a: "On the Gallery page, from the day of the wedding onwards. Uploads are checked before they appear, and everything in the album can be downloaded at full size by anyone.",
  },
  {
    q: "Who do I ask if something is not answered here?",
    a: "Erick, the best man and host, is looking after guest questions and is happy to help. His details are on the Details page.",
  },
];

/* =========================
   Contact
   ========================= */

export const CONTACT = {
  /** Guest-facing point of contact. Deliberately not the couple's numbers. */
  pointOfContact: {
    name: "Erick Cabal",
    role: "Best man and host",
    email: tbc<string>(),
    phone: tbc<string>(),
  },
  coordinator: {
    name: tbc<string>(),
    role: "On-the-day coordinator",
    note: "Being assigned. Erick cannot be best man, host and coordinator at the same time.",
  },
} as const;

/* =========================
   Navigation
   ========================= */

export const NAV: { href: string; label: string }[] = [
  { href: "/our-story", label: "Our Story" },
  { href: "/details", label: "Details" },
  { href: "/programme", label: "Programme" },
  { href: "/entourage", label: "Entourage" },
  { href: "/gallery", label: "Gallery" },
  { href: "/guestbook", label: "Guestbook" },
];

export const PRIMARY_CTA = { href: "/rsvp", label: "RSVP" } as const;

/* =========================
   Guest rules used by the RSVP form
   ========================= */

export const RSVP = {
  /** Hard cap per invitation. The list is 100 and every seat is allocated. */
  maxPartySize: 6,
  /** Shown on the form, and the date the caterer needs the final count. */
  deadlineLabel: "30 September 2026",
  deadlineIso: "2026-09-30",
} as const;

/* =========================
   Gallery
   ========================= */

export const GALLERY = {
  maxUploadBytes: 12 * 1024 * 1024,
  acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/heic"],
  acceptAttribute: "image/jpeg,image/png,image/webp,image/heic",
  maxFilesPerUpload: 10,
} as const;

/* =========================
   Credits
   ========================= */

export const CREDITS = {
  builder: { name: "Erick Cabal", url: "https://erickcabal.com" },
} as const;
