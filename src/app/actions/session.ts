import Cookies from "js-cookie";


export const verifySession = async () => {
  const cookie = Cookies.get('session');
  const session = cookie ? JSON.parse(cookie) : null;


  if (!session) {
    if (
      typeof window !== 'undefined' &&
      window.location.pathname !== '/login' &&
      !window.location.pathname.startsWith('/alterarSenha')
    ) {
      window.location.href = '/login';
    }
  }
  
  return session;
}