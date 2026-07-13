import noImg from '@app/assets/images/no-image-small.jpg';

interface AvatarProps {
  src?: string | null | undefined;
  alt?: string;
  className?: string;
  initialEnabled?: boolean;
}

function Avatar({ src, alt, className, initialEnabled = false }: AvatarProps) {
  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1 && parts[0]) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    const firstInitial = parts[0]?.charAt(0) || '';
    const secondInitial = parts[1]?.charAt(0) || '';

    return (firstInitial + secondInitial).toUpperCase();
  };

  return (
    <div
      className={`
        inline-flex items-center justify-center 
        overflow-hidden rounded-full w-8 h-8 
        ${className || ''}
      `}
    >
      {!initialEnabled || src ? (
        <img
          src={src || noImg}
          alt={alt}
          className={`w-full h-full ${src ? 'object-contain' : 'object-cover'}`}
        />
      ) : (
        <span className="text-sm font-medium">{getInitials(alt)}</span>
      )}
    </div>
  );
}

export { Avatar };
