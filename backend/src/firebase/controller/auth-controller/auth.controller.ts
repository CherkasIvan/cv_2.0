import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() user: { email: string; password: string }) {
    if (!user.email || !user.password) {
      throw new BadRequestException('Email and password are required');
    }

    try {
      const userAuth = await admin.auth().getUserByEmail(user.email);
      return { uid: userAuth.uid, email: userAuth.email };
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  @Post('guest-login')
  async guestLogin() {
    try {
      const apiKey = process.env.FIREBASE_API_KEY;
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        { returnSecureToken: true },
      );

      const { idToken, localId } = response.data;
      return { uid: localId, token: idToken };
    } catch (error) {
      throw new Error('Guest authentication failed');
    }
  }
}
