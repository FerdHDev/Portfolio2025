require("dotenv").config()
const express = require("express");
const nodemailer = require("nodemailer")
const cors = require("cors");
const app = express()

app.use(express.json())

app.use(cors());

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        email: process.env.EMAIL,
        pass: process.env.PASS
    }
});

app.post("/api/contact", async (req, res) => {
    const { userName, userEmail, userMessage } = req.body;

    const emailContent = `
    <table style="width: 100%; max-width: 600px; font-family: Arial, sans-serif; border-collapse: collapse; margin: auto; background-color: #ffffff; border: 1px solid #ddd;">
      <tr>
        <td style="background-color: #3B82F6; color: white; padding: 16px; text-align: center;">
          <h2 style="margin: 0;">📬 New Portfolio Message</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: #f4f4f4; padding: 15px; border-radius: 6px; font-style: italic;">
            ${userMessage}
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px; background-color: #f9f9f9; text-align: center; font-size: 0.9rem; color: #555;">
          <p>Sent from your portfolio contact form</p>
        </td>
      </tr>
    </table>
  `;

    try {
        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.EMAIL}>`,
            to: process.env.EMAIL,
            subject: `New message from ${userName}`,
            html: emailContent
        });

        res.status(200).json({ message: "Email sent successfully!" });
    } catch (err) {
        console.error("SendMail Error:", err);
        res.status(500).json({ error: "Failed to send email" });
    }
});


app.listen(process.env.PORT, () => console.log("Server running"))
