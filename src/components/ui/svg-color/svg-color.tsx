import { forwardRef } from 'react';

export interface SvgColorProps extends React.HTMLAttributes<HTMLImageElement> {
  src: string;
  className?: string;
  size?: number;
}

const SvgColor = forwardRef<HTMLImageElement, SvgColorProps>(
  ({ src, className = '', size = 24, style, ...rest }, ref) => {
    // If user doesn't provide explicit w/h classes, we’ll fall back to inline size
    const hasExplicitSize =
      /\b(w-|h-|size-)/.test(className) || (style && (style.width || style.height));

    const mergedStyle: React.CSSProperties = {
      // Longhand mask for better cross-browser behavior
      maskImage: src,
      maskRepeat: 'no-repeat',
      maskPosition: 'center',
      maskSize: 'contain',
      WebkitMaskImage: src,
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      WebkitMaskSize: 'contain',
      ...(hasExplicitSize ? {} : { width: size, height: size }),
      ...style,
    };

    return (
      <img
        ref={ref}
        alt="icon"
        src={src}
        aria-hidden="true"
        className={`inline-block align-middle ${className}`}
        style={mergedStyle}
        {...rest}
      />
    );
  },
);

export default SvgColor;
