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

/** Sarnai section title row: bold title left, small red "View All" right. */
export function SectionHeader({ title, icon, lead, link, right, className }: Props) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="m-0 text-lg font-bold text-navy sm:text-xl">{title}</h2>
        </div>
        {lead && <p className="m-0 text-sm text-muted">{lead}</p>}
      </div>
      {right}
      {link && (
        <Link href={link.href} className="text-[13px] font-medium text-accent hover:text-accent-deep">
          {link.label}
        </Link>
      )}
    </div>
  );
}
