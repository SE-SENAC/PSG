import { Course } from "./src/course/entities/course.entity"
import { CourseService } from "./src/course/course.service";
import { Injectable } from "@nestjs/common";
import { statusEnum } from "src/course/enum/course-enum";
import { EditalService } from "./src/documents/edital/edital.service";
import { ResultService } from "./src/documents/result/result.service";
import { Edital } from "./src/documents/edital/entities/edital.entity";
import { Result } from "./src/documents/result/entities/result.entity";
import { PERIOD_DAY } from "src/course/enum/period_day";
import { Category } from "src/category/entities/category.entity";
import { CategoryService } from "src/category/category.service";
import { AdminService } from "src/admin/admin.service";
import { Admin } from "src/admin/entities/admin.entity";
import { ROLE } from "src/type-user/enum/enum";

@Injectable()
export class AdminSeed {
    constructor(private readonly adminService: AdminService) { }

    async run() {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@senac.br';
        const adminPassword = process.env.ADMIN_PASSWORD || 'SenacDRSE@2026';

        // Check if this specific admin exists by email
        const existingAdmin = await this.adminService.findOneByEmail({ email: adminEmail });
        
        if (existingAdmin) {
            console.log(`Admin com o email ${adminEmail} já existe. Pulando semeadura.`);
            return;
        }

        try {
            await this.adminService.createAdminFromScratch({
                name: 'Admin Principal',
                email: adminEmail,
                password: adminPassword,
            });
            console.log(`Admin principal (${adminEmail}) criado com sucesso`);
        } catch (e) {
            console.error(`Falha ao criar o admin: ${e.message}`);
        }
    }
}


@Injectable()
export class EditalSeed {
    constructor(private readonly editalService: EditalService) { }

    async run() {
        const editals: Edital[] = [
            {
                id: 'c4ca4238-a0b9-2382-0dcc-509a6f75849b',
                title: 'Edital 001',
                file_path: 'edital-001.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'c81e728d-9d4c-2f63-6f06-7f89cc14862c',
                title: 'Edital 002',
                file_path: 'edital-002.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'eccbc87e-4b5c-e2fe-2830-8fd9f2a7baf3',
                title: 'Edital 003',
                file_path: 'edital-003.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'a87ff679-a2f3-e71d-9181-a67b7542122c',
                title: 'Edital 004',
                file_path: 'edital-004.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'e4da3b7f-bbce-2345-d777-2b0674a318d5',
                title: 'Edital 005',
                file_path: 'edital-005.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '1679091c-5a88-0faf-6fb5-e6087eb1b2dc',
                title: 'Edital 006',
                file_path: 'edital-006.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '8f14e45f-ceea-167a-5a36-dedd4bea2543',
                title: 'Edital 007',
                file_path: 'edital-007.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'c9f0f895-fb98-ab91-59f5-1fd0297e236d',
                title: 'Edital 008',
                file_path: 'edital-008.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '45c48cce-2e2d-7fbd-ea1a-fc51c7c6ad26',
                title: 'Edital 009',
                file_path: 'edital-009.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'd3d94468-02a4-4259-755d-38e6d163e820',
                title: 'Edital 010',
                file_path: 'edital-010.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        for (const edital of editals) {
            const exists = await this.editalService.findOne(edital.id);
            if (!exists) {
                await this.editalService.create(edital);
                console.log(`Edital ${edital.id} criado com sucesso`);
            }
        }


    }
}

@Injectable()
export class ResultSeed {
    constructor(private readonly resultService: ResultService) { }

