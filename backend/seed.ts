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
import { COURSE_TYPE } from "src/course/enum/course-type";
import { SuperAdmin } from "src/super-admin/entities/super-admin.entity";
import { SuperAdminService } from "src/super-admin/super-admin.service";

// Category UUIDs
const CAT_TI_ID = '3c59dc04-8e88-5024-3be8-079a5c74d079';
const CAT_SAUDE_ID = 'e4e9e3e2-5d8d-4a1f-9c0d-6f7e8a9b0c1d';
const CAT_GAST_ID = 'd2e1c0b9-a8f7-4e6d-b5c4-3a2b1c0d9e8f';
const CAT_BELEZA_ID = 'f1e2d3c4-b5a6-9788-7654-3210fedcba98';
const CAT_GESTAO_ID = '0fedcba9-8765-4321-bcde-f0123456789a';

@Injectable()
export class SuperAdminSeed{
    constructor(private readonly adminService: SuperAdminService) { }

    async run() {
        const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'super.admin@senac.br';
        const adminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SenacDRSE@2026';

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
export class AdminSeed {
    constructor(private readonly adminService: AdminService) { }

    async run() {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@senac.br';
        const adminPassword = process.env.ADMIN_PASSWORD || 'SenacDRSE@2026';

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
            { id: 'c4ca4238-a0b9-2382-0dcc-509a6f75849b', title: 'Edital 001/2026', file_path: 'edital-001.pdf', created_at: new Date(), updated_at: new Date() },
            { id: 'c81e728d-9d4c-2f63-6f06-7f89cc14862c', title: 'Edital 002/2026', file_path: 'edital-002.pdf', created_at: new Date(), updated_at: new Date() },
        ];

        for (const edital of editals) {
            const exists = await this.editalService.findOne(edital.id);
            if (!exists) {
                await this.editalService.create(edital);
                console.log(`Edital ${edital.title} criado com sucesso`);
            }
        }
    }
}

@Injectable()
export class ResultSeed {
    constructor(private readonly resultService: ResultService) { }

    async run() {
        const results: Result[] = [
            { id: '6512bd43-d9ca-a6e0-2c99-0b0a82652dca', code: 'RES-001', title: 'Resultado Preliminar 001', file_path: 'resultado-001.pdf', created_at: new Date(), updated_at: new Date() },
        ];

        for (const result of results) {
            const exists = await this.resultService.findOne(result.id);
            if (!exists) {
                await this.resultService.create(result);
                console.log(`Resultado ${result.title} criado com sucesso`);
            }
        }
    }
}

@Injectable()
export class CategorySeed {
    constructor(private readonly categoryService: CategoryService) { }

    async run() {
        const categories = [
            { id: CAT_TI_ID, title: 'Tecnologia da Informação' },
            { id: CAT_SAUDE_ID, title: 'Saúde' },
            { id: CAT_GAST_ID, title: 'Gastronomia' },
            { id: CAT_BELEZA_ID, title: 'Beleza' },
            { id: CAT_GESTAO_ID, title: 'Gestão' },
        ];

        for (const cat of categories) {
            try {
                const exists = await this.categoryService.findOne(cat.id);
                if (exists) continue;
            } catch (e) {
                // If not found, it throws NotFoundException, which is fine
            }
            
            await this.categoryService.create({
                id: cat.id,
                title: cat.title,
                isActive: true,
            });
            console.log(`Categoria ${cat.title} criada com sucesso`);
        }
    }
}

@Injectable()
export class CourseSeed {
    constructor(private readonly courseService: CourseService, private readonly categoryService: CategoryService) { }

