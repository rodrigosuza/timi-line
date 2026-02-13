// pages/api/ping.js
// Endpoint principal para receber chamadas do cron-job.org

import axios from 'axios';
import { addPingLog } from '../../lib/storage';

/**
 * Valida a API Key recebida no header
 */
function validateApiKey(req) {
  const receivedKey = req.headers['x-api-key'];
  const storedKey = process.env.CRON_API_KEY;
  
  if (!receivedKey || !storedKey) {
    return false;
  }
  
  return receivedKey === storedKey;
}

/**
 * Faz o ping no site alvo com retry
 */
async function pingTarget(targetUrl) {
  const startTime = Date.now();
  let attempt = 1;
  
  const ping = async () => {
    try {
      const response = await axios.get(targetUrl, {
        timeout: 60000, // 60 segundos
        validateStatus: () => true, // Aceita qualquer status
        headers: {
          'User-Agent': 'Keep-Alive-Monitor/1.0'
        }
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      return {
        success: response.status >= 200 && response.status < 500,
        statusCode: response.status,
        responseTime,
        error: null,
        retried: attempt > 1
      };
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      return {
        success: false,
        statusCode: 0,
        responseTime,
        error: error.message,
        retried: attempt > 1
      };
    }
  };
  
  // Primeira tentativa
  let result = await ping();
  
  // Se falhou, aguarda 5 segundos e tenta novamente
  if (!result.success) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    attempt = 2;
    result = await ping();
  }
  
  return result;
}

/**
 * Handler principal da API
 */
export default async function handler(req, res) {
  // Apenas método GET permitido
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only GET method is allowed'
    });
  }
  
  // Validar API Key
  if (!validateApiKey(req)) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing API Key. Add X-Api-Key header with your cron-job.org API Key.'
    });
  }
  
  // Verificar se TARGET_URL está configurado
  const targetUrl = process.env.TARGET_URL;
  if (!targetUrl) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'TARGET_URL not configured. Please set it in Vercel environment variables.'
    });
  }
  
  // Executar ping
  try {
    const pingResult = await pingTarget(targetUrl);
    
    // Criar log entry
    const logEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      target: targetUrl,
      ...pingResult,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    };
    
    // Salvar log
    addPingLog(logEntry);
    
    // Retornar resultado
    return res.status(200).json({
      success: pingResult.success,
      timestamp: logEntry.timestamp,
      target: targetUrl,
      statusCode: pingResult.statusCode,
      responseTime: pingResult.responseTime,
      message: pingResult.success ? 'Ping successful' : 'Ping failed',
      error: pingResult.error,
      retried: pingResult.retried
    });
    
  } catch (error) {
    console.error('Erro no ping:', error);
    
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}
