import { Test, TestingModule } from '@nestjs/testing';
import { TypeUserController } from './type-user.controller';
import { TypeUserService } from './type-user.service';

describe('TypeUserController', () => {
  let controller: TypeUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeUserController],
      providers: [TypeUserService],
    }).compile();

    controller = module.get<TypeUserController>(TypeUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
