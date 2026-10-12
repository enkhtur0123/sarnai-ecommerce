import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="container-x flex flex-col items-center gap-4 py-24 text-center">
      <span className="text-[72px] font-extrabold leading-none tracking-[-2px] text-accent">404</span>
      <h1 className="m-0 text-[28px] font-extrabold">{t("title")}</h1>
      <p className="m-0 text-muted">{t("lead")}</p>
      <Link href="/" className="btn-primary mt-2">
        {t("home")}
      </Link>
    </div>
  );
}
