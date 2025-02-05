import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LogisticService } from '../services/logistic.service';
import { Logistic } from '../schemas/logistic.schema';
import {  NotFoundException } from '@nestjs/common';
import * as mongoose from 'mongoose';

const mockLogistic = {
  _id: new mongoose.Types.ObjectId().toString(),
  itemname: 'Laptop',
  itemprice: 2000,
  itemweight: 5,
  itemquantity: 2,
};

const mockLogisticModel = {
  find: jest.fn().mockResolvedValue([mockLogistic]),
  create: jest.fn().mockResolvedValue(mockLogistic),
  findById: jest.fn().mockImplementation((id) => {
    return id === mockLogistic._id ? Promise.resolve(mockLogistic) : Promise.resolve(null);
  }),
  findByIdAndUpdate: jest.fn().mockImplementation((id, logistic) => {
    return id === mockLogistic._id ? Promise.resolve({ ...mockLogistic, ...logistic }) : null;
  }),
  findByIdAndDelete: jest.fn().mockImplementation((id) => {
    return id === mockLogistic._id ? Promise.resolve(mockLogistic) : null;
  }),
};

describe('LogisticService', () => {
  let service: LogisticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogisticService,
        { provide: getModelToken(Logistic.name), useValue: mockLogisticModel },
      ],
    }).compile();

    service = module.get<LogisticService>(LogisticService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve all logistics', async () => {
    const result = await service.findAll();
    expect(result).toEqual({ message: 'Logistics retrieved successfully', logistics: [mockLogistic] });
  });

  it('should create a logistic entry', async () => {
    const result = await service.create(mockLogistic as Logistic);
    expect(result).toEqual({ message: 'Logistic created successfully', logistic: mockLogistic });
  });

  it('should retrieve a logistic by ID', async () => {
    const result = await service.findById(mockLogistic._id);
    expect(result).toEqual({ message: 'Logistic retrieved successfully', logistic: mockLogistic });
  });

  it('should throw NotFoundException if logistic not found by ID', async () => {
    await expect(service.findById(new mongoose.Types.ObjectId().toString())).rejects.toThrow(NotFoundException);
  });

  it('should update a logistic by ID', async () => {
    const updatedLogistic = { itemname: 'Updated Laptop' };
    const result = await service.updateById(mockLogistic._id, updatedLogistic as Logistic);
    expect(result).toEqual({ message: 'Logistic updated successfully', logistic: { ...mockLogistic, ...updatedLogistic } });
  });

  it('should throw NotFoundException when updating non-existing logistic', async () => {
    await expect(service.updateById(new mongoose.Types.ObjectId().toString(), mockLogistic as Logistic)).rejects.toThrow(NotFoundException);
  });

  it('should delete a logistic by ID', async () => {
    const result = await service.deleteById(mockLogistic._id);
    expect(result).toEqual({ message: 'Logistic deleted successfully', deleted: true });
  });

  it('should throw NotFoundException when deleting non-existing logistic', async () => {
    await expect(service.deleteById(new mongoose.Types.ObjectId().toString())).rejects.toThrow(NotFoundException);
  });
});
