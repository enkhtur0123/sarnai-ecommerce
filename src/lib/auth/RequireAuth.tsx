"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useAuth } from "./AuthContext";
import { PageLoader } from "@/components/common/Loader";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) return <PageLoader />;
  if (!user) return null;

  return <>{children}</>;
}
