import { useEffect, useRef } from 'react';

export default function RibbonDivider({ flip = false }) {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          path.classList.add('drawn');
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(path);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '12px 0',
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 900 48"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{
          width: '100%',
          maxWidth: 900,
          height: 48,
          transform: flip ? 'scaleY(-1)' : 'none',
        }}
      >
        <path
          ref={pathRef}
          className="ribbon-path"
          d="M 0 30 C 80 8, 180 44, 320 24 S 520 6, 640 26 S 800 44, 900 20"
          stroke="#D9A521"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
