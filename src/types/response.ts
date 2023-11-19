export interface Response<T = undefined> {
  success: boolean;
  code: number;
  message: string;
  payload: T;
}
