// lib/storage.js
// Gerenciador de armazenamento temporário (volátil)
// ATENÇÃO: Dados serão perdidos em redeploy ou cold start

import fs from 'fs';
import path from 'path';

const STORAGE_PATH = '/tmp/keep-alive-data.json';

/**
 * Estrutura padrão do armazenamento
 */
const defaultData = {
  lastPing: null,
  logs: [],
  stats: {
    totalPings: 0,
    successfulPings: 0,
    failedPings: 0,
  }
};

/**
 * Lê dados do armazenamento temporário
 */
export function readStorage() {
  try {
    if (fs.existsSync(STORAGE_PATH)) {
      const data = fs.readFileSync(STORAGE_PATH, 'utf8');
      return JSON.parse(data);
    }
    return defaultData;
  } catch (error) {
    console.error('Erro ao ler storage:', error);
    return defaultData;
  }
}

/**
 * Salva dados no armazenamento temporário
 */
export function writeStorage(data) {
  try {
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar storage:', error);
    return false;
  }
}

/**
 * Adiciona um log de ping
 */
export function addPingLog(logEntry) {
  const data = readStorage();
  
  // Mantém apenas os últimos 50 logs
  data.logs.unshift(logEntry);
  if (data.logs.length > 50) {
    data.logs = data.logs.slice(0, 50);
  }
  
  // Atualiza estatísticas
  data.stats.totalPings++;
  if (logEntry.success) {
    data.stats.successfulPings++;
  } else {
    data.stats.failedPings++;
  }
  
  // Atualiza último ping
  data.lastPing = logEntry;
  
  writeStorage(data);
  return data;
}

/**
 * Obtém estatísticas
 */
export function getStats() {
  const data = readStorage();
  const successRate = data.stats.totalPings > 0 
    ? ((data.stats.successfulPings / data.stats.totalPings) * 100).toFixed(2)
    : 0;
  
  return {
    ...data.stats,
    successRate: parseFloat(successRate),
    lastPing: data.lastPing
  };
}

/**
 * Obtém logs recentes
 */
export function getRecentLogs(limit = 10) {
  const data = readStorage();
  return data.logs.slice(0, limit);
}

/**
 * Limpa todos os dados
 */
export function clearStorage() {
  try {
    if (fs.existsSync(STORAGE_PATH)) {
      fs.unlinkSync(STORAGE_PATH);
    }
    return true;
  } catch (error) {
    console.error('Erro ao limpar storage:', error);
    return false;
  }
}
