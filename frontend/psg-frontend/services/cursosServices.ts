import api from "@/lib/api";

const API_PATH = "course";
const CATEGORY_PATH = "category";

const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}


interface CreateCourseInterface{
    type : string;
    img_url : string;
    title : string;
    status_vacancy : number;
    address : string;
    municipality : string;
    categoryId : string;
    targetAudience : string;
    minAge : number;
    schooldays : string;
    workload : number;
    minimumEducation : string;
    description : string;
    code : string;
    availablePosition : number;
    classPeriodStart : string | Date;
    classPeriodEnd : string | Date;
    subscriptionStartDate : string | Date;
    subscriptionEndDate : string | Date;
    courseStart : string | Date;
    courseEnd : string | Date;
    createAt : string | Date;
    updatedAt : string | Date;
    period_day : number;
}

export default class CursosServices {
    static async getAll(page: number, limit: number): Promise<any> {
        try {
            // await delay(5000); // Removed unnecessary delay
            let response = await api.get(API_PATH, {
                params: { page, limit }
            })
            return response.data;
        } catch (e) {
            console.error("Error in getAll:", e);
            throw e;
        }
    }

    static async confirmCourse(id: string): Promise<any> {
      try {
          let response = await api.post(`${API_PATH}/confirm/${id}`);
          return response.data;
      } catch(e) {
          console.error("Error in confirmCourse:", e);
          throw e;
      }
  }

  static async filteredCourses(filter: any): Promise<any> {
      try {
          let response = await api.get(`${API_PATH}/filter`, {
              params: filter
          })
          return response.data
      } catch (e) {
          console.error("Error in filteredCourses:", e);
          throw e;
      }
  }

  static async findById(id: string): Promise<any> {
      try {
          let response = await api.get(`${API_PATH}/${id}`);
          return response.data;
      } catch (e) {
          console.error("Error in findById:", e);
          throw e;
      }
  }

  static async create(data : CreateCourseInterface) : Promise<any> {
    try{
        let response = await api.post(`${API_PATH}/course`,data);
        return response.data;
    }catch(e){
        console.error("Erro ao criar curso",e);
    }
  }

  static async update(id: string, data: any): Promise<any> {
      try {
          let response = await api.patch(`${API_PATH}/${id}`, data);
          return response.data;
      } catch (e) {
          console.error("Error in update:", e);
          throw e;
      }
  }

  static async delete(id: string): Promise<any> {
      try {
          let response = await api.delete(`${API_PATH}/${id}`);
          return response.data;
      } catch (e) {
          console.error("Error in delete:", e);
          throw e;
      }
  }

    static async search(search: string): Promise<any> {
        try {
            let response = await api.get(`${API_PATH}/search`, {
                params: { search }
            })
            return response.data
        } catch (e) {
            console.error("Error in search:", e);
            throw e;
        }
    }

    static async getAllCategories(): Promise<any> {
        try {
            let response = await api.get(CATEGORY_PATH, {
                params: { page: 1, limit: 100 }
            })
            return response.data
        } catch (e) {
            console.error("Error in getAllCategories:", e);
            throw e;
        }
    }
}





