import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
  static type: string;

  constructor(message?: any) {
    super();

    this.type = message;
  }
}
export class InvalidEmailError extends AuthError {
  static type = "Email không tồn tại !"
}
export class InvalidPasswordError extends AuthError {
  static type = "Password không hợp lệ !"
}
export class InactiveAccountError extends AuthError {
  static type = "Tài khoản chưa được kích hoạt !"
}
