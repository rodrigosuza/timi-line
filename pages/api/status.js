// pages/api/status.js
// Endpoint para obter status e estatísticas do sistema

import { getStats, getRecentLogs } from '../../lib/storage';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method Not Allowed'
    });
  }
  
  try {
    // Verificar configuração
    const isConfigured = !!(process.env.TARGET_URL && process.env.CRON_API_KEY);
    
    // Obter estatísticas
    const stats = getStats();
    
    // Obter logs recentes
    const recentLogs = getRecentLogs(10);
    
    // Informações de configuração (sem expor dados sensíveis)
    const config = {
      targetUrl: process.env.TARGET_URL 
        ? process.env.TARGET_URL.replace(/^(https?:\/\/[^/]+).*/, '$1/***')
        : null,
      interval: process.env.PING_INTERVAL || 300,
      isConfigured
    };
    
    return res.status(200).json({
      configured: isConfigured,
      config,
      stats,
      recentLogs,
      serverTime: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro ao obter status:', error);
    
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}
