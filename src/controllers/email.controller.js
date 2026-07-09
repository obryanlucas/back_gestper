const nodemailer = require("nodemailer");

async function sendEmailToStudents(req, res) {
  try {
    const students = req.body.students;

    if (!students || students.length === 0) {
      return res.status(400).json({ message: "Nenhum aluno informado" });
    }

    // Configuração do Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password
      },
    });
    console.log(transporter)

    for (const student of students) {
      if (!student.email) continue;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: student.email,
        subject: "Aviso importante",
        text: `Olá ${student.nome}, este é um email automático.`,
      });
    }

    return res.status(200).json({ message: "Emails enviados com sucesso!" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao enviar emails" });
  }
}

module.exports = { sendEmailToStudents };
