import { ROLE } from 'src/type-user/enum/enum';

export interface AuthResponse {
  message: string;
  token: string;
  refreshToken: string;
  userExists: {
    id: string;
    name: string;
    email: string;
    role: ROLE;
  };
}

export interface RegisterResponse {
  message: string;
  accessToken?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: ROLE;
  };
}

export interface JwtPayload {
  id: string;
  email: string;
  role?: ROLE;
}
