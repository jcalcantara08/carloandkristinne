import { Hero } from "@/components/sections/Hero";
import { AtAGlance } from "@/components/sections/AtAGlance";
import { StoryPreview } from "@/components/sections/StoryPreview";
import { DetailsPreview } from "@/components/sections/DetailsPreview";
import { DressCode } from "@/components/sections/DressCode";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { GuestbookPreview } from "@/components/sections/GuestbookPreview";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Marquee } from "@/components/sections/Marquee";
import { listGuestbook, listPhotos } from "@/lib/store";

/**
 * The page arc, house standard:
 * hero, proof strip, story, details, gallery, wishes, closing CTA.
 *
 * Grounds alternate white and a faint tint so a long scroll has rhythm, and
 * the single DARK band is the closing CTA. There is never a second dark band.
 */
export default async function HomePage() {
  const [wishes, photos] = await Promise.all([listGuestbook("approved", 3), listPhotos("approved")]);

  return (
    <>
      <Hero />
      <AtAGlance />
      <StoryPreview />
      <DetailsPreview />
      <DressCode />
      <Marquee />
      <GalleryPreview photos={photos} />
      <GuestbookPreview entries={wishes} />
      <CtaBanner />
    </>
  );
}
