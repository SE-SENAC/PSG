import api from "@/lib/api";

export default class AdminServices {
    static async getAll(): Promise<any[]> {
        try {
            let response = await api.get("admin");
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async getSuperAdmins(): Promise<any[]> {
        try {
            let response = await api.get("super-admin");
            return response.data;
        } catch (e) {
            throw e;
        }
    }
}