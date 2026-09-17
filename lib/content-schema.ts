import {
  CONTACT,
  COUPLE,
  DRESS_CODE,
  DRESS_NOTE,
  ENTOURAGE_FOOTNOTE,
  ENTOURAGE_GROUPS,
  FAQ,
  OFFICIANT,
  RECEPTION_DOORS,
  RSVP,
  SCHEDULE,
  VENUES,
  WEDDING_DAY,
  type Pending,
} from "@/lib/constants";

/**
 * The words and photographs on every public page, as one document the
 * couple edit from the dashboard ("Edit the website").
 *
 * Code holds the defaults (built from lib/constants.ts and the copy that
 * used to sit in each page). A saved document is merged over them, so a
 * field added later in code never breaks an older saved document, and an
 * empty string always means "not set" and is simply not rendered. Nothing
 * is ever invented in place of a missing value.
 *
 * The wedding date, the guest cap and the RSVP rules stay in constants: they
 * drive the countdown, the form limits and the email, and changing them is
 * a code change on purpose.
 *
 * This module has no server imports so the dashboard navigation (a client
 * component) can read the section list.
 */

export type Venue = { label: string; name: string; address: string; time: string; note: string; mapUrl: string };
/** A photograph on Our Story. Shape decides the frame it is cropped into. */
export type StoryPhoto = { src: string; alt: string; caption: string; shape: "landscape" | "portrait" };
export type TitledBody = { title: string; body: string };
export type Faq = { q: string; a: string };
export type Phase = "morning" | "afternoon" | "ceremony" | "between" | "reception";
export type ProgrammeItem = { time: string; minutes: string; title: string; detail: string; phase: Phase };
export type EntourageGroup = { title: string; blurb: string; people: string; pendingNote: string };
export type PhaseCopy = { label: string; title: string; blurb: string };

export type SiteContent = {
  home: {
    intro: string;
    primaryLabel: string;
    secondaryLabel: string;
    heroPhoto: string;
    heroPhotoAlt: string;
    glance: { label: string; value: string; note: string }[];
    storyEyebrow: string;
    storyTitle: string;
    storyP1: string;
    storyP2: string;
    storyLink: string;
    detailsEyebrow: string;
    detailsTitle: string;
    detailsIntro: string;
    detailsLink: string;
    galleryEyebrow: string;
    galleryTitle: string;
    galleryIntro: string;
    wishesEyebrow: string;
    wishesTitle: string;
    wishesIntro: string;
    ctaTitle: string;
    ctaBody: string;
  };
  ourStory: {
    eyebrow: string;
    title: string;
    intro: string;
    hashtagEyebrow: string;
    hashtagP1: string;
    hashtagP2: string;
    quoteEyebrow: string;
    quote: string;
    quoteNote: string;
    valuesEyebrow: string;
    valuesTitle: string;
    valuesIntro: string;
    values: TitledBody[];
    storyEyebrow: string;
    storyTitle: string;
    storyBody: string;
    pairEyebrow: string;
    pairTitle: string;
    pair: StoryPhoto[];
    photosEyebrow: string;
    photosTitle: string;
    photosIntro: string;
    photos: StoryPhoto[];
    ctaTitle: string;
    ctaBody: string;
  };
  details: {
    eyebrow: string;
    title: string;
    intro: string;
    headerPhotos: StoryPhoto[];
    venuesEyebrow: string;
    venuesTitle: string;
    venuesIntro: string;
    venues: Venue[];
    officiantLine: string;
    dressEyebrow: string;
    dressTitle: string;
    dressNote: string;
    dressCode: { role: string; colour: string; outfit: string }[];
    practicalEyebrow: string;
    practicalTitle: string;
    practical: TitledBody[];
    contactEyebrow: string;
    contactName: string;
    contactRole: string;
    contactEmail: string;
    contactPhone: string;
    faqEyebrow: string;
    faqTitle: string;
    faqIntro: string;
    faq: Faq[];
    ctaTitle: string;
    ctaBody: string;
  };
  programme: {
    eyebrow: string;
    title: string;
    intro: string;
    headerPhotos: StoryPhoto[];
    phases: { morning: PhaseCopy; afternoon: PhaseCopy; ceremony: PhaseCopy; between: PhaseCopy };
    items: ProgrammeItem[];
    doors: string;
    receptionEyebrow: string;
    receptionTitle: string;
    receptionIntro: string;
    receptionNote: string;
    hostEyebrow: string;
    hostTitle: string;
    hostP1: string;
    hostP2: string;
    ctaTitle: string;
    ctaBody: string;
  };
  entourage: {
    eyebrow: string;
    title: string;
    intro: string;
    headerPhotos: StoryPhoto[];
    groups: EntourageGroup[];
    footnoteEyebrow: string;
    footnote: string;
    ctaTitle: string;
    ctaBody: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    intro: string;
    how: TitledBody[];
    uploadEyebrow: string;
    uploadTitle: string;
    uploadIntro: string;
    albumTitle: string;
    emptyTitle: string;
    emptyBody: string;
    ctaTitle: string;
    ctaBody: string;
  };
  guestbook: {
    eyebrow: string;
    title: string;
    intro: string;
    headerPhotos: StoryPhoto[];
    wallTitle: string;
    emptyTitle: string;
    emptyBody: string;
    ctaTitle: string;
    ctaBody: string;
  };
  rsvp: {
    deadlineLabel: string;
    title: string;
    intro: string;
    headerPhotos: StoryPhoto[];
    why: TitledBody[];
    dayEyebrow: string;
    dayNote: string;
    closingLine: string;
  };
};

