import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465,
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  // If you want to restrict signup later, set disableSignUp: true
  plugins: [
    emailOTP({
      // overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        const subject =
          type === "sign-in"
            ? "Your sign-in OTP"
            : type === "email-verification"
            ? "Verify your email"
            : "Reset password OTP";
        const text = `Your OTP is ${otp}. It will expire in 5 minutes.`;
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: email,
          subject,
          text,
        });
      },
      // otpLength: 6,
      // expiresIn: 300,
      // allowedAttempts: 3,
    }),
  ],
});


