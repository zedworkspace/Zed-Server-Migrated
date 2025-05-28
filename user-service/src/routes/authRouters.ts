import express, { Router } from 'express';
import { accessTokenGenerator, emailRegister, emailSignIn, githubAuth, googleAuth, resetPassword, sendOtp, sendResetOtp } from '../controllers/authControllers';

const authRouter :Router = express.Router();

authRouter.post('/otp-request',sendOtp);
authRouter.post('/register',emailRegister);
authRouter.post('/signin',emailSignIn);
authRouter.post('/get-access-token',accessTokenGenerator);
authRouter.post('/reset-otp-request',sendResetOtp);
authRouter.post('/reset-password',resetPassword);
authRouter.post('/auth/google',googleAuth);
authRouter.post('/auth/github/callback',githubAuth);

export default authRouter;