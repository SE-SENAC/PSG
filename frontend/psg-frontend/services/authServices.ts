import axios from "axios"

interface RegisterInterface{

}

interface LoginInterface{
    email : string;
    password : string;
}

interface ForgetPasswordInterface {
    email : string;
}

interface ProfileInterface {
    id : number;
    name : string;
    email : string;
    token?: string;
    userExists?: any;
}

export default class AuthServices{

    static async login(data : LoginInterface) : Promise<any>{
        try{
            let response = await axios.post("http://192.168.1.116:3001/api/auth/login",data);
            if (response.data.token) {
                localStorage.setItem("token",response.data.token);
            }
            return response.data
        }catch(e){
            throw e;
        }
    }

    static async loginAdmin(data : LoginInterface) : Promise<any>{
        try{
            let response = await axios.post("http://192.168.1.116:3001/api/auth/login-admin",data);
             if (response.data.token) {
                localStorage.setItem("token",response.data.token);
            }
            return response.data
        }catch(e){
            throw e;
        }
    }

    static async forgetPassword(data : ForgetPasswordInterface){
        try{
            let response = await axios.post("http://192.168.1.116:3001/api/auth/send-reset-password-link",data);
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static async register(data : any){
        try{
            let response = await axios.post("http://192.168.1.116:3001/api/auth/register",data)
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static async profile(id: string){
        try{
            let response = await axios.get(`http://192.168.1.116:3001/api/auth/profile/${id}`,{
                headers : { Authorization : `Bearer ${localStorage.getItem("token")}`},
            })
            return response.data;
        }catch(e){
            throw e;
        }
    }

    static async getMe(){
        try{
            let response = await axios.get(`http://192.168.1.116:3001/api/auth/me`,{
                headers : { Authorization : `Bearer ${localStorage.getItem("token")}`},
            })
            return response.data;
        }catch(e){
            throw e;
        }
    }


    static async isAuthenticated(token: string) {
        if (!token) return false;
        try {
            let response = await axios.post("http://192.168.1.116:3001/api/auth/verify", { token: token }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (e) {
            localStorage.removeItem("token");
            return false;
        }
    }

    static async logout(token: string) {
        try {
            let response = await axios.post("http://192.168.1.116:3001/api/auth/logout", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    static async getAdmin(id : string){
        try{
            let response = await axios.get(`http://192.168.1.116:3001/api/auth/admin/${id}`,{
                headers : { Authorization : `Bearer ${localStorage.getItem("token")}`},
            })
            return response.data;
        }catch(e){
            throw e;
        }
    }

}