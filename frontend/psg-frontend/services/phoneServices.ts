import api from "@/lib/api";

export interface CountryDdi {
    name: string;
    code: string;
    flag: string;
}

export class PhoneServices {
    async getAllDdis(): Promise<CountryDdi[]> {
        try {
            const response = await api.get("https://restcountries.com/v3.1/all?fields=name,idd,flags");
            const countries = response.data
                .filter((c: any) => c.idd && c.idd.root)
                .flatMap((c: any) => {
                    const root = c.idd.root;
                    const suffixes = c.idd.suffixes || [""];
                    return suffixes.map((suffix: string) => ({
                        name: c.name.common,
                        code: `${root}${suffix}`.replace(/\D/g, ''),
                        flag: c.flags?.svg || c.flags?.png || ""
                    }));
                });

            const validCountries = countries.filter((c: CountryDdi) => c.code !== "");
            validCountries.sort((a: CountryDdi, b: CountryDdi) => a.name.localeCompare(b.name));
            return validCountries;
        } catch (e) {
            console.error("Erro ao buscar DDIs de países", e);
            throw new Error("Erro ao buscar a lista de DDIs");
        }
    }
}





