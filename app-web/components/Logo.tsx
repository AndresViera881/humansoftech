import Image from 'next/image';

interface LogoProps {
  size?: number;
  showText?: boolean;
  textSize?: string;
}

export function LogoIcon({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      width={size}
      height={size}
      alt="HumanSoftechs logo"
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );
}

export function LogoIconGradient({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      width={size}
      height={size}
      alt="HumanSoftechs logo"
    />
  );
}

export default function Logo({ size = 36, showText = true, textSize = 'text-base' }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex-shrink-0 rounded-xl flex items-center justify-center"
        style={{
          width: size + 10,
          height: size + 10,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
          padding: '5px',
        }}
      >
        <LogoIcon size={size} />
      </div>
      {showText && (
        <span className={`font-black tracking-tight ${textSize}`} style={{ lineHeight: 1.1 }}>
          <span style={{ color: '#1c1410' }}>Human</span><span style={{ color: '#2563eb' }}>Softechs</span>
        </span>
      )}
    </div>
  );
}
