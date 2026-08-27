// Dados de teste compartilhados entre os specs, para evitar magic strings repetidas.

export const FULL_NAME = 'Gabriel Vieira de Sousa';
export const FIRST_NAME = 'Gabriel';
export const LAST_NAME = 'Sousa';
export const COMPANY = 'Minha Empresa';

export const TITLE = 'Mr';

// As 4 constantes abaixo representam as 4 partições de equivalência do
// campo de senha, exercitadas em tests/11-password-partitions.spec.ts.
export const PASSWORD = 'Senha123!'; // partição válida: maiúscula + minúscula + número
export const WEAK_PASSWORD = 'senhafraca'; // partição inválida: só minúsculas
export const SHORT_PASSWORD = '123'; // partição inválida: muito curta
export const EMPTY_PASSWORD = ''; // partição inválida: campo vazio

export const DATE_OF_BIRTH = { day: '10', month: '5', year: '1998' };

export const ADDRESS = 'Rua Teste, 123';
export const ADDRESS_2 = 'Apto 45';
export const COUNTRY = 'Canada';
export const STATE = 'SP';
export const CITY = 'Sao Paulo';
export const ZIPCODE = '01000-000';
export const MOBILE_NUMBER = '11999999999';

// Date.now() sozinho tem resolução de 1ms: com os testes rodando em
// paralelo (fullyParallel: true), duas specs podem gerar o mesmo
// timestamp e colidir no mesmo email. O sufixo aleatório evita isso.
export function generateRandomEmail(prefix: string = 'gabriel'): string {
  const randomSuffix = Math.floor(Math.random() * 1_000_000);
  return `${prefix}${Date.now()}${randomSuffix}@teste.com`;
}
