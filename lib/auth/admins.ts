export const DOMINIO_PERMITIDO = "turbopartners.com.br";

export const EMAILS_ADMIN = [
  "roberto.fachetti@turbopartners.com.br",
  "victor.klein@turbopartners.com.br",
] as const;

export function ehAdmin(email: string): boolean {
  return EMAILS_ADMIN.includes(email.toLowerCase() as (typeof EMAILS_ADMIN)[number]);
}

export function emailNoDominio(email: string): boolean {
  return email.toLowerCase().endsWith(`@${DOMINIO_PERMITIDO}`);
}
