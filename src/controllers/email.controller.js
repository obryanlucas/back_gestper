const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

async function sendEmailToStudents(req, res) {
  try {
    const students = req.body.students;

    if (!students || students.length === 0) {
      return res.status(400).json({
        message: "Nenhum aluno informado",
      });
    }

    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    console.log(transporter);

    for (const student of students) {
      if (!student.email) continue;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: student.email,
        subject: "Aviso importante",
        text: `Olá ${student.nome}, este é um email automático.`,
      });
    }

    return res.status(200).json({
      message: "Emails enviados com sucesso!",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao enviar emails",
    });
  }
}

module.exports = { sendEmailToStudents };