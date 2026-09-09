const HAS_LETTER = /[A-Za-z\u0600-\u06FF]/;
const HAS_NUMBER = /\d/;

export function isValidPassword(value: string): boolean {
  return value.length >= 8 && HAS_LETTER.test(value) && HAS_NUMBER.test(value);
}
