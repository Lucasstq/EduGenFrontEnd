import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import { userService } from '../../../services';
import { Button, Input, Card } from '../../ui';
import styles from './Profilepage.module.css';

export function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleEdit = () => {
    setUsername(user?.username || '');
    setIsEditing(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUsername(user?.username || '');
    setError('');
  };

  const handleSave = async () => {
    if (!username.trim() || username.trim().length < 3) {
      setError('O nome de usuário deve ter no mínimo 3 caracteres.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await userService.updateProfile(username.trim());
      await refreshUser();
      setIsEditing(false);
      setSuccessMessage('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao atualizar perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      setIsLoggingOut(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => navigate('/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                fill="currentColor"
              />
            </svg>
          </button>
          <h1 className={styles.headerTitle}>Meu Perfil</h1>
          <div style={{ width: 36 }} />
        </div>

        {/* Avatar & Info */}
        <div className={styles.profileHero}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              {user ? getInitial(user.username) : '?'}
            </div>
            <div className={styles.avatarGlow} />
          </div>
          <h2 className={styles.profileName}>{user?.username}</h2>
          <p className={styles.profileEmail}>{user?.email}</p>
        </div>

        {/* Feedback messages */}
        {error && <div className={styles.error}>{error}</div>}
        {successMessage && <div className={styles.success}>{successMessage}</div>}

        {/* Edit Username Card */}
        <Card className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className={styles.sectionTitle}>Informações da Conta</span>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Nome de usuário</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  autoFocus
                />
              ) : (
                <p className={styles.fieldValue}>{user?.username}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>E-mail</label>
              <p className={styles.fieldValue}>{user?.email}</p>
            </div>

            {user?.createdAt && (
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Membro desde</label>
                <p className={styles.fieldValue}>{formatDate(user.createdAt)}</p>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className={styles.editActions}>
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} isLoading={isSaving}>
                Salvar
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={handleEdit} fullWidth>
              Editar nome de usuário
            </Button>
          )}
        </Card>

        {/* Logout Card */}
        <Card className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={`${styles.sectionIcon} ${styles.dangerIcon}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className={styles.sectionTitle}>Sessão</span>
          </div>

          {!showLogoutConfirm ? (
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowLogoutConfirm(true)}
            >
              Sair da conta
            </Button>
          ) : (
            <div className={styles.confirmLogout}>
              <p className={styles.confirmText}>Tem certeza que deseja sair?</p>
              <div className={styles.editActions}>
                <Button
                  variant="secondary"
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={isLoggingOut}
                >
                  Cancelar
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleLogout}
                  isLoading={isLoggingOut}
                >
                  Sair
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <button className={styles.navItem} onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 8H8V4H4V8ZM10 20H14V16H10V20ZM4 20H8V16H4V20ZM4 14H8V10H4V14ZM10 14H14V10H10V14ZM16 4V8H20V4H16ZM10 8H14V4H10V8ZM16 14H20V10H16V14ZM16 20H20V16H16V20Z"
              fill="currentColor"
            />
          </svg>
          <span>Início</span>
        </button>
        <button className={styles.navItem} onClick={() => navigate('/historico')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"
              fill="currentColor"
            />
          </svg>
          <span>Histórico</span>
        </button>
        <button className={`${styles.navItem} ${styles.active}`} onClick={() => navigate('/perfil')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
              fill="currentColor"
            />
          </svg>
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
}

export default ProfilePage;