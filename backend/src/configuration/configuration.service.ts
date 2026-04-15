import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from './entities/configuration.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findByKey(key: string) {
    const config = await this.configurationRepository.findOne({
      where: { key },
    });
    if (!config) {
      // Create a default if not found
      return this.upsert(key, 'Lorem ipsum dolor sit amet...');
    }
    return config;
  }

  async getAllPolicies() {
    const cacheKey = 'policies';
    const cachedPolicies = await this.cacheManager.get(cacheKey);
    if (cachedPolicies) {
      return cachedPolicies;
    }

    const privacy = await this.findByKey('privacy_policy');
    const cookie = await this.findByKey('cookie_policy');
    const policies = {
      privacy_policy: {
        text: privacy.value,
        updatedAt: privacy.updatedAt,
      },
      cookie_policy: {
        text: cookie.value,
        updatedAt: cookie.updatedAt,
      },
    };

    await this.cacheManager.set(cacheKey, policies, 600000); // Cache for 10 minutes
    return policies;
  }

  async upsert(key: string, value: string) {
    let config = await this.configurationRepository.findOne({ where: { key } });
    if (config) {
      config.value = value;
    } else {
      config = this.configurationRepository.create({ key, value });
    }
    const savedConfig = await this.configurationRepository.save(config);

    // Invalidate cache when policies are updated
    if (key === 'privacy_policy' || key === 'cookie_policy') {
      await this.cacheManager.del('policies');
    }

    return savedConfig;
  }

  async getEnrollmentRules() {
    const maxCourses = await this.findByKey('psg_max_courses');
    const allowSameShift = await this.findByKey('psg_allow_same_shift');

    return {
      psg_max_courses: parseInt(maxCourses.value) || 2,
      psg_allow_same_shift: allowSameShift.value === 'true',
    };
  }
}
