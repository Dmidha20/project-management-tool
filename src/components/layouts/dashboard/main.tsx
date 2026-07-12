interface MainProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Main({ children, className = '', ...other }: MainProps) {
  return (
    <main className={`flex flex-col flex-grow overflow-y-auto ${className}`} {...other}>
      {children}
    </main>
  );
}
