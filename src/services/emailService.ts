import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmergencyEmail = async (
  to: string,
  userName: string,
  location: { latitude: number; longitude: number }
) => {
  const googleMapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: '🚨 Emergency Alert: Immediate Assistance Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626; text-align: center;">Emergency Alert</h1>
        <p><strong>${userName}</strong> has triggered an emergency alert!</p>
        <p>Current Location:</p>
        <p><a href="${googleMapsLink}" style="color: #4f46e5;">View on Google Maps</a></p>
        <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #991b1b; margin: 0;">Please take immediate action and contact emergency services if necessary.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send emergency email:', error);
    return false;
  }
};