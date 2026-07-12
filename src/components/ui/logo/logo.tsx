import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import pmtLogo1 from "@app/assets/pmt_logo1.png";
import pmtLogo2 from "@app/assets/pmt_logo2.png";


export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** If true, disables link wrapping */
  disabledLink?: boolean;
  /** Choose which logo to render */
  variant?: 'light' | 'dark';
  /** Optional size shortcut */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'auto';
}

const sizeClasses: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-6 w-auto',
  md: 'h-8 w-auto',
  lg: 'h-10 w-auto',
  xl: 'h-12 w-auto',
  xxl: 'h-14 w-auto',
  auto: 'h-auto w-auto',
};

/**
 * Logo component
 *
 * - Controlled by `variant` (light | dark)
 * - Supports optional `size` prop or custom Tailwind classes
 * - Can be wrapped in a RouterLink unless `disabledLink` is true
 */
const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, variant = 'light', size = 'md', className = '', ...other }, ref) => {
    const logo = (
      <div ref={ref} className={`inline-flex p-3 rounded-lg ${className}`} {...other}>
        <img
           src={variant === 'dark' ? pmtLogo1 : pmtLogo2}
          alt={`logo-${variant}`}
          className={sizeClasses[size]}
        />
      </div>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <RouterLink to="/" className="contents">
        {logo}
      </RouterLink>
    );
  },
);

export { Logo };
