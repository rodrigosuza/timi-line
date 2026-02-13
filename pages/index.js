// pages/index.js
// Interface principal do Keep-Alive Monitor

import { useState, useEffect } from 'react';
import Head from 'next/head';
// import '../styles/globals.css';

export default function Home() {
  // Estados
  const [config, setConfig] = useState({
    targetUrl: '',
    apiKey: '',
    interval: 300
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [status, setStatus] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // URL da API de ping para copiar
  const [pingUrl, setPingUrl] = useState('');

  // Estados do Monitor Local
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitorHistory, setMonitorHistory] = useState([]);
  const [stats, setStats] = useState({ success: 0, fail: 0 });
  const [nextPingTime, setNextPingTime] = useState(null);

  useEffect(() => {
    // Definir URL de ping quando componente montar
    if (typeof window !== 'undefined') {
      setPingUrl(`${window.location.origin}/api/ping`);
    }

    // Carregar status inicial
    loadStatus();

    // Atualizar status a cada 30 segundos
    const statusInterval = setInterval(loadStatus, 30000);
    return () => clearInterval(statusInterval);
  }, []);

  // Loop do Monitor Local
  useEffect(() => {
    let timer;
    if (isMonitoring) {
      const runStep = async () => {
        setNextPingTime(null);
        const result = await executePing();

        const delay = result.success ? config.interval * 1000 : 5000;
        setNextPingTime(Date.now() + delay);
        timer = setTimeout(runStep, delay);
      };

      runStep();
    }
    return () => clearTimeout(timer);
  }, [isMonitoring, config.interval]);

  const executePing = async () => {
    try {
      const response = await fetch('/api/test');
      const data = await response.json();

      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        success: data.success,
        statusCode: data.statusCode || (data.success ? 200 : 500),
        responseTime: data.responseTime,
        error: data.error
      };

      setMonitorHistory(prev => [newEntry, ...prev].slice(0, 30));
      setStats(prev => ({
        success: prev.success + (data.success ? 1 : 0),
        fail: prev.fail + (data.success ? 0 : 1)
      }));

      if (data.success) {
        await loadStatus();
      }

      return data;
    } catch (error) {
      const failEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        success: false,
        statusCode: 0,
        error: 'Erro de conexão'
      };
      setMonitorHistory(prev => [failEntry, ...prev].slice(0, 30));
      setStats(prev => ({ ...prev, fail: prev.fail + 1 }));
      return { success: false };
    }
  };

  // Carregar status do sistema
  const loadStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    }
  };

  // Mostrar toast
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Validar e salvar configuração
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      const data = await response.json();

      if (data.success) {
        showToast('✓ Configuração validada! Siga as próximas etapas abaixo.', 'success');
        setShowInstructions(true);
      } else {
        showToast(`✗ Erro: ${data.errors?.join(', ') || data.message}`, 'error');
      }
    } catch (error) {
      showToast('✗ Erro ao validar configuração', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Testar ping manualmente
  const handleTestPing = async () => {
    setTestLoading(true);

    try {
      const response = await fetch('/api/test');
      const data = await response.json();

      if (data.success) {
        showToast(`✓ Ping bem-sucedido! Status: ${data.statusCode} | Tempo: ${data.responseTime}ms`, 'success');
        await loadStatus();
      } else {
        showToast(`✗ Ping falhou: ${data.error || data.message}`, 'error');
      }
    } catch (error) {
      showToast('✗ Erro ao executar teste de ping', 'error');
    } finally {
      setTestLoading(false);
    }
  };

  // Copiar URL para clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('✓ URL copiada para a área de transferência!', 'success');
  };

  // Formatar data/hora
  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR');
  };

  return (
    <>
      <Head>
        <title>Keep-Alive Monitor</title>
        <meta name="description" content="Sistema para manter sites ativos automaticamente" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-8 px-4">
        {/* Toast de notificação */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 toast px-6 py-4 rounded-lg shadow-lg text-white ${toast.type === 'success' ? 'bg-success' :
            toast.type === 'error' ? 'bg-error' :
              'bg-blue-500'
            }`}>
            {toast.message}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              🚀 Keep-Alive Monitor
            </h1>
            <p className="text-white/80 text-lg">
              Mantenha seus sites ativos 24/7 automaticamente
            </p>
          </div>

          {/* Card do Monitor Local */}
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6 border-l-4 border-primary">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                🖥️ Monitor em Tempo Real
              </h2>
              <div className="flex gap-4">
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase font-bold">Sucesso</div>
                  <div className="text-xl font-bold text-success">{stats.success}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase font-bold">Falha</div>
                  <div className="text-xl font-bold text-error">{stats.fail}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-md flex items-center justify-center gap-2 ${isMonitoring
                    ? 'bg-red-100 text-red-600 hover:bg-red-200 border-2 border-red-500'
                    : 'bg-primary text-white hover:bg-blue-600'
                  }`}
              >
                {isMonitoring ? (
                  <><span>⏹️</span> Parar Monitor</>
                ) : (
                  <><span>▶️</span> Iniciar Monitor</>
                )}
              </button>

              {isMonitoring && nextPingTime && (
                <div className="text-sm text-gray-600 animate-pulse">
                  Próximo acesso em: {Math.max(0, Math.round((nextPingTime - Date.now()) / 1000))}s
                </div>
              )}
            </div>

            {/* Histórico Local */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 uppercase border-b">
                Últimos 30 Registros
              </div>
              <div className="max-h-60 overflow-y-auto">
                {monitorHistory.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 italic">
                    Nenhum registro ainda. Clique em "Iniciar" para monitorar.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left">Hora</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Resposta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {monitorHistory.map(log => (
                        <tr key={log.id} className={log.success ? 'bg-green-50/30' : 'bg-red-50/30'}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.success ? 'bg-success text-white' : 'bg-error text-white'
                              }`}>
                              {log.success ? 'OK' : 'ERRO'} {log.statusCode !== 0 && log.statusCode}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {log.success ? `${log.responseTime}ms` : (log.error || 'Falha')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Card de Configuração */}
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ⚙️ Configuração
            </h2>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              {/* URL do Site */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do site para manter ativo
                </label>
                <input
                  type="url"
                  placeholder="https://meu-n8n.onrender.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={config.targetUrl}
                  onChange={(e) => setConfig({ ...config, targetUrl: e.target.value })}
                  required
                />
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key do cron-job.org
                  <a
                    href="https://console.cron-job.org/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary text-xs hover:underline"
                  >
                    (Onde obter?)
                  </a>
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    placeholder="sua-api-key-aqui"
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={config.apiKey}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showApiKey ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Intervalo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervalo entre pings (segundos)
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={config.interval}
                  onChange={(e) => setConfig({ ...config, interval: parseInt(e.target.value) })}
                >
                  <option value="30">30 segundos</option>
                  <option value="300">300 segundos (5 minutos)</option>
                  <option value="600">600 segundos (10 minutos)</option>
                  <option value="900">900 segundos (15 minutos)</option>
                  <option value="1800">1800 segundos (30 minutos)</option>
                </select>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <div className="spinner"></div>}
                  {loading ? 'Validando...' : '💾 Validar Configuração'}
                </button>

                <button
                  type="button"
                  onClick={handleTestPing}
                  disabled={testLoading || !status?.configured}
                  className="flex-1 bg-success text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {testLoading && <div className="spinner"></div>}
                  {testLoading ? 'Testando...' : '🔍 Testar Ping Agora'}
                </button>
              </div>
            </form>

            {/* Instruções após validação */}
            {showInstructions && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-2">📋 Próximas Etapas:</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Acesse <a href="https://vercel.com/dashboard" target="_blank" className="underline">Vercel Dashboard</a></li>
                  <li>Vá em: Seu Projeto → Settings → Environment Variables</li>
                  <li>Adicione as variáveis TARGET_URL, CRON_API_KEY e PING_INTERVAL</li>
                  <li>Faça um redeploy manual do projeto</li>
                  <li>Volte aqui e configure o cron-job.org (veja seção abaixo)</li>
                </ol>
              </div>
            )}
          </div>

          {/* Card de Status */}
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📊 Status do Sistema
            </h2>

            {/* Status da Configuração */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">Status da Configuração:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status?.configured
                  ? 'bg-success text-white'
                  : 'bg-error text-white'
                  }`}>
                  {status?.configured ? '✅ Configurado' : '❌ Não Configurado'}
                </span>
              </div>

              {status?.configured && status?.config?.targetUrl && (
                <div className="text-sm text-gray-600">
                  <strong>URL configurada:</strong> {status.config.targetUrl}
                </div>
              )}
            </div>

            {/* URL para Cron-Job.org */}
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <label className="block font-medium text-gray-700 mb-2">
                🔗 URL para configurar no cron-job.org:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={pingUrl}
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={() => copyToClipboard(pingUrl)}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 transition text-sm font-medium"
                >
                  📋 Copiar
                </button>
              </div>
            </div>

            {/* Último Ping */}
            {status?.stats?.lastPing && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3">Último Ping Executado:</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Data/Hora:</span>
                    <div className="font-medium">{formatDateTime(status.stats.lastPing.timestamp)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Status HTTP:</span>
                    <div className="font-medium">{status.stats.lastPing.statusCode}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Tempo de Resposta:</span>
                    <div className="font-medium">{status.stats.lastPing.responseTime}ms</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Resultado:</span>
                    <div className={`font-medium ${status.stats.lastPing.success ? 'text-success' : 'text-error'}`}>
                      {status.stats.lastPing.success ? '✅ Sucesso' : '❌ Falha'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Estatísticas */}
            {status?.stats && status.stats.totalPings > 0 && (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-primary">{status.stats.totalPings}</div>
                  <div className="text-sm text-gray-600">Total de Pings</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-success">{status.stats.successRate}%</div>
                  <div className="text-sm text-gray-600">Taxa de Sucesso</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-error">{status.stats.failedPings}</div>
                  <div className="text-sm text-gray-600">Falhas</div>
                </div>
              </div>
            )}
          </div>

          {/* Card de Instruções */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="text-2xl font-bold text-gray-800">
                📘 Como configurar o cron-job.org
              </h2>
              <span className="text-2xl">{showInstructions ? '▲' : '▼'}</span>
            </button>

            {showInstructions && (
              <div className="mt-4 space-y-4 text-gray-700">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-2">1️⃣ Criar conta</h3>
                  <p className="text-sm">Acesse <a href="https://console.cron-job.org" target="_blank" className="text-primary underline">console.cron-job.org</a> e crie uma conta gratuita</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-2">2️⃣ Obter API Key</h3>
                  <p className="text-sm">Vá em Settings → API → Copie sua API Key e cole no campo acima</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-2">3️⃣ Criar Cronjob</h3>
                  <p className="text-sm mb-2">Clique em "Create cronjob" e configure:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside ml-4">
                    <li><strong>Title:</strong> Keep-Alive Monitor</li>
                    <li><strong>URL:</strong> A URL gerada acima ({pingUrl})</li>
                    <li><strong>Schedule:</strong> Every X minutes (conforme configurado)</li>
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-2">4️⃣ Adicionar Header</h3>
                  <p className="text-sm mb-2">Na seção "Request", adicione um header:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside ml-4">
                    <li><strong>Header name:</strong> X-Api-Key</li>
                    <li><strong>Header value:</strong> Sua API Key do cron-job.org</li>
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-2">5️⃣ Salvar e Ativar</h3>
                  <p className="text-sm">Clique em "Create" e certifique-se de que o cronjob está ativo (toggle verde)</p>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <h3 className="font-bold text-warning mb-2">⚠️ Avisos Importantes</h3>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Configurações são armazenadas em variáveis de ambiente da Vercel</li>
                    <li>Após salvar variáveis, faça redeploy manual do projeto</li>
                    <li>Nunca compartilhe sua API Key publicamente</li>
                    <li>Logs são temporários e podem ser perdidos em redeploy</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-white/70 text-sm">
            <p>Keep-Alive Monitor v1.0 • Hospedado na Vercel</p>
            <p className="mt-1">100% Serverless • 100% Grátis</p>
          </div>
        </div>
      </main>
    </>
  );
}
