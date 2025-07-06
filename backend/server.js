require("dotenv").config()
const express = require("express");
const nodemailer = require("nodemailer")
const cors = require("cors");
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        email: process.env.EMAIL,
        pass: process.env.PASS
    }
});

app.post("/api/contact", async (req, res) => {

    const { name, email, message } = req.body;

    const emailContent = `
        <table style="width: 100%; max-width: 600px; font-family: Arial, sans-serif; border-collapse: collapse; margin: auto; background-color: #ffffff; border: 1px solid #ddd;">
          <tr>
            <td style="background-color: #3B82F6; color: white; padding: 16px; text-align: center;">
              <h2 style="margin: 0;">📬 New Portfolio Message</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p style="background-color: #f4f4f4; padding: 15px; border-radius: 6px; font-style: italic;">
                ${message}
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

    console.log("📨 Email:", process.env.EMAIL ? "EMAIL found ✅" : "EMAIL missing ❌");
    console.log("🔐 Pass:", process.env.PASS ? "PASS found ✅" : "PASS missing ❌");

    try {
        console.log("Sending with:", transporter.options.auth);
        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.EMAIL}>`,
            to: process.env.EMAIL,
            subject: `New message from ${name}`,
            html: emailContent
        });

        res.status(200).json({ message: "Email sent successfully!" });
    } catch (err) {
        console.error("SendMail Error:", err);
        res.status(500).json({ error: "Failed to send email" });
    }
});

app.get("/", (req, res) => {
    res.send(`
    <div style="font-family: 'Segoe UI', sans-serif; padding: 2rem; background-color: #0F2C5F; color: white;">
      <h1 style="font-size: 2.5rem; color: #3B82F6;">🚀 Portfolio Backend API</h1>
      <p>Welcome to the backend service for <strong>FerdHDev's portfolio</strong>.</p>
      
      <hr style="margin: 1.5rem 0; border: 0; border-top: 1px solid #3B82F6;" />

      <h2 style="font-size: 1.5rem;">📫 Contact Endpoint</h2>
      <p>POST your contact form data to:</p>
      <code style="display: inline-block; padding: 0.5rem 1rem; background-color: #1E40AF; border-radius: 5px;">
        (coming soon)
      </code>

      <h3 style="margin-top: 2rem;">📌 Example Payload (JSON)</h3>
      <pre style="background-color: #1E3A8A; padding: 1rem; border-radius: 6px;">
{
  "name": "FerdH Dev",
  "email": "ferdh@example.com",
  "message": "Hello, I'd like to connect!"
}
      </pre>

      <p style="margin-top: 2rem; font-size: 0.9rem; color: #ccc;">
        Proudly powered by Node.js, Express & Nodemailer 💌
      </p>
    </div>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running"))
