import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Email already in use' })
  @ApiBody({
    description: 'User registration payload',
    schema: {
      example: {
        username: 'JohnDoe',
        email: 'john.doe@example.com',
        password: 'Password123',
        confirmPassword: 'Password123'
      },
    },
  })
  async signUp(@Body() signupData: SignupDto) {
    return this.authService.signup(signupData);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Log in user' })
  @ApiResponse({ status: 200, description: 'Returns access & refresh tokens' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    description: 'User login credentials',
    schema: {
      example: {
        email: 'john.doe@example.com',
        password: 'Password123',
      },
    },
  })
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiResponse({ status: 200, description: 'Returns new tokens' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiBody({
    description: 'Refresh token payload',
    schema: {
      example: {
        refreshToken: '8a9b7c6d-ef12-4321-aabb-ccddeeff0011',
      },
    },
  })
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Put('change-password')
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password of logged-in user' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized or wrong password' })
  @ApiBody({
    description: 'Change password payload',
    schema: {
      example: {
        oldPassword: 'Password123',
        newPassword: 'NewPass456',
      },
    },
  })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ) {
    return this.authService.changePassword(
      req.userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset email if user exists' })
  @ApiResponse({ status: 200, description: 'Email sent if user exists' })
  @ApiBody({
    description: 'Forgot password request',
    schema: {
      example: {
        email: 'john.doe@example.com',
      },
    },
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Put('reset-password')
  @ApiOperation({ summary: 'Reset password using reset token' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @ApiBody({
    description: 'Reset password payload',
    schema: {
      example: {
        resetToken: 'reset-token-uuid-1234567890',
        newPassword: 'NewPassword456',
      },
    },
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.newPassword,
      resetPasswordDto.resetToken,
    );
  }
}