    async run() {
        const results: Result[] = [
            {
                id: '6512bd43-d9ca-a6e0-2c99-0b0a82652dca',
                code: 'RES-001',
                title: 'Resultado 001',
                file_path: 'resultado-001.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'c20ad4d7-6fe9-7759-aa27-a0c99bff6710',
                code: 'RES-002',
                title: 'Resultado 002',
                file_path: 'resultado-002.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'c51ce410-c124-a10e-0db5-e4b97fc2af39',
                code: 'RES-003',
                title: 'Resultado 003',
                file_path: 'resultado-003.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'aab32389-22bc-c25a-6f60-6eb525ffdc56',
                code: 'RES-004',
                title: 'Resultado 004',
                file_path: 'resultado-004.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '9bf31c7f-f062-936a-96d3-c8bd1f8f2ff3',
                code: 'RES-005',
                title: 'Resultado 005',
                file_path: 'resultado-005.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'c74d97b0-1eae-257e-44aa-9d5bade97baf',
                code: 'RES-006',
                title: 'Resultado 006',
                file_path: 'resultado-006.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '70efdf2e-c9b0-8607-9795-c442636b55fb',
                code: 'RES-007',
                title: 'Resultado 007',
                file_path: 'resultado-007.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '6f4922f4-5568-161a-8cdf-4ad2299f6d23',
                code: 'RES-008',
                title: 'Resultado 008',
                file_path: 'resultado-008.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '1f0e3dad-9990-8345-f743-9f8ffabdffc4',
                code: 'RES-009',
                title: 'Resultado 009',
                file_path: 'resultado-009.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '98f13708-2101-94c4-7568-7be6106a3b84',
                code: 'RES-010',
                title: 'Resultado 010',
                file_path: 'resultado-010.pdf',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ];

        for (const result of results) {
            const exists = await this.resultService.findOne(result.id);
            if (!exists) {
                await this.resultService.create(result);
                console.log(`Resultado ${result.id} criado com sucesso`);
            }
        }
    }
}

@Injectable()
export class CategorySeed {
    constructor(private readonly categoryService: CategoryService) { }

    async run() {
        const categories: Category[] = [
            {
                id: '3c59dc04-8e88-5024-3be8-079a5c74d079',
                title: 'Desenvolvimento Full Stack',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: []
            },
            {
                id: 'b6d767d2-f8ed-5d21-a44b-0e5886680cb9',
                title: 'Ciência de Dados e ML',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: []
            },
            {
                id: '37693cfc-7480-49e4-5d87-b8c7d8b9aacd',
                title: 'UX/UI Design',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: []
            },
            {
                id: '1ff1de77-4005-f8da-13f4-2943881c655f',
                title: 'DevOps e Cloud',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: []
            },
            {
                id: '8e296a06-7a37-5633-70de-d05f5a3bf3ec',
                title: 'Segurança da Informação',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: []
            },
            {
                id: '4e732ced-3463-d06d-e0ca-9a15b6153677',
                title: 'Marketing Digital',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: []
            },
            {
                id: '02e74f10-e032-7ad8-68d1-38f2b4fdd6f0',
                title: 'Gestão de Projetos',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: []
            },
            {
                id: '33e75ff0-9dd6-01bb-e69f-351039152189',
                title: 'Inteligência Artificial',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: []
            },
            {
                id: '6ea9ab1b-aa0e-fb9e-1909-4440c317e21b',
                title: 'Desenvolvimento Mobile',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: []
            },
            {
                id: '34173cb3-8f07-f89d-dbeb-c2ac9128303f',
                title: 'Banco de Dados',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                courses: []
            },
        ];

        for (const category of categories) {
            const exists = await this.categoryService.findOne(category.id);
            if (!exists) {
                await this.categoryService.create(category);
                console.log(`Categoria ${category.id} criada com sucesso`);
            }
        }
    }
}

@Injectable()
export class CourseSeed {

    constructor(private readonly courseService: CourseService, private readonly categoryService: CategoryService) { }

