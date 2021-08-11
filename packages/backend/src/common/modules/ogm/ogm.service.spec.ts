import { Test, TestingModule } from '@nestjs/testing';
import { OgmService } from './ogm.service';

describe('OgmService', () => {
  let service: OgmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OgmService],
    }).compile();

    service = module.get<OgmService>(OgmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
