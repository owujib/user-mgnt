export interface CreateUserDto {
  username: string;
  email: string;
  password: number;
}

export interface UserLoginDto {
  email: string;
  password: string;
}
