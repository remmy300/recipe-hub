export interface User {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
