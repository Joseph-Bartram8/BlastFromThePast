import { Link } from "@tanstack/react-router";
import { Archive, Calendar, MapPin, MessageCircle, Search } from "lucide-react";


export default function Home() {
  return (
    <div className="bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] flex items-center justify-center text-center bg-cover bg-center"
          style={{ backgroundImage: "url('/homeScreen.png')" }}>
        <div className="absolute inset-0 opacity-30"></div>

        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-bold drop-shadow-lg font-[Krona_One]">Your gateway to the world of toy collecting</h1>
          
          {/* Search Bar */}
          <div className="mt-4 flex items-center justify-center">
            <input 
              type="text" 
              placeholder="Search for toy ranges, events, shops ..." 
              className="px-4 py-2 rounded-l-md bg-white text-black w-96"
            />
            <button className="bg-gray-700 text-white px-4 py-2 rounded-r-md hover:bg-gray-800">
              <Search size={24} />
            </button>
          </div>
        </div>
      </div>




      {/* Categories Section */}
      <div className="w-full bg-white py-10 mb-[3px]">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { name: "Toy Archive", icon: <Archive size={40} />, link: "/archive" },
            { name: "Events", icon: <Calendar size={40} />, link: "/events" },
            { name: "Locations", icon: <MapPin size={40} />, link: "/locations" },
            { name: "Forum", icon: <MessageCircle size={40} />, link: "/forum" },
          ].map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-200 transition-all"
            >
              {category.icon}
              <span className="text-lg font-medium mt-2">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sections Wrapper with Gaps */}
      <div className="space-y-[3px] bg-gray-100">

        {/* Toy Range of the Week */}
        <div className="w-full bg-white py-10 relative">
          <div className="container mx-auto">
            <div className="w-2/3 pl-8">
              <h2 className="text-2xl font-semibold">Toy range of the week</h2>
              <p className="text-gray-600 mb-4">Each week we feature a toy range voted on by our members.</p>
            </div>
            <div className="flex items-center">
            <img
                  src="/ToxicCrusadorLogo.png"
                  alt="Toxic Crusaders Logo"
                  className="w-48 h-48 rounded-md"
                />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Toxic Crusaders</h3>
                <p className="text-gray-700">
                  The Toxic Crusaders toy line was released in 1991 by Playmates Toys, the same company behind the Teenage Mutant Ninja Turtles (TMNT) action figures. 

                  The toys were based on the short-lived animated TV series Toxic Crusaders, which itself was an unusual spin-off of the ultra-violent, R-rated cult film The Toxic Avenger (1984) by Troma Entertainment.
                </p>
                <Link to="/" className="mt-2 inline-block bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                  Read More
                </Link>
              </div>
              <img
                src="/ToxicCrusador.png"
                alt="Toxic Crusaders"
                className="w-1/4 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Advertisement or Content Placeholder */}
        <div className="container mx-auto py-6 px-6">
          <div className="w-full h-32 bg-gray-300 flex items-center justify-center text-gray-600">
            Advertisement or Content Space
          </div>
        </div>

        {/* Next Toy Fair Section */}
        <div className="w-full bg-white py-10 relative flex h-100">
          <div className="container mx-auto flex flex-row-reverse items-center">
            <img
              src="/toyFair.png"
              alt="Toy Fair"
              className="w-full h-full object-cover rounded-md"
            />
            <div className="w-2/3 pl-8">
              <h2 className="text-2xl font-semibold">Next toy fair in your region</h2>
              <p className="text-sm text-gray-600 mb-4">
                Your region is currently set to <Link to="/" className="text-blue-500 underline">United Kingdom</Link>
              </p>
              <h3 className="text-lg font-semibold text-gray-800">Gateshead Toy Fair on 24th April 2025</h3>
              <p className="text-gray-700 mt-2">Gateshead International Stadium, Neilson Rd, Gateshead NE10 0EF</p>
              <p className="text-gray-600 text-sm mt-1">⏰ 10:30am - 3:00pm (Early bird from 8:30am)</p>
              <p className="text-gray-600 text-sm">🎟️ Admission £4 adults, Under 16’s free (Early bird £8)</p>
              <p className="text-gray-600 text-sm">📍 260+ tables</p>
              <p className="text-gray-600 text-sm">🅿️ Free parking on site</p>
              <Link to="/" className="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                See All Toy Fairs And Events
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Toy Shop */}
        <div className="w-full bg-white py-10 relative flex">
          <div className="container mx-auto flex items-center h-full relative">
            {/* Button Positioned Top Right */}
            <Link
              to="/"
              className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
            >
              See All Toy Shops
            </Link>

            {/* Left Side - Location Info & Shop Logo */}
            <div className="w-1/2 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold">Featured toy shop</h2>
              <p className="text-sm text-gray-600 mb-4">
                Bricks and mortar shops are the cornerstone of our community.
              </p>
              <h3 className="text-lg font-semibold">Leicester Vintage & Old Toy Shop</h3>
              <p className="text-gray-700">
                9-11 E Bond St, Leicester, LE1 4SX, UK
              </p>
              {/* Shop Logo */}
              <img
                src="/ToyShopLogo.png"
                alt="Leicester Vintage Toy Shop"
                className="h-auto mt-4 rounded-md w-3/4"
              />
            </div>

            {/* Right Side - Description (Aligned Properly) */}
            <div className="w-1/2 pl-8 flex flex-col justify-center h-full">
              <p className="text-sm text-gray-600">
                Starting as a humble market stall, Leicester Vintage and Old Toyshop has gone from strength to strength to become the shop it is today.
                Run by Joseph Hand with the help of close friends and colleagues over the years.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Leicester Vintage and Old Toyshop strives to be a friendly environment for collectors, helping people find their favorite characters.
              </p>
            </div>
          </div>
        </div>


      </div>

      {/* Footer */}
      <footer className="w-full py-6 bg-[#f5f5f5] text-center text-gray-600">
        &copy; {new Date().getFullYear()} The Toy Portal
      </footer>
    </div>
  );
}
