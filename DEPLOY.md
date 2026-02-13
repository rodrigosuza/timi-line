# 🚀 Guia de Deploy Completo

Este documento contém instruções detalhadas para fazer o deploy do Keep-Alive Monitor na Vercel e configurar o cron-job.org.

## 📋 Checklist Pré-Deploy

Antes de começar, certifique-se de ter:

- [ ] Conta no GitHub
- [ ] Conta na Vercel (vercel.com)
- [ ] Conta no cron-job.org
- [ ] URL do site que deseja manter ativo
- [ ] Git instalado localmente

## 🔧 Passo 1: Preparar o Projeto

### 1.1 Clone ou Baixe o Projeto

```bash
# Se ainda não fez
git clone https://github.com/seu-usuario/keep-alive-monitor.git
cd keep-alive-monitor
```

### 1.2 Instale as Dependências

```bash
npm install
```

### 1.3 Teste Localmente (Opcional)

```bash
# Crie um arquivo .env.local com suas variáveis
echo "TARGET_URL=https://seu-site.com" > .env.local
echo "CRON_API_KEY=sua-api-key-temporaria" >> .env.local

# Execute
npm run dev

# Acesse http://localhost:3000
```

## 📤 Passo 2: Upload para o GitHub

### 2.1 Crie um Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em **"New repository"**
3. Nome: `keep-alive-monitor`
4. Deixe como **Público** ou **Privado**
5. **NÃO** marque "Initialize with README"
6. Clique em **"Create repository"**

### 2.2 Push do Código

```bash
# Se ainda não inicializou o git
git init

# Adicione o remote
git remote add origin https://github.com/SEU-USUARIO/keep-alive-monitor.git

# Faça o commit
git add .
git commit -m "Initial commit - Keep-Alive Monitor"

# Push
git branch -M main
git push -u origin main
```

## 🌐 Passo 3: Deploy na Vercel

### 3.1 Conectar Repositório

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **"Continue with GitHub"**
3. Autorize o Vercel a acessar seus repositórios
4. Selecione o repositório `keep-alive-monitor`
5. Clique em **"Import"**

### 3.2 Configurar Projeto

Na tela de configuração:

- **Project Name**: keep-alive-monitor (ou personalize)
- **Framework Preset**: Next.js (detectado automaticamente)
- **Root Directory**: ./
- **Build Command**: `npm run build` (padrão)
- **Output Directory**: `.next` (padrão)

**NÃO configure variáveis de ambiente ainda**

### 3.3 Deploy Inicial

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos
3. Você verá "Congratulations!" quando concluir
4. Anote a URL do seu projeto (ex: `keep-alive-monitor.vercel.app`)

## 🔑 Passo 4: Obter API Key do cron-job.org

### 4.1 Criar Conta