    async run() {
        const coursesParams = [
            // TI
            { id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', type: COURSE_TYPE.LIVRE, categoryId: CAT_TI_ID, title: 'Desenvolvedor Full Stack', code: 'TI-001', municipality: 'Aracaju', workload: 360, education: 'Ensino Médio Completo', period: PERIOD_DAY.NOITE },
            { id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', type: COURSE_TYPE.LIVRE, categoryId: CAT_TI_ID, title: 'Programador Web', code: 'TI-002', municipality: 'Itabaiana', workload: 240, education: 'Ensino Médio Incompleto', period: PERIOD_DAY.TARDE },
            { id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', type: COURSE_TYPE.TECNICO, categoryId: CAT_TI_ID, title: 'Técnico em Informática', code: 'TI-003', municipality: 'Lagarto', workload: 1200, education: 'Ensino Médio Cursando', period: PERIOD_DAY.MANHÃ },
            
            // Saúde
            { id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', type: COURSE_TYPE.TECNICO, categoryId: CAT_SAUDE_ID, title: 'Técnico em Enfermagem', code: 'SAUD-001', municipality: 'Aracaju', workload: 1600, education: 'Ensino Médio Completo', period: PERIOD_DAY.MANHÃ },
            { id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', type: COURSE_TYPE.LIVRE, categoryId: CAT_SAUDE_ID, title: 'Recepcionista em Serviços de Saúde', code: 'SAUD-002', municipality: 'Estância', workload: 240, education: 'Ensino Fundamental Completo', period: PERIOD_DAY.NOITE },
            
            // Gastronomia
            { id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', type: COURSE_TYPE.LIVRE, categoryId: CAT_GAST_ID, title: 'Cozinheiro Profissional', code: 'GAST-001', municipality: 'Aracaju', workload: 500, education: 'Ensino Fundamental Completo', period: PERIOD_DAY.TARDE },
            { id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', type: COURSE_TYPE.LIVRE, categoryId: CAT_GAST_ID, title: 'Confeiteiro', code: 'GAST-002', municipality: 'Tobias Barreto', workload: 300, education: 'Ensino Fundamental Completo', period: PERIOD_DAY.MANHÃ },
            
            // Beleza
            { id: '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', type: COURSE_TYPE.LIVRE, categoryId: CAT_BELEZA_ID, title: 'Cabeleireiro Assistente', code: 'BEL-001', municipality: 'Nossa Senhora da Glória', workload: 200, education: 'Ensino Fundamental Completo', period: PERIOD_DAY.TARDE },
            { id: '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', type: COURSE_TYPE.LIVRE, categoryId: CAT_BELEZA_ID, title: 'Maquiador', code: 'BEL-002', municipality: 'Propriá', workload: 160, education: 'Ensino Fundamental Completo', period: PERIOD_DAY.NOITE },
            
            // Gestão
            { id: 'a0b1c2d3-e4f5-6a7b-8c9d-0e1f2a3b4c5d', type: COURSE_TYPE.LIVRE, categoryId: CAT_GESTAO_ID, title: 'Assistente Administrativo', code: 'GEST-001', municipality: 'Aracaju', workload: 160, education: 'Ensino Médio Incompleto', period: PERIOD_DAY.MANHÃ },
            { id: 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e', type: COURSE_TYPE.LIVRE, categoryId: CAT_GESTAO_ID, title: 'Assistente de Recursos Humanos', code: 'GEST-002', municipality: 'Itabaiana', workload: 160, education: 'Ensino Médio Incompleto', period: PERIOD_DAY.NOITE },
        ];

        for (const courseParam of coursesParams) {
            try {
                const exists = await this.courseService.findOne(courseParam.id);
                if (exists) {
                    // Atualiza period_day e type para garantir que são strings válidas (corrige dados antigos com valores numéricos)
                    await this.courseService.update(courseParam.id, {
                        period_day: courseParam.period,
                        type: courseParam.type,
                    } as any);
                    continue;
                }
            } catch (e) {
                // Not found
            }

            const now = new Date();
            const nextMonth = new Date();
            nextMonth.setMonth(now.getMonth() + 1);

            await this.courseService.create({
                id: courseParam.id,
                img_url: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop&sig=${courseParam.code}`,
                title: courseParam.title,
                type: courseParam.type,
                status_vacancy: statusEnum.ATIVA,
                period_day: courseParam.period,
                address: `Unidade Senac ${courseParam.municipality}`,
                municipality: courseParam.municipality,
                targetAudience: 'Pessoas interessadas em qualificação profissional gratuita.',
                minAge: 16,
                schooldays: 'Segunda a Sexta-feira',
                workload: courseParam.workload,
                minimumEducation: courseParam.education,
                description: `O curso de ${courseParam.title} prepara o aluno para o mercado de trabalho através de uma metodologia prática e teórica focada em competências profissionais.`,
                code: courseParam.code,
                availablePosition: 20,
                classPeriodStart: now,
                classPeriodEnd: nextMonth,
                subscriptionStartDate: now,
                subscriptionEndDate: nextMonth,
                courseStart: now,
                courseEnd: nextMonth,
                createdAt: now,
                updatedAt: now,
                categoryId: courseParam.categoryId
            } as any);
            console.log(`Curso ${courseParam.title} (${courseParam.municipality}) inserido com sucesso.`);
        }

    }
}
