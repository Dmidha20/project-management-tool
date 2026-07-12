import { SideIllustration } from "@app/components/ui/side-illustration";
import { Icon } from "@iconify/react";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <main className="h-dvh w-full overflow-hidden">
      <div className="relative flex h-full w-full overflow-hidden bg-white">
        <div className="hidden lg:flex lg:w-[54%]">
          <SideIllustration />
        </div>

        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-white px-6 py-10 sm:px-10 lg:w-[46%] lg:px-16 lg:py-8">
          <button
            type="button"
            aria-label="Toggle theme"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 shadow-sm transition hover:bg-slate-200 sm:right-5 sm:top-5"
          >
            <Icon icon="mdi:white-balance-sunny" width={17} />
          </button>

          <div className="w-full max-w-[338px]">{children}</div>
        </div>
      </div>
    </main>
  );
};

export { AuthLayout };
