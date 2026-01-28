import { IconProps } from './types';

export function CheckIcon({
  size = 10,
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
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={label}
      aria-hidden={!label}
      {...props}
    >
      <path
        d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
        stroke="white"
        strokeWidth="1.94437"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
