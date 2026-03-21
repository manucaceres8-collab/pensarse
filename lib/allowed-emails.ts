export const allowedPsychologistEmails = [
  "manucaceres8@gmail.com",
  "otrocorreo@gmail.com",
];

export function isAllowedPsychologistEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return allowedPsychologistEmails.some((item) => item.toLowerCase() === normalized);
}
