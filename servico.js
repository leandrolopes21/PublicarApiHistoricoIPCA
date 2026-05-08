import historicoInflacao from "./dados.js";

export const exibeDadosIpca = () => {
    return historicoInflacao;
};

export const exibeDadosPorID = (id) => {
    const dadosId = parseInt(id);
    return historicoInflacao.find(dado => dado.id === dadosId);
};

export const exibeDadosIpcaPorAno = (ano) => {
    const dadosAno = parseInt(ano);
    return historicoInflacao.filter(dado => dado.ano === dadosAno);
};

export const calculaReajustePeriodo = (valor, mesInicial, anoInicial, mesFinal, anoFinal) => {
    const historicoFiltrado = historicoInflacao.filter(dado => {
        if (anoInicial === anoFinal) {
            return dado.ano === anoInicial && dado.mes >= mesInicial && dado.mes <= mesFinal;
        } else {
            return (
                (dado.ano === anoInicial && dado.mes >= mesInicial) ||
                (dado.ano > anoInicial && dado.ano < anoFinal) ||
                (dado.ano === anoFinal && dado.mes <= mesFinal)
            );
        }
    });

    let resultado = valor;
    for (const elemento of historicoFiltrado) {
        resultado *= (1 + (elemento.ipca / 100));
    }

    return resultado.toFixed(2);
};
