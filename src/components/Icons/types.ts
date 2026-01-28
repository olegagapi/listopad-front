import { SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  label?: string;
}
