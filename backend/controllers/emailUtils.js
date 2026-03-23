import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Brevo SMTP (requires verified sender)
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.BREVO_API_KEY
  }
});

// Log config for debug
console.log('Email from:', process.env.FROM_EMAIL);
console.log('Using NODE_ENV:', process.env.NODE_ENV);

export const sendVerificationEmail = async (email, code, fullName) => {
  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Emeza konti yawe ya AmataLink / Verify Your AmataLink Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <!-- Kinyarwanda -->
        <h2>Murakaza neza kuri AmataLink, ${fullName}!</h2>
        <p>Konti yawe yafunguwe neza. Kugira ngo wemeze ko iyi imeri ari iyawe, koresha iyi mibare y'ibanga:</p>
        
        <div style="background: #10b981; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 4px; margin: 20px 0;">
          ${code}
        </div>
        
        <p>Iyi mibare irata agaciro mu minota 15.</p>
        <p>Yinjize mu rubuga kugira ngo wuzuze igikorwa cyo kwiyandikisha.</p>

        <hr style="border: none; border-top: 2px dashed #eee; margin: 30px 0;">

        <!-- English -->
        <h2>Welcome to AmataLink, ${fullName}!</h2>
        <p>Your account has been created. Please verify your account using the code below. The code is the same as above.</p>
        <p>This code expires in 15 minutes. Enter it in the app to complete your signup.</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p>Murakoze / Best regards,<br><strong>AmataLink Team</strong></p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to', email);
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

export default { sendVerificationEmail };
