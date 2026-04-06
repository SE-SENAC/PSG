import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import LoginDto from './dto/login.dto';
import RegisterDto from './dto/register.dto';
import PasswordResetDto from './dto/password-reset.dto';
import { JwtAuthGuard } from './guard/auth.guard';
import { AuthResponse, RegisterResponse } from './auth.types';
import { User } from 'src/user/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-super-admin')
  @ApiOperation({ summary: 'Autenticação de super admin' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido.', type: Object }) // Replace Object with actual type if needed by Swagger
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async loginSuperAdmin(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.loginSuperAdmin(loginDto);
  }

  @Post('register-admin')
  @ApiOperation({ summary: 'Registro de novo administrador' })
  @ApiResponse({ status: 201, description: 'Administrador registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou e-mail já em uso.' })
  async registerAdmin(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.registerAdmin(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Autenticação de usuário' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('login-admin')
  @ApiOperation({ summary: 'Autenticação de admin' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async loginAdmin(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.loginAdmin(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro de novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou e-mail já em uso.' })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile/:id')
  @ApiOperation({ summary: 'Obter perfil completo por ID' })
  @ApiResponse({ status: 200, description: 'Perfil retornado.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async getProfile(@Param('id') id: string): Promise<Partial<User>> {
    return this.authService.getFullProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Obter dados do usuário logado' })
  @ApiResponse({ status: 200, description: 'Dados retornados.' })
  async getMe(@Req() req): Promise<Partial<User>> {
    return this.authService.getMe(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('admin/:id')
  @ApiOperation({ summary: 'Obter dados do admin logado' })
  @ApiResponse({ status: 200, description: 'Dados retornados.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async getAdmin(@Param('id') id: string): Promise<Partial<User>> {
    return this.authService.getAdmin(id);
  }

  @Post('send-reset-password-link')
  @ApiOperation({ summary: 'Solicitar recuperação de senha' })
  @ApiResponse({ status: 200, description: 'E-mail enviado.' })
  async requestPasswordReset(@Body() passwordResetDto: PasswordResetDto) {
    return this.authService.requestPasswordReset(passwordResetDto);
  }

  @Post('password-reset')
  @ApiOperation({ summary: 'Resetar senha com token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        newPassword: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Senha alterada.' })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verificar validade do token' })
  @ApiBody({
    schema: { type: 'object', properties: { token: { type: 'string' } } },
  })
  @ApiResponse({ status: 200, description: 'Token válido.' })
  async verify(@Body('token') token: string) {
    const payload = await this.authService.verifyToken(token);
    return this.authService.getMe(payload.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Logout do sistema' })
  @ApiResponse({ status: 200, description: 'Logout realizado.' })
  logout() {
    return { message: 'Logout realizado com sucesso' };
  }
}
