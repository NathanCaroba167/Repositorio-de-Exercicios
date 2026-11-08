const bearer = [{ bearerAuth: [] }];

const erro = (descricao) => ({
    description: descricao,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } },
});

const idPath = (nome = 'id') => ({
    name: nome, in: 'path', required: true, schema: { type: 'integer' },
});

module.exports = {
    openapi: '3.0.3',
    info: {
        title: 'Exercita API',
        version: '1.0.0',
        description:
            'API da plataforma de integração aluno-professor (PET Computação e Design UEL).\n\n' +
            'Para testar rotas protegidas: faça login em `POST /api/auth/login`, copie o `token` ' +
            'e clique em **Authorize** (cadeado), colando só o token.',
    },
    servers: [{ url: 'http://localhost:3001', description: 'Desenvolvimento' }],
    tags: [
        { name: 'Auth' }, { name: 'Exercícios' }, { name: 'Dúvidas' },
        { name: 'Disciplinas' }, { name: 'Referências' }, { name: 'Progresso' },
    ],
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
        schemas: {
            Erro: { type: 'object', properties: { erro: { type: 'string' } } },
            Usuario: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    nome: { type: 'string' },
                    email: { type: 'string' },
                    tipo: { type: 'string', enum: ['aluno', 'professor'] },
                },
            },
            AuthResposta: {
                type: 'object',
                properties: {
                    usuario: { $ref: '#/components/schemas/Usuario' },
                    token: { type: 'string' },
                },
            },
            Exercicio: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    titulo: { type: 'string' },
                    conteudo: { type: 'string' },
                    descricao: { type: 'string' },
                    solucao: { type: 'string' },
                    dificuldade: { type: 'string', enum: ['Básico', 'Intermediário', 'Avançado'] },
                    aula: { type: 'string' },
                    disciplina_id: { type: 'integer' },
                    disciplina: { type: 'string' },
                    codigo: { type: 'string' },
                    cor: { type: 'string' },
                    professor: { type: 'string' },
                    total_uteis: { type: 'integer' },
                    criado_em: { type: 'string', format: 'date-time' },
                },
            },
            ExercicioEntrada: {
                type: 'object',
                required: ['titulo', 'conteudo', 'descricao', 'solucao', 'disciplina_id'],
                properties: {
                    titulo: { type: 'string' },
                    conteudo: { type: 'string' },
                    descricao: { type: 'string' },
                    solucao: { type: 'string' },
                    dificuldade: { type: 'string', enum: ['Básico', 'Intermediário', 'Avançado'] },
                    aula: { type: 'string', example: 'Aula 1' },
                    disciplina_id: { type: 'integer' },
                },
            },
            Duvida: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    pergunta: { type: 'string' },
                    resposta: { type: 'string', nullable: true },
                    aluno: { type: 'string' },
                    criado_em: { type: 'string', format: 'date-time' },
                    respondido_em: { type: 'string', format: 'date-time', nullable: true },
                },
            },
            DuvidaPendente: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    pergunta: { type: 'string' },
                    exercicio_id: { type: 'integer' },
                    titulo: { type: 'string' },
                    disciplina: { type: 'string' },
                    aluno: { type: 'string' },
                    criado_em: { type: 'string', format: 'date-time' },
                },
            },
            Disciplina: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    nome: { type: 'string' },
                    codigo: { type: 'string' },
                    cor: { type: 'string' },
                    professor: { type: 'string' },
                },
            },
            Referencia: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    titulo: { type: 'string' },
                    aula: { type: 'string', nullable: true },
                    url: { type: 'string', nullable: true },
                    arquivo_url: { type: 'string', nullable: true, example: '/uploads/uuid.pdf' },
                    criado_em: { type: 'string', format: 'date-time' },
                },
            },
            Progresso: {
                type: 'object',
                properties: {
                    matriculas: { type: 'array', items: { type: 'integer' }, description: 'IDs de disciplinas' },
                    concluidos: { type: 'array', items: { type: 'integer' }, description: 'IDs de exercícios' },
                    uteis: { type: 'array', items: { type: 'integer' }, description: 'IDs de exercícios' },
                },
            },
        },
    },
    paths: {
        '/api/auth/cadastrar': {
            post: {
                tags: ['Auth'],
                summary: 'Cadastro público (sempre cria aluno)',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: {
                                type: 'object', required: ['nome', 'email', 'senha'],
                                properties: {
                                    nome: { type: 'string' },
                                    email: { type: 'string', example: 'ana@uel.br' },
                                    senha: { type: 'string', minLength: 8 },
                                },
                            } } },
                },
                responses: {
                    201: { description: 'Criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResposta' } } } },
                    400: erro('Dados inválidos ou e-mail já cadastrado'),
                    429: erro('Muitas tentativas'),
                },
            },
        },
        '/api/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: {
                                type: 'object', required: ['email', 'senha'],
                                properties: { email: { type: 'string' }, senha: { type: 'string' } },
                            } } },
                },
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResposta' } } } },
                    400: erro('Dados faltando'),
                    401: erro('E-mail ou senha incorretos'),
                    429: erro('Muitas tentativas'),
                },
            },
        },
        '/api/exercicios': {
            get: {
                tags: ['Exercícios'],
                summary: 'Lista exercícios (aberta)',
                parameters: [
                    { name: 'disciplina', in: 'query', schema: { type: 'string' }, description: 'Nome da disciplina' },
                    { name: 'dificuldade', in: 'query', schema: { type: 'string' } },
                    { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Busca em título, conteúdo e descrição' },
                    { name: 'disciplina_id', in: 'query', schema: { type: 'integer' } },
                ],
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Exercicio' } } } } },
                },
            },
            post: {
                tags: ['Exercícios'],
                summary: 'Cria exercício (professor, só na própria disciplina)',
                security: bearer,
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ExercicioEntrada' } } } },
                responses: {
                    201: { description: 'Criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Exercicio' } } } },
                    400: erro('Campos obrigatórios faltando'),
                    401: erro('Sem token ou token inválido'),
                    403: erro('Não é professor ou disciplina de outro professor'),
                },
            },
        },
        '/api/exercicios/{id}': {
            parameters: [idPath()],
            get: {
                tags: ['Exercícios'],
                summary: 'Busca exercício por id (aberta)',
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Exercicio' } } } },
                    404: erro('Não encontrado'),
                },
            },
            put: {
                tags: ['Exercícios'],
                summary: 'Edita exercício (professor da disciplina)',
                security: bearer,
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ExercicioEntrada' } } } },
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Exercicio' } } } },
                    401: erro('Sem token'), 403: erro('Não é professor'),
                    404: erro('Não encontrado nas suas disciplinas'),
                },
            },
            delete: {
                tags: ['Exercícios'],
                summary: 'Apaga exercício e as dúvidas dele (professor da disciplina)',
                security: bearer,
                responses: {
                    200: { description: 'Removido' },
                    401: erro('Sem token'), 403: erro('Não é professor'),
                    404: erro('Não encontrado nas suas disciplinas'),
                },
            },
        },
        '/api/duvidas': {
            get: {
                tags: ['Dúvidas'],
                summary: 'Lista dúvidas de um exercício (logado)',
                security: bearer,
                parameters: [{ name: 'exercicio_id', in: 'query', required: true, schema: { type: 'integer' } }],
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Duvida' } } } } },
                    400: erro('exercicio_id faltando'), 401: erro('Sem token'),
                },
            },
            post: {
                tags: ['Dúvidas'],
                summary: 'Aluno envia uma dúvida',
                security: bearer,
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: {
                                type: 'object', required: ['exercicio_id', 'pergunta'],
                                properties: { exercicio_id: { type: 'integer' }, pergunta: { type: 'string' } },
                            } } },
                },
                responses: {
                    201: { description: 'Criada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Duvida' } } } },
                    400: erro('Dados inválidos'), 401: erro('Sem token'),
                    403: erro('Só aluno pode enviar'), 404: erro('Exercício não encontrado'),
                },
            },
        },
        '/api/duvidas/pendentes': {
            get: {
                tags: ['Dúvidas'],
                summary: 'Professor vê dúvidas sem resposta das suas disciplinas',
                security: bearer,
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/DuvidaPendente' } } } } },
                    401: erro('Sem token'), 403: erro('Não é professor'),
                },
            },
        },
        '/api/duvidas/{id}/responder': {
            put: {
                tags: ['Dúvidas'],
                summary: 'Professor responde (só dúvidas das suas disciplinas)',
                security: bearer,
                parameters: [idPath()],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: {
                                type: 'object', required: ['resposta'], properties: { resposta: { type: 'string' } },
                            } } },
                },
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Duvida' } } } },
                    400: erro('Resposta vazia'), 401: erro('Sem token'),
                    403: erro('Não é professor'), 404: erro('Dúvida não encontrada para as suas disciplinas'),
                },
            },
        },
        '/api/duvidas/publicas': {
            get: {
                tags: ['Dúvidas'],
                summary: 'Dúvidas respondidas e públicas de uma disciplina (sem o nome do aluno)',
                security: bearer,
                parameters: [{ name: 'disciplina_id', in: 'query', required: true, schema: { type: 'integer' } }],
                responses: { 200: { description: 'OK' }, 400: erro('disciplina_id inválido'), 401: erro('Sem token') },
            },
        },
        '/api/duvidas/minhas': {
            get: {
                tags: ['Dúvidas'],
                summary: 'Todas as dúvidas do aluno logado',
                security: bearer,
                responses: { 200: { description: 'OK' }, 401: erro('Sem token') },
            },
        },
        '/api/duvidas/professor': {
            get: {
                tags: ['Dúvidas'],
                summary: 'Dúvidas de uma disciplina do professor (pendentes ou respondidas)',
                security: bearer,
                parameters: [
                    { name: 'disciplina_id', in: 'query', required: true, schema: { type: 'integer' } },
                    { name: 'status', in: 'query', schema: { type: 'string', enum: ['pendentes', 'respondidas'] } },
                ],
                responses: { 200: { description: 'OK' }, 400: erro('disciplina_id inválido'), 403: erro('Não é professor') },
            },
        },
        '/api/duvidas/{id}/lida': {
            put: {
                tags: ['Dúvidas'],
                summary: 'Professor marca como lida',
                security: bearer,
                parameters: [idPath()],
                responses: { 200: { description: 'OK' }, 404: erro('Dúvida não encontrada para as suas disciplinas') },
            },
        },
        '/api/duvidas/{id}/resolvida': {
            put: {
                tags: ['Dúvidas'],
                summary: 'Aluno marca "Entendi" (só na própria dúvida, já respondida)',
                security: bearer,
                parameters: [idPath()],
                responses: { 200: { description: 'OK' }, 404: erro('Não encontrada ou sem resposta') },
            },
        },
        '/api/disciplinas/minhas': {
            get: {
                tags: ['Disciplinas'],
                summary: 'Disciplinas do professor logado',
                security: bearer,
                responses: { 200: { description: 'OK' }, 403: erro('Não é professor') },
            },
        },
        '/api/disciplinas': {
            get: {
                tags: ['Disciplinas'],
                summary: 'Lista disciplinas (aberta)',
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Disciplina' } } } } },
                },
            },
        },
        '/api/referencias': {
            get: {
                tags: ['Referências'],
                summary: 'Lista materiais de uma disciplina (logado)',
                security: bearer,
                parameters: [
                    { name: 'disciplina_id', in: 'query', required: true, schema: { type: 'integer' } },
                    { name: 'tipo', in: 'query', schema: { type: 'string', enum: ['aula', 'material', 'referencia'] } },
                ],
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Referencia' } } } } },
                    400: erro('disciplina_id faltando'), 401: erro('Sem token'),
                },
            },
            post: {
                tags: ['Referências'],
                summary: 'Professor posta material (PDF e/ou link) na própria disciplina',
                description: 'Corpo em `multipart/form-data`. PDF até 10 MB. Informe `arquivo`, `url` ou os dois.',
                security: bearer,
                requestBody: {
                    required: true,
                    content: { 'multipart/form-data': { schema: {
                                type: 'object', required: ['titulo', 'disciplina_id'],
                                properties: {
                                    titulo: { type: 'string' },
                                    aula: { type: 'string' },
                                    disciplina_id: { type: 'integer' },
                                    url: { type: 'string' },
                                    arquivo: { type: 'string', format: 'binary' },
                                    tipo: { type: 'string' },
                                    formato: { type: 'string' },
                                    descricao: { type: 'string' },
                                },
                            } } },
                },
                responses: {
                    201: { description: 'Criada' },
                    400: erro('Dados inválidos, sem PDF/link ou arquivo que não é PDF'),
                    401: erro('Sem token'), 403: erro('Não é professor ou disciplina de outro professor'),
                },
            },
        },
        '/api/referencias/{id}': {
            delete: {
                tags: ['Referências'],
                summary: 'Professor remove material da própria disciplina',
                security: bearer,
                parameters: [idPath()],
                responses: {
                    200: { description: 'Removido' },
                    401: erro('Sem token'), 403: erro('Não é professor'),
                    404: erro('Material não encontrado nas suas disciplinas'),
                },
            },
        },
        '/api/progresso': {
            get: {
                tags: ['Progresso'],
                summary: 'Progresso do usuário logado (matrículas, concluídos e úteis)',
                security: bearer,
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Progresso' } } } },
                    401: erro('Sem token'),
                },
            },
        },
        '/api/progresso/{tipo}/{id}': {
            parameters: [
                { name: 'tipo', in: 'path', required: true, schema: { type: 'string', enum: ['matriculas', 'concluidos', 'uteis'] } },
                idPath(),
            ],
            put: {
                tags: ['Progresso'],
                summary: 'Marca (repetir a chamada não dá erro)',
                security: bearer,
                responses: { 200: { description: 'ok' }, 401: erro('Sem token'), 404: erro('Tipo inválido ou item inexistente') },
            },
            delete: {
                tags: ['Progresso'],
                summary: 'Desmarca',
                security: bearer,
                responses: { 200: { description: 'ok' }, 401: erro('Sem token'), 404: erro('Tipo inválido') },
            },
        },
    },
};