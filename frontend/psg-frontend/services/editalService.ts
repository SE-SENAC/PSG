import api from "@/lib/api";

export default class EditalService{
    static async findAll(page: number, limit: number = 9, search?: string): Promise<any> {
        try {
            const response = await api.get("edital", { params: { page, limit, search } });
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static findById = async(id: number | string) => {
        try{
            let response = await api.get("edital/" + id);
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static create = async(data: any) => {
        try{
            let response = await api.post("edital",data);
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static update = async(id: number | string, data: any) => {
        try{
            let response = await api.put("edital/" + id,data);
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static delete = async(id: number | string) => {
        try{
            let response = await api.delete("edital/" + id);
            return response.data;
        }catch(e){
            throw e;
        }
    }
}





