import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { brand } from "@/lib/brand";
import { gbp, CarImage } from "@/components/CarCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const [c] = await sql`SELECT make, model, variant FROM cars WHERE id = ${Number(params.id) || 0}`;
  return { title: c ? `${c.make} ${c.model} ${c.variant}` : "Car not found" };
}

export default async function Car({ params }) {
  const [c] = await sql`SELECT * FROM cars WHERE id = ${Number(params.id) || 0}`;
  if (!c) notFound();

  // Representative example: 10% deposit, 60 months.
  const r = brand.apr / 1200, months = 60, loan = c.price * 0.9;
  const monthly = Math.round((loan * r) / (1 - Math.pow(1 + r, -months)));
  const specs = [
    ["Year", c.year], ["Mileage", `${c.mileage.toLocaleString("en-GB")} miles`], ["Fuel", c.fuel],
    ["Gearbox", c.gearbox], ["Body", c.body], ["Colour", c.colour],
  ];

  return (
    <div className="wrap section">
      <p><Link href="/cars">Back to all cars</Link></p>
      <div className="detail">
        <div>
          <div className="img" style={{ aspectRatio: "16/10" }}><CarImage car={c} /></div>
          <h2>About this car</h2>
          <p>{c.description}</p>
          <table className="specs"><tbody>
            {specs.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}
          </tbody></table>
        </div>
        <aside className="panel">
          <h1 style={{ margin: 0 }}>{c.make} {c.model}</h1>
          <p className="muted">{c.variant}</p>
          <div><span className="price">{gbp(c.price)}</span></div>
          <p>From <b>{gbp(monthly)}/month</b> over {months} months</p>
          <p className="muted">Representative example: {brand.apr}% APR, 10% deposit. Subject to status.</p>
          <form className="stack" method="POST" action="/api/enquiry">
            <input type="hidden" name="type" value="reserve" />
            <input type="hidden" name="car_id" value={c.id} />
            <input name="name" placeholder="Full name" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="phone" type="tel" placeholder="Phone" />
            <button className="btn alt">Reserve this car</button>
          </form>
        </aside>
      </div>
    </div>
  );
}
