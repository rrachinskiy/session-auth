type Field = 'username' | 'password';

interface Error {
  status?: number;
  field?: Field;
}
