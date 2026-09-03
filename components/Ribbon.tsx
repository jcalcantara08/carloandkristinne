/**
 * The ribbon.
 *
 * One continuous blue-into-violet line that snakes down the entire length of
 * the page, passing behind every section. It is the site's spine and the
 * single device that makes it look like itself rather than like a template:
 * every other wedding site is a stack of centred cards, and this one has a
 * thread running through it.
 *
 * Implementation notes that matter if you touch it:
 *
 * - `preserveAspectRatio="none"` lets one fixed viewBox stretch to any page
 *   height, so the curve always spans the document no matter how long it is.
 * - `vector-effect="non-scaling-stroke"` is what stops that stretch from
 *   smearing the stroke into a wedge. Without it the line thickens wherever
 *   the curve runs horizontally.
 * - It is purely decorative, so it is aria-hidden and pointer-events-none,
 *   and it sits at -z-10 behind all content.
 */
export function Ribbon() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ribbon-stroke" x1="0" y1="0" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3A55D9" stopOpacity="0" />
            <stop offset="0.08" stopColor="#3A55D9" stopOpacity="0.55" />
            <stop offset="0.42" stopColor="#8B3FD4" stopOpacity="0.55" />
            <stop offset="0.72" stopColor="#3A55D9" stopOpacity="0.5" />
            <stop offset="1" stopColor="#8B3FD4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* The main thread. */}
        <path
          d="M 62 0 C 18 130, 92 250, 46 390 S 4 590, 68 740 S 96 890, 38 1000"
          stroke="url(#ribbon-stroke)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />

        {/* A second, fainter pass, offset. Two lines read as a ribbon
            catching the light; one line reads as a stray border. */}
        <path
          d="M 66 0 C 24 140, 96 260, 51 400 S 9 600, 73 750 S 99 900, 43 1000"
          stroke="url(#ribbon-stroke)"
          strokeWidth="0.5"
          strokeOpacity="0.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
