// Creates tables and seeds sample cars if the table is empty. Safe to re-run.
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set (see .env.example)");
const sql = neon(process.env.DATABASE_URL);

await sql`CREATE TABLE IF NOT EXISTS cars (
  id serial PRIMARY KEY, make text NOT NULL, model text NOT NULL, variant text NOT NULL DEFAULT '',
  year int NOT NULL, mileage int NOT NULL, price int NOT NULL, fuel text NOT NULL, gearbox text NOT NULL,
  body text NOT NULL, colour text NOT NULL, description text NOT NULL DEFAULT '', image_url text,
  status text NOT NULL DEFAULT 'available', created_at timestamptz NOT NULL DEFAULT now())`;

await sql`CREATE TABLE IF NOT EXISTS enquiries (
  id serial PRIMARY KEY, type text NOT NULL, name text NOT NULL, email text NOT NULL, phone text,
  reg text, mileage int, car_id int REFERENCES cars(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now())`;

const [{ n }] = await sql`SELECT count(*)::int AS n FROM cars`;
if (n === 0) {
  const seed = [
    ["Ford", "Fiesta", "1.0 EcoBoost Zetec", 2020, 28400, 11495, "Petrol", "Manual", "Hatchback", "Blue"],
    ["Volkswagen", "Golf", "1.5 TSI Style", 2021, 19800, 17995, "Petrol", "Manual", "Hatchback", "Grey"],
    ["BMW", "3 Series", "320d M Sport", 2019, 41200, 19950, "Diesel", "Automatic", "Saloon", "Black"],
    ["Nissan", "Qashqai", "1.3 DIG-T Acenta Premium", 2021, 22100, 18495, "Petrol", "Manual", "SUV", "White"],
    ["Tesla", "Model 3", "Long Range AWD", 2021, 30500, 23995, "Electric", "Automatic", "Saloon", "White"],
    ["Kia", "Sportage", "1.6 T-GDi 3", 2022, 14300, 24450, "Petrol", "Manual", "SUV", "Red"],
    ["Vauxhall", "Corsa", "1.2 SE Edition", 2022, 12800, 12995, "Petrol", "Manual", "Hatchback", "Silver"],
    ["Mercedes-Benz", "A Class", "A200 AMG Line", 2020, 33900, 21250, "Petrol", "Automatic", "Hatchback", "Grey"],
  ];
  for (const [make, model, variant, year, mileage, price, fuel, gearbox, body, colour] of seed) {
    const description = `A ${year} ${make} ${model} in ${colour}. Sample listing: replace with your own description.`;
    await sql`INSERT INTO cars (make, model, variant, year, mileage, price, fuel, gearbox, body, colour, description)
      VALUES (${make}, ${model}, ${variant}, ${year}, ${mileage}, ${price}, ${fuel}, ${gearbox}, ${body}, ${colour}, ${description})`;
  }
  console.log(`Seeded ${seed.length} sample cars.`);
}
console.log("Database ready.");
