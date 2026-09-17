/**
 * Every wedding fact lives here. Nothing is hardcoded in a component.
 *
 * Anything the couple has not decided yet is marked `pending: true` (or set
 * to `null`) rather than invented. The UI renders those as an honest
 * "To be confirmed" chip instead of a plausible lie, and the admin manual
 * tells the couple this file is the one place to update.
 *
 * Sources: "Tin Carlo Wedding Workbook.docx" and the answered questionnaire
 * (22 July 2026), then the printed invitation suite the couple sent on
 * 17 September 2026 (entourage card, save the date, invitation, attire
 * guide, finer details). Where the two disagree the printed suite wins: it is
 * what guests hold in their hands. Budget figures, vendor negotiations and
 * internal planning flags are deliberately NOT in this file. This site is for
 * guests.
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

/**
 * Kristinne's name comes first everywhere, and the monogram is KC: that is
 * how the printed invitation has it. The hashtag keeps Carlo first because
 * it is a sentence ("Carlo, a gift from God to Kristinne"), and its casing
 * is exactly as printed.
 */
export const SITE = {
  name: "Kristinne & Carlo",
  longName: "Kristinne & Carlo",
  tagline: "Kaloob ng Diyos",
  description:
    "Kristinne Monzon and John Carlo Alcantara are getting married on 17 October 2026: the ceremony at Jesus the Counselor Church in General Trias, the reception at Servando's Restaurant in Rosario, Cavite. Details, the day's programme, RSVP and the shared photo album.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://carloandkristinne.com",
  locale: "en_PH",
  hashtag: "#CARLOobngDiyoskayKRISTINNE",
  /** Used in the wordmark, where the hashtag is split for emphasis. */
  hashtagParts: { prefix: "#CARLO", middle: "obngDiyoskay", suffix: "KRISTINNE" },
  /** The two initials of the monogram, in the order the invitation prints them. */
  monogram: ["K", "C"],
} as const;

export const COUPLE = {
  groom: {
    firstName: "John Carlo",
    shortName: "Carlo",
    lastName: "Alcantara",
    fullName: "John Carlo Alcantara",
    /** As printed on the entourage card. */
    formalName: "John Carlo Y. Alcantara",
  },
  bride: {
    firstName: "Kristinne",
    shortName: "Tin",
    lastName: "Monzon",
    fullName: "Kristinne Monzon",
    /** As printed on the entourage card. */
    formalName: "Kristinne Joy G. Monzon",
  },
} as const;

/* =========================
   The photographs
   The couple had no engagement shoot, so on 17 September 2026 they sent five
   photographs they already had. They live in public/photos and are wired in
   through the site document (`home.heroPhoto`, `ourStory.photos` in
   DEFAULT_CONTENT), so the couple can swap any of them from the dashboard.
   The masters sit beside the repo, outside git.
   ========================= */

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
  /** From the finer details card: guests are welcome from three. */
  doorsTime: "3:00 PM",
  guestCount: 100,
  /** The ceremony's town. The reception is in `receptionTown`. */
  town: "General Trias",
  receptionTown: "Rosario",
  province: "Cavite",
  country: "Philippines",
} as const;

/* =========================
   Venues
   Names and addresses as printed on the invitation. The map links are the
   destinations of the two QR codes on the finer details card, decoded on
   17 September 2026 (they were Canva short links that redirect to Google
   Maps places).
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
    name: set("Jesus the Counselor Church"),
    address: set("428A Saint Francis Subdivision, San Juan I, General Trias, Cavite"),
    time: "4:00 PM",
    note: "Christian rites, officiated by Pastor Jomar Antalan and Pastora Lorna Antalan. Guests are warmly welcome from 3:00 PM; the ceremony begins promptly at 4:00 PM.",
    mapUrl: set("https://www.google.com/maps/place/JTC+Christian+Ministries/@14.3850742,120.8766708,17z"),
  },
  {
    key: "reception",
    label: "The Reception",
    name: set("Servando's Restaurant"),
    address: set("Beside MV Soriano Medical Clinic, Rosario, Cavite 4106"),
    time: "Doors at 7:15 PM",
    note: "There is a gap after the ceremony while the couple finish their photographs and everyone travels over from General Trias, so please do not head straight here. Doors open at 7:15 PM, the programme starts at 8:00 PM, and parking is available on site.",
    mapUrl: set("https://www.google.com/maps/place/Servando's+Restaurant/@14.4084224,120.8585391,17z"),
  },
];

export const OFFICIANT = {
  name: "Pastor Jomar Antalan",
  coOfficiant: "Pastora Lorna Antalan",
  rite: "Christian rites",
  note: "A PSA-registered solemnizing officer.",
} as const;

/* =========================
   Dress code
   The colours are the couple's own coding from the workbook. The outfits are
   read off the three attire guides they sent on 17 September 2026 (Best
   Man; Bridesmaids and Groomsmen; Principal Sponsors), garment by garment,
   so a guest knows the cut and not only the shade. Roles with no guide say
   only what is known. The figures are HD redraws of the guides' illustrations (ChatGPT,
   17 September 2026, masters in the sibling photos folder under
   attire-hd); an empty figure means the guide has not been sent yet.
   ========================= */

