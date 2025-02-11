import { AuthProvider, HttpError } from "react-admin";

interface Credentials {
  username: string;
  password: string;
}

export const authProvider: AuthProvider = {
  login: async ({ username, password }: Credentials) => {
    const request = new Request(`/api/auth/login`, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ username, password }),
    });

    try {
        const response = await fetch(request);

        if (!response.ok) {
            const error = await response.json();
            throw new HttpError(error.message || 'Login failed', response.status);
        }

        const data = await response.json();
        const token = data.data?.token; // Adjusted to account for the response structure
        
        if (token) {
          localStorage.setItem('token', token);
          return Promise.resolve();
        } else {
          throw new HttpError('Invalid token received', 500);
        }
    } catch (error: any) {
        return Promise.reject(
            new HttpError(error.message || 'Network error', error.status || 500)
        );
    }
},
  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    localStorage.getItem("token") ? Promise.resolve() : Promise.reject(),
  getPermissions: () => {
    return Promise.resolve(undefined);
  },
  getIdentity: () => {
    const persistedUser = localStorage.getItem("token");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    return Promise.resolve(user);
  },
};

export default authProvider;
