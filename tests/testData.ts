// Dados de teste compartilhados entre os specs, para evitar magic strings repetidas.

export const FULL_NAME = 'Gabriel Vieira de Sousa';
export const FIRST_NAME = 'Gabriel';
export const LAST_NAME = 'Sousa';
export const COMPANY = 'Minha Empresa';

export const PASSWORD = 'Senha123!';
// Só minúsculas, sem número/símbolo — usada em 11-weak-password.spec.ts.
export const WEAK_PASSWORD = 'senhafraca';

export const DATE_OF_BIRTH = { day: '10', month: '5', year: '1998' };

export const ADDRESS = 'Rua Teste, 123';
export const ADDRESS_2 = 'Apto 45';
export const COUNTRY = 'Canada';
export const STATE = 'SP';
export const CITY = 'Sao Paulo';
export const ZIPCODE = '01000-000';
export const MOBILE_NUMBER = '11999999999';

export function generateRandomEmail(prefix: string = 'gabriel'): string {
  return `${prefix}${Date.now()}@teste.com`;
}
