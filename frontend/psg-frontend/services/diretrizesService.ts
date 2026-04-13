import api from "@/lib/api";

export default class DiretrizesService {
    static async findAll(page : number, limit: number = 9, search?: string) {
        try{
            let response = await api.get("diretrizes",{params:{page : page, limit : limit, search}});
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static findById = async (id: string | number) => {
        try {
            let response = await api.get(`diretrizes/${id}`);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static create = async (data: any) => {
        try {
            let response = await api.post("diretrizes", data);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static update = async (id: string | number, data: any) => {
        try {
            let response = await api.put(`diretrizes/${id}`, data);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static delete = async (id: string | number) => {
        try {
            let response = await api.delete(`diretrizes/${id}`);
            return response.data;
        } catch (e) {
            throw e;
        }
    }
}
