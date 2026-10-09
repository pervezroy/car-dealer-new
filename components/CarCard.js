import Link from "next/link";

export const gbp = (n) => "£" + Number(n).toLocaleString("en-GB");

export function CarImage({ car }) {
  // eslint-disable-next-line @next/next/no-img-element
  return car.image_url ? <img src={car.image_url} alt={`${car.make} ${car.model}`} /> : <span>{car.make}</span>;
}

export default function CarCard({ car }) {
  return (
    <Link href={`/cars/${car.id}`} className="card">
      <div className="img"><CarImage car={car} /></div>
      <div className="body">
        <h3>{car.make} {car.model}</h3>
        <p className="muted">{car.variant}</p>
        <p className="muted">{car.year}, {car.mileage.toLocaleString("en-GB")} miles, {car.gearbox}, {car.fuel}</p>
        <span className="price">{gbp(car.price)}</span>
      </div>
    </Link>
  );
}
