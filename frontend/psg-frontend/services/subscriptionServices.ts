import axios from "axios";

const API_URL = "http://192.168.1.116:3001/api";

export default class SubscriptionServices{

    static async create(course_id : string, student_id : string){
        try{
            let response = await axios.post(`${API_URL}/subscription`,{
                status : 'CONFIRMADO',
                course_id : course_id,
                user_id : student_id
            });
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static async get_all(){
        try{
            let response = await axios.get(`${API_URL}/subscription`);
            return response.data
        }catch(e){
            throw e;
        }
    }

    static async confirm_subscription(id : number){
        try{
            let response = await axios.post(`${API_URL}/subscription/confirm/${id}`);
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static async get(id : number){
        try{
            let response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        }catch(e){
            throw e;
        }
    }

}