1. Acesse [console.cron-job.org](https://console.cron-job.org)
2. Clique em **"Sign up"**
3. Preencha:
   - Email
   - Password
   - Confirm password
4. Confirme seu email

### 4.2 Obter API Key

1. Faça login no [console.cron-job.org](https://console.cron-job.org)
2. Clique no seu **nome de usuário** (canto superior direito)
3. Selecione **"Settings"**
4. Na aba lateral, clique em **"API"**
5. Copie sua **API Key** (algo como `a1b2c3d4e5f6g7h8i9j0`)

**⚠️ Importante**: Guarde essa API Key em local seguro!

## ⚙️ Passo 5: Configurar Variáveis de Ambiente na Vercel

### 5.1 Acessar Configurações

1. No dashboard da Vercel, clique no seu projeto
2. Vá em **"Settings"** (menu superior)
3. No menu lateral, clique em **"Environment Variables"**

### 5.2 Adicionar Variáveis

Adicione as seguintes variáveis uma por uma:

#### Variável 1: TARGET_URL

- **Key (Nome)**: `TARGET_URL`
- **Value (Valor)**: `https://seu-site.onrender.com`
  - Substitua pela URL do site que deseja manter ativo
  - Deve incluir `https://` ou `http://`
  - Exemplo: `https://meu-n8n.onrender.com`
- **Environment**: Marque apenas **Production**
- Clique em **"Save"**

#### Variável 2: CRON_API_KEY

- **Key (Nome)**: `CRON_API_KEY`
- **Value (Valor)**: `sua-api-key-do-cron-job`
  - Cole a API Key que copiou do cron-job.org
  - Exemplo: `a1b2c3d4e5f6g7h8i9j0`
- **Environment**: Marque apenas **Production**
- Clique em **"Save"**

#### Variável 3: PING_INTERVAL (Opcional)

- **Key (Nome)**: `PING_INTERVAL`
- **Value (Valor)**: `300`
  - Intervalo em segundos
  - `300` = 5 minutos (recomendado)
  - `600` = 10 minutos
  - `900` = 15 minutos
- **Environment**: Marque apenas **Production**
- Clique em **"Save"**

### 5.3 Verificar Variáveis

Você deve ter 2-3 variáveis configuradas:

| Name | Value | Environment |
|------|-------|-------------|
| TARGET_URL | https://seu-site.com | Production |
| CRON_API_KEY | a1b2c3...j0 | Production |
| PING_INTERVAL | 300 | Production |

## 🔄 Passo 6: Redeploy do Projeto

**Por que?** Variáveis de ambiente só são carregadas após um redeploy.

### 6.1 Forçar Redeploy

1. Vá em **"Deployments"** (menu superior)
2. Localize o último deployment (primeiro da lista)
3. Clique nos **três pontos** (⋯) à direita
4. Selecione **"Redeploy"**
5. Na modal, clique em **"Redeploy"** novamente
6. Aguarde 1-2 minutos

### 6.2 Verificar Status

1. Após concluir, você verá um ✓ verde
2. Clique em **"Visit"** para abrir o site
3. Você deve ver a interface do Keep-Alive Monitor

## 🕐 Passo 7: Configurar Cronjob no cron-job.org

### 7.1 Criar Novo Cronjob

1. Acesse [console.cron-job.org](https://console.cron-job.org)
2. Na página principal, clique em **"Create cronjob"**

### 7.2 Configurações Básicas

Preencha os campos:

**BASIC**

- **Title**: `Keep-Alive Monitor`
- **Address (URL)**: `https://seu-projeto.vercel.app/api/ping`
  - Substitua `seu-projeto` pelo nome real
  - Exemplo: `https://keep-alive-monitor.vercel.app/api/ping`

**SCHEDULE**

- Selecione: **"Every X minutes"**
- **Minutes**: `5` (ou conforme configurado no PING_INTERVAL)
- **Enabled**: Deixe marcado

**NOTIFICATIONS** (Opcional)

- Marque **"Enabled"** se quiser receber emails de falha
- Email: seu@email.com

### 7.3 Configurar Request (Headers)

Role até a seção **REQUEST** e clique em **"Advanced"**

**Request Headers**

1. Clique em **"+ Add header"**
2. Preencha:
   - **Name**: `X-Api-Key`
   - **Value**: `sua-api-key-do-cron-job`
     - Cole a mesma API Key usada nas variáveis da Vercel

**Timeout**

- Defina: `60` segundos

**Expected response**

- **Status code**: `200`
- Deixe os outros campos em branco

### 7.4 Salvar e Ativar

1. Revise todas as configurações
2. Clique em **"Create"** (botão verde no final)
3. Você será redirecionado para a lista de cronjobs
4. Certifique-se de que o toggle está **VERDE** (ativo)

## ✅ Passo 8: Testar o Sistema

### 8.1 Teste Manual na Interface

1. Acesse `https://seu-projeto.vercel.app`
2. A interface deve mostrar:
   - Status: ✅ Configurado
   - URL configurada (parcialmente oculta)
3. Clique em **"🔍 Testar Ping Agora"**
4. Aguarde 5-10 segundos
5. Você deve ver:
   - Toast verde: "✓ Ping bem-sucedido!"
   - Estatísticas atualizadas
   - Último ping com data/hora atual

### 8.2 Verificar no cron-job.org

1. Volte ao [console.cron-job.org](https://console.cron-job.org)
2. Clique no cronjob **"Keep-Alive Monitor"**
3. Vá na aba **"History"**
4. Aguarde 5 minutos (ou o intervalo configurado)
5. Você deve ver:
   - Nova execução com status **200 OK**
   - Response time em ms
   - Ícone verde ✓

### 8.3 Verificar Logs na Interface

1. Volte para `https://seu-projeto.vercel.app`
2. Role até a seção **"📊 Status do Sistema"**
3. Você deve ver:
   - **Último Ping Executado** com data/hora recente
   - **Status HTTP**: 200
   - **Resultado**: ✅ Sucesso
4. Nas **Estatísticas**:
   - Total de Pings: incrementando
   - Taxa de Sucesso: próxima de 100%

## 🎯 Passo 9: Monitoramento Contínuo

### 9.1 Verificações Diárias (Primeira Semana)

- [ ] Acesse o cron-job.org e verifique histórico
- [ ] Confirme que todas as execuções foram bem-sucedidas
- [ ] Verifique se seu site alvo está ativo

### 9.2 Verificações Semanais

- [ ] Confira taxa de sucesso na interface
- [ ] Revise logs para identificar padrões de falha
- [ ] Ajuste intervalo se necessário

### 9.3 Ajustes Recomendados

Se taxa de sucesso < 95%:

1. Aumente o timeout no cron-job.org
2. Aumente o intervalo (menos frequente)
3. Verifique se o site alvo tem problemas

Se tudo estiver 100%:

- ✅ Parabéns! Sistema funcionando perfeitamente
- Você pode deixar rodando indefinidamente

## 🐛 Solução de Problemas

### Problema: Teste Manual funciona, mas cron-job.org falha com 401

**Causa**: Header X-Api-Key incorreto ou ausente

**Solução**:
1. Verifique se adicionou o header no cron-job.org
2. Confirme que o valor é exatamente igual à CRON_API_KEY da Vercel
3. Delete e recrie o cronjob se necessário

### Problema: Erro 400 - TARGET_URL not configured

**Causa**: Variável não foi carregada

**Solução**:
1. Confirme que adicionou TARGET_URL na Vercel
2. Faça um redeploy manual
3. Aguarde 2-3 minutos e teste novamente

### Problema: Pings ocorrem, mas site continua em sleep

**Causa**: URL incorreta ou site muito lento para acordar

**Solução**:
1. Confirme que a URL está correta (com https://)
2. Teste acessar a URL manualmente em navegador
3. Alguns sites requerem múltiplos pings - aguarde 30 minutos
4. Verifique se o site tem limite de tempo mais longo para acordar

### Problema: Estatísticas não aparecem

**Causa**: Sistema teve cold start ou redeploy recente

**Solução**:
1. Execute um teste manual
2. Aguarde o próximo ping automático
3. Estatísticas são voláteis e resetam em redeploy - isso é normal

## 📞 Precisa de Ajuda?

Se encontrar problemas:

1. Revise este guia do início
2. Consulte o [README.md](README.md) para FAQ
3. Abra uma issue no GitHub com:
   - Descrição do problema
   - Screenshots
   - Logs de erro

## 🎉 Conclusão

Se chegou até aqui, parabéns! 🎊

Seu sistema está:
- ✅ Deployed na Vercel
- ✅ Configurado com variáveis de ambiente
- ✅ Conectado ao cron-job.org
- ✅ Fazendo pings automáticos
- ✅ Mantendo seu site ativo 24/7

**100% grátis e totalmente funcional!** 🚀

---

**Próximos passos opcionais**:
- Customizar interface (cores, textos)
- Adicionar múltiplos sites
- Integrar notificações (Discord, Slack)
- Contribuir com melhorias no GitHub

**⭐ Não esqueça de dar uma estrela no repositório!**
