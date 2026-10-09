export const metadata = { title: "Sell your car" };

export default function Sell() {
  return (
    <div className="wrap section">
      <h1>Sell your car</h1>
      <p className="muted">Tell us about your car and we will email you a valuation.</p>
      <form className="stack" method="POST" action="/api/enquiry">
        <input type="hidden" name="type" value="sell" />
        <input name="reg" placeholder="Registration, e.g. AB12 CDE" required />
        <input name="mileage" type="number" placeholder="Mileage" required />
        <input name="name" placeholder="Full name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="phone" type="tel" placeholder="Phone" />
        <button className="btn">Get my valuation</button>
      </form>
    </div>
  );
}
