# 🚀 Keep-Alive Monitor

Sistema serverless para manter sites ativos automaticamente através de pings programados.

## 📋 Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Deploy na Vercel](#deploy-na-vercel)
- [Configuração do Cron-Job.org](#configuração-do-cron-joborg)
- [Como Usar](#como-usar)
- [API Endpoints](#api-endpoints)
- [Limitações](#limitações)
- [FAQ](#faq)
- [Suporte](#suporte)

## 🎯 Sobre

O **Keep-Alive Monitor** é uma solução 100% gratuita e serverless para manter seus sites e serviços ativos 24/7. Ideal para:

- ✅ Evitar que apps no Render.com, Heroku, Railway entrem em "sleep mode"
- ✅ Manter serviços n8n, Appsmith, Supabase sempre disponíveis
- ✅ Monitorar disponibilidade de APIs e webhooks
- ✅ Garantir uptime de aplicações gratuitas

## ✨ Funcionalidades

- 🔄 **Ping Automático**: Mantém sites ativos através do cron-job.org
- 🎨 **Interface Intuitiva**: Painel simples para configuração
- 🔐 **Seguro**: Validação de API Key via headers
- 📊 **Estatísticas**: Monitoramento de taxa de sucesso e tempo de resposta
- 🧪 **Teste Manual**: Execute pings de teste quando quiser
- 📝 **Logs Temporários**: Histórico dos últimos 50 pings
- ⚡ **Retry Automático**: Tenta novamente em caso de falha
- 💯 **100% Grátis**: Usa apenas recursos gratuitos (Vercel + cron-job.org)

## 🛠️ Tecnologias

- **Framework**: Next.js 14
- **Runtime**: Node.js 18+
- **Estilo**: Tailwind CSS
- **HTTP Client**: Axios
- **Hospedagem**: Vercel (plano gratuito)
- **Cron Service**: cron-job.org (plano gratuito)

## 📦 Instalação

### Pré-requisitos

- Node.js 18 ou superior
- Conta no GitHub
- Conta na Vercel (gratuita)
- Conta no cron-job.org (gratuita)

### Clone o Repositório

```bash
git clone https://github.com/seu-usuario/keep-alive-monitor.git
cd keep-alive-monitor
```

### Instale as Dependências

```bash
npm install
```

### Execute Localmente (Desenvolvimento)

```bash
npm run dev
```

Acesse `http://localhost:3000`

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` (para desenvolvimento local):

```env
TARGET_URL=https://seu-site.onrender.com
CRON_API_KEY=sua-api-key-do-cron-job
PING_INTERVAL=300
```

**Importante**: Para produção, configure as variáveis diretamente na Vercel (veja próxima seção).

### 2. Obter API Key do cron-job.org

1. Acesse [console.cron-job.org](https://console.cron-job.org)
2. Crie uma conta gratuita
3. Vá em **Settings** → **API**
4. Copie sua **API Key**

## 🚀 Deploy na Vercel

### Opção 1: Deploy via GitHub (Recomendado)

1. **Push para o GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Conectar à Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em **"New Project"**
   - Importe seu repositório do GitHub
   - Clique em **"Deploy"**

3. **Configurar Variáveis de Ambiente**
   - No dashboard da Vercel, acesse seu projeto
   - Vá em **Settings** → **Environment Variables**
   - Adicione as seguintes variáveis:
     
     | Nome | Valor | Ambiente |
     |------|-------|----------|
     | `TARGET_URL` | `https://seu-site.onrender.com` | Production |
     | `CRON_API_KEY` | `sua-api-key-aqui` | Production |
     | `PING_INTERVAL` | `300` | Production (opcional) |

4. **Redeploy**
   - Vá em **Deployments**
   - Clique nos três pontos do último deploy
   - Selecione **"Redeploy"**

### Opção 2: Deploy via CLI da Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Adicionar variáveis de ambiente
vercel env add TARGET_URL
vercel env add CRON_API_KEY
vercel env add PING_INTERVAL

# Redeploy
vercel --prod
```

## 🕐 Configuração do Cron-Job.org

### Passo a Passo Completo

1. **Acesse o Console**
   - Vá em [console.cron-job.org](https://console.cron-job.org)
   - Faça login

2. **Criar Novo Cronjob**
   - Clique em **"Create cronjob"**

3. **Configurações Básicas**
   - **Title**: `Keep-Alive Monitor`
   - **Address (URL)**: `https://seu-projeto.vercel.app/api/ping`
   - **Schedule**: 
     - Escolha **"Every X minutes"**
     - Intervalo: `5 minutes` (ou conforme configurado)

4. **Adicionar Header de Autenticação**
   - Na seção **"Request"**, clique em **"Advanced"**
   - Em **"Request headers"**, clique em **"+"**
   - Adicione:
     - **Name**: `X-Api-Key`
     - **Value**: `sua-api-key-do-cron-job`

5. **Configurações Adicionais (Opcional)**
   - **Timeout**: 60 segundos
   - **Method**: GET
   - **Expected status code**: 200

6. **Salvar e Ativar**
   - Clique em **"Create"**
   - Certifique-se de que o toggle está **verde** (ativo)

### Exemplo Visual

```
┌─────────────────────────────────────┐
│ Create cronjob                      │
├─────────────────────────────────────┤
│ Title: Keep-Alive Monitor           │
│ URL: https://seu-app.vercel.app/... │
│ Schedule: Every 5 minutes           │
│                                     │
│ ▼ Advanced                          │
│ ┌─────────────────────────────┐    │
│ │ Request Headers             │    │
│ │ Name: X-Api-Key             │    │
│ │ Value: sua-api-key-aqui     │    │
│ └─────────────────────────────┘    │
│                                     │
│ [ Cancel ]  [ Create ]              │
└─────────────────────────────────────┘
```

## 📖 Como Usar

### Interface Web

1. **Acesse seu site**
   ```
   https://seu-projeto.vercel.app
   ```

2. **Configure**
   - Preencha a URL do site que deseja manter ativo
   - Cole sua API Key do cron-job.org
   - Escolha o intervalo entre pings
   - Clique em **"Validar Configuração"**

3. **Siga as Instruções**
   - Adicione as variáveis de ambiente na Vercel
   - Faça redeploy
   - Configure o cronjob no cron-job.org

4. **Teste**
   - Clique em **"Testar Ping Agora"**
   - Verifique se o status é bem-sucedido

5. **Monitore**
   - Acompanhe estatísticas em tempo real
   - Veja logs dos últimos pings
   - Verifique taxa de sucesso

## 🔌 API Endpoints

### GET `/api/ping`

Endpoint principal chamado pelo cron-job.org.

**Headers Obrigatórios:**
```
X-Api-Key: sua-api-key-do-cron-job
```

**Response (200 OK):**
```json
{
  "success": true,
  "timestamp": "2025-02-12T14:30:00.000Z",
  "target": "https://meu-site.com",
  "statusCode": 200,
  "responseTime": 1234,
  "message": "Ping successful"
}
```

### GET `/api/test`

Teste manual do ping (sem autenticação).

**Response (200 OK):**
```json
{
  "success": true,
  "timestamp": "2025-02-12T14:30:00.000Z",
  "target": "https://meu-site.com",
  "statusCode": 200,
  "responseTime": 1234,
  "message": "Test ping successful ✓",
  "note": "This was a manual test ping"
}
```

### GET `/api/status`

Obtém status e estatísticas do sistema.

**Response (200 OK):**
```json
{
  "configured": true,
  "config": {
    "targetUrl": "https://meu-site.com/***",
    "interval": 300,
    "isConfigured": true
  },
  "stats": {
    "totalPings": 100,
    "successfulPings": 98,
    "failedPings": 2,
    "successRate": 98.0,
    "lastPing": { ... }
  },
  "recentLogs": [ ... ],
  "serverTime": "2025-02-12T14:30:00.000Z"
}
```

### POST `/api/config`

Valida configuração proposta.

**Body:**
```json
{
  "targetUrl": "https://meu-site.com",
  "apiKey": "sua-api-key",
  "interval": 300
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Configuration is valid",
  "nextSteps": [ ... ]
}
```

## ⚠️ Limitações

### Limitações da Vercel (Plano Free)

- **Execução**: Máximo 60 segundos por function
- **Bandwidth**: 100 GB/mês
- **Function Execution**: 100 GB-hours/mês
- **Armazenamento**: Sistema de arquivos temporário (volátil)
- **Cold Start**: Primeira execução pode demorar alguns segundos

### Limitações do cron-job.org (Plano Free)

- **Intervalo Mínimo**: 60 segundos
- **Jobs Simultâneos**: Máximo 3 jobs
- **Timeout**: 30 segundos por requisição
- **Execuções**: 60.000/mês (suficiente para ping a cada 5 minutos)

### Considerações Importantes

⚠️ **Logs são temporários**: Armazenados em `/tmp` e perdidos em redeploy

⚠️ **Estatísticas resetam**: Após cold start ou redeploy

⚠️ **Configuração via env vars**: Requer redeploy manual após mudanças

💡 **Recomendação**: Configure intervalo de 5 minutos ou mais para otimizar recursos

## ❓ FAQ

### P: Por que meu site continua entrando em sleep mode?

**R**: Verifique se:
1. O cronjob está ativo (toggle verde no cron-job.org)
2. O header `X-Api-Key` está configurado corretamente
3. As variáveis de ambiente estão na Vercel
4. Você fez redeploy após adicionar variáveis

### P: Como vejo os logs do cron-job.org?

**R**: No console do cron-job.org:
1. Clique no seu cronjob
2. Vá na aba **"History"**
3. Veja status de cada execução

### P: Posso monitorar múltiplos sites?

**R**: Sim, mas precisa:
1. Criar instância separada para cada site, OU
2. Modificar o código para suportar múltiplas URLs

### P: O que acontece se meu site ficar offline?

**R**: O sistema:
1. Detecta a falha
2. Tenta novamente após 5 segundos
3. Registra o erro nos logs
4. Continua tentando nos próximos ciclos

### P: Posso usar com sites que exigem autenticação?

**R**: Sim, modifique o código em `/pages/api/ping.js` para adicionar headers de autenticação personalizados.

### P: Como altero o timeout do ping?

**R**: Edite o valor em `/pages/api/ping.js`:
```javascript
timeout: 60000, // Altere para o valor desejado em ms
```

### P: Posso receber notificações de falhas?

**R**: O sistema básico não inclui notificações. Você pode:
1. Configurar alertas no cron-job.org (plano pago)
2. Integrar com serviços como Better Uptime, UptimeRobot
3. Adicionar webhook para Discord/Slack (requer código customizado)

## 🐛 Troubleshooting

### Erro 401 - Unauthorized

**Causa**: API Key incorreta ou ausente

**Solução**:
1. Verifique se adicionou o header `X-Api-Key` no cron-job.org
2. Confirme se a API Key está correta
3. Teste com `/api/test` primeiro

### Erro 400 - TARGET_URL not configured

**Causa**: Variável de ambiente não definida

**Solução**:
1. Adicione `TARGET_URL` na Vercel
2. Faça redeploy manual
3. Aguarde 1-2 minutos e tente novamente

### Ping falha com timeout

**Causa**: Site alvo muito lento ou indisponível

**Solução**:
1. Verifique se o site está acessível manualmente
2. Aumente o timeout (se necessário)
3. Verifique se não há firewall bloqueando

### Estatísticas não aparecem

**Causa**: Cold start ou redeploy recente

**Solução**:
1. Execute um teste manual
2. Aguarde o próximo ping automático
3. Logs são voláteis e serão recriados

## 📞 Suporte

### Como Reportar Bugs

1. Verifique se o bug já foi reportado nas [Issues](https://github.com/seu-usuario/keep-alive-monitor/issues)
2. Crie uma nova issue com:
   - Descrição detalhada
   - Passos para reproduzir
   - Screenshots (se aplicável)
   - Logs de erro

### Comunidade

- GitHub Discussions: [Discussões](https://github.com/seu-usuario/keep-alive-monitor/discussions)
- Issues: [Reportar Bug](https://github.com/seu-usuario/keep-alive-monitor/issues)

## 📄 Licença

Este projeto é open-source e está disponível sob a licença MIT.

## 🙏 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 🎉 Créditos

Desenvolvido com ❤️ para a comunidade dev.

**Tecnologias utilizadas**:
- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [cron-job.org](https://cron-job.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)

---

**⭐ Se este projeto foi útil, deixe uma estrela no GitHub!**
