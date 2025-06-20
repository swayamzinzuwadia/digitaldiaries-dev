import { VercelRequest, VercelResponse } from "@vercel/node";
import * as SibApiV3Sdk from "@sendinblue/client";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      userEmail,
      userName,
      screenTitle,
      date,
      slot,
      location,
      package: packageType,
      price,
    } = req.body;

    // Validate required fields
    if (
      !userEmail ||
      !userName ||
      !screenTitle ||
      !date ||
      !slot ||
      !location ||
      !packageType ||
      !price
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        required: [
          "userEmail",
          "userName",
          "screenTitle",
          "date",
          "slot",
          "location",
          "package",
          "price",
        ],
      });
    }

    // Initialize Brevo API
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!
    );

    // Create email content
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = `Booking Confirmation - ${screenTitle}`;
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #F75590, #e04477); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .highlight { color: #F75590; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 Booking Confirmed!</h1>
            <p>Your romantic movie experience is all set</p>
          </div>
          <div class="content">
            <p>Dear <strong>${userName}</strong>,</p>
            <p>Thank you for choosing Digital Diaries for your romantic movie experience! Your booking has been confirmed and we're excited to create a magical moment for you.</p>
            
            <div class="booking-details">
              <h3>📋 Booking Details</h3>
              <div class="detail-row">
                <span class="detail-label">Experience:</span>
                <span class="detail-value highlight">${screenTitle}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${location}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${new Date(date).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${slot}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Package:</span>
                <span class="detail-value">${
                  packageType.charAt(0).toUpperCase() + packageType.slice(1)
                }</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value highlight">₹${price}</span>
              </div>
            </div>
            
            <p><strong>What to expect:</strong></p>
            <ul>
              <li>Arrive 15 minutes before your scheduled time</li>
              <li>Bring your own movie or choose from our collection</li>
              <li>Complimentary refreshments included</li>
              <li>Professional setup and assistance throughout</li>
            </ul>
            
            <p>If you have any questions or need to make changes to your booking, please don't hesitate to contact us.</p>
            
            <p>We look forward to creating a memorable experience for you! 💕</p>
            
            <div class="footer">
              <p>Best regards,<br>The Digital Diaries Team</p>
              <p>📧 support@digitaldiaries.com<br>📞 +91 98765 43210</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    sendSmtpEmail.sender = {
      name: "Digital Diaries",
      email: "noreply@digitaldiaries.com",
    };
    sendSmtpEmail.to = [{ email: userEmail, name: userName }];

    // Send the email
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    return res.status(200).json({
      success: true,
      messageId: result.messageId,
      message: "Confirmation email sent successfully",
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return res.status(500).json({
      error: "Failed to send confirmation email",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
