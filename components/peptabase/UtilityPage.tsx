import type { ReactNode } from "react";
import Link from "next/link";

type UtilityPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  links?: Array<{ href: string; label: string }>;
};

export default function UtilityPage({ eyebrow, title, description, children, links = [] }: UtilityPageProps) {
  return (
    <div className="pb-shell">
      <div className="pb-warning-banner">FOR EDUCATIONAL &amp; RESEARCH PURPOSES ONLY - NOT FOR HUMAN CONSUMPTION - NOT MEDICAL ADVICE</div>
      <main className="pb-main">
        <section className="pb-section pb-utility-shell">
          <div className="pb-section-head">
            <div>
              <div className="pb-eyebrow">{eyebrow}</div>
              <h1 className="pb-database-title">{title}</h1>
              <p className="pb-section-copy">{description}</p>
            </div>
          </div>
          {links.length > 0 ? (
            <div className="pb-inline-link-list pb-top-links">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="pb-inline-link">
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
          <div className="pb-utility-content">{children}</div>
        </section>
      </main>
    </div>
  );
}
