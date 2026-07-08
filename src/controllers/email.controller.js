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
        subject: "⚠️ Aviso de Frequência - Ação Necessária",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="background-color: #d32f2f; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Aviso de Frequência</h1>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">Olá, <strong>${student.nome}</strong>,</p>
                <p style="font-size: 15px; color: #555; line-height: 1.6;">
                  Identificamos que você possui <strong>faltas registradas</strong> em suas atividades acadêmicas recentes.
                </p>
                <p style="font-size: 15px; color: #555; line-height: 1.6;">
                  A frequência é essencial para o seu aproveitamento e aprovação. Pedimos que regularize sua situação o quanto antes e, caso tenha justificativas, entre em contato com a coordenação.
                </p>
                <div style="background-color: #fff3f3; border-left: 4px solid #d32f2f; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; font-size: 14px; color: #b71c1c;">
                    ⚠️ Faltas recorrentes podem impactar sua situação acadêmica.
                  </p>
                </div>
                <p style="font-size: 15px; color: #555;">Contamos com sua atenção e comprometimento.</p>
                <p style="font-size: 15px; color: #555; margin-top: 25px;">Atenciosamente,<br><strong>Equipe Acadêmica</strong></p>
              </div>
              <div style="background-color: #f0f0f0; padding: 15px; text-align: center;">
                <p style="font-size: 12px; color: #999; margin: 0;">Este é um e-mail automático, por favor não responda.</p>
              </div>
            </div>
          </div>
        `,   
      });
    }

    return res.status(200).json({ message: "Emails enviados com sucesso!" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao enviar emails" });
  }
}

module.exports = { sendEmailToStudents };
