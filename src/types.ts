type Field = 'username' | 'password';

export interface HttpError extends Error {
  status?: number;
  field?: Field;
}
