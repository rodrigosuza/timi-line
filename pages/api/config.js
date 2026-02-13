// pages/api/config.js
// Endpoint para gerenciar configurações
// NOTA: Como Vercel Free não permite alterar env vars via código,
// este endpoint retorna instruções para configuração manual

export default async function handler(req, res) {
  // GET - Obter instruções de configuração
  if (req.method === 'GET') {
    const vercelProjectUrl = `https://vercel.com/dashboard`;
    const cronJobUrl = `https://console.cron-job.org/settings`;
    
    return res.status(200).json({
      message: 'Configuration instructions',
      currentConfig: {
        targetUrl: process.env.TARGET_URL || 'Not configured',
        apiKeyConfigured: !!process.env.CRON_API_KEY,
        interval: process.env.PING_INTERVAL || '300 (default)'
      },
      instructions: {
        step1: {
          title: 'Configure Environment Variables in Vercel',
          url: vercelProjectUrl,
          path: 'Your Project → Settings → Environment Variables',
          variables: {
            TARGET_URL: 'URL of the site to keep alive (e.g., https://your-site.onrender.com)',
            CRON_API_KEY: 'Your cron-job.org API Key',
            PING_INTERVAL: 'Interval in seconds (optional, default: 300)'
          }
        },
        step2: {
          title: 'Get your cron-job.org API Key',
          url: cronJobUrl,
          instructions: 'Login → Settings → API → Copy API Key'
        },
        step3: {
          title: 'Redeploy your Vercel project',
          instructions: 'After adding environment variables, trigger a manual redeploy for changes to take effect'
        }
      }
    });
  }
  
  // POST - Validar configuração proposta
  if (req.method === 'POST') {
    const { targetUrl, apiKey, interval } = req.body;
    
    const errors = [];
    
    // Validar URL
    if (!targetUrl) {
      errors.push('targetUrl is required');
    } else {
      try {
        const url = new URL(targetUrl);
        if (!['http:', 'https:'].includes(url.protocol)) {
          errors.push('targetUrl must use http:// or https:// protocol');
        }
        // Bloquear IPs locais/privados
        if (url.hostname === 'localhost' || 
            url.hostname === '127.0.0.1' ||
            url.hostname.startsWith('192.168.') ||
            url.hostname.startsWith('10.')) {
          errors.push('targetUrl cannot be a local or private IP address');
        }
      } catch (e) {
        errors.push('targetUrl is not a valid URL');
      }
    }
    
    // Validar API Key
    if (!apiKey) {
      errors.push('apiKey is required');
    } else if (apiKey.length < 10) {
      errors.push('apiKey must be at least 10 characters long');
    }
    
    // Validar intervalo
    if (interval !== undefined) {
      const intervalNum = parseInt(interval);
      if (isNaN(intervalNum) || intervalNum < 60) {
        errors.push('interval must be a number >= 60 seconds');
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
        message: 'Validation failed'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Configuration is valid',
      nextSteps: [
        '1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
        `2. Add TARGET_URL = ${targetUrl}`,
        `3. Add CRON_API_KEY = ${apiKey.substring(0, 4)}****** (your full API key)`,
        interval ? `4. Add PING_INTERVAL = ${interval}` : '4. PING_INTERVAL is optional (default: 300)',
        '5. Redeploy your project',
        '6. Come back here to verify configuration'
      ],
      vercelUrl: 'https://vercel.com/dashboard'
    });
  }
  
  return res.status(405).json({
    error: 'Method Not Allowed',
    message: 'Only GET and POST methods are allowed'
  });
}
