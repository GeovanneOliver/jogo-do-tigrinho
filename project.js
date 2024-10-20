// 1. Depositar dinheiro
// 2. Escolher a quantidade de linhas da aposta
// 3. Quanto o usuário vai postar
// 4. Girar a roleta
// 5. Verifica se o usuário ganhou
// 6. Entregar o dinheiro ao vencedor
// 7. Jogar denovo

const prompt = require("prompt-sync")();

const LINHAS = 3;
const COLUNAS = 3;

const QTDE_FIGURAS = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
}

const VALOR_FIGURAS = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}

const depositar = () =>{//O usuário digita o saldo para a casa de aposta
    while(true){
    const qtdeDepositada = prompt("Digite o valor depositado: ");
    const qtdeDepositadaNumero = parseFloat(qtdeDepositada);

    if(isNaN(qtdeDepositadaNumero) || qtdeDepositadaNumero <= 0){
        console.log("Valor invaliddo, tente novamente!");
        }else{
            return qtdeDepositadaNumero;
        }
    }
};

const qtdeLinhasAposta = () =>{//o usuário insere a quantidade de linhas para apostar, deve ser entre 1 e 3
    while(true){
        const qtdeLinhas = prompt("Digite a quantidade de linhas para apostar(1-3): ");
        const qtdeLinhasAposta = parseFloat(qtdeLinhas);
    
        if(isNaN(qtdeLinhasAposta) || qtdeLinhasAposta <= 0 || qtdeLinhasAposta > 3){
            console.log("Valor invaliddo, tente novamente!");
            }else{
                return qtdeLinhasAposta;
            }
        }
}

const valorBet = (saldo, linhas) =>{// usuário incluir o valor da aposta, lembrando que deve ser multiplicado pela quantidade de linhas, pois cada linha é uma aposta
    while(true){
        const aposta = prompt("Digite o valor desejado para apostar POR LINHA: ");
        const valorAposta = parseFloat(aposta);
    
        if(isNaN(valorAposta) || valorAposta <= 0 || valorAposta > saldo / linhas){
            console.log("Valor invaliddo, tente novamente!");
            }else{
                return valorAposta;
            }
        }
}

const girarRoleta = () =>{
    const figuras = [];
    for (const [figura, count] of Object.entries(QTDE_FIGURAS)){//loop para cada figura e sua quantidade
        for (let i = 0; i < count; i++){//será inserido no array criado antes
            figuras.push(figura);
            //o array terá resultado sememlhante a isso [A, A, B, B, B, B]
        }  
    }
    //reels significa carretel, é referente a coluna da roleta, não consegui pensar em uma tradução melhor
    const reels = [];
    for(let i = 0; i < COLUNAS; i++){// Para gerar a coluna
        reels.push([]);
        const reelsFigura = [...figuras];//aqui estou copiando o primeiro array no topo da função
        // eu preciso duplicar esse array porque preciso remover ele para a primeira coluna para não duplicar, porém ainda preciso para a próxima
        for (let j = 0; j < LINHAS; j++){
            const randomIndex = Math.floor(Math.random() * reelsFigura.length);
            const figuraSelecionada = reelsFigura[randomIndex];
            reels[i].push(figuraSelecionada);
            reelsFigura.splice(randomIndex, 1);
        }
    }
    return reels;
};

/*
Essa função transpose é para facilitar a validação se o usuário ganhou ou não
resumindo, estou pegando o index 0 nos 3 arrays e transformando em uma array separada
Exemplo: Usando o array gerado abaixo
[ [ 'C', 'D', 'B' ], [ 'A', 'D', 'C' ], [ 'B', 'C', 'D' ] ]
vou criar um novo com usando o index 0 = [C, A, B], index 1 = [D, D, C], index 2 = [B, C, D]
*/
const transpose = (reels) =>{
    const linhas = [];
    for (let i = 0; i < LINHAS; i++){
        linhas.push([]);
        for (let j = 0; j < COLUNAS; j++){
            linhas[i].push(reels[j][i]);
        }
    }

    return linhas;
}

const mostrarLinhas = (linhas) => {
    for (const linha of linhas){
        let linhaString = "";
        for(const [i, figura] of linha.entries()){
            linhaString += figura
            if (i != linha.length - 1){
                linhaString += " | "
            }
        }
        console.log(linhaString);   
    }
};

const verificaGanhos = (linhas, bet, qtdeLinhas) => {
    let ganho = 0;

    for (let linha = 0; linha < qtdeLinhas; linha++){
        const figuras = linhas[linha];
        let figurasIguais = true;

        for (const figura of figuras){//aqui eu rodo todas as figuras
            if(figura != figuras[0]){//comparo se o a figura que estou agora é igual a primeira, caso não for significa que não ganhou
                figurasIguais = false;
                break;
            }
        }

        if (figurasIguais){
            ganho += bet * VALOR_FIGURAS[figuras[0]]
        }

    }
    return ganho;
}

const jogo = () => {
    let saldo = depositar();

    while (true){
        console.log(`Você possui um saldo de R$${saldo}`);       
        const numeroLinhas = qtdeLinhasAposta();
        const bet = valorBet(saldo, numeroLinhas);
        saldo -= bet * numeroLinhas;

        const reels = girarRoleta();
        const linhas = transpose(reels);
        mostrarLinhas(linhas);
        const ganhos = verificaGanhos(linhas, bet, numeroLinhas);
        saldo += ganhos;
        console.log(`Você ganhou R$ ${ganhos}`);

        if(saldo == 0){
            console.log("Você não possui mais saldo!");
            bereak;
        }

        const jogarDenovo = prompt("Deseja jogar novamente (s/n)");

        if (jogarDenovo != "s") break;
    }
};

jogo();