import { IconProps } from './types';

export function YouTubeIcon({
  size = 20,
  width,
  height,
  className = '',
  label,
  ...props
}: IconProps): React.JSX.Element {
  return (
    <svg
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`fill-current ${className}`}
      aria-label={label}
      aria-hidden={!label}
      {...props}
    >
      <path
        d="M23.498 6.186a2.995 2.995 0 0 0-2.107-2.117C19.545 3.5 12 3.5 12 3.5s-7.545 0-9.391.569A2.995 2.995 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.995 2.995 0 0 0 2.107 2.117C4.455 20.5 12 20.5 12 20.5s7.545 0 9.391-.569a2.995 2.995 0 0 0 2.107-2.117C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
        fill="currentColor"
      />
    </svg>
  );
}
