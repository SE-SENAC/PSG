import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from './entities/configuration.entity';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
  ) {}

  async findByKey(key: string) {
    const config = await this.configurationRepository.findOne({ where: { key } });
    if (!config) {
      // Create a default if not found
      return this.upsert(key, 'Lorem ipsum dolor sit amet...');
    }
    return config;
  }

  async getAllPolicies() {
    const privacy = await this.findByKey('privacy_policy');
    const cookie = await this.findByKey('cookie_policy');
    return {
      privacy_policy: {
        text: privacy.value,
        updatedAt: privacy.updatedAt
      },
      cookie_policy: {
        text: cookie.value,
        updatedAt: cookie.updatedAt
      }
    };
  }

  async upsert(key: string, value: string) {
    let config = await this.configurationRepository.findOne({ where: { key } });
    if (config) {
      config.value = value;
    } else {
      config = this.configurationRepository.create({ key, value });
    }
    return this.configurationRepository.save(config);
  }
}
