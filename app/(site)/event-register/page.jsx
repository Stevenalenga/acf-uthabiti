"use client";

export default function RegisterPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Register for ACFMombasa2026
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Join Africa’s leading childcare forum. Complete the registration form below
            to secure your spot and be part of meaningful discussions, networking, and
            collaboration for quality, inclusive childcare.
          </p>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-16 bg-[#FFF4F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Registration Form
            </h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#E5553C] focus:outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@example.com"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#E5553C] focus:outline-none"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                  Phone/WhatsApp
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+254 700 000 000"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#E5553C] focus:outline-none"
                  required
                />
              </div>

              {/* Organization */}
              <div>
                <label htmlFor="organization" className="block text-gray-700 font-medium mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  placeholder="Organization Name"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#E5553C] focus:outline-none"
                />
              </div>

              {/* Optional: Country */}
              <div>
                <label htmlFor="country" className="block text-gray-700 font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="Kenya"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#E5553C] focus:outline-none"
                />
              </div>

              {/* Optional: Job Title */}
              <div>
                <label htmlFor="jobTitle" className="block text-gray-700 font-medium mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="Childcare Specialist"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#E5553C] focus:outline-none"
                />
              </div>

              {/* Submit Button - full width */}
              <div className="md:col-span-2 text-center mt-4">
                <button
                  type="submit"
                  className="bg-[#E5553C] text-white font-semibold py-3 px-8 rounded-lg shadow hover:bg-[#cc4a35] transition"
                >
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact & Convener Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          {/* Contact Info */}
          <div className="lg:w-1/2 text-gray-800">
            <h2 className="text-2xl font-bold mb-4">Need Assistance?</h2>
            <p className="mb-4">
              Reach out to our team for support or inquiries regarding registration.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-[#E5553C] text-xl"></span>
                <span>+254 714-262-626</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E5553C] text-xl"></span>
                <span>cac@uthabitiafrica.org</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E5553C] text-xl"></span>
                <span>
                  Africa Childcare Forum c/o Collaborative Action for Childcare Office #1,
                  Overbay Apartments, OV1 Junction of Rhapta & Church Road, Westlands, Nairobi
                </span>
              </li>
            </ul>
          </div>

          {/* Convener Logo */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <a
              href="https://cac.uthabitiafrica.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition transform hover:scale-105"
            >
              <img
                src="/images/cac-logos.png"
                alt="Collaborative Action for Childcare"
                className="h-32 w-auto object-contain"
              />
              <p className="mt-2 text-center text-gray-700 font-medium">
                Learn more about our convening partner
              </p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}