const str = (p: Pending<string>): string => (p.pending ? "" : p.value);

/** "Name | Role | Note", one person per line. The form the couple type it in. */
export function peopleToLines(people: { name: string; role: string; note?: string }[]): string {
  return people.map((p) => [p.name, p.role, p.note ?? ""].join(" | ").replace(/ \| $/, "")).join("\n");
}

export function linesToPeople(lines: string): { name: string; role: string; note?: string }[] {
  return lines
    .split("\n")
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter((parts) => parts[0])
    .map(([name, role = "", note = ""]) => (note ? { name, role, note } : { name, role }));
}

export const DEFAULT_CONTENT: SiteContent = {
  home: {
    intro:
      "In their own words: makulit, masayahin, simple lang. You are warmly invited to be there when they promise it out loud.",
    primaryLabel: "RSVP",
    secondaryLabel: "The details",
    heroPhoto: "/photos/carlo-kristinne-studio-lean.jpg",
    heroPhotoAlt: "Kristinne and Carlo leaning towards each other in front of a white studio wall, both in blue.",
    glance: [
      { label: "The date", value: WEDDING_DAY.dateShort, note: WEDDING_DAY.dayOfWeek },
      { label: "Ceremony", value: "4:00 PM", note: `${WEDDING_DAY.town}, ${WEDDING_DAY.province}` },
      { label: "Reception", value: "Doors at 7:15 PM", note: `${WEDDING_DAY.receptionTown}, programme at 8` },
      { label: "Dress code", value: "Formal, in the blues", note: "White is for the couple" },
    ],
    storyEyebrow: "Kaloob ng Diyos",
    storyTitle: "A gift, and the two people lucky enough to find it",
    storyP1:
      "The hashtag came before almost anything else. #CARLOobngDiyoskayKRISTINNE reads as “Carlo, a gift from God to Kristinne”, and the moment it was said out loud, everyone knew that was the one.",
    storyP2:
      "That is the tone of the whole day. Makulit, masayahin, simple lang. They have said plainly that they want the day to feel like them rather than look like a magazine, and the three things worth spending on are the church moment, the food, and the photographs.",
    storyLink: "Read the whole story",
    detailsEyebrow: "Where and when",
    detailsTitle: "One afternoon, two towns, two rooms",
    detailsIntro:
      "Everything happens in Rosario, Cavite, on a single Saturday. The ceremony is indoors and so is the reception, which in October is not a small thing.",
    detailsLink: "Maps, dress code and questions",
    galleryEyebrow: "The album",
    galleryTitle: "Everything anyone photographs, in one place",
    galleryIntro:
      "From the day of the wedding onwards, anyone can add the photographs they took, and anyone can download them at full size. No app, no account, nothing to sign up for.",
    wishesEyebrow: "From everyone else",
    wishesTitle: "Wishes for the two of them",
    wishesIntro: "Anyone can leave a note. Every one of them is read by both of them before it goes up.",
    ctaTitle: "Will we see you there?",
    ctaBody:
      "There are a hundred seats and every one of them is spoken for, so an early reply is a real kindness to the caterer, and to Carlo and Kristinne.",
  },
  ourStory: {
    eyebrow: "Kaloob ng Diyos",
    title: "A gift from God, and the two who found it",
    intro:
      "The hashtag arrived before the venue did, and it has been the loveliest summary of these two ever since.",
    hashtagEyebrow: "The hashtag",
    hashtagP1:
      "Read it slowly and it comes apart into “Carlo, kaloob ng Diyos kay Kristinne”. Carlo, a gift from God to Kristinne. It was one of two candidates. The other one, #iTINNEkdaNgdiyoskayCARLO, pointed the gift the other way.",
    hashtagP2:
      "Somebody pointed out that it only points one way. Somebody else pointed out that either version would be. They kept it anyway, and the vote was unanimous within about four minutes, which is faster than any other decision in this entire wedding.",
    quoteEyebrow: "In their own words",
    quote: "Ilabas namin kung sino talaga kami: makulit, masayahin, simple lang, at enjoy lang lahat.",
    quoteNote:
      "Loosely: let us just be who we actually are. Playful, cheerful, simple, and everyone enjoying themselves. That sentence is the brief for the whole day, and it is why this website does not try to be solemn.",
    valuesEyebrow: "What matters to them",
    valuesTitle: "Three things, in order",
    valuesIntro:
      "They wrote these down before booking anything, which is the single most sensible thing a couple can do.",
    values: [
      {
        title: "The church moment",
        body: "The first of the three things they said were worth spending on. Everything else on the day is arranged around this half hour.",
      },
      {
        title: "The food",
        body: "One hundred people, fed properly, in a room with air conditioning. Not a small thing to pull off in October.",
      },
      {
        title: "The photographs",
        body: "A photographer and videographer on them from ten in the morning until nearly midnight, and an entourage who agreed to a half past eleven call with a speed they may come to question, and will absolutely be glad about.",
      },
    ],
    storyEyebrow: "How it happened",
    storyTitle: "How they met, and how he asked",
    storyBody: "",
    pairEyebrow: "The two of them",
    pairTitle: "Carlo, and Kristinne",
    pair: [
      {
        src: "/photos/carlo-studio-1.jpg",
        alt: "Carlo in a light blue shirt, in front of a white studio wall.",
        caption: "Carlo",
        shape: "portrait",
      },
      {
        src: "/photos/kristinne-studio-1.jpg",
        alt: "Kristinne resting her chin on her hand, leaning on the back of a chair.",
        caption: "Kristinne",
        shape: "portrait",
      },
    ],
    photosEyebrow: "Photographs",
    photosTitle: "A few of their favourites",
    photosIntro:
      "There was no engagement shoot. These are the pictures they already had, which is rather the point.",
    // Files in public/photos, supplied by the couple on 17 September 2026.
    // Captions describe what is in the frame and claim nothing else.
    photos: [
      {
        src: "/photos/carlo-waterfall.jpg",
        alt: "Carlo sitting on a rock in front of a waterfall, in a colourful shirt.",
        caption: "Carlo, somewhere with a waterfall",
        shape: "portrait",
      },
      {
        src: "/photos/kristinne-elephants.jpg",
        alt: "Kristinne making a peace sign in a garden with elephant statues behind her.",
        caption: "Kristinne, with the elephants",
        shape: "portrait",
      },
      {
        src: "/photos/carlo-kristinne-proposal-cave.jpg",
        alt: "Kristinne holding up her hand to show her engagement ring, Carlo beside her in a rock cave by the sea.",
        caption: "The ring",
        shape: "portrait",
      },
      {
        src: "/photos/carlo-kristinne-school-christmas.jpg",
        alt: "Carlo and Kristinne in school uniforms making peace signs in front of a lit Christmas tree at night.",
        caption: "Before all of this",
        shape: "portrait",
      },
    ],
    ctaTitle: "Be in the room",
    ctaBody: "Photographs are lovely, but they would much rather have you there in person.",
  },
  details: {
    eyebrow: "Everything practical",
    title: "The details",
    intro: "One Saturday, two towns, and a few things worth knowing before you set your alarm.",
    headerPhotos: [
      {
        src: "/photos/carlo-kristinne-studio-chin.jpg",
        alt: "Kristinne resting her chin on Carlo's head, both smiling at the camera.",
        caption: "",
        shape: "landscape",
      },
    ],
    venuesEyebrow: "Where",
    venuesTitle: "Two places, one evening",
    venuesIntro:
      "The ceremony and the reception are in different places, and the reception doors do not open until a quarter past seven. Full addresses are on your invitation; please read the timings below before you plan your evening.",
    venues: VENUES.map((v) => ({
      label: v.label,
      name: str(v.name),
      address: str(v.address),
      time: v.time,
      note: v.note,
      mapUrl: str(v.mapUrl),
    })),
    officiantLine: `The ceremony is by ${OFFICIANT.rite}, officiated by ${OFFICIANT.name} and ${OFFICIANT.coOfficiant}.`,
    dressEyebrow: "What to wear",
    dressTitle: "Who wears what",
    dressNote: DRESS_NOTE,
    dressCode: DRESS_CODE.map((d) => ({ role: d.role, colour: d.colour, outfit: d.outfit })),
    practicalEyebrow: "Good to know",
    practicalTitle: "The small print, kindly meant",
    practical: [
      { title: "Parking", body: "Parking is included at the reception venue." },
      {
        title: "If it rains",
        body: "October is rainy season, but both the ceremony and the reception are indoors and the reception venue is air-conditioned. Bring an umbrella for the walk between cars and you will be perfectly fine.",
      },
      {
        title: "Who to ask",
        body: "Erick, the best man and host, is looking after guest questions. Please go to him rather than the couple in the week of the wedding.",
      },
    ],
    contactEyebrow: "Point of contact",
    contactName: CONTACT.pointOfContact.name,
    contactRole: CONTACT.pointOfContact.role,
    contactEmail: str(CONTACT.pointOfContact.email),
    contactPhone: str(CONTACT.pointOfContact.phone),
    faqEyebrow: "Questions",
    faqTitle: "Asked and answered",
    faqIntro: "If your question is not answered here, please ask Erick. He would genuinely rather you did.",
    faq: FAQ.map((f) => ({ q: f.q, a: f.a })),
    ctaTitle: "Will we see you there?",
    ctaBody:
      "There are a hundred seats and every one of them is spoken for, so an early reply is a real kindness to the caterer, and to Carlo and Kristinne.",
  },
  programme: {
    eyebrow: "The run of show",
    title: "One very long Saturday",
    headerPhotos: [
      {
        src: "/photos/carlo-kristinne-studio-lean.jpg",
        alt: "Carlo and Kristinne leaning towards each other in front of a white studio wall, both in blue.",
        caption: "",
        shape: "landscape",
      },
    ],
    intro:
      "It starts at seven in the morning and finishes near midnight. Here is the whole of it, including the parts you are not expected to be awake for.",
    phases: {
      morning: {
        label: "Morning",
        title: "Long before you see any of it",
        blurb: "Hair, make-up and photographs, from seven in the morning. The entourage is called for half past eleven.",
      },
      afternoon: {
        label: "Afternoon",
        title: "Into the ceremony look",
        blurb: "The change, the retouch, and one hour of enforced rest.",
      },
      ceremony: {
        label: "Ceremony",
        title: "The part that counts",
        blurb: "Please come early. This is the half hour they care about most.",
      },
      between: {
        label: "In between",
        title: "The gap, and why it is there",
        blurb:
          "The photographs at the church take a while, and the reception is somewhere else. Please do not drive straight over: the doors do not open until a quarter past seven.",
      },
    },
    items: SCHEDULE.map((s) => ({
      time: str(s.time),
      minutes: s.minutes ? String(s.minutes) : "",
      title: s.title,
      detail: s.detail,
      phase: s.phase,
    })),
    doors: RECEPTION_DOORS,
    receptionEyebrow: "Reception",
    receptionTitle: "Then, the whole evening",
    receptionIntro:
      "The full running order, in the order your host will actually call it. It opens with everybody on their feet and it ends near midnight, with a proper three quarters of an hour in the middle for dinner.",
    receptionNote:
      "Every time below is worked out from the quarter past seven doors, so treat them as close rather than exact. A ceremony that runs long, or a room that will not stop dancing, moves everything after it. Nobody minds.",
    hostEyebrow: "Your host",
    hostTitle: "Erick is running the evening",
    hostP1:
      "He is both the best man and the host, which is two jobs, so a separate on-the-day coordinator is being assigned for everything that is not a microphone.",
    hostP2:
      "The running order below is his, so if you are giving a toast, reading, performing or leading the prayer, speak to him well before the day rather than on the night. He would much rather move something than surprise you with it.",
    ctaTitle: "Tell them you are coming",
    ctaBody: "The programme comes together far more easily once the couple know who will be there.",
  },
  entourage: {
    eyebrow: "The people",
    title: "Who is standing with them",
    // Kristinne first, as on the invitation. The captions are the couple's
    // formal names from the entourage card; the old "The Couple" group of
    // two text cards is gone because these portraits are that group.
    headerPhotos: [
      {
        src: "/photos/kristinne-studio-2.jpg",
        alt: "Kristinne leaning on the back of a chair, smiling, in front of a white studio wall.",
        caption: `${COUPLE.bride.formalName} · Bride`,
        shape: "portrait",
      },
      {
        src: "/photos/carlo-studio-2.jpg",
        alt: "Carlo in a dark steel blue shirt, checking his watch, in front of a white studio wall.",
        caption: `${COUPLE.groom.formalName} · Groom`,
        shape: "portrait",
      },
    ],
    intro:
      "The people walking down the aisle with them, and the two very small ones carrying the most important things.",
    groups: ENTOURAGE_GROUPS.map((g) => ({
      title: g.title,
      blurb: g.blurb,
      people: peopleToLines(g.people),
      pendingNote: g.pendingNote ?? "",
    })),
    footnoteEyebrow: "A note on flowers",
    footnote: ENTOURAGE_FOOTNOTE,
    ctaTitle: "Are you on this list?",
    ctaBody:
      "If you are, you already know. Either way, Carlo and Kristinne would love to have you in the room.",
  },
  gallery: {
    eyebrow: "The shared album",
    title: "Everything, from everyone",
    intro:
      "The photographers will cover the day beautifully. This is for everything they cannot be in two places for, which is often the best of it.",
    how: [
      {
        title: "Anyone can add",
        body: "No app and no account needed. Just choose the photographs from your phone and send them.",
      },
      {
        title: "Checked first",
        body: "Carlo and Kristinne see everything before it appears, which keeps the album lovely for everyone.",
      },
      {
        title: "Anyone can take",
        body: "Every photograph in the album downloads at its original size, and the links never expire.",
      },
    ],
    uploadEyebrow: "Add yours",
    uploadTitle: "Upload what you took",
    uploadIntro: "Tag anything you post elsewhere with the hashtag so it can be found later.",
    albumTitle: "The album",
    emptyTitle: "Nothing here yet",
    emptyBody:
      "The album fills up from the day of the wedding. Come back on the seventeenth, or any time after, and it will not be empty.",
    ctaTitle: "First, the small matter of your reply",
    ctaBody: "The album will happily wait for you. The caterer, sadly, cannot.",
  },
  guestbook: {
    eyebrow: "Say something",
    title: "The wishing wall",
    headerPhotos: [
      {
        src: "/photos/carlo-kristinne-proposal-cave.jpg",
        alt: "Kristinne holding up her hand to show her engagement ring, Carlo beside her in a rock cave by the sea.",
        caption: "",
        shape: "portrait",
      },
    ],
    intro:
      "A wish, a blessing, or a story. Everything left here is read by both of them, and printed for them to keep afterwards.",
    wallTitle: "What everyone has written",
    emptyTitle: "Nothing here yet",
    emptyBody: "The wall fills up as messages are approved. Yours could be the very first.",
    ctaTitle: "And are you coming?",
    ctaBody: "A message means a lot. A reply means the caterer can count you in.",
  },
  rsvp: {
    deadlineLabel: RSVP.deadlineLabel,
    title: "Are you coming?",
    intro: "One short form, two minutes, and then Carlo and Kristinne can stop refreshing their phones.",
    headerPhotos: [
      {
        src: "/photos/carlo-kristinne-beach-sunset.jpg",
        alt: "Carlo and Kristinne on a beach at sunset, both in white, palm trees behind them.",
        caption: "",
        shape: "landscape",
      },
    ],
    why: [
      {
        title: "The list is 100",
        body: "Every seat is already accounted for, so please count only the people named on your invitation.",
      },
      {
        title: "The caterer needs a number",
        body: "The final headcount goes to the kitchen about two weeks before the day, so an early reply is a real help.",
      },
      {
        title: "It takes two minutes",
        body: "If your plans change afterwards, message Erick rather than filling this in again.",
      },
    ],
    dayEyebrow: "The day itself",
    dayNote: `Ceremony at ${WEDDING_DAY.ceremonyTime}. Be seated by 3:30 PM.`,
    closingLine: "Kindly reply by",
  },
};

