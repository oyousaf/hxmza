"use server"

export type ContactFormState =
  | { state: "idle" }
  | { state: "success" }
  | { state: "error"; error: string }

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = (formData.get("name") as string)?.trim()
  const email = (formData.get("email") as string)?.trim()
  const message = (formData.get("message") as string)?.trim()

  if (!name || !email || !message) {
    return { state: "error", error: "Please fill in every field." }
  }

  // TODO: wire up real delivery (e.g. an email provider or a Medusa admin
  // notification) once Beds4u has one set up. For now this just logs the
  // enquiry server-side so nothing is silently lost.
  console.info("[contact] enquiry received", { name, email, message })

  return { state: "success" }
}
