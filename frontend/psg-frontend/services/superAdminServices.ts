import api from "@/lib/api";

export default class SuperAdminServices {
    static async getStats(): Promise<any> {
        try {
            const response = await api.get("super-admin/dashboard/stats");
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async listAdmins(page: number = 1, limit: number = 100, search?: string): Promise<any> {
        try {
            const response = await api.get("super-admin/admins", { params: { page, limit, search } });
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async createAdmin(data: any): Promise<any> {
        try {
            const response = await api.post("super-admin/admins", data);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async toggleAdminStatus(userId: string, isActive: boolean): Promise<any> {
        try {
            const response = await api.patch(`super-admin/admins/${userId}/status`, { isActive });
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async updateAdmin(userId: string, data: any): Promise<any> {
        try {
            const response = await api.put(`super-admin/admins/${userId}`, data);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async deleteAdmin(userId: string): Promise<any> {
        try {
            const response = await api.delete(`super-admin/admins/${userId}`);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async getAdmin(userId: string): Promise<any> {
        try {
            const response = await api.get(`super-admin/admins/${userId}`);
            return response.data;
        } catch (e) {
            throw e;
        }
    }
}
