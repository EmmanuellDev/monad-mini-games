import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FF2CB2 0%, #C400FF 100%)',
          borderRadius: '8px',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5V19A9 3 0 0 0 21 19V5" />
          <path d="M3 12A9 3 0 0 0 21 12" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
