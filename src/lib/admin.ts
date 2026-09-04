// Administrateurs autorisés à consulter les feedbacks (miroir des policies SQL).
export const ADMIN_EMAILS = [
  'charshow@gmail.com',
  'marchepublic@nomadimpact.org',
  'hello@nomadimpact.org',
  'info@nomadimpact.org',
]

export function isAdmin(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email)
}
