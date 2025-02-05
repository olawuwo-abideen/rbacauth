import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { LoginDto } from '../src/auth/dto/login.dto';
import { SignUpDto } from '../src/auth/dto/signup.dto';
import { CreateLogisticDto } from 'src/logistic/dto/logistic.dto';
import { MongooseModule } from '@nestjs/mongoose';

describe('App E2E Tests (Auth & Logistic)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdLogisticId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MongooseModule.forRoot(process.env.MONGO_URI_TEST)],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  
  const testUser: SignUpDto = {
    firstname: 'Jane',
    lastname: 'Doe',
    email: `testuser${Date.now()}@email.com`,
    password: 'Test@1234',
    confirmpassword: 'Test@1234',
    role: 'Admin',
    phonenumber: '+234555555555',
  };

  describe('Auth Module', () => {
    it('should sign up a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testUser.email);
      authToken = res.body.token;
    });

    it('should not sign up with an existing email', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser)
        .expect(409); 
    });

    it('should log in a user', async () => {
      const loginData: LoginDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(res.body).toHaveProperty('token');
      authToken = res.body.token;
    });

    it('should not log in with wrong credentials', async () => {
      const loginData: LoginDto = {
        email: testUser.email,
        password: 'WrongPass@1234',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(400);
    });
  });

  describe('Logistic Module', () => {
    const testLogistic: CreateLogisticDto = {
      itemname: 'Laptop',
      itemprice: 2500,
      itemweight: 5,
      itemquantity: 10,
    };

    it('should create a logistic item', async () => {
      const res = await request(app.getHttpServer())
        .post('/logistic')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testLogistic)
        .expect(201);

      expect(res.body.message).toBe('Logistic created successfully');
      expect(res.body.logistic.itemname).toBe(testLogistic.itemname);
      createdLogisticId = res.body.logistic._id;
    });

    it('should retrieve all logistic items', async () => {
      const res = await request(app.getHttpServer())
        .get('/logistic')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.message).toBe('Logistics retrieved successfully');
      expect(Array.isArray(res.body.logistics)).toBe(true);
    });

    it('should retrieve a logistic item by ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/logistic/${createdLogisticId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.message).toBe('Logistic retrieved successfully');
      expect(res.body.logistic._id).toBe(createdLogisticId);
    });

    it('should update a logistic item by ID', async () => {
      const updatedLogistic = { itemprice: 3000 };

      const res = await request(app.getHttpServer())
        .put(`/logistic/${createdLogisticId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedLogistic)
        .expect(200);

      expect(res.body.message).toBe('Logistic updated successfully');
      expect(res.body.logistic.itemprice).toBe(updatedLogistic.itemprice);
    });

    it('should delete a logistic item by ID', async () => {
      await request(app.getHttpServer())
        .delete(`/logistic/${createdLogisticId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should return 404 for a deleted logistic item', async () => {
      await request(app.getHttpServer())
        .get(`/logistic/${createdLogisticId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
