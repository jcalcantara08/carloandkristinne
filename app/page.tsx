import { Hero } from "@/components/sections/Hero";
import { AtAGlance } from "@/components/sections/AtAGlance";
import { StoryPreview } from "@/components/sections/StoryPreview";
import { DetailsPreview } from "@/components/sections/DetailsPreview";
import { DressCode } from "@/components/sections/DressCode";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { GuestbookPreview } from "@/components/sections/GuestbookPreview";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { listGuestbook, listPhotos } from "@/lib/store";

/**
 * The page arc: hero, proof strip, story, details, dress code, gallery,
 * wishes, closing CTA. Grounds alternate white and a faint ice tint so a
 * long scroll has rhythm, and the single DARK band is the closing CTA.
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
      <GalleryPreview photos={photos} />
      <GuestbookPreview entries={wishes} />
      <CtaBanner />
    </>
  );
}
