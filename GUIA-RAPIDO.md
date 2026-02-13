# 🚀 Keep-Alive Monitor - Guia Rápido

## ✅ O que foi criado?

Sistema completo e funcional para manter sites ativos 24/7 usando Vercel (grátis) + cron-job.org (grátis).

## 📦 Arquivos Incluídos

```
keep-alive-monitor/
├── 📄 README.md              # Documentação completa
├── 📄 DEPLOY.md              # Guia passo a passo de deploy
├── 📄 package.json           # Dependências do projeto
├── 📄 vercel.json            # Configuração da Vercel
├── 📄 .env.example           # Exemplo de variáveis de ambiente
├── 📄 .gitignore             # Arquivos ignorados pelo Git
├── 📁 pages/
│   ├── index.js              # Interface principal (frontend)
│   ├── _app.js               # Configuração global Next.js
│   └── api/
│       ├── ping.js           # Endpoint principal (cron-job.org chama este)
│       ├── test.js           # Endpoint de teste manual
│       ├── status.js         # Endpoint de estatísticas
│       └── config.js         # Endpoint de configuração
├── 📁 lib/
│   └── storage.js            # Gerenciador de logs/estatísticas
├── 📁 styles/
│   └── globals.css           # Estilos globais
├── tailwind.config.js        # Configuração Tailwind CSS
└── postcss.config.js         # Configuração PostCSS
```

## 🎯 Funcionalidades Implementadas

✅ **Interface Web Completa**
- Menu de configuração
- Campo para URL do site
- Campo para API Key do cron-job.org
- Seletor de intervalo de ping
- Botão de teste manual
- Visualização de status em tempo real

✅ **Backend Serverless**
- Endpoint `/api/ping` (chamado pelo cron-job.org)
- Endpoint `/api/test` (teste manual)
- Endpoint `/api/status` (estatísticas)
- Endpoint `/api/config` (validação de configuração)

✅ **Segurança**
- Validação de API Key via headers
- Sanitização de URLs
- Proteção contra IPs locais/privados
- Headers de segurança

✅ **Funcionalidades Avançadas**
- Retry automático em caso de falha
- Logs dos últimos 50 pings
- Estatísticas (total, sucesso, falhas, taxa)
- Tempo de resposta em ms
- Status HTTP detalhado

✅ **Documentação**
- README.md completo com FAQ
- DEPLOY.md com guia passo a passo
- Comentários em todo o código
- Instruções integradas na interface

## ⚡ Início Rápido (3 Passos)

### 1️⃣ Upload para GitHub

```bash
cd keep-alive-monitor
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU-USUARIO/keep-alive-monitor.git
git push -u origin main
```

### 2️⃣ Deploy na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe seu repositório do GitHub
3. Clique em "Deploy"
4. Após deploy, vá em Settings → Environment Variables
5. Adicione:
   - `TARGET_URL` = URL do seu site
   - `CRON_API_KEY` = API Key do cron-job.org
6. Faça redeploy

### 3️⃣ Configurar cron-job.org

1. Acesse [console.cron-job.org](https://console.cron-job.org)
2. Crie conta e obtenha API Key (Settings → API)
3. Crie cronjob:
   - URL: `https://seu-projeto.vercel.app/api/ping`
   - Intervalo: 5 minutos
   - Header: `X-Api-Key: sua-api-key`

✅ **Pronto! Seu site ficará ativo 24/7!**

## 📚 Documentação Detalhada

- **README.md**: Documentação completa com FAQ, troubleshooting, API docs
- **DEPLOY.md**: Guia passo a passo ilustrado com screenshots conceituais

## 🔧 Tecnologias Utilizadas

- **Next.js 14**: Framework React para SSR/SSG
- **Tailwind CSS**: Estilização responsiva
- **Axios**: Cliente HTTP para fazer pings
- **Vercel**: Hospedagem serverless (grátis)
- **cron-job.org**: Agendador de tarefas (grátis)

## ⚙️ Configurações Importantes

### Variáveis de Ambiente (Vercel)

| Nome | Descrição | Exemplo |
|------|-----------|---------|
| TARGET_URL | URL do site a manter ativo | `https://meu-n8n.onrender.com` |
| CRON_API_KEY | API Key do cron-job.org | `a1b2c3d4e5f6g7h8i9j0` |
| PING_INTERVAL | Intervalo em segundos (opcional) | `300` (5 minutos) |

### Cron-Job.org

- **URL**: `https://seu-projeto.vercel.app/api/ping`
- **Método**: GET
- **Header**: `X-Api-Key: sua-api-key`
- **Intervalo**: 5 minutos (300 segundos)
- **Timeout**: 60 segundos

## 🎨 Características da Interface

- **Design Responsivo**: Funciona em mobile e desktop
- **Gradiente Moderno**: Fundo roxo/azul vibrante
- **Cards Claros**: Informações organizadas em cards brancos
- **Feedback Visual**: Toasts de sucesso/erro
- **Status em Tempo Real**: Atualiza a cada 30 segundos
- **Copiar URL**: Botão para copiar endpoint de ping
- **Toggle de Senha**: Mostrar/ocultar API Key

## 🔐 Segurança Implementada

✅ Validação de API Key em todas as requisições
✅ Sanitização de URLs (bloqueia IPs locais/privados)
✅ Headers de segurança (X-Frame-Options, etc)
✅ Validação de formato de URL
✅ Timeout de 60 segundos para evitar travamentos
✅ Sem exposição de dados sensíveis nos logs

## 📊 Métricas e Logs

O sistema rastreia:
- **Total de pings** executados
- **Taxa de sucesso** (%)
- **Pings com falha** (count)
- **Último ping**: data/hora, status, tempo de resposta
- **Histórico**: últimos 50 pings (temporário)

⚠️ **Importante**: Logs são armazenados em `/tmp` (volátil) e resetam em redeploy/cold start. Isso é normal para Vercel Free.

## 🚨 Limitações Conhecidas

### Vercel Free
- ⏱️ Máximo 60s por function execution
- 📦 100 GB bandwidth/mês
- 🔄 Cold start possível (primeira execução)
- 💾 Sistema de arquivos temporário

### cron-job.org Free
- ⏱️ Intervalo mínimo: 60 segundos
- 🔢 Máximo 3 cronjobs simultâneos
- ⏳ Timeout: 30 segundos
- 📊 60.000 execuções/mês

## ✨ Melhorias Futuras (Opcionais)

Você pode adicionar:
- [ ] Suporte a múltiplas URLs
- [ ] Notificações por email/Discord/Slack
- [ ] Banco de dados persistente (Supabase/MongoDB)
- [ ] Gráficos de uptime
- [ ] Exportação de relatórios
- [ ] Autenticação para múltiplos usuários
- [ ] Webhook customizados
- [ ] Integração com outros serviços de cron

## 📞 Suporte

Se precisar de ajuda:

1. Consulte **README.md** para FAQ completo
2. Leia **DEPLOY.md** para guia detalhado
3. Verifique issues no GitHub
4. Abra nova issue com descrição do problema

## 🎉 Pronto para Usar!

Este sistema está **100% completo e funcional**. Basta seguir os 3 passos do início rápido e você terá um sistema profissional de keep-alive rodando em poucos minutos.

**Custo total: R$ 0,00** 💰

---

**Desenvolvido com ❤️ para a comunidade dev**

⭐ Se gostou, deixe uma estrela no GitHub!
