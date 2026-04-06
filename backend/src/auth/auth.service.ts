import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { User } from 'src/user/entities/user.entity';
import { Address } from 'src/address/entities/address.entity';
import { Phone } from 'src/phone/entities/phone.entity';
import { Student } from 'src/student/entities/student.entity';
import { TypeUser } from 'src/type-user/entities/type-user.entity';
import { ROLE } from 'src/type-user/enum/enum';

import { AuthJwtService } from './jwtService';
import LoginDto from './dto/login.dto';
import RegisterDto from './dto/register.dto';
import PasswordResetDto from './dto/password-reset.dto';
import { renderResetPasswordEmail } from './templates/render';
import { AuthResponse, RegisterResponse, JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
    @InjectRepository(Phone) private readonly phoneRepository: Repository<Phone>,
    @InjectRepository(Student) private readonly studentRepository: Repository<Student>,
    @InjectRepository(TypeUser) private readonly typeUserRepository: Repository<TypeUser>,
    private readonly jwtService: AuthJwtService,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  /**
   * Generic login method used across different roles
   */
  async login(loginDto: LoginDto, allowedRole: ROLE | ROLE[] = ROLE.CLIENT): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const roles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
    if (!user.typeUser || !roles.includes(user.typeUser.role as ROLE)) {
      throw new UnauthorizedException('Você não tem permissão para esta ação');
    }

    return this.generateAuthResponse(user);
  }

  async loginAdmin(loginDto: LoginDto): Promise<AuthResponse> {
    // Allow both ADMIN and SUPERADMIN to use admin portal
    return this.login(loginDto, [ROLE.ADMIN, ROLE.SUPERADMIN]);
  }

  async loginSuperAdmin(loginDto: LoginDto): Promise<AuthResponse> {
    return this.login(loginDto, ROLE.SUPERADMIN);
  }

  private async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
      relations: ['typeUser'],
    });

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return user;
  }

  private async generateAuthResponse(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.typeUser?.role as ROLE,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAccessToken(payload),
      this.jwtService.signRefreshToken(payload),
    ]);

    return {
      message: 'Login realizado com sucesso',
      token: accessToken,
      refreshToken,
      userExists: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.typeUser?.role as ROLE,
      },
    };
  }

  async register(registerDto: RegisterDto, role: ROLE = ROLE.CLIENT): Promise<RegisterResponse> {
    await this.checkExistingUser(registerDto.email, registerDto.cpf);

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const typeUser = await this.findOrCreateRole(role);

    const savedUser = await this.userRepository.save(
      this.userRepository.create({
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        isActive: true,
        typeUser,
      }),
    );

    await this.saveUserDetails(savedUser, registerDto);

    const payload = { id: savedUser.id, email: savedUser.email };
    const accessToken = await this.jwtService.signAccessToken(payload);

    return {
      message: 'Usuário registrado com sucesso',
      accessToken,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: typeUser.role as ROLE,
      },
    };
  }

  async registerAdmin(registerDto: RegisterDto): Promise<RegisterResponse> {
    return this.register(registerDto, ROLE.ADMIN);
  }

  private async checkExistingUser(email: string, cpf: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('E-mail já está em uso');
    }

    const existingStudent = await this.studentRepository.findOne({ where: { cpf } });
    if (existingStudent) {
      throw new BadRequestException('CPF já cadastrado');
    }
  }

  private async findOrCreateRole(role: ROLE): Promise<TypeUser> {
    let typeUser = await this.typeUserRepository.findOne({ where: { role } });
    if (!typeUser) {
      typeUser = await this.typeUserRepository.save({ role });
    }
    return typeUser;
  }

  private async saveUserDetails(user: User, dto: RegisterDto): Promise<void> {
    // Save Student Data
    const student = this.studentRepository.create({
      ...dto,
      birth_date: new Date(dto.birth_date),
      user,
    });
    // Extract non-student fields that might be in dto due to spread but are not in Student entity
    // In a cleaner implementation, Student creation would have its own DTO
    await this.studentRepository.save(student);

    // Save Phone
    if (dto.phones) {
      await this.phoneRepository.save(
        this.phoneRepository.create({ ...dto.phones, user }),
      );
    }

    // Save Address
    if (dto.addresses) {
      await this.addressRepository.save(
        this.addressRepository.create({ ...dto.addresses, user }),
      );
    }
  }

  async requestPasswordReset(passwordResetDto: PasswordResetDto) {
    const user = await this.userRepository.findOne({
      where: { email: passwordResetDto.email },
    });
    if (!user) {
      throw new BadRequestException('E-mail não encontrado');
    }

    const resetToken = await this.jwtService.sign(
      { id: user.id },
      { expiresIn: '15m' },
    );
    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    const { html, text } = await renderResetPasswordEmail(user.name, resetLink);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Recuperação de Senha - PSG Senac',
      html,
      text,
    });

    return { message: 'E-mail de recuperação enviado com sucesso' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = await this.jwtService.verify(token);
      const user = await this.userRepository.findOne({ where: { id: payload.id } });

      if (!user) {
        throw new BadRequestException('Usuário não encontrado');
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await this.userRepository.save(user);

      await this.cacheManager.del(`user_profile:${user.id}`);

      return { message: 'Senha alterada com sucesso' };
    } catch (e) {
      throw new BadRequestException('Token inválido ou expirado');
    }
  }

  async getFullProfile(userId: string) {
    const cacheKey = `user_profile:${userId}`;
    const cachedUser = await this.cacheManager.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['typeUser', 'phones', 'addresses', 'student'],
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const { password, ...userWithoutPassword } = user;
    await this.cacheManager.set(cacheKey, userWithoutPassword, 3600000);

    return userWithoutPassword;
  }

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async getMe(userId: string) {
    return this.getFullProfile(userId);
  }

  async getAdmin(adminId: string) {
    const cacheKey = `admin_profile:${adminId}`;
    const cachedAdmin = await this.cacheManager.get<User>(cacheKey);

    if (cachedAdmin) {
      return cachedAdmin;
    }

    const admin = await this.userRepository.findOne({
      where: { id: adminId },
      relations: ['typeUser'],
    });

    if (!admin) {
      throw new BadRequestException('Admin não encontrado');
    }

    const { password, ...adminWithoutPassword } = admin;
    await this.cacheManager.set(cacheKey, adminWithoutPassword, 3600000);

    return adminWithoutPassword;
  }
}


