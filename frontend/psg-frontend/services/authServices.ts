import api from "@/lib/api";

interface RegisterInterface { }

interface LoginInterface {
    email: string;
    password: string;
}

interface ForgetPasswordInterface {
    email: string;
}

export default class AuthServices {
    static async login(data: LoginInterface): Promise<any> {
        try {
            let response = await api.post("auth/login", data);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async loginAdmin(data: LoginInterface): Promise<any> {
        try {
            let response = await api.post("auth/login-admin", data);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async loginSuperAdmin(data: LoginInterface): Promise<any> {
        try {
            let response = await api.post("auth/login-super-admin", data);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            return response.data;
        } catch (e) {
            throw e;
        }
    }
    static async forgetPassword(data: ForgetPasswordInterface) {
        try {
            let response = await api.post("auth/send-reset-password-link", data);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async register(data: any) {
        try {
            let response = await api.post("auth/register", data);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async profile(id: string) {
        try {
            let response = await api.get(`auth/profile/${id}`);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async getMe() {
        try {
            let response = await api.get(`auth/me`);
            return response.data;
        } catch (e) {
            throw e;
        }
    }


    static async isAuthenticated(token: string) {
        if (!token) return false;
        try {
            let response = await api.post("auth/verify", { token: token });
            return response.data;
        } catch (e) {
            localStorage.removeItem("token");
            return false;
        }
    }

    static async logout(token: string) {
        try {
            let response = await api.post("auth/logout", {});
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async getAdmin(id: string) {
        try {
            let response = await api.get(`auth/admin/${id}`);
            return response.data;
        } catch (e) {
            throw e;
        }
    }
    static async resetPassword(token: string, newPassword: string) {
        try {
            let response = await api.post("auth/password-reset", { token, newPassword });
            return response.data;
        } catch (e) {
            throw e;
        }
    }
}





