export const subjectCatalog = [
    {
        subject: "Algoritmos",
        code: "CCO101",
        professor: "Vanessa",
        color: "green",
        items: [
            [
                "Ordenação",
                "Ordenação por intercalação",
                "Implemente o Merge Sort e analise sua complexidade de tempo e espaço.",
                "Intermediário",
                "Divida o vetor recursivamente, intercale os subvetores em ordem e conclua que o custo é O(n log n), com O(n) de espaço auxiliar.",
            ],
            [
                "Recursão",
                "Busca binária recursiva",
                "Implemente uma busca binária recursiva e explique sua condição de parada.",
                "Básico",
                "Compare o alvo com o elemento central e prossiga em apenas uma metade. O intervalo vazio encerra a busca, que possui custo O(log n).",
            ],
        ],
    },
    {
        subject: "Álgebra Linear",
        code: "MAT120",
        professor: "Maurício",
        color: "blue",
        items: [
            [
                "Sistemas lineares",
                "Eliminação de Gauss",
                "Resolva o sistema linear aplicando operações elementares nas linhas da matriz.",
                "Intermediário",
                "Escreva a matriz aumentada, escalone até a forma triangular e faça a substituição retroativa para encontrar as incógnitas.",
            ],
            [
                "Espaços vetoriais",
                "Base e dimensão",
                "Verifique se o conjunto de vetores forma uma base para o espaço indicado.",
                "Avançado",
                "Teste a independência linear e a capacidade de geração. O conjunto será base quando satisfizer as duas condições.",
            ],
        ],
    },
    {
        subject: "Cálculo I",
        code: "MAT101",
        professor: "Oswaldo",
        color: "blue",
        items: [
            [
                "Limites",
                "Limites e continuidade",
                "Calcule o limite da função quando x tende a 2 e analise sua continuidade no ponto.",
                "Intermediário",
                "Fatore o numerador, cancele o fator comum e avalie a expressão simplificada. O limite e o valor da função são iguais a 4.",
            ],
            [
                "Derivadas",
                "Taxa de variação instantânea",
                "Determine a derivada no ponto e interprete o resultado como taxa de variação.",
                "Intermediário",
                "Aplique o quociente incremental e calcule seu limite. O resultado representa a inclinação da reta tangente no ponto.",
            ],
        ],
    },
    {
        subject: "Sistemas Digitais I",
        code: "ELE110",
        professor: "Elieser",
        color: "violet",
        items: [
            [
                "Álgebra booleana",
                "Simplificação de expressão lógica",
                "Simplifique a expressão usando as propriedades da álgebra booleana.",
                "Básico",
                "Aplique as leis distributiva, de absorção e de De Morgan até obter a expressão com o menor número de termos.",
            ],
            [
                "Circuitos combinacionais",
                "Projeto de um somador completo",
                "Projete as saídas de soma e transporte de um somador completo.",
                "Intermediário",
                "Monte a tabela verdade. A soma é A ⊕ B ⊕ Cin e o transporte é AB + Cin(A ⊕ B).",
            ],
        ],
    },
    {
        subject: "Matemática Discreta e Finita I",
        code: "MAT130",
        professor: "Eliandro",
        color: "rose",
        items: [
            [
                "Lógica proposicional",
                "Equivalência entre proposições",
                "Mostre por tabela verdade que as duas proposições apresentadas são equivalentes.",
                "Básico",
                "Liste todas as valorações e calcule as colunas intermediárias. As proposições são equivalentes quando as colunas finais coincidem.",
            ],
            [
                "Conjuntos",
                "Operações entre conjuntos",
                "Resolva a expressão envolvendo união, interseção e complemento.",
                "Intermediário",
                "Resolva primeiro as operações entre parênteses e use as leis de De Morgan para tratar o complemento da união ou interseção.",
            ],
        ],
    },
    {
        subject: "Cálculo II",
        code: "MAT201",
        professor: "Oswaldo",
        color: "orange",
        items: [
            [
                "Integração",
                "Integral por partes",
                "Calcule a integral do produto de uma função polinomial por uma exponencial.",
                "Intermediário",
                "Escolha u como o termo polinomial e dv como o exponencial. Aplique ∫u dv = uv − ∫v du e simplifique.",
            ],
            [
                "Séries",
                "Convergência de série",
                "Determine se a série numérica converge usando um teste adequado.",
                "Avançado",
                "Aplique o teste da razão. Se o limite do módulo da razão entre termos consecutivos for menor que 1, a série converge absolutamente.",
            ],
        ],
    },
    {
        subject: "Estrutura de Dados I",
        code: "CCO201",
        professor: "Evandro",
        color: "green",
        items: [
            [
                "Listas encadeadas",
                "Inserção em lista simplesmente encadeada",
                "Implemente a inserção de um novo nó no início de uma lista.",
                "Básico",
                "Faça o novo nó apontar para o primeiro elemento atual e atualize a referência de início para o novo nó. A operação é O(1).",
            ],
            [
                "Pilhas e filas",
                "Validação de parênteses com pilha",
                "Use uma pilha para verificar se uma expressão possui delimitadores balanceados.",
                "Intermediário",
                "Empilhe aberturas e, para cada fechamento, compare com o topo. A expressão é válida se não houver incompatibilidade e a pilha terminar vazia.",
            ],
        ],
    },
    {
        subject: "Física",
        code: "FIS101",
        professor: "Renato",
        color: "cyan",
        items: [
            [
                "Cinemática",
                "Movimento uniformemente variado",
                "Determine a velocidade e a posição de um corpo após o intervalo informado.",
                "Básico",
                "Use v = v₀ + at e s = s₀ + v₀t + at²/2, mantendo as unidades no Sistema Internacional.",
            ],
            [
                "Dinâmica",
                "Força resultante em plano inclinado",
                "Calcule a aceleração de um bloco em um plano inclinado sem atrito.",
                "Intermediário",
                "Decomponha o peso. A componente paralela é mg sen θ; pela segunda lei de Newton, a aceleração é g sen θ.",
            ],
        ],
    },
    {
        subject: "Matemática Discreta e Finita II",
        code: "MAT230",
        professor: "-",
        color: "rose",
        items: [
            [
                "Grafos",
                "Menor caminho em grafo ponderado",
                "Encontre o menor caminho entre dois vértices usando o algoritmo de Dijkstra.",
                "Intermediário",
                "Inicialize as distâncias, escolha repetidamente o vértice não visitado de menor custo e relaxe suas arestas até alcançar o destino.",
            ],
            [
                "Combinatória",
                "Princípio da inclusão-exclusão",
                "Calcule a quantidade de elementos na união de três conjuntos.",
                "Avançado",
                "Some os tamanhos individuais, subtraia as interseções dois a dois e adicione a interseção dos três conjuntos.",
            ],
        ],
    },
    {
        subject: "Sistemas Digitais II",
        code: "ELE210",
        professor: "Elieser",
        color: "violet",
        items: [
            [
                "Circuitos sequenciais",
                "Contador síncrono de três bits",
                "Projete um contador binário síncrono usando flip-flops.",
                "Avançado",
                "Construa a tabela de transição, derive as entradas de excitação dos flip-flops e simplifique cada função lógica.",
            ],
            [
                "Máquinas de estados",
                "Detector de sequência",
                "Modele uma máquina de estados que detecte a sequência binária especificada.",
                "Avançado",
                "Defina estados para os prefixos já reconhecidos, construa as transições e indique a saída na transição ou estado de detecção.",
            ],
        ],
    },
];

export const exercises = subjectCatalog.flatMap((subject, subjectIndex) =>
    subject.items.map((item, itemIndex) => ({
        id: subjectIndex * 2 + itemIndex + 1,
        subject: subject.subject,
        code: subject.code,
        professor: subject.professor,
        color: subject.color,
        content: item[0],
        title: item[1],
        description: item[2],
        difficulty: item[3],
        solution: item[4],
        lesson: `Aula ${itemIndex + 1}`,
        time: itemIndex === 0 ? "Há 2 horas" : "Ontem",
        engagement: 34 + subjectIndex * 11 + itemIndex * 7,
    }))
);

export const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
};

export const subjects = [...new Set(exercises.map((item) => item.subject))];
export const professors = [...new Set(exercises.map((item) => item.professor))];