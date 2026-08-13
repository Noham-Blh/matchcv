import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg width="32" height="32" viewBox="0 0 100 100">
        <rect x="4" y="4" width="92" height="92" rx="22" fill="#12141C" />
        <path
          d="M26 74 L26 28 L50 54"
          stroke="#C6FF3D"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M50 54 L74 28 L74 74"
          stroke="#5A70E4"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
    { ...size }
  );
}
