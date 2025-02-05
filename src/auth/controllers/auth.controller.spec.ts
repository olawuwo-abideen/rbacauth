import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn().mockResolvedValue({ token: 'test-token' }),
            login: jest.fn().mockResolvedValue({ token: 'test-token' }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    it('should return a token on successful signup', async () => {
      const signUpDto: SignUpDto = {
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'janedoe@gmail.com',
        password: 'Password123--',
        confirmpassword: 'Password123--',
        role: 'admin',
        phonenumber: '+234555555555',
      };

      const result = await authController.signUp(signUpDto);
      expect(result).toEqual({ token: 'test-token' });
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });

  describe('login', () => {
    it('should return a token on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'janedoe@gmail.com',
        password: 'Password123--',
      };

      const result = await authController.login(loginDto);
      expect(result).toEqual({ token: 'test-token' });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
