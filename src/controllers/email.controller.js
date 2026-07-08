const nodemailer = require("nodemailer");

async function sendEmailToStudents(req, res) {
  try {
    const students = req.body.students;

    if (!students || students.length === 0) {
      return res.status(400).json({
        message: "Nenhum aluno informado"
      });
    }

    // Configuração do Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    console.log(transporter);

    for (const student of students) {
      if (!student.email) continue;

      await transporter.sendMail({
        from: `"Gestper" <${process.env.EMAIL_USER}>`,
        to: student.email,
        subject: "📢 Aviso Importante - Controle de Frequência",

        text: `Olá, ${student.nome}!

Esperamos que você esteja bem.

O sistema Gestper identificou, durante a análise das planilhas acadêmicas, que você possui um ou mais registros de ausência que merecem sua atenção.

Este comunicado tem como objetivo mantê-lo informado sobre sua situação de frequência para que você possa acompanhar seu desempenho acadêmico e evitar possíveis prejuízos ao longo do período letivo.

==================================================

O QUE VOCÊ DEVE FAZER?

✔ Consulte sua frequência com o professor responsável.

✔ Verifique se existe alguma falta que possa ser justificada.

✔ Caso identifique qualquer inconsistência, procure a coordenação pedagógica da instituição.

✔ Continue acompanhando regularmente sua frequência e seu rendimento escolar.

==================================================

IMPORTANTE

Este aviso possui caráter informativo e foi gerado automaticamente após a importação e processamento das planilhas acadêmicas pelo sistema Gestper.

Caso sua situação já tenha sido regularizada ou exista alguma justificativa pendente de análise, desconsidere este comunicado.

==================================================

Data do envio: ${new Date().toLocaleDateString("pt-BR")}
Horário do envio: ${new Date().toLocaleTimeString("pt-BR")}

Atenciosamente,

Equipe Gestper
Sistema Inteligente de Gestão Escolar

Este é um e-mail automático. Não é necessário respondê-lo.

© ${new Date().getFullYear()} Gestper - Todos os direitos reservados.
`
      });
    }

    return res.status(200).json({
      message: "Emails enviados com sucesso!"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao enviar emails"
    });
  }
}

module.exports = {
  sendEmailToStudents
};
