import axios from "axios";

export default class ResultsServices{
    static findAll = async(page : number) => {
        try{
            let response = await axios.get("http://192.168.1.116:3001/api/results",{params:{page : page, limit : 10}});
            return response.data;
        }catch(e){
            throw e;
        }
    }
}