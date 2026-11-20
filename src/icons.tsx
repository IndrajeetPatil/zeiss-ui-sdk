import type { IconName } from "./content.ts";

const paths: Record<
  IconName | "search" | "arrow" | "external" | "people" | "globe" | "handshake" | "up",
  string
> = {
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  cross: "M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z",
  chip: "M7 7h10v10H7Z M10 10h4v4h-4Z M9 2v5 M15 2v5 M9 17v5 M15 17v5 M2 9h5 M2 15h5 M17 9h5 M17 15h5",
  gear: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9l2.1 2.1 M17 17l2.1 2.1 M4.9 19.1 7 17 M17 7l2.1-2.1",
  microscope: "M6 21h12 M9 21v-3a6 6 0 0 1 9-5 M10 4l4 2-3 6-4-2Z M12 2l3 1.5",
  aperture:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z M14.3 8l5.7 9.9 M9.7 8h11.5 M7.4 12l5.8-10 M9.7 16 4 6.1 M14.3 16H2.8 M16.6 12l-5.8 10",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 1v6 M12 17v6 M1 12h6 M17 12h6",
  projector: "M3 9h14v8H3Z M10 13m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0 M17 11l4-2v8l-4-2",
  prism: "M12 3 3 20h18Z M1 14l8-1 M15 12l8-3 M15 13l8 1 M15 14l8 5",
  screen: "M3 4h18v12H3Z M8 20h8 M12 16v4",
  search: "M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Z M16 16l5 5",
  arrow: "M4 12h15 M14 6l6 6-6 6",
  external: "M14 4h6v6 M20 4l-9 9 M18 14v6H4V6h6",
  people:
    "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6 M14 14.3A6 6 0 0 1 22 20",
  globe:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z M2 12h20 M12 2c3 3.5 3 16.5 0 20 M12 2c-3 3.5-3 16.5 0 20",
  handshake: "M2 11l5-5 5 3 5-3 5 5 M7 6l-3 9 5 5 3-2 3 2 5-5-3-9 M9 12l3 3",
  up: "M12 20V5 M6 11l6-6 6 6",
};

function Icon({ name, size = 24 }: { name: keyof typeof paths; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      <path d={paths[name]} />
    </svg>
  );
}

function ZeissLogo() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" role="img" aria-label="ZEISS">
      <rect width="48" height="48" fill="#0f2db3" />
      <path d="M0 10 Q24 3 48 10 V0 H0Z" fill="#fff" opacity=".18" />
      <text
        x="24"
        y="29"
        textAnchor="middle"
        fill="#fff"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
        fontWeight="700"
        fontSize="12.5"
        letterSpacing="-.2"
      >
        ZEISS
      </text>
      <path d="M0 38 Q24 45 48 38 V48 H0Z" fill="#fff" opacity=".18" />
    </svg>
  );
}

export { Icon, ZeissLogo };