/* =========================
   The editor: which fields each page exposes
   ========================= */

export type ScalarField = {
  type: "text" | "textarea" | "url" | "image";
  path: string;
  label: string;
  help?: string;
};

export type ListField = {
  type: "list";
  path: string;
  label: string;
  help?: string;
  /** Adding a row is allowed; removing one is done by blanking its title. */
  itemFields: { key: string; label: string; type: "text" | "textarea" | "url" | "select"; options?: string[] }[];
  /** The key that decides whether a row exists at all. */
  required: string;
  /** Blank rows offered under the list for new entries. */
  spare?: number;
};

export type ContentField = ScalarField | ListField;

export type ContentSection = {
  id: string;
  label: string;
  description: string;
  /** The public path this section edits. */
  preview: string;
  fields: ContentField[];
};

const text = (path: string, label: string, help?: string): ScalarField => ({ type: "text", path, label, help });
const area = (path: string, label: string, help?: string): ScalarField => ({ type: "textarea", path, label, help });
const titledBody = (path: string, label: string, help?: string, spare = 1): ListField => ({
  type: "list",
  path,
  label,
  help,
  required: "title",
  spare,
  itemFields: [
    { key: "title", label: "Title", type: "text" },
    { key: "body", label: "Text", type: "textarea" },
  ],
});

