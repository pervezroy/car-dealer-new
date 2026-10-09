import Link from "next/link";

export const metadata = { title: "Thank you" };

export default function Thanks() {
  return (
    <div className="wrap section">
      <h1>Thanks, we have your details</h1>
      <p>We will be in touch shortly.</p>
      <Link href="/cars" className="btn">Keep browsing</Link>
    </div>
  );
}
