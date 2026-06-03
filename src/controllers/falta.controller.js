const xlsx = require('xlsx');
const fs = require('fs');
const faltasModel = require('../models/faltas.model');

exports.importarFaltas = async (req, res) => {
  try {
    const arquivoFaltas = req.files['faltas'][0];
    const arquivoBase = req.files['base'][0];

    // ===============================
    // LER PLANILHASs
    // ===============================

    const workbookFaltas = xlsx.readFile(arquivoFaltas.path);
    const sheetFaltas =
      workbookFaltas.Sheets[workbookFaltas.SheetNames[0]];
    const dadosFaltas = xlsx.utils.sheet_to_json(sheetFaltas);

    const workbookBase = xlsx.readFile(arquivoBase.path);
    const sheetBase =
      workbookBase.Sheets[workbookBase.SheetNames[0]];
    const dadosBase = xlsx.utils.sheet_to_json(sheetBase);

    // ===============================
    // FILTRAR
    // ===============================

    const alunosComFalta = dadosFaltas.filter(
      aluno => Number(aluno.TT_FALTAS) >= 2
    );

    let inseridos = 0;

    // 👇 NOVO: array para guardar os dados inseridos
    const alunosSalvos = [];

    // ===============================
    // PROCESSAR
    // ===============================

    for (const aluno of alunosComFalta) {
      const contato = dadosBase.find(
        item => String(item['RA ALUNO']) === String(aluno.RA)
      );

      if (contato) {
        const dadosAluno = {
          nome: aluno.NOME,
          ra: aluno.RA,
          email: contato['E-MAIL'] || '',
          telefone1: contato['TELEFONE 1'] || '',
          telefone2: contato['TELEFONE ALUNO 2'] || '',
          telefoneResponsavel:
            contato['TELEFONE 1 RESPONSAVEL ACADEMICO'] || ''
        };

        // 👇 AGORA CAPTURA O RETORNO DO MODEL
        const alunoInserido = await faltasModel.salvarAluno(dadosAluno);

        alunosSalvos.push(alunoInserido);
        inseridos++;
      }
    }

    // ===============================
    // LIMPAR ARQUIVOS
    // ===============================

    fs.unlinkSync(arquivoFaltas.path);
    fs.unlinkSync(arquivoBase.path);

    // ===============================
    // RESPOSTA
    // ===============================

    res.json({
      sucesso: true,
      total: inseridos,
      dados: alunosSalvos
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      sucesso: false,
      erro: error.message
    });
  }
};