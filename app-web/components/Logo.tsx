import Image from "next/image";

interface LogoProps {
  size?: number;
  showText?: boolean;
  textSize?: string;
}

/* LOGO NORMAL (navbar y demás componentes) */
export function LogoIcon({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      width={size}
      height={size}
      alt="HumanSoftechs logo"
      style={{
        filter: "brightness(0) invert(1)",
      }}
    />
  );
}

/* LOGO ORIGINAL */
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

/* LOGO SOLO PARA FOOTER (blanco puro) */
export function LogoIconFooter({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      width={size}
      height={size}
      alt="HumanSoftechs footer logo"
      style={{
        filter: "brightness(0) saturate(100%) invert(100%)",
        objectFit: "contain",
      }}
    />
  );
}

/* LOGO NORMAL DEL NAVBAR */
export default function Logo({
  size = 36,
  showText = true,
  textSize = "text-base",
}: LogoProps) {
  const iconBox = size + 10;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex-shrink-0 rounded-xl flex items-center justify-center"
        style={{
          width: iconBox,
          height: iconBox,
          background: "#111827",
          padding: "6px",
        }}
      >
        <LogoIcon size={size} />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`tracking-tight ${textSize}`}
            style={{ lineHeight: 1.15 }}
          >
            <span style={{ color: "#111827", fontWeight: 900 }}>
              Human
            </span>
            <span style={{ color: "#111827", fontWeight: 400 }}>
              Softechs
            </span>
          </span>

          <span className="flex gap-0.5 mt-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background:
                    i < 3 ? "#111827" : "#d1d5db",
                  display: "inline-block",
                }}
              />
            ))}
          </span>
        </div>
      )}
    </div>
  );
}

/* LOGO SOLO PARA FOOTER */
export function LogoFooter({
  size = 36,
  showText = true,
  textSize = "text-base",
}: LogoProps) {
  const iconBox = size + 10;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex-shrink-0 rounded-xl flex items-center justify-center"
        style={{
          width: iconBox,
          height: iconBox,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "6px",
        }}
      >
        {/* SOLO FOOTER */}
        <LogoIconFooter size={size} />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`tracking-tight ${textSize}`}
            style={{ lineHeight: 1.15 }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.95)",
                fontWeight: 800,
              }}
            >
              Human
            </span>

            <span
              style={{
                color: "rgba(255,255,255,0.95)",
                fontWeight: 500,
              }}
            >
              Softechs
            </span>
          </span>

          <span className="flex gap-0.5 mt-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background:
                    i < 3
                      ? "#ffffff"
                      : "rgba(255,255,255,0.3)",
                  display: "inline-block",
                }}
              />
            ))}
          </span>
        </div>
      )}
    </div>
  );
}