import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  icon?: React.ReactNode;
  lead?: string;
  link?: { href: string; label: string };
  right?: React.ReactNode;
  className?: string;
};

/** Section title row from the design: 28/800 navy title, optional icon, "View all →" link. */
export function SectionHeader({ title, icon, lead, link, right, className }: Props) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="m-0 text-[22px] font-extrabold tracking-[-0.5px] text-navy sm:text-[28px]">
            {title}
          </h2>
        </div>
        {lead && <p className="m-0 text-[15px] text-muted">{lead}</p>}
      </div>
      {right}
      {link && (
        <Link
          href={link.href}
          className="group flex items-center gap-1.5 text-sm font-bold text-navy hover:text-accent"
        >
          {link.label}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
