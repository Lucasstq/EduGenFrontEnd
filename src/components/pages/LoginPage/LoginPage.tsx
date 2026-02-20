import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import { Button, Input } from '../../ui';
import styles from './LoginPage.module.css';

type TabType = 'login' | 'register';

export function LoginPage() {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login form
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });
  
  // Register form
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(loginForm);
      navigate('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      await register(registerForm);
      setActiveTab('login');
      setLoginForm({ username: registerForm.username, password: '' });
      setError('');
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className={styles.logoTitle}>EduGen</h1>
          <p className={styles.logoSubtitle}>Gerador de Atividades com IA</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Entrar
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'register' ? styles.active : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Cadastrar
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className={styles.form}>
            <Input
              label="Nome de usuário"
              type="text"
              name="username"
              placeholder="seu nome de usuário"
              value={loginForm.username}
              onChange={(e) =>
                setLoginForm({ ...loginForm, username: e.target.value })
              }
              fullWidth
              required
            />
            <Input
              label="Senha"
              type="password"
              name="password"
              placeholder="••••••••"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              fullWidth
              required
            />
            <Button type="submit" fullWidth isLoading={isLoading}>
              Entrar
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className={styles.form}>
            <Input
              label="Nome de usuário"
              type="text"
              name="username"
              placeholder="seunome"
              value={registerForm.username}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, username: e.target.value })
              }
              fullWidth
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, email: e.target.value })
              }
              fullWidth
              required
            />
            <Input
              label="Senha"
              type="password"
              name="password"
              placeholder="••••••••"
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
              fullWidth
              required
            />
            <Input
              label="Confirmar Senha"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={registerForm.confirmPassword}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  confirmPassword: e.target.value,
                })
              }
              fullWidth
              required
            />
            <p className={styles.passwordHint}>
              A senha deve ter 8-100 caracteres, incluindo 1 letra maiúscula, 1
              minúscula e 1 número.
            </p>
            <Button type="submit" fullWidth isLoading={isLoading}>
              Criar Conta
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
