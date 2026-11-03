import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function PageHeading({
  eyebrow,
  title,
  accent,
  description,
  action,
}) {
  return (
    <section
      className={`dashboard-heading ${
        action ? "dashboard-heading-row" : ""
      }`}
    >
      <div>
        <span className="home-eyebrow">{eyebrow}</span>

        <h1>
          {title} <span>{accent}</span>
        </h1>

        <p>{description}</p>
      </div>

      {action && (
        <Link href={action.href} className="dashboard-primary-button">
          {action.label}
          <ArrowUpRight size={17} />
        </Link>
      )}
    </section>
  );
}