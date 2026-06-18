import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import hbs from 'hbs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendEmailOtp = async (to, subject, templateName, templateData) => {
    try {
        // Check env variables are loaded
        console.log("EMAIL_USER:", process.env.EMAIL_USER);
        console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "loaded" : "missing");

        // Check template path
        const templatePath = path.join(__dirname, "../templates", `${templateName}.html`);
        console.log("Template path:", templatePath);
        console.log("Template exists:", fs.existsSync(templatePath));

        const templateSource = fs.readFileSync(templatePath, "utf8");
        const template = hbs.compile(templateSource);
        const html = template(templateData);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Verify transporter connection
        await transporter.verify();
        console.log("SMTP connection verified successfully");

        const mailOptions = {
            from: `"Ag Link" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        console.log("Sending email to:", to);

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);

        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error("Email error:", error.message);  // exact error here
        return { success: false, error: error.message };
    }
};

export default sendEmailOtp;