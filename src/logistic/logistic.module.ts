import { Module } from '@nestjs/common';
import { LogisticController } from './controllers/logistic.controller';
import { LogisticService } from './services/logistic.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { LogisticSchema } from './schemas/logistic.schema';


@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Logistic', schema: LogisticSchema }]),
  ],
  controllers: [LogisticController],
  providers: [LogisticService],
})
export class LogisticModule {}
