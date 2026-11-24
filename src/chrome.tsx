import type { ReactNode } from "react";
import { Link } from "./router.tsx";

type Crumb = { label: string; href?: string };

function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="breadcrumb container"
    >
      <ol>
        {items.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function PageHero({
  image,
  eyebrow,
  title,
  subtitle,
  align = "start",
  tone = "dark",
}: {
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  align?: "start" | "end";
  tone?: "dark" | "light";
}) {
  return (
    <section
      className={`page-hero align-${align} tone-on-${tone}`}
      aria-labelledby="page-title"
    >
      <img
        className="cover"
        src={image}
        alt=""
      />
      <div className="container page-hero-copy">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 id="page-title">{title}</h1>
        {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
      </div>
    </section>
  );
}

export { Breadcrumb, PageHero };
