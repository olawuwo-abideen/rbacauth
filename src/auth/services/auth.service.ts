import {
    BadRequestException,
    ConflictException,
    Injectable
    } from '@nestjs/common';
    import { InjectModel } from '@nestjs/mongoose';
    import { Model } from 'mongoose';
    import { User } from '../schemas/user.schema';
    import * as bcrypt from 'bcryptjs';
    import { JwtService } from '@nestjs/jwt';
    import { SignUpDto } from '../dto/signup.dto';
    import { LoginDto } from '../dto/login.dto';
    
    @Injectable()
    export class AuthService {
    logger: any;
    constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private UserModel: Model<User>,
    ) {}
    
    async signUp(signUpDto: SignUpDto): Promise<{ message: string; token: string; user: any }> {
      const { firstname, lastname, email, password, confirmpassword, role, phonenumber } = signUpDto;
    
      // Check if email or phone number already exists
      const existingUser = await this.UserModel.findOne({ 
        $or: [{ email }, { phonenumber }] 
      });
    
      if (existingUser) {
        if (existingUser.email === email) {
          throw new ConflictException('Email already exists. Please log in.');
        }
        if (existingUser.phonenumber === phonenumber) {
          throw new ConflictException('Phone number already exists. Please use a different number.');
        }
      }
    
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
    
      // Create the user
      const user = await this.UserModel.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        confirmpassword,
        role,
        phonenumber,
      });
    
      // Generate JWT token
      const token = this.jwtService.sign({ id: user._id });
    
      return {
        message: 'User signed up successfully',
        token,
        user: {
          id: user._id,
          firstName: user.firstname,
          lastName: user.lastname,
          email: user.email,
          role: user.role,
          phonenumber: user.phonenumber,
        },
      };
    }
    
    
    async login(loginDto: LoginDto): Promise<{ message:string; token: string; user: any }> {
    const { email, password } = loginDto;
    
    
    const user = await this.UserModel.findOne({ email });
    
    if (!user) {
    throw new BadRequestException('Invalid email or password');
    }
    
    
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatched) {
    throw new BadRequestException('Invalid email or password');
    }
    
    
    const token = this.jwtService.sign({ id: user._id });
    
    
    return {
    message:"User login sucessfully",
    token,
    user: {
    id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    phonenumber: user.phonenumber,
    },
    };
    }
    
      }
    
    
    