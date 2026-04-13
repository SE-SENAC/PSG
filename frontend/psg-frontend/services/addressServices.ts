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

export class AddressServices {
    async getAddressByZipCode(zipCode: string): Promise<AddressResponseViaCep> {
        try {
            const response = await api.get(`https://viacep.com.br/ws/${zipCode}/json/`);
            return response.data;
        } catch (e) {
            throw new Error("Erro ao buscar endereço");
        }
    }
}





