import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../../services';
import { Button, Input } from '../../ui';
import styles from './ForgotPasswordPage.module.css';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: string[] } } };
      const errors = error.response?.data?.errors;
      setError(errors?.length ? errors.join(', ') : 'Erro ao enviar email de redefinição');
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
          <h1 className={styles.logoTitle}>Esqueci minha senha</h1>
          <p className={styles.logoSubtitle}>
            Informe seu email para receber o link de redefinição
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {success ? (
          <>
            <div className={styles.success}>
              Se o email informado estiver cadastrado, você receberá um link para redefinir sua senha.
              Verifique sua caixa de entrada e spam.
            </div>
            <div className={styles.backLink}>
              <Link to="/login">Voltar para o login</Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" fullWidth isLoading={isLoading}>
              Enviar link de redefinição
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
