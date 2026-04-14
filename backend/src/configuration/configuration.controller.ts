import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get('policies')
  @ApiOperation({ summary: 'Obter políticas de privacidade e cookies' })
  async getPolicies() {
    return this.configurationService.getAllPolicies();
  }

  @Post('upsert')
  @ApiOperation({ summary: 'Atualizar configuração (Apenas Super Admin)' })
  // @UseGuards(SuperAdminGuard) // Assuming you have an AuthGuard
  async upsert(@Body() data: { key: string; value: string }) {
    return this.configurationService.upsert(data.key, data.value);
  }
}
