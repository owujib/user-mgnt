export interface CreateUserDto {
  username?: string;
  email: string;
  password: number;
}

export interface UserLoginDto {
  identity: string;
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  username?: string;
}

export interface ResetPasswordDto {
  code: string;
  password: string;
}

export interface UpdatePasswordDto {
  current_password: string;
  new_password: string;
}
