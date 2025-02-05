import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import * as mongoose from 'mongoose';
  import { Logistic } from '../schemas/logistic.schema';
 
  @Injectable()
  export class LogisticService {
    constructor(
      @InjectModel(Logistic.name)
      private logisticModel: mongoose.Model<Logistic>,
    ) {}
  
    async findAll(): Promise<{ message: string; logistics: Logistic[] }> {
      const logistics = await this.logisticModel.find();
      return { message: 'Logistics retrieved successfully', logistics };
    }
    
  
    async create(logistic: Logistic): Promise<{ message: string; logistic: Logistic }> {
      const data = Object.assign(logistic);
    
      const res = await this.logisticModel.create(data);
      
      return {
        message: 'Logistic created successfully',
        logistic: res,
      };
    }
  
    async findById(id: string): Promise<{ message: string; logistic: Logistic }> {
      const isValidId = mongoose.isValidObjectId(id);
      if (!isValidId) {
        throw new BadRequestException('Please enter a valid ID.');
      }
    
      const logistic = await this.logisticModel.findById(id);
      if (!logistic) {
        throw new NotFoundException('Logistic not found.');
      }
    
      return { message: 'Logistic retrieved successfully', logistic };
    }
    
    async updateById(id: string, logistic: Logistic): Promise<{ message: string; logistic: Logistic }> {
      const updatedLogistic = await this.logisticModel.findByIdAndUpdate(id, logistic, {
        new: true,
        runValidators: true,
      });
    
      if (!updatedLogistic) {
        throw new NotFoundException('Logistic not found.');
      }
    
      return { message: 'Logistic updated successfully', logistic: updatedLogistic };
    }
    
    async deleteById(id: string): Promise<{ message: string; deleted: boolean }> {
      const deletedLogistic = await this.logisticModel.findByIdAndDelete(id);
      if (!deletedLogistic) {
        throw new NotFoundException('Logistic not found.');
      }
    
      return { message: 'Logistic deleted successfully', deleted: true };
    }
    
  

  }
  