export type DressRole = {
  role: string;
  colour: string;
  /** The actual garments, as drawn on the attire guide. Empty when there is no guide for the role. */
  outfit: string;
  /** The guide's illustration of the outfit, under public/. Empty when there is none. */
  figure: string;
  /** Swatch stops. Rendered as a small gradient chip, never as the only cue. */
  swatch: string[];
};

export const DRESS_CODE: DressRole[] = [
  // Card order on the Details page, four across: the family and sponsor
  // groups on the first row, the wedding party on the second, guests and
  // the couple on a wider last row.
  {
    role: "Parents of the bride and groom",
    colour: "Purples",
    outfit: "Long gowns for the mothers. Barong Tagalog and black trousers for the fathers.",
    figure: "/photos/attire-parents.jpg",
    swatch: ["#C9A8E0", "#9B7CC0", "#7B4FA6", "#3F2A5A"],
  },
  {
    role: "Principal sponsors",
    colour: "Earth tones",
    outfit: "Long gowns for the ninangs. Barong Tagalog and black trousers for the ninongs.",
    figure: "/photos/attire-principal-sponsors.jpg",
    swatch: ["#9A8577", "#A89484", "#D9C6BC", "#EAE0CC"],
  },
  {
    role: "Secondary sponsors",
    colour: "Blues",
    outfit: "Long gowns for the women. Barong Tagalog and black trousers for the men.",
    figure: "/photos/attire-secondary-sponsors.jpg",
    swatch: ["#3B5068", "#7A97B3", "#B9C9D6"],
  },
  {
    role: "The bearers",
    colour: "Blues",
    outfit: "A blue dress for the girls. A black suit with a bow tie for the boys.",
    figure: "/photos/attire-bearers.jpg",
    swatch: ["#3B5068", "#7A97B3", "#B9C9D6"],
  },
  {
    role: "Best Man",
    colour: "Dark blue",
    outfit: "A dark blue suit, white shirt, blue tie.",
    figure: "/photos/attire-best-man.jpg",
    swatch: ["#3B5068", "#6B8BC9"],
  },
  {
    role: "Maid of Honour",
    colour: "Lavender",
    outfit: "A long lavender gown.",
    figure: "/photos/attire-maid-of-honour.jpg",
    swatch: ["#D8C3EA", "#9B7CC0", "#5E3A80"],
  },
  {
    role: "Groomsmen",
    colour: "Black suit, blue tie",
    outfit: "A black suit, white shirt, blue tie.",
    figure: "/photos/attire-groomsmen.jpg",
    swatch: ["#0B1220", "#7A97B3"],
  },
  {
    role: "Bridesmaids",
    colour: "Dusty blue",
    outfit: "A long dusty blue gown, any shade.",
    figure: "/photos/attire-bridesmaids.jpg",
    swatch: ["#3B5068", "#7A97B3", "#B9C9D6"],
  },
  {
    role: "Our guests",
    colour: "Blues",
    outfit: "Formal attire in any shade of blue. Please choose colours other than red or black. White is for the couple.",
    figure: "/photos/attire-guests.jpg",
    swatch: ["#3B5068", "#7A97B3", "#B9C9D6", "#6B8BC9"],
  },
  {
    role: "The couple",
    colour: "White",
    outfit: "White is theirs.",
    figure: "",
    swatch: ["#FFFFFF", "#D6E0E8"],
  },
];

/** The attire guide's own words, lightly joined. */
export const DRESS_NOTE =
  "We kindly ask you to wear formal attire in any of the elegant shades from our chosen palette. White is reserved for the bride and the groom; please choose colours other than red or black.";

/**
 * The three palettes on the printed attire guide, as swatches guests can
 * hold a dress or a tie up against. The blues are named exactly as on the
 * first guides; the purples and earth tones are read off the full guide.
 */
