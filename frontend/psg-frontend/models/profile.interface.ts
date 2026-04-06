export interface ProfileInterfaceStudent {
    id: string;
    name: string;
    email: string;
    password: string;

    typeUser: {
        role: string;
    }
    addresses: {
        zipCode: string;
        residence_number: string;
        street: string;
        complement: string;
        neighborhood: string;
        city: string;
        state: string;
    }[]
    phones: {
        ddd: string;
        ddi: string;
        number: string;
    }[]
    student: {
        cpf: string;
        gender: string;
        birth_date: string;
        is_pcd: string;
        pcd_type: string;
        personal_income: number;
        family_income: number;
        number_parents_in_home: number;
        mother_name: string;
        father_name: string;
        educationLevel: string;
        institution: string;
        course: string;
        job_status: string;
        where_study_secondary_school: string;
    }
}