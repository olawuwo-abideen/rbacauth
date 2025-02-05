import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ConflictException, BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel;
  let jwtService;

  beforeEach(async () => {
    const mockUserModel = {
      create: jest.fn(),
      findOne: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mockedToken'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should successfully sign up a user and return a token', async () => {
      const signUpDto: SignUpDto = {
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'janedoe@gmail.com',
        password: 'Password123!',
        confirmpassword: 'Password123!',
        role: 'user',
        phonenumber: '+1234567890',
      };

      userModel.create.mockResolvedValue({
        _id: 'mockedUserId',
        ...signUpDto,
        password: 'hashedPassword',
      });

      const result = await authService.signUp(signUpDto);
      expect(result).toHaveProperty('token', 'mockedToken');
      expect(result.user).toMatchObject({
        id: 'mockedUserId',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'janedoe@gmail.com',
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      userModel.create.mockRejectedValue({ code: 11000 });
      const signUpDto: SignUpDto = {
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'janedoe@example.com',
        password: 'Password123--',
        confirmpassword: 'Password123--',
        role: 'admin',
        phonenumber: '+1234567890',
      };

      await expect(authService.signUp(signUpDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should successfully log in a user and return a token', async () => {
      const loginDto: LoginDto = {
        email: 'janedoe@gmail.com',
        password: 'Password123--',
      };

      userModel.findOne.mockResolvedValue({
        _id: 'mockedUserId',
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'janedoe@gmail.com',
        password: await bcrypt.hash('Password123--', 10),
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.login(loginDto);
      expect(result).toHaveProperty('token', 'mockedToken');
      expect(result.user).toMatchObject({
        id: 'mockedUserId',
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'janedoe@gmail.com',
      });
    });

    it('should throw BadRequestException when email is invalid', async () => {
      userModel.findOne.mockResolvedValue(null);
      const loginDto: LoginDto = {
        email: 'janedoe@gmail.com',
        password: 'Password123--',
      };

      await expect(authService.login(loginDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when password is incorrect', async () => {
      userModel.findOne.mockResolvedValue({
        _id: 'mockedUserId',
        email: 'janedoe@gmail.com',
        password: await bcrypt.hash('Password123--', 10),
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const loginDto: LoginDto = {
        email: 'janedoe@gmail.com',
        password: 'Password123--',
      };

      await expect(authService.login(loginDto)).rejects.toThrow(BadRequestException);
    });
  });
});
