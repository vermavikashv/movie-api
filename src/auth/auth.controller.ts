import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signIn(@Body() dto: LoginDto) {
    return this.authService.signIn(dto.username, dto.password);
  }

  @Post('signout')
  signOut() {
    return this.authService.signOut();
  }
}
