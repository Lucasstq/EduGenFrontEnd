import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../../services';
import { Button, Input } from '../../ui';
import styles from './ResetPasswordPage.module.css';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [form, setForm] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.newPassword !== form.confirmNewPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!token) {
      setError('Token de redefinição não encontrado');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: string[] } } };
      const errors = error.response?.data?.errors;
      setError(errors?.length ? errors.join(', ') : 'Erro ao redefinir senha');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
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
            <h1 className={styles.logoTitle}>Link inválido</h1>
          </div>
          <div className={styles.error}>
            O link de redefinição de senha é inválido ou expirou.
          </div>
          <div className={styles.backLink}>
            <Link to="/forgot-password">Solicitar novo link</Link>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className={styles.logoTitle}>Nova senha</h1>
          <p className={styles.logoSubtitle}>Defina sua nova senha abaixo</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {success ? (
          <>
            <div className={styles.success}>
              Senha redefinida com sucesso! Você será redirecionado para o login...
            </div>
            <div className={styles.backLink}>
              <Link to="/login">Ir para o login</Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Nova senha"
              type="password"
              name="newPassword"
              placeholder="••••••••"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              fullWidth
              required
            />
            <Input
              label="Confirmar nova senha"
              type="password"
              name="confirmNewPassword"
              placeholder="••••••••"
              value={form.confirmNewPassword}
              onChange={(e) =>
                setForm({ ...form, confirmNewPassword: e.target.value })
              }
              fullWidth
              required
            />
            <p className={styles.passwordHint}>
              A senha deve ter 8-100 caracteres, incluindo 1 letra maiúscula, 1
              minúscula e 1 número.
            </p>
            <Button type="submit" fullWidth isLoading={isLoading}>
              Redefinir senha
            </Button>
            <div className={styles.backLink}>
              <Link to="/login">Voltar para o login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