    async run() {
        const category = await this.categoryService.findOne('3c59dc04-8e88-5024-3be8-079a5c74d079');
        if (!category) {
            console.error('Categoria não encontrada. Pulando semeadura de cursos.');
            return;
        }
        const courses: Course[] = [
            {
                id: 'c16a5320-fa47-5530-d958-3c34fd356ef5',
                img_url: "https://picsum.photos/200/300",
                title: 'Desenvolvimento Full Stack',
                status_vacancy: statusEnum.ATIVA,
                period_day: PERIOD_DAY.MANHÃ,

                address: 'Av. Paulista, 1000',
                targetAudience: 'Interessados em front-end e back-end',
                minAge: 18,
                schooldays: 'Segunda a sexta',
                workload: 360,
                minimumEducation: 'Ensino médio',
                description: 'Formação completa em tecnologias web modernas.',
                code: 'DFS-001',
                availablePosition: 25,
                classPeriodStart: new Date(),
                classPeriodEnd: new Date(),
                subscriptionStartDate: new Date(),
                subscriptionEndDate: new Date(),
                courseStart: new Date(),
                courseEnd: new Date(),
                subscriptions: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                category: category,
            },
            {
                id: '6364d3f0-f495-b6ab-9dcf-8d3b5c6e0b01',
                img_url: "https://picsum.photos/200/300",
                title: 'Ciência de Dados e ML',
                status_vacancy: statusEnum.ATIVA,
                period_day: PERIOD_DAY.MANHÃ,
                address: 'Rua Digital, 45',
                targetAudience: 'Pessoas com afinidade em matemática e estatística',
                minAge: 18,
                schooldays: 'Terça e Quinta',
                workload: 120,
                minimumEducation: 'Ensino médio',
                description: 'Análise de dados, Python e Machine Learning.',
                code: 'CD-002',
                availablePosition: 15,
                classPeriodStart: new Date(),
                classPeriodEnd: new Date(),
                subscriptionStartDate: new Date(),
                subscriptionEndDate: new Date(),
                courseStart: new Date(),
                courseEnd: new Date(),
                subscriptions: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                category: category,
            },
            {
                id: '182be0c5-cdcd-5072-bb18-64cdee4d3d6e',
                img_url: "https://picsum.photos/200/300",
                title: 'Cibersegurança Prática',
                status_vacancy: statusEnum.ATIVA,
                period_day: PERIOD_DAY.MANHÃ,
                address: 'Online',
                targetAudience: 'Interessados em segurança da informação',
                minAge: 16,
                schooldays: 'Sábados',
                workload: 60,
                minimumEducation: 'Ensino médio cursando',
                description: 'Fundamentos de defesa cibernética e testes de invasão.',
                code: 'CS-003',
                availablePosition: 40,
                classPeriodStart: new Date(),
                classPeriodEnd: new Date(),
                subscriptionStartDate: new Date(),
                subscriptionEndDate: new Date(),
                courseStart: new Date(),
                courseEnd: new Date(),
                subscriptions: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                category: category,
            },
            {
                id: 'e369853d-f766-fa44-e1ed-0ff613f563bd',
                img_url: "https://picsum.photos/200/300",
                title: 'UX/UI Design',
                status_vacancy: statusEnum.ATIVA,
                period_day: PERIOD_DAY.MANHÃ,
                address: 'Rua das Artes, 12',
                targetAudience: 'Criativos e interessados em interfaces',
                minAge: 16,
                schooldays: 'Segunda e Quarta',
                workload: 80,
                minimumEducation: 'Ensino médio',
                description: 'Criação de interfaces centradas no usuário.',
                code: 'UX-004',
                availablePosition: 20,
                classPeriodStart: new Date(),
                classPeriodEnd: new Date(),
                subscriptionStartDate: new Date(),
                subscriptionEndDate: new Date(),
                courseStart: new Date(),
                courseEnd: new Date(),
                subscriptions: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                category: category,
            },
            {
                id: '1c383cd3-0b7c-298a-b502-93adfecb7b18',
                img_url: "https://picsum.photos/200/300",
                title: 'Desenvolvimento Mobile Flutter',
                status_vacancy: statusEnum.INATIVA,
                period_day: PERIOD_DAY.MANHÃ,
                address: 'Av. Inovação, 500',
                targetAudience: 'Desenvolvedores mobile',
                minAge: 18,
                schooldays: 'Segunda a sexta',
                workload: 100,
                minimumEducation: 'Ensino médio',
                description: 'Criação de apps nativos para iOS e Android.',
                code: 'MOB-005',
                availablePosition: 12,
                classPeriodStart: new Date(),
                classPeriodEnd: new Date(),
                subscriptionStartDate: new Date(),
                subscriptionEndDate: new Date(),
                courseStart: new Date(),
                courseEnd: new Date(),
                subscriptions: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                category: category,
            },
            {
                id: '19ca14e7-ea63-28a4-2e0e-b13d585e4c22',
                img_url: "https://picsum.photos/200/300",
                title: 'Administração de Redes Cloud',
                status_vacancy: statusEnum.INATIVA,
                period_day: PERIOD_DAY.MANHÃ,
                address: 'Data Center Sul',
                targetAudience: 'Técnicos de TI',
                minAge: 18,
                schooldays: 'Segunda a sexta',
                workload: 150,
                minimumEducation: 'Ensino médio',
                description: 'Gestão de infraestrutura em AWS e Azure.',
                code: 'CLD-006',
                availablePosition: 10,
                classPeriodStart: new Date(),
                classPeriodEnd: new Date(),
                subscriptionStartDate: new Date(),
                subscriptionEndDate: new Date(),
                courseStart: new Date(),
                courseEnd: new Date(),
                subscriptions: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                category: category,
            },
            {
                id: 'a5bfc9e0-7964-f8dd-deb9-5fc584cd965d',
                img_url: "https://picsum.photos/200/300",
                title: 'Robótica Educacional',
                status_vacancy: statusEnum.INATIVA,
                period_day: PERIOD_DAY.MANHÃ,
                address: 'Escola Técnica 1',
                targetAudience: 'Jovens interessados em hardware',
                minAge: 14,
                schooldays: 'Quarta e Sexta',
                workload: 45,
                minimumEducation: 'Ensino fundamental',
                description: 'Introdução ao Arduino e automação.',
                code: 'ROB-007',
                availablePosition: 15,
                classPeriodStart: new Date(),
                classPeriodEnd: new Date(),
                subscriptionStartDate: new Date(),
                subscriptionEndDate: new Date(),
                courseStart: new Date(),
                courseEnd: new Date(),
                subscriptions: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                category: category,
            },
            {
                id: 'a5771bce-93e2-00c3-6f7c-d9dfd0e5deaa',
                img_url: "https://picsum.photos/200/300",
                title: 'Desenvolvimento de Jogos com Unity',
                status_vacancy: statusEnum.FUTURA,
                period_day: PERIOD_DAY.MANHÃ,
                address: 'Hub de Games',
                targetAudience: 'Interessados em gamedev',
                minAge: 16,
                schooldays: 'Segunda a quinta',
                workload: 200,
                minimumEducation: 'Ensino médio cursando',
                description: 'Lógica de programação para jogos 2D e 3D.',
                code: 'GAM-008',
                availablePosition: 20,
                classPeriodStart: new Date(),
                classPeriodEnd: new Date(),
                subscriptionStartDate: new Date(),
                subscriptionEndDate: new Date(),
                courseStart: new Date(),
                courseEnd: new Date(),
                subscriptions: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                category: category,
            },
            {
                id: 'd67d8ab4-f4c1-0bf2-2aa3-53e27879133c',
                img_url: "https://picsum.photos/200/300",
                title: 'Inteligência Artificial Aplicada',
                status_vacancy: statusEnum.FUTURA,
                period_day: PERIOD_DAY.MANHÃ,
                address: 'Online',
                targetAudience: 'Profissionais de tecnologia',
                minAge: 18,
                schooldays: 'Terça e Quinta',
                workload: 90,
                minimumEducation: 'Ensino superior incompleto',
                description: 'Implementação de APIs de IA em negócios.',
                code: 'IA-009',
                availablePosition: 30,
                classPeriodStart: new Date(),
                classPeriodEnd: new Date(),
                subscriptionStartDate: new Date(),
                subscriptionEndDate: new Date(),
                courseStart: new Date(),
                courseEnd: new Date(),
                subscriptions: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                category: category,
            },
            {
                id: 'd645920e-395f-edad-7bbb-ed0eca3fe2e0',
                img_url: "https://picsum.photos/200/300",
                title: 'Qualidade de Software (QA)',
                status_vacancy: statusEnum.FUTURA,
                period_day: PERIOD_DAY.MANHÃ,
                address: 'Rua dos Testes, 99',
                targetAudience: 'Pessoas detalhistas e analíticas',
                minAge: 18,
                schooldays: 'Segunda a sexta',
                workload: 60,
                minimumEducation: 'Ensino médio',
                description: 'Testes automatizados e garantia de qualidade.',
                code: 'QA-010',
                availablePosition: 20,
                classPeriodStart: new Date(),
                classPeriodEnd: new Date(),
                subscriptionStartDate: new Date(),
                subscriptionEndDate: new Date(),
                courseStart: new Date(),
                courseEnd: new Date(),
                subscriptions: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                category: category,
            },
        ];

        for (const courseData of courses) {
            // Verifica se o curso já existe (pelo código, por exemplo) para evitar duplicatas
            const exists = await this.courseService.findOne(courseData.id);

            if (!exists) {
                await this.courseService.create(courseData);
                console.log(`Curso ${courseData.title} inserido com sucesso.`);
            }
        }
    }
}
