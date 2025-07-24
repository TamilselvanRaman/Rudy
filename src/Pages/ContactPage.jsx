import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white py-10 px-4">
      {/* Header */}
      <BannerComponent title="Contact Us" subtitle="Home / Contact Us" />

      {/* Map */}
      <div className="max-w-4xl mx-auto">
        <iframe
          title="map"
          className="w-full h-64 rounded-lg shadow-md"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509387!2d144.95373531531585!3d-37.81627974260806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5775f1f0aabcba!2sVictoria%20St%2C%20Richmond%20VIC%203121%2C%20Australia!5e0!3m2!1sen!2sus!4v1633000000000!5m2!1sen!2sus"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {/* Contact Info */}
      <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Phone */}
        <div className="border p-6 rounded-lg shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <Phone className="w-6 h-6 text-black" />
          </div>
          <h3 className="font-semibold">Phone</h3>
          <p className="text-sm mt-2">
            <strong>Toll-free:</strong> 0803 - 080 - 3081
            <br />
            <strong>Fax:</strong> 0000 - 123 - 456789
          </p>
        </div>

        {/* Email */}
        <div className="border p-6 rounded-lg shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <Mail className="w-6 h-6 text-black" />
          </div>
          <h3 className="font-semibold">Email</h3>
          <p className="text-sm mt-2">
            mail@example.com
            <br />
            support@example.com
          </p>
        </div>

        {/* Address */}
        <div className="border p-6 rounded-lg shadow-sm text-center">
          <div className="flex justify-center mb-4">
            <MapPin className="w-6 h-6 text-black" />
          </div>
          <h3 className="font-semibold">Address</h3>
          <p className="text-sm mt-2">
            No: 5B, A East Madison Street,
            <br />
            Baltimore, MD, USA 4508
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto mt-10">
        <h3 className="text-lg font-semibold mb-4">Contact Form</h3>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="tel"
              placeholder="Phone number"
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <textarea
            rows="5"
            placeholder="Comment"
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
          <div className="text-center">
            <button
              type="submit"
              className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded shadow"
            >
              SEND
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
