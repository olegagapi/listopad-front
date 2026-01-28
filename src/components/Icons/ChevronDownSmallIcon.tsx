import { IconProps } from './types';

export function ChevronDownSmallIcon({
  size = 16,
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
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`fill-current ${className}`}
      aria-label={label}
      aria-hidden={!label}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.95363 5.67461C3.13334 5.46495 3.44899 5.44067 3.65866 5.62038L7.99993 9.34147L12.3412 5.62038C12.5509 5.44067 12.8665 5.46495 13.0462 5.67461C13.2259 5.88428 13.2017 6.19993 12.992 6.37964L8.32532 10.3796C8.13808 10.5401 7.86178 10.5401 7.67453 10.3796L3.00787 6.37964C2.7982 6.19993 2.77392 5.88428 2.95363 5.67461Z"
        fill="currentColor"
      />
    </svg>
  );
}
