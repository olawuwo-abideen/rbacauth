import { Test, TestingModule } from '@nestjs/testing';
import { LogisticController } from './logistic.controller';
import { LogisticService } from '../services/logistic.service';
import { CreateLogisticDto, UpdateLogisticDto } from '../dto/logistic.dto';
import { Logistic } from '../schemas/logistic.schema';

describe('LogisticController', () => {
  let controller: LogisticController;
  let service: LogisticService;

  const mockLogistic: Logistic = {
    id: '1',
    itemname: 'laptop',
    itemprice: 2000000,
    itemweight: 5,
    itemquantity: 5,
  } as Logistic;

  const mockLogisticService = {
    findAll: jest.fn().mockResolvedValue({ message: 'Success', logistics: [mockLogistic] }),
    create: jest.fn().mockResolvedValue({ message: 'Created', logistic: mockLogistic }),
    findById: jest.fn().mockResolvedValue({ message: 'Found', logistic: mockLogistic }),
    updateById: jest.fn().mockResolvedValue({ message: 'Updated', logistic: mockLogistic }),
    deleteById: jest.fn().mockResolvedValue({ message: 'Deleted', deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogisticController],
      providers: [{ provide: LogisticService, useValue: mockLogisticService }],
    }).compile();

    controller = module.get<LogisticController>(LogisticController);
    service = module.get<LogisticService>(LogisticService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllLogistics', () => {
    it('should return all logistics', async () => {
      await expect(controller.getAllLogistics()).resolves.toEqual({
        message: 'Success',
        logistics: [mockLogistic],
      });
    });
  });

  describe('createLogistic', () => {
    it('should create a logistic', async () => {
      const dto: CreateLogisticDto = {
        itemname: 'phone',
        itemprice: 2000000,
        itemweight: 5,
        itemquantity: 5,
      };
      await expect(controller.createLogistic(dto)).resolves.toEqual({
        message: 'Created',
        logistic: mockLogistic,
      });
    });
  });

  describe('getLogistic', () => {
    it('should return a logistic by ID', async () => {
      await expect(controller.getLogistic('1')).resolves.toEqual({
        message: 'Found',
        logistic: mockLogistic,
      });
    });
  });

  describe('updateLogistic', () => {
    it('should update a logistic by ID', async () => {
      const dto: UpdateLogisticDto = {
        itemname: 'updated phone',
        itemprice: 2500000,
        itemweight: 6,
        itemquantity: 10,
      };
      await expect(controller.updateLogistic('1', dto)).resolves.toEqual({
        message: 'Updated',
        logistic: mockLogistic,
      });
    });
  });

  describe('deleteLogistic', () => {
    it('should delete a logistic by ID', async () => {
      await expect(controller.deleteLogistic('1')).resolves.toEqual({
        message: 'Deleted',
        deleted: true,
      });
    });
  });
});