export const CONTENT_SECTIONS: ContentSection[] = [
  {
    id: "home",
    label: "Home",
    description: "The first page a guest sees: the hero, the four facts, and the previews of every other page.",
    preview: "/",
    fields: [
      { type: "image", path: "home.heroPhoto", label: "Hero photograph", help: "A landscape photograph of the two of you. Upload one to replace the beach photograph; empty shows the beach photograph again." },
      text("home.heroPhotoAlt", "Photograph description", "Read out by screen readers. One sentence."),
      area("home.intro", "Hero introduction"),
      text("home.primaryLabel", "Main button"),
      text("home.secondaryLabel", "Second button"),
      {
        type: "list",
        path: "home.glance",
        label: "The four facts under the hero",
        required: "label",
        spare: 0,
        itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "value", label: "Value", type: "text" },
          { key: "note", label: "Note", type: "text" },
        ],
      },
      text("home.storyEyebrow", "Story eyebrow"),
      text("home.storyTitle", "Story heading"),
      area("home.storyP1", "Story, first paragraph"),
      area("home.storyP2", "Story, second paragraph"),
      text("home.storyLink", "Story button"),
      text("home.detailsEyebrow", "Details eyebrow"),
      text("home.detailsTitle", "Details heading"),
      area("home.detailsIntro", "Details introduction"),
      text("home.detailsLink", "Details button"),
      text("home.galleryEyebrow", "Album eyebrow"),
      text("home.galleryTitle", "Album heading"),
      area("home.galleryIntro", "Album introduction", "The album preview only shows once photographs are published."),
      text("home.wishesEyebrow", "Wishes eyebrow"),
      text("home.wishesTitle", "Wishes heading"),
      area("home.wishesIntro", "Wishes introduction"),
      text("home.ctaTitle", "Closing heading"),
      area("home.ctaBody", "Closing text"),
    ],
  },
  {
    id: "our-story",
    label: "Our story",
    description: "The hashtag, the quote, the three things that matter, and the story itself when you are ready to write it.",
    preview: "/our-story",
    fields: [
      text("ourStory.eyebrow", "Eyebrow"),
      text("ourStory.title", "Heading"),
      area("ourStory.intro", "Introduction"),
      text("ourStory.hashtagEyebrow", "Hashtag eyebrow"),
      area("ourStory.hashtagP1", "Hashtag, first paragraph"),
      area("ourStory.hashtagP2", "Hashtag, second paragraph"),
      text("ourStory.quoteEyebrow", "Quote eyebrow"),
      area("ourStory.quote", "The quote"),
      area("ourStory.quoteNote", "Under the quote"),
      text("ourStory.valuesEyebrow", "Values eyebrow"),
      text("ourStory.valuesTitle", "Values heading"),
      area("ourStory.valuesIntro", "Values introduction"),
      titledBody("ourStory.values", "The three things", "Blank a title to remove that card."),
      text("ourStory.storyEyebrow", "Story eyebrow"),
      text("ourStory.storyTitle", "Story heading"),
      area("ourStory.storyBody", "The story", "How you met and how he asked. Leave empty and the section stays hidden. Blank lines make paragraphs."),
      text("ourStory.pairEyebrow", "Portraits eyebrow"),
      text("ourStory.pairTitle", "Portraits heading"),
      {
        type: "list",
        path: "ourStory.pair",
        label: "The two portraits",
        help: "One of each of you, side by side. The caption is the name under the photograph.",
        required: "src",
        spare: 0,
        itemFields: [
          { key: "src", label: "Address", type: "text" },
          { key: "caption", label: "Caption", type: "text" },
          { key: "alt", label: "Description for screen readers", type: "textarea" },
          { key: "shape", label: "Shape", type: "select", options: ["landscape", "portrait"] },
        ],
      },
      text("ourStory.photosEyebrow", "Photographs eyebrow"),
      text("ourStory.photosTitle", "Photographs heading"),
      area("ourStory.photosIntro", "Photographs introduction"),
      {
        type: "list",
        path: "ourStory.photos",
        label: "The photographs",
        help: "The address is where the photograph lives. The four here are files on the site. A photograph you upload through the Gallery and publish can be used too: open it in the album and paste its address. Blank the address to remove one.",
        required: "src",
        spare: 1,
        itemFields: [
          { key: "src", label: "Address", type: "text" },
          { key: "caption", label: "Caption", type: "text" },
          { key: "alt", label: "Description for screen readers", type: "textarea" },
          { key: "shape", label: "Shape", type: "select", options: ["landscape", "portrait"] },
        ],
      },
      text("ourStory.ctaTitle", "Closing heading"),
      area("ourStory.ctaBody", "Closing text"),
    ],
  },
  {
    id: "details",
    label: "Details",
    description: "Venues, maps, dress code, the practical notes, your point of contact, and the questions guests ask.",
    preview: "/details",
    fields: [
      text("details.eyebrow", "Eyebrow"),
      text("details.title", "Heading"),
      {
        type: "list",
        path: "details.headerPhotos",
        label: "Header photographs",
        help: "One photograph makes a wide band under the heading; two make a pair. Blank the address to remove one.",
        required: "src",
        spare: 1,
        itemFields: [
          { key: "src", label: "Address", type: "text" },
          { key: "alt", label: "Description for screen readers", type: "textarea" },
          { key: "shape", label: "Shape", type: "select", options: ["landscape", "portrait"] },
        ],
      },

      area("details.intro", "Introduction"),
      text("details.venuesEyebrow", "Venues eyebrow"),
      text("details.venuesTitle", "Venues heading"),
      area("details.venuesIntro", "Venues introduction"),
      {
        type: "list",
        path: "details.venues",
        label: "Venues",
        help: "Name, address and map link are shown as soon as you fill them in. Empty means not announced yet.",
        required: "label",
        spare: 0,
        itemFields: [
          { key: "label", label: "Label", type: "text" },
          { key: "name", label: "Venue name", type: "text" },
          { key: "address", label: "Address", type: "text" },
          { key: "time", label: "Time", type: "text" },
          { key: "note", label: "Note for guests", type: "textarea" },
          { key: "mapUrl", label: "Map link", type: "url" },
        ],
      },
      text("details.officiantLine", "Officiant line"),
      text("details.dressEyebrow", "Dress code eyebrow"),
      text("details.dressTitle", "Dress code heading"),
      area("details.dressNote", "Dress code note"),
      {
        type: "list",
        path: "details.dressCode",
        label: "Who wears what",
        help: "The outfit is the actual garments, as on the attire guide: cut, shirt, tie, shoes. Leave it empty for a role with no guide yet.",
        required: "role",
        spare: 1,
        itemFields: [
          { key: "role", label: "Who", type: "text" },
          { key: "colour", label: "Colour", type: "text" },
          { key: "outfit", label: "The outfit", type: "textarea" },
        ],
      },
      text("details.practicalEyebrow", "Good to know eyebrow"),
      text("details.practicalTitle", "Good to know heading"),
      titledBody("details.practical", "Good to know cards"),
      text("details.contactEyebrow", "Contact eyebrow"),
      text("details.contactName", "Contact name"),
      text("details.contactRole", "Contact role"),
      text("details.contactEmail", "Contact email", "Empty hides it."),
      text("details.contactPhone", "Contact phone", "Empty hides it."),
      text("details.faqEyebrow", "Questions eyebrow"),
      text("details.faqTitle", "Questions heading"),
      area("details.faqIntro", "Questions introduction"),
      {
        type: "list",
        path: "details.faq",
        label: "Questions and answers",
        help: "Blank a question to remove it. Answer in the first sentence, then elaborate.",
        required: "q",
        spare: 2,
        itemFields: [
          { key: "q", label: "Question", type: "text" },
          { key: "a", label: "Answer", type: "textarea" },
        ],
      },
      text("details.ctaTitle", "Closing heading"),
      area("details.ctaBody", "Closing text"),
    ],
  },
  {
    id: "programme",
    label: "Programme",
    description: "The run of the day. Reception times are worked out from the doors time and each item's minutes, so they never disagree.",
    preview: "/programme",
    fields: [
      {
        type: "list",
        path: "programme.headerPhotos",
        label: "Header photographs",
        help: "One photograph makes a wide band under the heading; two make a pair. Blank the address to remove one.",
        required: "src",
        spare: 1,
        itemFields: [
          { key: "src", label: "Address", type: "text" },
          { key: "alt", label: "Description for screen readers", type: "textarea" },
          { key: "shape", label: "Shape", type: "select", options: ["landscape", "portrait"] },
        ],
      },
      text("programme.eyebrow", "Eyebrow"),
      text("programme.title", "Heading"),
      area("programme.intro", "Introduction"),
      text("programme.phases.morning.title", "Morning heading"),
      area("programme.phases.morning.blurb", "Morning introduction"),
      text("programme.phases.afternoon.title", "Afternoon heading"),
      area("programme.phases.afternoon.blurb", "Afternoon introduction"),
      text("programme.phases.ceremony.title", "Ceremony heading"),
      area("programme.phases.ceremony.blurb", "Ceremony introduction"),
      text("programme.phases.between.title", "In between heading"),
      area("programme.phases.between.blurb", "In between introduction"),
      {
        type: "list",
        path: "programme.items",
        label: "Every item of the day",
        help: "Day items carry a clock time. Reception items carry minutes instead; their clock time is worked out from the doors. Blank a title to remove an item. New items go at the end, in the phase you pick.",
        required: "title",
        spare: 2,
        itemFields: [
          { key: "phase", label: "Part of the day", type: "select", options: ["morning", "afternoon", "ceremony", "between", "reception"] },
          { key: "time", label: "Clock time (day items)", type: "text" },
          { key: "minutes", label: "Minutes (reception items)", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "detail", label: "Detail", type: "textarea" },
        ],
      },
      text("programme.doors", "Reception doors open at", "Written like 7:15 PM. Every reception time is counted from here."),
      text("programme.receptionEyebrow", "Reception eyebrow"),
      text("programme.receptionTitle", "Reception heading"),
      area("programme.receptionIntro", "Reception introduction"),
      area("programme.receptionNote", "Note above the reception list"),
      text("programme.hostEyebrow", "Host eyebrow"),
      text("programme.hostTitle", "Host heading"),
      area("programme.hostP1", "Host, first paragraph"),
      area("programme.hostP2", "Host, second paragraph"),
      text("programme.ctaTitle", "Closing heading"),
      area("programme.ctaBody", "Closing text"),
    ],
  },
  {
    id: "entourage",
    label: "Entourage",
    description: "Every group of people standing with you. A group with no names yet stays hidden from guests.",
    preview: "/entourage",
    fields: [
      {
        type: "list",
        path: "entourage.headerPhotos",
        label: "Header photographs",
        help: "One photograph makes a wide band under the heading; two make a pair. Blank the address to remove one.",
        required: "src",
        spare: 1,
        itemFields: [
          { key: "src", label: "Address", type: "text" },
          { key: "alt", label: "Description for screen readers", type: "textarea" },
          { key: "shape", label: "Shape", type: "select", options: ["landscape", "portrait"] },
        ],
      },
      text("entourage.eyebrow", "Eyebrow"),
      text("entourage.title", "Heading"),
      area("entourage.intro", "Introduction"),
      {
        type: "list",
        path: "entourage.groups",
        label: "Groups",
        help: "People: one per line, written as Name | Role | Note. The note is optional. A group with no people is not shown.",
        required: "title",
        spare: 1,
        itemFields: [
          { key: "title", label: "Group", type: "text" },
          { key: "blurb", label: "One line under the group name", type: "text" },
          { key: "people", label: "People, one per line: Name | Role | Note", type: "textarea" },
          { key: "pendingNote", label: "Note while the list is empty (only you see it)", type: "text" },
        ],
      },
      text("entourage.footnoteEyebrow", "Footnote eyebrow"),
      area("entourage.footnote", "Footnote"),
      text("entourage.ctaTitle", "Closing heading"),
      area("entourage.ctaBody", "Closing text"),
    ],
  },
  {
    id: "gallery",
    label: "Gallery",
    description: "The shared album page: how it works, the upload invitation, and the empty state before the day.",
    preview: "/gallery",
    fields: [
      text("gallery.eyebrow", "Eyebrow"),
      text("gallery.title", "Heading"),
      area("gallery.intro", "Introduction"),
      titledBody("gallery.how", "How it works cards", undefined, 0),
      text("gallery.uploadEyebrow", "Upload eyebrow"),
      text("gallery.uploadTitle", "Upload heading"),
      area("gallery.uploadIntro", "Upload introduction"),
      text("gallery.albumTitle", "Album heading"),
      text("gallery.emptyTitle", "Empty album heading"),
      area("gallery.emptyBody", "Empty album text"),
      text("gallery.ctaTitle", "Closing heading"),
      area("gallery.ctaBody", "Closing text"),
    ],
  },
  {
    id: "guestbook",
    label: "Guestbook",
    description: "The wishing wall: the invitation to write, and what shows before the first message.",
    preview: "/guestbook",
    fields: [
      {
        type: "list",
        path: "guestbook.headerPhotos",
        label: "Header photographs",
        help: "One photograph makes a wide band under the heading; two make a pair. Blank the address to remove one.",
        required: "src",
        spare: 1,
        itemFields: [
          { key: "src", label: "Address", type: "text" },
          { key: "alt", label: "Description for screen readers", type: "textarea" },
          { key: "shape", label: "Shape", type: "select", options: ["landscape", "portrait"] },
        ],
      },
      text("guestbook.eyebrow", "Eyebrow"),
      text("guestbook.title", "Heading"),
      area("guestbook.intro", "Introduction"),
      text("guestbook.wallTitle", "Wall heading"),
      text("guestbook.emptyTitle", "Empty wall heading"),
      area("guestbook.emptyBody", "Empty wall text"),
      text("guestbook.ctaTitle", "Closing heading"),
      area("guestbook.ctaBody", "Closing text"),
    ],
  },
  {
    id: "rsvp",
    label: "RSVP",
    description: "The reply page. The form itself and the guest cap are fixed; the words around them are yours.",
    preview: "/rsvp",
    fields: [
      {
        type: "list",
        path: "rsvp.headerPhotos",
        label: "Header photographs",
        help: "One photograph makes a wide band under the heading; two make a pair. Blank the address to remove one.",
        required: "src",
        spare: 1,
        itemFields: [
          { key: "src", label: "Address", type: "text" },
          { key: "alt", label: "Description for screen readers", type: "textarea" },
          { key: "shape", label: "Shape", type: "select", options: ["landscape", "portrait"] },
        ],
      },
      text("rsvp.deadlineLabel", "Reply-by date, as shown to guests", "Also used on every closing banner."),
      text("rsvp.title", "Heading"),
      area("rsvp.intro", "Introduction"),
      titledBody("rsvp.why", "Why reply cards", undefined, 0),
      text("rsvp.dayEyebrow", "Day box eyebrow"),
      text("rsvp.dayNote", "Day box note"),
      text("rsvp.closingLine", "Closing banner line", "Shown before the reply-by date."),
    ],
  },
];

