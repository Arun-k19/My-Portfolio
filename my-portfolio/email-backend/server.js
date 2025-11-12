import express from "express";
import nodemailer from "nodemailer";
const app = express();
app.use(express.json());

app.post("/send-mail", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourmail@gmail.com",
        pass: "your-app-password",
      },
    });

    await transporter.sendMail({
      from: email,
      to: "yourmail@gmail.com",
      subject: `Message from ${name}`,
      text: message,
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
