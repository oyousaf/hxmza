export const navLinks = [
  { id: 1, href: "hero", name: "Home" },
  { id: 2, href: "about", name: "About" },
  { id: 3, href: "instagram", name: "Cars" },
  { id: 4, href: "reviews", name: "Reviews" },
  { id: 5, href: "contact", name: "Contact" },
];

import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { BsFillTelephoneFill, BsTwitterX } from "react-icons/bs";

export const socialLinks = [
  {
    id: 1,
    href: "https://www.facebook.com/acemotorsales1",
    icon: (
      <FaFacebook className="text-3xl hover:text-rose-600 transition-all ease-in-out duration-300" />
    ),
  },
  {
    id: 2,
    href: "https://www.instagram.com/acemotorsltd",
    icon: (
      <FaInstagram className="text-3xl hover:text-rose-600 transition-all ease-in-out duration-300" />
    ),
  },
  {
    id: 3,
    href: "https://x.com",
    icon: (
      <BsTwitterX className="text-3xl hover:text-rose-600 transition-all ease-in-out duration-300" />
    ),
  },
  {
    id: 4,
    href: "https://youtube.com",
    icon: (
      <FaYoutube className="text-3xl hover:text-rose-600 transition-all ease-in-out duration-300" />
    ),
  },
  {
    id: 5,
    href: "tel:07809107655",
    icon: (
      <BsFillTelephoneFill className="text-3xl hover:text-rose-600 transition-all ease-in-out duration-300" />
    ),
  },
];

export const reviews = [
  {
    name: "Donna Rose",
    feedback:
      "Went to go have a look at an Audi A1 with my husband and father-in-law. Car was in great condition, great price, and the service we were given was outstanding. Very polite & helpful - to the point my father-in-law didn't come with the intention of buying a new car but we came away with 2! Highly recommend - couldn't do enough for us! Had the cars around 7 months and so far so good; no problems whatsoever!",
  },
  {
    name: "Tom Betts",
    feedback: `Highly recommend. I purchased a BMW 320d. It was well presented, came fully serviced and valeted. The car also came with a 3 month warranty and just under 3 months I came across a fault that was taken care of with a local garage. Paid with no hassle by Ace Motor Sales. Would definitely buy from them again. 👍🏻`,
  },
  {
    name: "VEYGO GROUPS",
    feedback:
      "Brilliant customer service by Fez! Brilliant deals; lovely motors get your selves down!!!",
  },
  {
    name: "Eddie Kahoro",
    feedback:
      "Very professional, helpful and genuine. Made sure that all our questions were answered before we chose to buy. Very reliable and polite.",
  },
  {
    name: "Julie Longworth",
    feedback:
      "An absolute gem of used car dealer. Purchased my fabulous Nissan Juke 3 weeks ago and the service received from Ace Motors has been excellent. Had a little issue with the air-con not working but was quickly sorted. Many thanks for making this buying experience stress free and a pleasure, can recommend with confidence.",
  },
  {
    name: "Adil",
    feedback: `Recently bought an Audi a3 from Ace motor sales. Great vehicle at a great price and was a very easy process buying the car.
Staff were very accommodating and friendly and went out of their way to help me with anything i needed.
Highly recommend buying a car from here and i will definitely be purchasing another in the future`,
  },
  {
    name: "khaalid mulla",
    feedback: `Great vehicle and exactly as described at a very reasonable price. Fantastic service and vehicle was ready to go. A very smooth process with the paperwork and an overall great purchasing experience with helpful staff.

Definitely will be returning to purchase another vehicle in the future. Best of luck to the owner`,
  },
  {
    name: "Donna Scott",
    feedback: `Brilliant service! Car was delivered to my door the day after I enquired and I was given a good deal on my part-ex.
Thank you so much for everything! Highly recommended 5*`,
  },
  {
    name: "Denisa",
    feedback:
      "Good car and good price. Nice staff too, helpful with everything. Even came out on a Sunday for us to buy the car",
  },
];

export const mockData = [
  {
    id: 1,
    image_url: "/porsche-taycan.jpg",
    title: "Porsche Taycan Turbo S",
    description: (
      <>
        {`
          The all-electric Taycan Turbo S with Performance Battery Plus, high driving dynamics, and a flat flyline.
        `}
        <span className="block mt-3 font-bold text-xl">
          Available from £161,400
        </span>
      </>
    ),
  },
  {
    id: 2,
    image_url: "/hyundai-ioniq-5-pe.jpg",
    title: "Hyundai IONIQ 5 PE",
    description: (
      <>
        {`
          The Hyundai IONIQ 5 is a fully-electric midsize CUV with 800V battery technology for ultra-fast charging and offers a driving range of up to 354 miles.
        `}
        <span className="block mt-3 font-bold text-xl">
          Available from £39,900
        </span>
      </>
    ),
  },
  {
    id: 3,
    image_url: "/tesla y 2025.jpg",
    title: "Tesla Model Y Juniper Update",
    description: (
      <>
        {`
          Model Y is a fully electric, mid-size SUV with unparalleled protection and versatile cargo space.
        `}
        <span className="block mt-3 font-bold text-xl">
          Available from £44,990
        </span>
      </>
    ),
  },
];
