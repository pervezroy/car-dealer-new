import Link from "next/link";
import { sql } from "@/lib/db";
import { brand } from "@/lib/brand";
import CarCard, { gbp } from "@/components/CarCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const makes = await sql`SELECT DISTINCT make FROM cars WHERE status = 'available' ORDER BY make`;
  const cars = await sql`SELECT * FROM cars WHERE status = 'available' ORDER BY id DESC LIMIT 6`;
  const [{ n }] = await sql`SELECT count(*)::int AS n FROM cars WHERE status = 'available'`;

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1>{brand.tagline}</h1>
          <p>Browse inspected used cars, see your monthly price, and have it delivered. No showroom visit needed.</p>
          <form action="/cars" className="search">
            <select name="make" aria-label="Make">
              <option value="">Any make</option>
              {makes.map((m) => <option key={m.make}>{m.make}</option>)}
            </select>
            <select name="max" aria-label="Maximum price">
              <option value="">Any price</option>
              {[10000, 15000, 20000, 25000, 30000].map((p) => <option key={p} value={p}>Up to {gbp(p)}</option>)}
            </select>
            <button className="btn alt">Show {n} cars</button>
          </form>
        </div>
      </section>

      <div className="wrap usps">
        {brand.usps.map(([t, d]) => <div key={t}><b>{t}</b><span className="muted">{d}</span></div>)}
      </div>

      <section className="section soft">
        <div className="wrap">
          <h2>Latest arrivals</h2>
          <div className="grid">{cars.map((c) => <CarCard key={c.id} car={c} />)}</div>
          <p><Link href="/cars">See all cars</Link></p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>How it works</h2>
          <ol className="steps">
            <li><h3>1. Choose</h3><p className="muted">Filter by make, body type and budget.</p></li>
            <li><h3>2. Reserve</h3><p className="muted">Secure the car online with your details.</p></li>
            <li><h3>3. Get it delivered</h3><p className="muted">We bring it to you, with 7 days to decide.</p></li>
          </ol>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <h2>Got a car to sell?</h2>
          <p className="muted">Enter your registration and we will come back with a valuation.</p>
          <Link href="/sell-your-car" className="btn">Get a valuation</Link>
        </div>
      </section>
    </>
  );
}
