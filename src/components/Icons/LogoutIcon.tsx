import { IconProps } from './types';

export function LogoutIcon({
  size = 24,
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
        d="M15.75 9V5.25C15.75 4.00736 14.7426 3 13.5 3H7.5C6.25736 3 5.25 4.00736 5.25 5.25V18.75C5.25 19.9926 6.25736 21 7.5 21H13.5C14.7426 21 15.75 19.9926 15.75 18.75V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M12 12H21M21 12L18.75 9.75M21 12L18.75 14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
