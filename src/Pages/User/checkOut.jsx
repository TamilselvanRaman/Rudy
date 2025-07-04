import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";

const Checkout = () => {
  const { cartItems } = useContext(CartContext);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "",
    cardNumber: "",
    expDate: "",
    securityCode: "",
    nameOnCard: "",
  });

  const [errors, setErrors] = useState({});

  const subtotal = cartItems
    .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    .toFixed(2);

  const estimatedTax = (subtotal * 0.18).toFixed(2);
  const total = (parseFloat(subtotal) + parseFloat(estimatedTax)).toFixed(2);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Enter an email or phone number";
    if (!form.lastName) newErrors.lastName = "Enter a last name";
    if (!form.address) newErrors.address = "Enter an address";
    if (!form.city) newErrors.city = "Enter a city";
    if (!form.postalCode) newErrors.postalCode = "Enter a ZIP / postal code";
    if (!form.cardNumber) newErrors.cardNumber = "Enter a card number";
    if (!form.expDate) newErrors.expDate = "Enter a valid expiration date";
    if (!form.securityCode)
      newErrors.securityCode = "Enter the CVV or security code";
    if (!form.nameOnCard)
      newErrors.nameOnCard = "Enter your name as on the card";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      alert("Payment Submitted!");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-4 sm:px-6 lg:px-8 py-12">
        {/* LEFT FORM */}
        <div className="md:col-span-2 space-y-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Savon.
          </h2>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Contact</h3>
            <input
              name="email"
              type="text"
              placeholder="Email or mobile phone number"
              value={form.email}
              onChange={handleChange}
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } bg-white rounded px-4 py-2`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
            <label className="inline-flex items-center space-x-2 text-sm">
              <input type="checkbox" />
              <span>Email me with news and offers</span>
            </label>
          </div>

          {/* Delivery */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Delivery</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                type="text"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                className="col-span-1 border border-gray-300 bg-white rounded px-4 py-2"
              />
              <input
                name="lastName"
                type="text"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                className={`col-span-1 border ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } bg-white rounded px-4 py-2`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 col-span-2">
                  {errors.lastName}
                </p>
              )}
              <input
                name="address"
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className={`col-span-2 border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } bg-white rounded px-4 py-2`}
              />
              {errors.address && (
                <p className="text-sm text-red-500 col-span-2">
                  {errors.address}
                </p>
              )}
              <input
                name="apartment"
                type="text"
                placeholder="Apartment, suite, etc."
                value={form.apartment}
                onChange={handleChange}
                className="col-span-2 border border-gray-300 bg-white rounded px-4 py-2"
              />
              <input
                name="city"
                type="text"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className={`col-span-1 border ${
                  errors.city ? "border-red-500" : "border-gray-300"
                } bg-white rounded px-4 py-2`}
              />
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className="col-span-1 border border-gray-300 bg-white rounded px-4 py-2"
              >
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Kerala">Kerala</option>
                <option value="Karnataka">Karnataka</option>
              </select>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="col-span-1 border border-gray-300 bg-white rounded px-4 py-2"
              >
                <option value="India">India</option>
                <option value="USA">USA</option>
              </select>
              <input
                name="postalCode"
                type="text"
                placeholder="PIN code"
                value={form.postalCode}
                onChange={handleChange}
                className={`col-span-1 border ${
                  errors.postalCode ? "border-red-500" : "border-gray-300"
                } bg-white rounded px-4 py-2`}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500 col-span-2">
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>

          {/* Shipping method */}
          <div className="bg-gray-100 text-gray-500 p-4 rounded text-sm">
            Enter your shipping address to view available shipping methods.
          </div>

          {/* Payment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment</h3>
            <p className="text-sm text-gray-500">
              All transactions are secure and encrypted.
            </p>
            <div className="bg-amber-100 text-amber-800 px-3 py-2 rounded text-sm font-medium inline-block">
              Credit card
            </div>
            <input
              name="cardNumber"
              type="text"
              placeholder="Card number"
              value={form.cardNumber}
              onChange={handleChange}
              className={`w-full border ${
                errors.cardNumber ? "border-red-500" : "border-gray-300"
              } bg-white rounded px-4 py-2`}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="expDate"
                type="text"
                placeholder="Expiration date (MM / YY)"
                value={form.expDate}
                onChange={handleChange}
                className={`border ${
                  errors.expDate ? "border-red-500" : "border-gray-300"
                } bg-white rounded px-4 py-2`}
              />
              <input
                name="securityCode"
                type="text"
                placeholder="Security code"
                value={form.securityCode}
                onChange={handleChange}
                className={`border ${
                  errors.securityCode ? "border-red-500" : "border-gray-300"
                } bg-white rounded px-4 py-2`}
              />
            </div>
            <input
              name="nameOnCard"
              type="text"
              placeholder="Name on card"
              value={form.nameOnCard}
              onChange={handleChange}
              className={`w-full border ${
                errors.nameOnCard ? "border-red-500" : "border-gray-300"
              } bg-white rounded px-4 py-2`}
            />
            <label className="flex items-center text-sm gap-2 mt-2">
              <input type="checkbox" />
              Use shipping address as billing address
            </label>
            <button
              onClick={handleSubmit}
              className="w-full bg-rose-400 hover:bg-rose-500 text-white font-medium py-2 rounded mt-4"
            >
              Pay now
            </button>
          </div>
        </div>

        {/* RIGHT CART SUMMARY */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 space-y-4 h-fit">
          {cartItems.map((item, i) => (
            <div key={i} className="flex justify-between gap-4">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div className="text-sm">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500">
                    {item.weight}g / {item.flavour}
                  </p>
                </div>
              </div>
              <div className="text-sm font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          <hr />
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Estimated taxes</span>
            <span>${estimatedTax}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total} USD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
