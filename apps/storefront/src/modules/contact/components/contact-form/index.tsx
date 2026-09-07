"use client"

import { useActionState } from "react"
import { sendContactMessage, ContactFormState } from "@lib/data/contact"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"

const initialState: ContactFormState = { state: "idle" }

export default function ContactForm() {
  const [formState, formAction] = useActionState(sendContactMessage, initialState)

  if (formState.state === "success") {
    return (
      <div className="w-full max-w-lg rounded-md border border-ui-border-base bg-ui-bg-subtle p-6 text-ui-fg-base">
        Thank you — your message has been sent. We&apos;ll get back to you shortly.
      </div>
    )
  }

  return (
    <form action={formAction} className="w-full max-w-lg flex flex-col gap-y-4">
      <Input label="Name" name="name" required data-testid="contact-name-input" />
      <Input label="Email" name="email" type="email" required data-testid="contact-email-input" />
      <div className="flex flex-col w-full">
        <div className="flex relative z-0 w-full txt-compact-medium">
          <textarea
            name="message"
            placeholder=" "
            required
            rows={5}
            className="pt-4 pb-1 block w-full px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover resize-none"
          />
          <label className="flex items-center mx-3 px-1 transition-all absolute duration-300 top-3 -z-1 origin-0 text-ui-fg-subtle">
            Message<span className="text-rose-500">*</span>
          </label>
        </div>
      </div>
      <ErrorMessage
        error={formState.state === "error" ? formState.error : null}
        data-testid="contact-form-error"
      />
      <SubmitButton data-testid="contact-submit-button" className="w-full sm:w-fit">
        Send message
      </SubmitButton>
    </form>
  )
}
