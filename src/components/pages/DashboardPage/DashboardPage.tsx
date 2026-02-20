import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import { userService } from '../../../services';
import { Button, Card } from '../../ui';
import {
  DashboardData,
  RecentActivity,
  SubjectLabels,
  SubjectAbbreviations,
  GradeLabels,
  Subject,
} from '../../../types';
import styles from './DashboardPage.module.css';

// Cores por matéria
const subjectColors: Record<Subject, string> = {
  [Subject.MATEMATICA]: '#3b82f6',
  [Subject.PORTUGUES]: '#8b5cf6',
  [Subject.CIENCIAS]: '#22c55e',
  [Subject.HISTORIA]: '#f97316',
  [Subject.GEOGRAFIA]: '#06b6d4',
  [Subject.HORTICULTURA]: '#84cc16',
  [Subject.ENSINO_RELIGIOSO]: '#ec4899',
  [Subject.ARTE_E_EDUCACAO]: '#f43f5e',
};

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [dashboard, activities] = await Promise.all([
        userService.getDashboard(),
        userService.getLatestActivities(),
      ]);
      setDashboardData(dashboard);
      setRecentActivities(activities);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewActivity = () => {
    navigate('/nova-atividade');
  };

  const handleViewHistory = () => {
    navigate('/historico');
  };

  const handleViewActivity = (versionId: number) => {
    navigate(`/atividade/${versionId}`);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <p className={styles.greeting}>Bem-vinda de volta,</p>
            <h1 className={styles.username}>
              {user?.username || dashboardData?.username} 👋
            </h1>
          </div>
        </header>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#3b82f6' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>
                {dashboardData?.totalWorksheets || 0}
              </span>
              <span className={styles.statLabel}>Atividades</span>
            </div>
          </Card>

          <Card className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#f59e0b' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>
                {dashboardData?.totalExercises || 0}
              </span>
              <span className={styles.statLabel}>Questões</span>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className={styles.actionsGrid}>
          <Card className={styles.actionCard} clickable onClick={handleNewActivity}>
            <div className={styles.actionIcon} style={{ backgroundColor: '#f59e0b' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 9L20.25 6.25L23 5L20.25 3.75L19 1L17.75 3.75L15 5L17.75 6.25L19 9ZM11.5 9.5L9 4L6.5 9.5L1 12L6.5 14.5L9 20L11.5 14.5L17 12L11.5 9.5Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className={styles.actionContent}>
              <span className={styles.actionTitle}>Nova Atividade</span>
              <span className={styles.actionDescription}>Gere questões...</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles.actionArrow}>
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
            </svg>
          </Card>

          <Card className={styles.actionCard} clickable onClick={handleViewHistory}>
            <div className={styles.actionIcon} style={{ backgroundColor: '#8b5cf6' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className={styles.actionContent}>
              <span className={styles.actionTitle}>Ver Histórico</span>
              <span className={styles.actionDescription}>Acesse ativid...</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles.actionArrow}>
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
            </svg>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${Math.min((dashboardData?.totalWorksheets || 0) * 10, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* CTA Button */}
        <Button fullWidth onClick={handleNewActivity} className={styles.ctaButton}>
          + Nova Atividade
        </Button>

        {/* Recent Activities */}
        <section className={styles.recentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recentes</h2>
            <button className={styles.viewAllButton} onClick={handleViewHistory}>
              Ver tudo
            </button>
          </div>

          <div className={styles.activitiesList}>
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <Card
                  key={activity.version_id}
                  className={styles.activityCard}
                  clickable
                  onClick={() => handleViewActivity(activity.version_id)}
                >
                  <div
                    className={styles.activityBadge}
                    style={{ backgroundColor: subjectColors[activity.subject] }}
                  >
                    {SubjectAbbreviations[activity.subject]}
                  </div>
                  <div className={styles.activityContent}>
                    <span className={styles.activityTitle}>
                      {activity.worksheet_topic}
                    </span>
                    <div className={styles.activityMeta}>
                      <span
                        className={styles.activitySubjectTag}
                        style={{
                          backgroundColor: `${subjectColors[activity.subject]}20`,
                          color: subjectColors[activity.subject],
                        }}
                      >
                        {SubjectLabels[activity.subject]}
                      </span>
                      <span className={styles.activityInfo}>
                        {GradeLabels[activity.grade]} · {activity.question_count}q
                      </span>
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles.activityArrow}>
                    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
                  </svg>
                </Card>
              ))
            ) : (
              <p className={styles.emptyMessage}>
                Nenhuma atividade criada ainda. Comece criando sua primeira atividade!
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <button className={`${styles.navItem} ${styles.active}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 8H8V4H4V8ZM10 20H14V16H10V20ZM4 20H8V16H4V20ZM4 14H8V10H4V14ZM10 14H14V10H10V14ZM16 4V8H20V4H16ZM10 8H14V4H10V8ZM16 14H20V10H16V14ZM16 20H20V16H16V20Z"
              fill="currentColor"
            />
          </svg>
          <span>Início</span>
        </button>
        <button className={styles.navItem} onClick={handleViewHistory}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"
              fill="currentColor"
            />
          </svg>
          <span>Histórico</span>
        </button>
        <button className={styles.navItem} onClick={logout}>
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

export default DashboardPage;
