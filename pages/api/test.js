// pages/api/test.js
// Endpoint para teste manual do ping (sem validação de API Key)

import axios from 'axios';
import { addPingLog } from '../../lib/storage';

/**
 * Faz o ping no site alvo
 */
async function pingTarget(targetUrl) {
  const startTime = Date.now();
  
  try {
    const response = await axios.get(targetUrl, {
      timeout: 60000, // 60 segundos
      validateStatus: () => true,
      headers: {
        'User-Agent': 'Keep-Alive-Monitor/1.0 (Test)'
      }
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    return {
      success: response.status >= 200 && response.status < 500,
      statusCode: response.status,
      responseTime,
      error: null
    };
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    return {
      success: false,
      statusCode: 0,
      responseTime,
      error: error.message
    };
  }
}

/**
 * Handler da API de teste
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only GET method is allowed'
    });
  }
  
  // Verificar se TARGET_URL está configurado
  const targetUrl = process.env.TARGET_URL;
  if (!targetUrl) {
    return res.status(400).json({
      error: 'Not Configured',
      message: 'TARGET_URL not configured. Please set it in Vercel environment variables.',
      configured: false
    });
  }
  
  try {
    const pingResult = await pingTarget(targetUrl);
    
    // Criar log entry
    const logEntry = {
      id: `test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      target: targetUrl,
      ...pingResult,
      isTest: true,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    };
    
    // Salvar log (opcional para testes)
    addPingLog(logEntry);
    
    return res.status(200).json({
      success: pingResult.success,
      timestamp: logEntry.timestamp,
      target: targetUrl,
      statusCode: pingResult.statusCode,
      responseTime: pingResult.responseTime,
      message: pingResult.success ? 'Test ping successful ✓' : 'Test ping failed ✗',
      error: pingResult.error,
      note: 'This was a manual test ping'
    });
    
  } catch (error) {
    console.error('Erro no teste de ping:', error);
    
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      success: false
    });
  }
}
