import { calculaReajustePeriodo, exibeDadosIpca, exibeDadosIpcaPorAno, exibeDadosPorID } from './servico.js';
import express from 'express';
const app = express();

// 1ª Rota, mostra todos os dados entre 01/2015 e 12/2023
// 2ª Rota, filtra por ano específico
app.get('/historicoIPCA', (req, res) => {
    const dadosIpca = req.query.dados;
    const dadosIpcaAno = req.query.ano;

    if (dadosIpcaAno) {
        const ano = parseInt(dadosIpcaAno);
        if (isNaN(ano)) {
            res.status(400).send({"erro": "Requisição inválida!"});
        } else if (ano < 2015 || ano > 2023) {
            res.status(404).send({"erro": "Ano não encontrado"});
        } else {
            const retornaDadosIpcaPorAno = exibeDadosIpcaPorAno(ano);

            if (retornaDadosIpcaPorAno.length > 0) {
                res.json(retornaDadosIpcaPorAno);
            }
        }
    } else {
        const retornaDados = exibeDadosIpca();
        res.json(retornaDados);
    }
});

// 3ª Rota, calcular valores da coleção de dados ipca
app.get('/historicoIPCA/calculo', (req, res) => {
    const valor = parseFloat(req.query.valor);
    const mesInicial = parseInt(req.query.mesInicial);
    const anoInicial = parseInt(req.query.anoInicial);
    const mesFinal = parseInt(req.query.mesFinal);
    const anoFinal = parseInt(req.query.anoFinal);

    if (isNaN(valor) || isNaN(mesInicial) || isNaN(anoInicial) || isNaN(mesFinal) || isNaN(anoFinal) ||
        mesInicial < 1 || mesInicial > 12 || mesFinal < 1 || mesFinal > 12 ||
        anoInicial < 2015 || anoFinal > 2023 || (anoInicial > anoFinal) ||
        (anoInicial === anoFinal && mesInicial > mesFinal)) {
        res.status(400).send({"erro": "Parâmetros inválidos ou fora do intervalo (2015-2023"});
    } else {
        const resultado = calculaReajustePeriodo(valor, mesInicial, anoInicial, mesFinal, anoFinal);
        res.json({"resultado": resultado});
    }
});

// 4ª Rota, busca os dados através do seu id
app.get('/historicoIPCA/:id', (req, res) => {
    const dadosIpcaID = req.params.id;

    if (isNaN(parseInt(dadosIpcaID))) {
        res.status(400).send({"erro": "Requisição inválida!"});
    } else {
        const retornaDadosIpcaID = exibeDadosPorID(dadosIpcaID);

        if (retornaDadosIpcaID) {
            res.json(retornaDadosIpcaID);
        } else {
            res.status(404).send({"erro": "ID não encontrada"});
        }
    }
});

app.listen(8080, () => {
    let data = new Date();
    console.log(`Servidor iniciado em ${data.toLocaleDateString()} ${data.toLocaleTimeString()}`);
});