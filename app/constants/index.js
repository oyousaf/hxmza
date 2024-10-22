export const navLinks = [
  { id: 1, href: "hero", name: "Home" },
  { id: 2, href: "instagram", name: "Cars" },
  { id: 3, href: "reviews", name: "Reviews" },
  { id: 4, href: "contact", name: "Contact" },
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
      "Went to go have a look at a audi a1 with my husband and father in law it was in great condition,  great price , the service we were given was outstanding very polite, helpful to the point my father in law didn't come with the intention of buying a new car but we came away with 2 highly recommend couldn't do enough for us , had the cars around 7 months and no problems",
  },
  {
    name: "Tom Betts",
    feedback: `Highly recomend. I purchased a bmw 320d. it was well presented, came fully serviced and valeted. The car came with a 3 month warranty and just under 3 months i came across a fault that was taken care of with a local garage. Paid with no hassle by ace motor sales. Would definitely buy from these again. 👍🏻`,
  },
  {
    name: "VEYGO GROUPS",
    feedback:
      "Brilliant customer service by fez! Brilliant deals lovely motors get your selves down!!!",
  },
];

export const mockData = [
  {
    id: 1,
    image_url: "../porsche-taycan.jpg",
    title: "Porsche Taycan Turbo S",
    description: (
      <>
        {`
          The all-electric Taycan Turbo S with Performance Battery Plus, high driving dynamics, and a flat flyline.
        `}
        <span className="block mt-3 font-bold text-xl">Available from £161,400</span>
      </>
    ),
  },
  {
    id: 2,
    image_url: "../hyundai-ioniq-5-pe.jpg",
    title: "Hyundai IONIQ 5 PE",
    description: (
      <>
        {`
          The Hyundai IONIQ 5 is a fully-electric midsize CUV with 800V battery technology for ultra-fast charging and offers a driving range of up to 354 miles.
        `}
        <span className="block mt-3 font-bold text-xl">Available from £39,900</span>
      </>
    ),
  },
  {
    id: 3,
    image_url: "../tesla y 2025.jpg",
    title: "Tesla Model Y Juniper Update",
    description: (
      <>
        {`
          Model Y is a fully electric, mid-size SUV with unparalleled protection and versatile cargo space.
        `}
        <span className="block mt-3 font-bold text-xl">Available from £44,990</span>
      </>
    ),
  },
];