export function sectionById(id: string): ContentSection | undefined {
  return CONTENT_SECTIONS.find((s) => s.id === id);
}

/** The editor section for a public path, for the "Edit this page" button. */
export function sectionForPath(pathname: string): ContentSection | undefined {
  const clean = pathname.replace(/\/$/, "") || "/";
  return CONTENT_SECTIONS.find((s) => s.preview === clean);
}

/* =========================
   Path helpers and the merge
   ========================= */

export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

export function setPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(".");
  let cursor: Record<string, unknown> = obj;
  for (const key of keys.slice(0, -1)) {
    const next = cursor[key];
    if (!next || typeof next !== "object") cursor[key] = {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
}

/**
 * Facts that arrive in code after the couple have saved the document.
 *
 * A dashboard save snapshots the whole document, so every list that existed
 * at that moment is frozen, and a fact added to code later (the printed
 * entourage card, a new dress code row) never reaches the live site. This
 * heals the two lists where that has actually happened. For each group the
 * code knows, the saved group wins only if the couple put names in it; an
 * empty saved group gives way to the code's group, and groups the saved
 * document has never heard of are appended in code order. Groups the couple
 * added themselves are kept at the end. A group is matched by title. One
 * refinement: when every name in the saved group is contained in a name in
 * the code's group, the code's version is used. That covers the same people
 * with reassigned roles (the bearers, between the workbook and the print)
 * and a shorter earlier list ("Pastor Jomar" before "Pastor Jomar Antalan"
 * and Pastora Lorna arrived). Names the couple typed themselves would not
 * all be fragments of the code's names.
 */
const coveredByCode = (saved: string, code: string) => {
  const codeNames = linesToPeople(code).map((p) => p.name.toLowerCase());
  return linesToPeople(saved).every((p) => codeNames.some((name) => name.includes(p.name.toLowerCase())));
};

export function healContent(content: SiteContent): SiteContent {
  const saved = content.entourage.groups;
  const healed: EntourageGroup[] = DEFAULT_CONTENT.entourage.groups.map((code) => {
    const match = saved.find((g) => g.title === code.title);
    if (!match || linesToPeople(match.people).length === 0) return code;
    return coveredByCode(match.people, code.people) ? code : match;
  });
  // Groups that once existed in code and were removed on purpose. A saved
  // copy of one must not be treated as something the couple added.
  const retired = ["The Couple"];
  for (const g of saved) {
    if (retired.includes(g.title)) continue;
    if (!healed.some((h) => h.title === g.title) && linesToPeople(g.people).length > 0) healed.push(g);
  }
  return { ...content, entourage: { ...content.entourage, groups: healed } };
}

/**
 * Stored over defaults. Objects merge key by key; arrays and scalars are
 * taken whole from the stored side when present, so a saved list replaces
 * the default list rather than being spliced into it.
 */
export function mergeContent<T>(defaults: T, stored: unknown): T {
  if (Array.isArray(defaults)) return (Array.isArray(stored) ? stored : defaults) as T;
  if (defaults && typeof defaults === "object") {
    const out: Record<string, unknown> = {};
    const base = defaults as Record<string, unknown>;
    const over = stored && typeof stored === "object" && !Array.isArray(stored) ? (stored as Record<string, unknown>) : {};
    for (const key of Object.keys(base)) {
      out[key] = key in over ? mergeContent(base[key], over[key]) : base[key];
    }
    return out as T;
  }
  return (typeof stored === typeof defaults && stored !== null ? stored : defaults) as T;
}

/* =========================
   Programme helpers, shared by the page and the editor
   ========================= */

/** "7:15 PM" to minutes from midnight. Anything unreadable falls back to 7:15 PM. */
export function clockToMinutes(label: string): number {
  const match = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM|NN)?$/i.exec(label.trim());
  if (!match) return 19 * 60 + 15;
  let hours = Number(match[1]) % 12;
  const minutes = Number(match[2] ?? 0);
  const suffix = (match[3] ?? "").toUpperCase();
  if (suffix === "PM") hours += 12;
  if (suffix === "NN") hours = 12;
  return hours * 60 + minutes;
}

export function receptionTimeline(items: ProgrammeItem[], doors: string) {
  let offset = 0;
  const start = clockToMinutes(doors);
  return items
    .filter((item) => item.phase === "reception")
    .map((item) => {
      const minutes = Number(item.minutes) || 0;
      const entry = { item, minutes, offset, clockMinutes: start + offset };
      offset += minutes;
      return entry;
    });
}
