"use client";

import { useState } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { Link as ScrollLink } from "react-scroll";
import { navLinks, socialLinks } from "../constants/index";
import Image from "next/image";
import logo from "@/public/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className="bg-black text-white fixed top-0 left-0 right-0 p-4 z-50">
      <div className="flex container mx-auto justify-between items-center">
        {/* Logo wrapped with ScrollLink for smooth scroll to top */}
        <ScrollLink
          to="hero"
          smooth={true}
          duration={500}
          className="cursor-pointer"
        >
          <Image
            src={logo}
            alt="logo"
            priority={true}
            className="w-[150px] md:w-[200px]"
          />
        </ScrollLink>

        <button
          onClick={toggleMenu}
          className="text-white md:hidden z-10 focus:outline-none"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? (
            <RiCloseLine className="text-4xl" />
          ) : (
            <RiMenu3Line className="text-4xl" />
          )}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4">
          {navLinks.map(({ id, href, name }) => (
            <li key={id}>
              <ScrollLink
                to={href}
                smooth={true}
                duration={500}
                className="text-xl hover:text-rose-600 transition-colors cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                {name}
              </ScrollLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Full-Screen Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black flex flex-col transition-transform duration-300 ease-in-out transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col items-center justify-center flex-grow">
          <ul className="space-y-8 text-center">
            {navLinks.map(({ id, href, name }) => (
              <li key={id}>
                <ScrollLink
                  to={href}
                  smooth={true}
                  duration={500}
                  className="text-3xl hover:text-rose-600 transition-colors ease-in-out duration-300 uppercase cursor-pointer "
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                >
                  {name}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Icons pinned to the bottom of the mobile menu */}
        <div className="flex space-x-6 mb-4 justify-center">
          {socialLinks.map(({ id, href, icon }) => (
            <a key={id} href={href} target="_blank" rel="noopener noreferrer">
              {icon}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
