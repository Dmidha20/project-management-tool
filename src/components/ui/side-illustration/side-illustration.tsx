import { Icon } from "@iconify/react";
import bgImage from "@app/assets/images/bg_img.png";
import pmtLogo from "@app/assets/pmt_logo1.png";

const FEATURES = [
  { icon: "mdi:folder", title: "Projects", description: "Organize and manage multiple projects." },
  { icon: "mdi:check-bold", title: "Tasks", description: "Assign tasks and track progress." },
  { icon: "mdi:chart-bar", title: "Reports", description: "Monitor performance with insightful reports." },
];

const SideIllustration = () => {
  return (
    <aside className="relative h-full w-full overflow-hidden bg-[#0b1035] px-8 py-8 text-white xl:px-16 xl:py-12">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="-ml-6 w-32">
          <img
            src={pmtLogo}
            alt="PMT"
            className="w-full brightness-0 invert"
          />
        </div>

        <section className="mt-2 max-w-[300px] xl:mt-3">
          <h2 className="text-4xl font-bold leading-[1.14] tracking-tight xl:text-[46px]">
            Plan.<br />
            Track.<br />
            <span className="text-violet-400">Deliver.</span>
          </h2>
          <p className="mt-5 max-w-[280px] text-sm leading-6 text-indigo-100/85">
            Manage projects, assign tasks, and monitor progress from one centralized platform.
          </p>
        </section>

        <section className="mt-auto grid grid-cols-3 overflow-hidden py-4 backdrop-blur-sm">
          {FEATURES.map(({ icon, title, description }) => (
            <div key={title} className="min-w-0 px-3 first:pl-1 last:pr-1 xl:px-4 xl:first:pl-2 xl:last:pr-2 not-first:border-l not-first:border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/90 shadow-lg shadow-indigo-950/30">
                <Icon icon={icon} width={19} />
              </div>
              <h4 className="mt-2.5 text-sm font-semibold">{title}</h4>
              <p className="mt-1 text-xs leading-5 text-indigo-100/75">{description}</p>
            </div>
          ))}
        </section>
      </div>
    </aside>
  );
};

export { SideIllustration };
