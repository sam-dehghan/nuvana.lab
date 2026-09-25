import Link from "next/link";
import { cta } from "@/content/site";

export function CtaBand() {
  return (
    <div className="container" style={{ display: "flex", justifyContent: "center", paddingBlock: "3rem" }}>
      <Link href={cta.href} className="button button-red">
        {cta.label}
      </Link>
    </div>
  );
}
