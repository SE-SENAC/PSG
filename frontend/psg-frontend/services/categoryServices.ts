import api from "@/lib/api";

const PATH = "category";

export default class CategoryServices {
    static async getAll(page: number = 1, limit: number = 100): Promise<any> {
        try {
            const response = await api.get(PATH, { params: { page, limit } });
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async getById(id: string): Promise<any> {
        try {
            const response = await api.get(`${PATH}/${id}`);
            return response.data;
        } catch (e) {
            throw e;
        }
    }


    static async create(data: any): Promise<any> {
        try {
            const response = await api.post(PATH, data);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async update(id: string, data: any): Promise<any> {
        try {
            const response = await api.patch(`${PATH}/${id}`, data);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async delete(id: string): Promise<any> {
        try {
            const response = await api.delete(`${PATH}/${id}`);
            return response.data;
        } catch (e) {
            throw e;
        }
    }
}
