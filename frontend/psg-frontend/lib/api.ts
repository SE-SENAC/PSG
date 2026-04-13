import axios from 'axios';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // No navegador: usa caminho relativo a partir da origem atual (Nginx lida com o roteamento)
    return ''; 
  }
  // No servidor (SSR): usa o nome da rede interna do Docker ou a variável de ambiente
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

const api = axios.create({
  baseURL: `${getBaseUrl()}/api`,
});

// Interceptador de requisição: adiciona token de autenticação
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptador de resposta: trata erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';

    if (error.response) {
      // O servidor respondeu com um status code fora do range 2xx
      const data = error.response.data;
      
      // Tenta extrair a mensagem do formato NestJS
      if (data && data.message) {
        message = Array.isArray(data.message) 
          ? data.message.join(', ') 
          : data.message;
      }

      // Trata erros de autenticação (401)
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Opcional: redirecionar para login
          // window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      message = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    }

    console.error('[API Error]:', message, error);
    
    // Podemos anexar a mensagem amigável ao erro para ser usada nos componentes
    error.friendlyMessage = message;
    
    return Promise.reject(error);
  }
);

export default api;
