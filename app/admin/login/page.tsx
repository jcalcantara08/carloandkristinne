import type { Metadata } from "next";
import { LoginForm } from "@/app/admin/login/login-form";
import { Monogram } from "@/components/Monogram";
import { isAuthConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const configured = isAuthConfigured();

  // Only ever redirect to a path on this site.
  const next = params.next?.startsWith("/admin") ? params.next : "/admin";

  return (
    <section className="relative flex min-h-[80vh] items-center bg-brand-paper-200">
      <div className="container py-20">
        <div className="mx-auto max-w-md text-center">
          <Monogram size="md" className="mx-auto" />
          <p className="eyebrow mt-6">Wedding command centre</p>
          <h1 className="mt-4 text-display-lg">Sign in</h1>
          <div aria-hidden="true" className="rule mx-auto mt-6" />
        </div>

        <div className="card mx-auto mt-10 max-w-md p-6 sm:p-8">
          {configured ? (
            <LoginForm next={next} />
          ) : (
            <div className="text-sm leading-relaxed text-brand-ink/75">
              <p className="font-medium text-brand-ink">The admin area is not configured yet.</p>
              <p className="mt-3">
                Set <code className="text-brand-plum-500">ADMIN_PASSWORD</code> and{" "}
                <code className="text-brand-plum-500">ADMIN_SESSION_SECRET</code> in the
                environment, then redeploy. There is deliberately no default password.
              </p>
              <p className="mt-3 text-brand-ink/60">
                Generate a secret with <code>openssl rand -base64 32</code>.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
