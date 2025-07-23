import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { Country, State } from "country-state-city";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

const isValidCardNumber = (num) => {
  const str = num.replace(/\D/g, "");
  let sum = 0;
  let shouldDouble = false;
  for (let i = str.length - 1; i >= 0; i--) {
    let digit = parseInt(str[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidExpiry = (exp) => {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!regex.test(exp)) return false;
  const [month, year] = exp.split("/");
  const expiry = new Date(`20${year}`, parseInt(month));
  return expiry > new Date();
};

const isValidCVV = (cvv) => /^[0-9]{3,4}$/.test(cvv);

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    cardNumber: "",
    expDate: "",
    securityCode: "",
    nameOnCard: "",
    upiId: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const countryList = Country.getAllCountries().map((c) => ({
      label: c.name,
      value: c.isoCode,
    }));
    setCountries(countryList);
  }, []);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setForm((prev) => ({ ...prev, country: country.label, state: "" }));
    const stateList = State.getStatesOfCountry(country.value).map((s) => ({
      label: s.name,
      value: s.isoCode,
    }));
    setStates(stateList);
    setSelectedState(null);
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setForm((prev) => ({ ...prev, state: state.label }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!isValidEmail(form.email)) newErrors.email = "Enter a valid email";
    if (!form.lastName) newErrors.lastName = "Enter last name";
    if (!form.address) newErrors.address = "Enter address";
    if (!form.city) newErrors.city = "Enter city";
    if (!form.postalCode) newErrors.postalCode = "Enter postal code";
    if (!form.country) newErrors.country = "Select country";
    if (!form.state) newErrors.state = "Select state";

    if (selectedMethod === "card") {
      if (!isValidCardNumber(form.cardNumber))
        newErrors.cardNumber = "Invalid card number";
      if (!isValidExpiry(form.expDate)) newErrors.expDate = "Invalid expiry";
      if (!isValidCVV(form.securityCode))
        newErrors.securityCode = "Invalid CVV";
      if (!form.nameOnCard) newErrors.nameOnCard = "Name required";
    }

    if (selectedMethod === "upi" && !form.upiId)
      newErrors.upiId = "Enter valid UPI ID";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setSubmitted(true);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const estimatedTax = (subtotal * 0.18).toFixed(2);
  const total = (subtotal + parseFloat(estimatedTax)).toFixed(2);

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-semibold text-green-600">
            ✅ Payment Successful!
          </h2>
          <p className="mt-2 text-gray-700">Thank you for your order.</p>
        </div>
      </div>
    );
  }

  const paymentOptions = [
    { value: "card", label: "Credit/Debit Card" },
    { value: "upi", label: "UPI" },
    { value: "cod", label: "Cash on Delivery" },
  ];

  return (
    <div className="bg-white min-h-screen text-black font-sans">
      <div className="text-center py-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold">Rudy.</h1>
      </div>

      <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-3 gap-6">
        {/* Left Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold">Contact</h2>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email or mobile"
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded px-4 py-2`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Delivery */}
          <div>
            <h2 className="text-lg font-semibold">Delivery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name "
                className="border border-gray-300 rounded px-4 py-2"
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name (optional)"
                className={`border ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } rounded px-4 py-2`}
              />
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className={`col-span-2 border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } rounded px-4 py-2`}
              />
              <input
                name="apartment"
                value={form.apartment}
                onChange={handleChange}
                placeholder="Apt, suite (optional)"
                className="col-span-2 border border-gray-300 rounded px-4 py-2"
              />
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className={`border ${
                  errors.city ? "border-red-500" : "border-gray-300"
                } rounded px-4 py-2`}
              />
              <Select
                options={countries}
                value={selectedCountry}
                onChange={handleCountryChange}
                placeholder="Country"
              />
              <Select
                options={states}
                value={selectedState}
                onChange={handleStateChange}
                placeholder="State"
                isDisabled={!selectedCountry}
              />
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                className={`border ${
                  errors.postalCode ? "border-red-500" : "border-gray-300"
                } rounded px-4 py-2`}
              />
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Choose Payment Method</h2>
            {paymentOptions
              .slice(0, showMore ? paymentOptions.length : 1)
              .map(({ value, label }) => (
                <div
                  key={value}
                  className={`p-4 border rounded cursor-pointer ${
                    selectedMethod === value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white"
                  }`}
                  onClick={() => setSelectedMethod(value)}
                >
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedMethod === value}
                      onChange={() => setSelectedMethod(value)}
                      className="mr-2"
                    />
                    {label}
                  </label>

                  {/* Conditional Inputs */}
                  {selectedMethod === "card" && value === "card" && (
                    <div className="space-y-3 mt-4">
                      <div className="flex gap-2 justify-end">
                        <FaCcVisa className="text-xl text-blue-600" />
                        <FaCcMastercard className="text-xl text-red-600" />
                      </div>
                      <input
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={handleChange}
                        placeholder="Card Number"
                        className="w-full border border-gray-300 rounded px-4 py-2"
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.cardNumber}
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          name="expDate"
                          value={form.expDate}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          className="border border-gray-300 rounded px-4 py-2"
                        />
                        <input
                          name="securityCode"
                          value={form.securityCode}
                          onChange={handleChange}
                          placeholder="CVV"
                          className="border border-gray-300 rounded px-4 py-2"
                        />
                      </div>
                      <input
                        name="nameOnCard"
                        value={form.nameOnCard}
                        onChange={handleChange}
                        placeholder="Name on Card"
                        className="w-full border border-gray-300 rounded px-4 py-2"
                      />
                    </div>
                  )}

                  {selectedMethod === "upi" && value === "upi" && (
                    <div className="mt-4">
                      <input
                        name="upiId"
                        value={form.upiId}
                        onChange={handleChange}
                        placeholder="UPI ID (e.g. name@upi)"
                        className="w-full border border-gray-300 rounded px-4 py-2"
                      />
                      {errors.upiId && (
                        <p className="text-red-500 text-sm">{errors.upiId}</p>
                      )}
                    </div>
                  )}

                  {selectedMethod === "cod" && value === "cod" && (
                    <p className="mt-2 text-sm text-gray-600">
                      Pay with cash on delivery.
                    </p>
                  )}
                </div>
              ))}

            {/* Toggle Button */}
            <div className="text-center">
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-blue-600 text-sm flex items-center justify-center mx-auto"
              >
                {showMore ? (
                  <>
                    <HiChevronUp className="mr-1" /> Hide other payment options
                  </>
                ) : (
                  <>
                    <HiChevronDown className="mr-1" /> Show more payment options
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white py-3 rounded text-sm font-semibold hover:bg-gray-800"
            >
              Pay Now
            </button>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="bg-gray-50 p-9 rounded border border-gray-200 space-y-4">
          {cartItems.map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded border"
              />
              <div className="flex-1 text-sm">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.weight}g / {item.flavour}
                </p>
              </div>
              <div className="text-sm font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          <hr />
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Estimated Tax</span>
            <span>${estimatedTax}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