export const ATTIRE_PALETTE: { family: string; name: string; hex: string }[] = [
  { family: "The blues: guests, entourage, sponsors and bearers", name: "Dark steel blue", hex: "#3B5068" },
  { family: "The blues: guests, entourage, sponsors and bearers", name: "Dusty blue", hex: "#7A97B3" },
  { family: "The blues: guests, entourage, sponsors and bearers", name: "Ice blue", hex: "#D6E0E8" },
  { family: "The blues: guests, entourage, sponsors and bearers", name: "Light blue grey", hex: "#B9C9D6" },
  { family: "The blues: guests, entourage, sponsors and bearers", name: "Cornflower blue", hex: "#6B8BC9" },
  { family: "The purples: parents and the maid of honour", name: "Lilac", hex: "#D8C3EA" },
  { family: "The purples: parents and the maid of honour", name: "Lavender", hex: "#B89BD0" },
  { family: "The purples: parents and the maid of honour", name: "Orchid", hex: "#7B4FA6" },
  { family: "The purples: parents and the maid of honour", name: "Plum", hex: "#5E3A80" },
  { family: "The purples: parents and the maid of honour", name: "Deep purple", hex: "#3F2A5A" },
  { family: "The earth tones: principal sponsors", name: "Taupe", hex: "#9A8577" },
  { family: "The earth tones: principal sponsors", name: "Mocha", hex: "#A89484" },
  { family: "The earth tones: principal sponsors", name: "Mauve grey", hex: "#A99A9B" },
  { family: "The earth tones: principal sponsors", name: "Blush", hex: "#D9C6BC" },
  { family: "The earth tones: principal sponsors", name: "Champagne", hex: "#EAE0CC" },
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
    key: "parents",
    title: "The Parents",
    blurb: "The four people who were there first.",
    people: [
      { name: "Carlito P. Alcantara", role: "Father of the Groom" },
      { name: "Noreen Y. Alcantara", role: "Mother of the Groom" },
      { name: "Ariel B. Monzon", role: "Father of the Bride" },
      { name: "Debora G. Monzon", role: "Mother of the Bride" },
    ],
  },
  {
    key: "grandparent",
    title: "Grandparent",
    blurb: "With love, across the generations.",
    people: [{ name: "Lily F. Gragas", role: "Grandparent" }],
  },
  {
    key: "officiant",
    title: "Officiating",
    blurb: "Who will marry them.",
    people: [
      { name: OFFICIANT.name, role: "Wedding Officiant", note: OFFICIANT.rite },
      { name: OFFICIANT.coOfficiant, role: "Wedding Officiant" },
    ],
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
    // As printed on the entourage card, which reassigns the three roles
    // compared with the July workbook.
    people: [
      { name: "KD Trey Nicolas", role: "Ring Bearer" },
      { name: "Ruri Chan Monzon", role: "Bible Bearer" },
      { name: "Zephanie Bible Capoon", role: "Coin Bearer" },
    ],
  },
  {
    key: "sponsors",
    title: "Principal Sponsors",
    blurb: "Our ninong and ninang, in the pairs they will be called.",
    people: [
      { name: "Mr. Juancho Mores", role: "Ninong" },
      { name: "Mrs. Josephine Mores", role: "Ninang" },
      { name: "Mr. Aquilino Vistan Jr.", role: "Ninong" },
      { name: "Mrs. Amelita Vistan", role: "Ninang" },
      { name: "Mr. Rodulfo Hernandez", role: "Ninong" },
      { name: "Mrs. Darlene Hernandez", role: "Ninang" },
      { name: "Mr. Restituto Landero", role: "Ninong" },
      { name: "Mrs. Lilibeth Landero", role: "Ninang" },
      { name: "Mr. Ereberto Aguilar", role: "Ninong" },
      { name: "Mrs. Maria Loida Nuniala", role: "Ninang" },
      { name: "Mr. Hope Fransisco", role: "Ninong" },
      { name: "Mrs. Marissa Sabandal", role: "Ninang" },
      { name: "Mr. Rolando Pallera", role: "Ninong" },
      { name: "Mrs. Donna Dee Cabal", role: "Ninang" },
    ],
  },
  {
    key: "secondary",
    title: "Secondary Sponsors",
    blurb: "Candle, veil and cord.",
    people: [
      { name: "Bryan Kyle Monzon", role: "Candle" },
      { name: "Kimberly Monzon", role: "Candle" },
      { name: "Apolinario Nicolas", role: "Veil" },
      { name: "Emelita Nicolas", role: "Veil" },
      { name: "Carlito Monzon", role: "Cord" },
      { name: "Jennette Monzon", role: "Cord" },
    ],
  },
  {
    key: "groomsmen",
    title: "Groomsmen",
    blurb: "Black suits, blue ties.",
    people: [
      { name: "John Reuben Javier", role: "Groomsman" },
      { name: "Leodegario Capoon IV", role: "Groomsman" },
      { name: "Zonite Quimno", role: "Groomsman" },
      { name: "Mar Alen Alamo", role: "Groomsman" },
      { name: "Ivan Benedict Barron", role: "Groomsman" },
      { name: "Triston Danlag", role: "Groomsman" },
    ],
  },
  {
    key: "bridesmaids",
    title: "Bridesmaids",
    blurb: "In the dusty blues.",
    people: [
      { name: "Joahnna Alcantara", role: "Bridesmaid" },
      { name: "Amarah Nayeli Monzon", role: "Bridesmaid" },
      { name: "Michelle Anne Golimlim", role: "Bridesmaid" },
      { name: "Thea Mae Signo", role: "Bridesmaid" },
      { name: "Irish Mae Agudo", role: "Bridesmaid" },
      { name: "Graciene Magsino", role: "Bridesmaid" },
    ],
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
    time: set("3:00 PM"),
    title: "Guests arrive",
    detail:
      "You are warmly welcome from three. The ushers will show you to your seat; the front rows are kept for the parents and the sponsors. The ceremony begins promptly at four.",
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
    a: "Saturday, 17 October 2026, at 4:00 in the afternoon, at Jesus the Counselor Church, 428A Saint Francis Subdivision, San Juan I, General Trias, Cavite. The reception follows at Servando's Restaurant, beside MV Soriano Medical Clinic in Rosario, Cavite; its doors open at 7:15 PM, so there is a wait in between while the couple finish their photographs and everyone travels over. Both maps are on the Details page.",
  },
  {
    q: "What should I wear?",
    a: "Formal attire in any of the blues from the attire guide. White is reserved for the bride and the groom, and please choose colours other than red or black. If you are in the entourage, your outfit is drawn out on the Details page.",
  },
  {
    q: "Do I need to RSVP, and by when?",
    a: "Yes please, by 5 October 2026, and as early as you can manage before that. The final headcount goes to the caterer about two weeks before the day, so replying early is a real help. It takes two minutes on the RSVP page.",
  },
  {
    q: "Can I bring a plus one or my children?",
    a: "Only if your invitation names them, and that is purely a numbers problem rather than anything personal. The list is capped at 100 and every seat is already accounted for. If you are not sure who is included in yours, just ask Erick and he will check.",
  },
  {
    q: "What time should I actually arrive?",
    a: "Guests are warmly invited to arrive from 3:00 PM onwards. The ceremony begins promptly at 4:00 PM, and it would be a shame to miss the walk down the aisle.",
  },
  {
    q: "Why is there a gap between the ceremony and the reception?",
    a: "Carlo and Kristinne have their photographs taken at the church after the recessional, and the reception is in Rosario, about half an hour from the church in General Trias. The doors there open at 7:15 PM and the programme starts at 8:00 PM. Please do not drive straight over after the ceremony, and if you are not sure what to do with the time in between, ask Erick.",
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
    a: "No registry. In their own words: your presence on our special day is the greatest gift we could ask for. If you wish to bless us with a gift, a monetary gift would be sincerely appreciated as we begin this new chapter of our lives together. Thank you for your love, prayers and generosity.",
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
  deadlineLabel: "5 October 2026",
  deadlineIso: "2026-10-05",
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
  /** Erick's own line, in the footer of every page. He is Carlo's kababata. */
  note: "kababata ni Carlo, grateful to have helped make this day",
} as const;

/**
 * The studio card. Erick builds these sites, and a guest who likes this one
 * is the next client, so a small corner card offers Enclave at the first,
 * third and fifth minute of a visit (Erick's numbers), once each, and never
 * on the dashboard. Copy and link live here so the card has no words of its
 * own.
 */
export const PROMO = {
  eyebrow: "Enclave",
  headline: "Need a website like this for your wedding?",
  body: "This one was designed and built by Erick Cabal. Yours can be too.",
  cta: "See Enclave",
  url: "https://erickcabal.com/enclave",
  /** Minutes into a visit at which the card appears, once each. */
  minutes: [1, 3, 5],
} as const;
