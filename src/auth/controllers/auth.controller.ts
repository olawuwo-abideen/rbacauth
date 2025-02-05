import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/signup.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}

@Post('/signup')
@ApiOperation({ summary: 'User signup' })
@ApiBody({ type: SignUpDto, description: 'User sign-up data' })
@ApiResponse({
  status: HttpStatus.CREATED,
  description:
    'User successfully signed up.',
})
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data.' })
signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
return this.authService.signUp(signUpDto);
}


@Post('/login')
@ApiOperation({ summary: 'User login' })
@ApiBody({ type: LoginDto, description: 'User login data' })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'User successfully signed in. Access token generated.',
})
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Invalid credentials.',
})
login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
return this.authService.login(loginDto);
}


}

