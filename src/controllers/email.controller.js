const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

function makeEmailBody(to, from, subject, text) {
  const message = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    text,
  ].join("\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sendEmailToStudents(req, res) {
  try {
    const students = req.body.students;

    if (!students || students.length === 0) {
      return res.status(400).json({ message: "Nenhum aluno informado" });
    }

    const erros = [];

    for (const student of students) {
      if (!student.email) continue;

      try {
        const raw = makeEmailBody(
          student.email,
          process.env.EMAIL_USER,
          "Aviso importante",
          `Olá ${student.nome}, este é um email automático.`
        );

        await gmail.users.messages.send({
          userId: "me",
          requestBody: { raw },
        });

        console.log(`✅ Email enviado: ${student.email}`);
      } catch (err) {
        console.error(`❌ Falha: ${student.email} →`, err.message);
        erros.push(student.email);
      }
    }

    if (erros.length > 0) {
      return res.status(207).json({ message: "Alguns emails falharam", falhas: erros });
    }

    return res.status(200).json({ message: "Emails enviados com sucesso!" });

  } catch (error) {
    console.error("Erro geral:", error.message);
    return res.status(500).json({ message: "Erro ao enviar emails", erro: error.message });
  }
}

module.exports = { sendEmailToStudents };
