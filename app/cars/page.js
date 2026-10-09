import Link from "next/link";
import { sql } from "@/lib/db";
import CarCard, { gbp } from "@/components/CarCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Used cars for sale" };

export default async function Cars({ searchParams }) {
  const make = searchParams.make || null;
  const body = searchParams.body || null;
  const max = Number(searchParams.max) || 1000000;
  const sort = searchParams.sort || "new";

  const makes = await sql`SELECT DISTINCT make FROM cars WHERE status = 'available' ORDER BY make`;
  const bodies = await sql`SELECT DISTINCT body FROM cars WHERE status = 'available' ORDER BY body`;
  const cars = await sql`
    SELECT * FROM cars
    WHERE status = 'available'
      AND (${make}::text IS NULL OR make = ${make})
      AND (${body}::text IS NULL OR body = ${body})
      AND price <= ${max}`;
  cars.sort(sort === "low" ? (a, b) => a.price - b.price : sort === "high" ? (a, b) => b.price - a.price : (a, b) => b.id - a.id);

  return (
    <div className="wrap section layout">
      <form className="filters">
        <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Filter</h2>
        <select name="make" defaultValue={make || ""} aria-label="Make">
          <option value="">Any make</option>
          {makes.map((m) => <option key={m.make}>{m.make}</option>)}
        </select>
        <select name="body" defaultValue={body || ""} aria-label="Body type">
          <option value="">Any body type</option>
          {bodies.map((b) => <option key={b.body}>{b.body}</option>)}
        </select>
        <select name="max" defaultValue={searchParams.max || ""} aria-label="Maximum price">
          <option value="">Any price</option>
          {[10000, 15000, 20000, 25000, 30000].map((p) => <option key={p} value={p}>Up to {gbp(p)}</option>)}
        </select>
        <select name="sort" defaultValue={sort} aria-label="Sort by">
          <option value="new">Newest first</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
        <button className="btn">Apply filters</button>
      </form>
      <div>
        <h1 style={{ marginTop: 0 }}>{cars.length} used cars</h1>
        {cars.length ? (
          <div className="grid">{cars.map((c) => <CarCard key={c.id} car={c} />)}</div>
        ) : (
          <p>No cars match those filters. <Link href="/cars">Clear filters</Link></p>
        )}
      </div>
    </div>
  );
}
