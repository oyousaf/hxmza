import { socialLinks } from "../constants/index";

const Footer = () => {
  return (
    <footer className="py-8" id="contact">
      <h2 className="text-4xl font-bold text-center mb-8">Get in Touch</h2>
      <div className="flex flex-col md:flex-row md:items-center justify-center px-4 lg:px-8">
        {/* Iframe Container */}
        <div className="flex-grow flex items-center justify-center ">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d631.5462629097879!2d-1.6783367301941519!3d53.70835050988343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bdf983824d755%3A0x1ccbf3963f34d05a!2sAce%20Motor%20Sales!5e0!3m2!1sen!2suk!4v1729510614154!5m2!1sen!2suk"
            width="600"
            height="450"
            style={{ border: 0, borderRadius: 5 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Copyright and Social Icons */}
        <div className="flex flex-col items-center md:ml-6 mt-10 md:mt-0">
          <h4 className="text-xl font-semibold text-center">
            © {new Date().getFullYear()} Ace Motor Sales
          </h4>
          <p className="mt-2 text-lg">4 Westgate, Heckmondwike, WF16 0EH</p>
          <div className="flex space-x-6 mt-[50px]">
            {socialLinks.map(({ id, href, icon }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rose-600"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
