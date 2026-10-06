import QRCode from "qrcode";

/**
 * A scannable code for a venue's map link, drawn on the server at build or
 * revalidate time, so it always matches the link saved under Edit the
 * website, Details. The couple asked for these on 6 October 2026 so guests
 * can scan the way to the church and the reception, as on the printed cards.
 *
 * Black on white with a quiet zone, because brand colours lower the scan
 * rate on older phones. Error correction M survives a cracked screen or a
 * glare on a printed copy.
 */
export async function VenueQr({ url, venueName, className }: { url: string; venueName: string; className?: string }) {
  const svg = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 2 });
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  return (
    // A data URI needs no image optimisation, and next/image cannot size an inline SVG for us.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`QR code for the map to ${venueName}`}
      width={160}
      height={160}
      className={className ?? "mx-auto h-40 w-40 rounded-lg border border-brand-line bg-brand-paper"}
    />
  );
}
