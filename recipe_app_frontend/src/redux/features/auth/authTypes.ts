export interface User {
  interceptors: any;
  _id: string;
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
