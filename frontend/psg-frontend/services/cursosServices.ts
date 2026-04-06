import axios from "axios";

const API_URL = "http://192.168.1.116:3001/api/course";
const CATEGORY_API_URL = "http://192.168.1.116:3001/api/category";

const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export default class CursosServices {
    static async getAll(page: number, limit: number): Promise<any> {
        try {
            // await delay(5000); // Removed unnecessary delay
            let response = await axios.get(API_URL, {
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
          let response = await axios.post(`${API_URL}/confirm/${id}`);
          return response.data;
      } catch(e) {
          console.error("Error in confirmCourse:", e);
          throw e;
      }
  }

  static async filteredCourses(filter: any): Promise<any> {
      try {
          let response = await axios.get(`${API_URL}/filter`, {
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
          let response = await axios.get(`${API_URL}/${id}`);
          return response.data;
      } catch (e) {
          console.error("Error in findById:", e);
          throw e;
      }
  }

  static async update(id: string, data: any): Promise<any> {
      try {
          let response = await axios.patch(`${API_URL}/${id}`, data);
          return response.data;
      } catch (e) {
          console.error("Error in update:", e);
          throw e;
      }
  }

  static async delete(id: string): Promise<any> {
      try {
          let response = await axios.delete(`${API_URL}/${id}`);
          return response.data;
      } catch (e) {
          console.error("Error in delete:", e);
          throw e;
      }
  }

    static async search(search: string): Promise<any> {
        try {
            let response = await axios.get(`${API_URL}/search`, {
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
            let response = await axios.get(CATEGORY_API_URL, {
                params: { page: 1, limit: 100 }
            })
            return response.data
        } catch (e) {
            console.error("Error in getAllCategories:", e);
            throw e;
        }
    }
}