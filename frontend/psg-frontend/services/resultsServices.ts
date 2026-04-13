import api from "@/lib/api";

export default class ResultsServices{

    static async findAll(page: number, limit: number = 10, search?: string): Promise<any> {
        try {
            const response = await api.get("results", { params: { page, limit, search } });
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static findById = async(id: number | string) => {
        try{
            let response = await api.get("results/" + id);
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static create = async(data: any) => {
        try{
            let response = await api.post("results",data);
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static update = async(id: number | string, data: any) => {
        try{
            let response = await api.put("results/" + id,data);
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static delete = async(id: number | string) => {
        try{
            let response = await api.delete("results/" + id);
            return response.data;
        }catch(e){
            throw e;
        }
    }
}





