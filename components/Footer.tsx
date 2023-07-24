import Image from "next/image";
import Link from "next/link";
import { footerLinks } from "@/constants";

const Footer = () => {
  return (
    <footer className="flex flex-col mt-5 border-t border-gray-100 bg-[#d1cbc1]">
      <div className="flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10">
        <div className="flex flex-col justify-start items-start gap-6">
          <Link href="https://hxmza.uk">
            <Image src="/logo.png" alt="logo" width={118} height={18} />
          </Link>
        </div>

        <div className="footer__links">
          {footerLinks.map((link) => (
            <div key={link.title} className="footer__link">
              <h3 className="font-bold">{link.title}</h3>
              {link.links.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className="text-gray-500 hover:text-white"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap mt-10 border-t border-gray-100 sm:px-16 px-6 py-10">
        <p>
          &copy; {new Date().getFullYear()}
          <Link href="https://hxmza.uk"> Hxmza's Hub </Link>
        </p>
        <div className="footer__copyrights-link">
          <Link href="/" className="text-gray-500 hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/" className="text-gray-500 hover:text-white">
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
