import LotusBloom from './svgs/LotusBloom';

export default function CompletionRing({ completion = 0, done = 0, total = 0, size = 120 }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - completion);
  const pct = Math.round(completion * 100);

  const strokeColor = pct >= 80 ? '#C9A961' : pct >= 50 ? '#E8843C' : '#5A8A8A';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        {/* Background ring */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#E8E0D0"
          className="dark:opacity-20"
          strokeWidth="7"
          fill="none"
        />
        {/* Progress ring */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={strokeColor}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.6s ease-in-out, stroke 0.4s ease' }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {completion >= 0.8 ? (
          <LotusBloom completion={completion} size={52} />
        ) : (
          <>
            <span className="text-2xl font-bold font-sans" style={{ color: strokeColor }}>
              {pct}%
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">
              {done}/{total}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
