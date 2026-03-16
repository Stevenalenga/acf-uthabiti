"use client";

import {
  Plane,
  MapPin,
  Hotel,
  CreditCard,
  Globe,
  Sun,
  Shield,
  Compass,
  Train
} from "lucide-react";

export default function VenuePage() {

  const hotels = [
    "Serena Beach Resort & Spa",
    "Sarova Whitesands Beach Resort & Spa",
    "Voyager Beach Resort"
  ];

  const attractions = [
    "Fort Jesus",
    "Old Town Mombasa",
    "Haller Park"
  ];

  return (
    <main className="bg-white">

      {/* HERO */}
      <section
        className="relative h-[420px] flex items-center justify-center text-white text-center"
        style={{
          backgroundImage: "url('/images/venues.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative max-w-4xl px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Venue
          </h1>

          <p className="text-lg text-gray-200">
            PrideInn Paradise Beach Resort & Spa  
            <br />
            Mombasa, Kenya
          </p>
        </div>
      </section>


      {/* VENUE OVERVIEW */}
      <section className="py-24">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            PrideInn Paradise Beach Resort & Spa
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed">
            The Africa Childcare Forum 2026 will take place at the
            <strong> PrideInn Paradise Beach Resort & Spa</strong>,
            located along the scenic Shanzu Beach on Kenya’s North Coast.
          </p>

          <p className="text-gray-600 mt-6 leading-relaxed">
            The resort offers modern conference facilities, comfortable
            accommodation, and beautiful ocean views, providing an ideal
            setting for dialogue, learning, and networking among
            participants from across Africa and around the world.
          </p>

          <p className="text-gray-600 mt-6 leading-relaxed">
            With spacious meeting rooms, breakout areas, and beachfront
            surroundings, the venue provides a welcoming environment for
            policy discussions, workshops, and collaborative exchanges
            focused on advancing childcare systems and Early Childhood
            Development across Africa.
          </p>

        </div>

      </section>


      {/* TRAVEL INFORMATION */}
      <section className="py-24 bg-[#FFF4F0]">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Travel Information
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">

            <div>
              <Plane className="text-[#E5553C] mb-4" size={30}/>
              <h3 className="font-semibold text-xl mb-3">
                Airport
              </h3>

              <p className="text-gray-600">
                The nearest international gateway is
                <strong> Moi International Airport</strong>,
                located approximately 30–40 minutes by car
                from the conference venue.
              </p>

              <p className="text-gray-600 mt-4">
                Participants arriving via
                <strong> Jomo Kenyatta International Airport</strong>
                in Nairobi can connect to Mombasa through:
              </p>

              <ul className="mt-4 text-gray-600 space-y-2">
                <li>• Domestic flights to Mombasa</li>
                <li>• Madaraka Express train from Nairobi</li>
                <li>• Road transportation between Nairobi and Mombasa</li>
              </ul>

            </div>


            <div>
              <Train className="text-[#E5553C] mb-4" size={30}/>
              <h3 className="font-semibold text-xl mb-3">
                Transportation to the Venue
              </h3>

              <ul className="text-gray-600 space-y-3">
                <li>• Airport taxis available at the terminal</li>
                <li>• Ride-hailing services such as Uber and Bolt</li>
                <li>• Pre-arranged hotel airport transfers</li>
                <li>• Local taxi services</li>
              </ul>

              <p className="text-gray-600 mt-4">
                The organizing team will share recommended
                transport options and guidance closer to the event.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ACCOMMODATION */}
      <section className="py-24">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">
            <Hotel className="text-[#E5553C] mx-auto mb-3" size={32}/>
            <h2 className="text-3xl font-bold">
              Accommodation
            </h2>
          </div>

          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
            Participants are encouraged to stay at the
            PrideInn Paradise Beach Resort & Spa, the official
            venue for the forum. A limited number of rooms will
            be reserved at special conference rates.
          </p>

          <div className="grid md:grid-cols-3 gap-6">

            {hotels.map((hotel,i)=>(
              <div
                key={i}
                className="border rounded-xl p-6 text-center hover:shadow-md transition"
              >
                {hotel}
              </div>
            ))}

          </div>

        </div>

      </section>


      {/* VISA */}
      <section className="py-24 bg-[#FFF4F0]">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <Globe className="text-[#E5553C] mx-auto mb-4" size={32}/>

          <h2 className="text-3xl font-bold mb-6">
            Visa Information
          </h2>

          <p className="text-gray-600 leading-relaxed">
            International participants traveling to Kenya must
            obtain an <strong>Electronic Travel Authorization (eTA)</strong>
            prior to arrival.
          </p>

          <p className="text-gray-600 mt-4">
            Participants are advised to apply at least
            <strong> 2–3 weeks before travel</strong>.
          </p>

          <a
            href="https://www.etakenya.go.ke"
            target="_blank"
            className="inline-block mt-6 bg-[#E5553C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cc4a35]"
          >
            Kenya eTA Portal
          </a>

        </div>

      </section>


      {/* WEATHER */}
      <section className="py-24">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <Sun className="text-[#E5553C] mx-auto mb-4" size={32}/>

          <h2 className="text-3xl font-bold mb-6">
            Weather in Mombasa
          </h2>

          <p className="text-gray-600">
            Mombasa experiences warm tropical coastal weather.
            In September temperatures typically range between
            <strong> 24°C – 30°C (75°F – 86°F)</strong>.
          </p>

          <ul className="mt-6 text-gray-600 space-y-2">
            <li>• Light breathable clothing</li>
            <li>• Comfortable walking shoes</li>
            <li>• Sunscreen and sunglasses</li>
            <li>• Light evening wear for networking events</li>
          </ul>

        </div>

      </section>


      {/* CURRENCY */}
      <section className="py-24 bg-[#FFF4F0]">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <CreditCard className="text-[#E5553C] mx-auto mb-4" size={32}/>

          <h2 className="text-3xl font-bold mb-6">
            Currency & Payments
          </h2>

          <p className="text-gray-600">
            The official currency in Kenya is the
            <strong> Kenyan Shilling (KES)</strong>.
          </p>

          <ul className="mt-6 text-gray-600 space-y-2">
            <li>• Major hotels and restaurants accept credit cards</li>
            <li>• ATMs are widely available</li>
            <li>• Mobile payment (M-Pesa) is widely used</li>
          </ul>

        </div>

      </section>


      {/* SAFETY */}
      <section className="py-24">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <Shield className="text-[#E5553C] mx-auto mb-4" size={32}/>

          <h2 className="text-3xl font-bold mb-6">
            Safety & Local Tips
          </h2>

          <ul className="text-gray-600 space-y-3">
            <li>• Use registered taxis or ride-hailing services</li>
            <li>• Keep valuables secure</li>
            <li>• Follow guidance from forum organizers</li>
            <li>• Drink bottled or filtered water</li>
          </ul>

        </div>

      </section>


      {/* EXPLORE MOMBASA */}
      <section className="py-24 bg-[#FFF4F0]">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <Compass className="text-[#E5553C] mx-auto mb-4" size={32}/>

          <h2 className="text-3xl font-bold mb-12">
            Explore Mombasa
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {attractions.map((place,i)=>(
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
              >
                {place}
              </div>
            ))}

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="py-20 bg-[#E5553C] text-white text-center">

        <h2 className="text-3xl font-bold mb-4">
          Join Us in Mombasa
        </h2>

        <p className="mb-6">
          Register now to participate in the Africa Childcare Forum 2026.
        </p>

        <a
          href="/event-register"
          className="bg-white text-[#E5553C] px-7 py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          Register for the Forum
        </a>

      </section>

    </main>
  );
}