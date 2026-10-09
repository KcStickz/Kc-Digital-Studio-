import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textColor?: string;
}

/**
 * Official KC Digital Studio Logo
 * Faithful vector representation of the brand mark.
 * Preserves exact proportions, aspect ratio, and orange brand identity (#FFA500).
 */
export const StudioLogoMark: React.FC<{ size?: number | string; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="KC Digital Studio Logo Mark"
    >
      {/* Left Crescent Shape (C) */}
      <path
        d="M 54 80 C 32 80 14 66 14 50 C 14 34 32 20 54 20 C 58.5 20 59.2 23.5 56.5 26.5 C 41 33 37.5 45 42 62.5 C 44.5 72 50 78 54 80 Z"
        fill="#FFA500"
      />
      {/* Right Diagonal K Element */}
      <path
        d="M 46.5 43.5 L 70 21.5 L 83.5 22 L 63.5 41 L 84 80 L 66 80 L 46.5 43.5 Z"
        fill="#FFA500"
      />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 40,
  showText = true,
  textColor = 'text-white',
}) => {
  return (
    <a
      href="#home"
      className={`inline-flex items-center gap-3 transition-opacity hover:opacity-90 group focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 rounded-lg p-1 ${className}`}
      aria-label="KC Digital Studio - Home"
    >
      <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-[#121727]/80 border border-[#282D40] shadow-sm group-hover:border-[#FFA500]/40 transition-colors">
        <StudioLogoMark size={size} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight text-lg leading-tight ${textColor} group-hover:text-white transition-colors`}>
            KC <span className="text-[#FFA500]">Digital</span> Studio
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#858DA2] font-medium">
            Creative & Digital
          </span>
        </div>
      )}
    </a>
  );
};

export default Logo;
