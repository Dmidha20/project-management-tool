import React from 'react';

interface LoaderProps {
  loading: boolean;
  size?: number;
  children: React.ReactNode;
}

const Loader: React.FC<LoaderProps> = ({ size = 60, loading, children }) => {
  if (!loading) {
    return children;
  }

  return (
    <div className="flex justify-center items-center h-full w-full mt-auto mb-auto">
      <div
        className="border-4 border-[var(--color-neutral-300)] border-t-[var(--color-info-500)] rounded-full animate-spin"
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
};

export { Loader };
