import { Metadata } from "next"
import ContactForm from "@modules/contact/components/contact-form"

export const metadata: Metadata = {
  title: "Contact | Beds4u",
  description: "Get in touch with Beds4u about an order, a custom size, or anything else.",
}

export default function ContactPage() {
  return (
    <div className="content-container py-16 grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="font-serif text-4xl mb-4">Get in touch</h1>
        <p className="text-ui-fg-subtle max-w-md mb-8">
          Questions about a size, a finish, or an existing order — send us a message and we&apos;ll reply as soon as we can.
        </p>
        <div className="text-ui-fg-subtle text-small-regular">
          {/* TODO: replace with Beds4u's real registered address once available. */}
          <p className="txt-compact-medium-plus text-ui-fg-base mb-1">Beds4u</p>
          <p>Unit 1, Factory Road</p>
          <p>Leeds, LS1 1AA</p>
          <p>United Kingdom</p>
        </div>
      </div>
      <ContactForm />
    </div>
  )
}
