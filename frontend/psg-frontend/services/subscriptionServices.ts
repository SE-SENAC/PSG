import api from "@/lib/api";
import { SubscriptionInterface } from "@/models/subscription.interface";

export default class SubscriptionServices{

    static async create(course_id : string, student_id : string){
        try{
            let response = await api.post(`subscription`,{
                status : 'CONFIRMADO',
                course_id : course_id,
                user_id : student_id
            });
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static async getAll(page: number = 1, limit: number = 10, search?: string){
        try{
            let response = await api.get(`subscription`, {
                params: { page, limit, search }
            });
            return response.data
        }catch(e){
            throw e;
        }
    }

    static async confirm_subscription(id : number | string){
        try{
            let response = await api.post(`subscription/confirm/${id}`);
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static async get(id : number | string){
        try{
            let response = await api.get(`subscription/${id}`);
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static async update(id: number | string, data: any) {
        try{
            let response = await api.put("subscription/" + id, data);
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static async delete(id: number | string) {
        try{
            let response = await api.delete("subscription/" + id);
            return response.data;
        }catch(e){
            throw e;
        }
    }
}





