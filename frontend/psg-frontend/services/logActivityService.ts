import api from "@/lib/api";

export default class LogActivityService{
    static async logActivity(data : any){
        try{
            let response = await api.post("log-activity",data);
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static async getAll(page: number = 1, limit: number = 10, filters: any = {}) {
        try {
            let response = await api.get("log-activity", { 
                params: { 
                    page, 
                    limit,
                    ...filters
                } 
            });
            return response.data;
        } catch(e) {
            throw e;
        }
    }
}
