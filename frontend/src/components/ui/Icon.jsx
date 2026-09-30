const PATHS = {
  leaf: 'M20 4C10 4 4 10 4 20c0 8 6 14 14 14 10 0 16-6 16-16C34 8 28 4 20 4z',
  shipping: 'M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 18a2 2 0 100-4 2 2 0 000 4zM17 18a2 2 0 100-4 2 2 0 000 4z',
  drop: 'M12 2s7 8 7 13a7 7 0 11-14 0c0-5 7-13 7-13z',
  flask: 'M9 2h6M10 2v6l-6 11a2 2 0 002 3h12a2 2 0 002-3l-6-11V2',
  location: 'M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13zM12 12a2 2 0 100-4 2 2 0 000 4z',
  headset: 'M4 13a8 8 0 0116 0v5a2 2 0 01-2 2h-2v-6h4M4 18a2 2 0 002 2h2v-6H4v4z',
  gift: 'M12 8v13M3 8h18v4H3zM12 8c-2 0-4-2-4-4a2.5 2.5 0 014-1c1.5-1.5 4-1 4 1s-2 4-4 4zM7 21h10v-9H7z',
  question: 'M12 22a10 10 0 100-20 10 10 0 000 20zM9.5 9a2.5 2.5 0 015 .3c0 1.7-2.5 2-2.5 3.7M12 17h.01',
  user: 'M12 12a5 5 0 100-10 5 5 0 000 10zM4 22c0-4.4 3.6-8 8-8s8 3.6 8 8',
  cart: 'M3 4h2l2.4 12.4a2 2 0 002 1.6h8.4a2 2 0 002-1.6L21 8H6',
  sparkle: 'M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6L12 2z',
  root: 'M12 3v6M12 9c-3 0-5 2-5 5s1 5 1 7M12 9c3 0 5 2 5 5s-1 5-1 7M9 21h6',
  shield: 'M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
};

export default function Icon({ name, size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d={PATHS[name] || ''} />
    </svg>
  );
}