import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

async function bootstrap() {
const app = await NestFactory.create(AppModule);

app.use(cors())
app.use(helmet());
app.use(compression());
app.use(cookieParser());
const config = new DocumentBuilder()
.setTitle('Median')
.setDescription('Role-Based Access Control API description')
.setVersion('0.1')
.build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

await app.listen(3000);
}
bootstrap();  