import api from "@/lib/api";

export interface AddressResponseViaCep {
    cep?: string;
    logradouro?: string;
    complemento?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
    erro?: string | boolean;
}

export default class AddressServices {
    static async getAddressByZipCode(zipCode: string): Promise<AddressResponseViaCep> {
        try {
            const response = await api.get(`https://viacep.com.br/ws/${zipCode}/json/`);
            return response.data;
        } catch (e) {
            throw new Error("Erro ao buscar endereço");
        }
    }

    static async getAll(): Promise<any> {
        try {
            const response = await api.get("address");
            return response.data;
        } catch (e) {
            throw e;
        }
    }
}






