import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req) {
  const f = await req.formData();
  const v = (k) => String(f.get(k) || "").trim().slice(0, 500);
  const to = (path) => NextResponse.redirect(new URL(path, req.url), 303);

  if (!v("name") || !v("email").includes("@")) return to("/");

  const type = v("type") === "sell" ? "sell" : "reserve";
  await sql`
    INSERT INTO enquiries (type, name, email, phone, reg, mileage, car_id)
    VALUES (${type}, ${v("name")}, ${v("email")}, ${v("phone")}, ${v("reg")},
            ${Number(v("mileage")) || null}, ${Number(v("car_id")) || null})`;
  return to("/thanks");
}
