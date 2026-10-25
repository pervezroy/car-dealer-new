import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  const to = (path) => NextResponse.redirect(new URL(path, req.url), 303);

  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const value = (key, maxLength = 500) =>
    String(form.get(key) ?? "").trim().slice(0, maxLength);

  const name = value("name", 120);
  const email = value("email", 254).toLowerCase();
  const phone = value("phone", 40);
  const requestedType = value("type", 20);
  const type = requestedType === "sell" ? "sell" : requestedType === "reserve" ? "reserve" : null;

  if (!type || !name || !emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Please provide your name and a valid email address." },
      { status: 400 }
    );
  }

  const rawMileage = value("mileage", 20);
  const mileage = rawMileage ? Number(rawMileage) : null;
  if (type === "sell" && (!Number.isSafeInteger(mileage) || mileage < 0)) {
    return NextResponse.json(
      { error: "Please provide a valid mileage for your car." },
      { status: 400 }
    );
  }

  const rawCarId = value("car_id", 20);
  const carId = rawCarId ? Number(rawCarId) : null;
  if (type === "reserve" && (!Number.isSafeInteger(carId) || carId <= 0)) {
    return NextResponse.json(
      { error: "Please select a valid vehicle to reserve." },
      { status: 400 }
    );
  }

  try {
    if (type === "reserve") {
      const [car] = await sql`SELECT id FROM cars WHERE id = ${carId} AND status = 'available' LIMIT 1`;
      if (!car) {
        return NextResponse.json(
          { error: "Sorry, this vehicle is no longer available." },
          { status: 409 }
        );
      }
    }

    await sql`
      INSERT INTO enquiries (type, name, email, phone, reg, mileage, car_id)
      VALUES (${type}, ${name}, ${email}, ${phone || null}, ${value("reg", 20) || null},
              ${type === "sell" ? mileage : null}, ${type === "reserve" ? carId : null})`;

    return to("/thanks");
  } catch (error) {
    console.error("Failed to save enquiry:", error);
    return NextResponse.json(
      { error: "We couldn't submit your details just now. Please try again later." },
      { status: 500 }
    );
  }
}
