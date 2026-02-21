import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../services';
import { Card, Select } from '../../ui';
import {
  Subject,
  RecentActivity,
  SubjectLabels,
  SubjectAbbreviations,
  GradeLabels,
} from '../../../types';
import styles from './HistoryPage.module.css';

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

export function HistoryPage() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState<Subject | ''>('');

  const subjectOptions = [
    { value: '', label: 'Todas as matérias' },
    ...Object.values(Subject).map((value) => ({
      value,
      label: SubjectLabels[value],
    })),
  ];

  useEffect(() => {
    loadActivities();
  }, [currentPage, selectedSubject]);

  const loadActivities = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getActivities(
        currentPage,
        10,
        selectedSubject || undefined
      );
      setActivities(response.activities);
      setTotalPages(response.totalPages);
      setTotalActivities(response.totalActivities);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleViewActivity = (versionId: number) => {
    navigate(`/atividade/${versionId}`);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value as Subject | '');
    setCurrentPage(0);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div>
            <h1 className={styles.title}>Histórico</h1>
            <p className={styles.subtitle}>
              {totalActivities} {totalActivities === 1 ? 'atividade' : 'atividades'}
            </p>
          </div>
        </header>

        {/* Filter */}
        <div className={styles.filterSection}>
          <Select
            options={subjectOptions.slice(1)}
            value={selectedSubject}
            onChange={handleSubjectChange}
            fullWidth
          />
        </div>

        {/* Activities List */}
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        ) : activities.length > 0 ? (
          <>
            <div className={styles.activitiesList}>
              {activities.map((activity) => (
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
                    <span className={styles.activityDate}>
                      {formatDate(activity.created_at)}
                    </span>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={styles.activityArrow}
                  >
                    <path
                      d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"
                      fill="currentColor"
                    />
                  </svg>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <span className={styles.pageInfo}>
                  Página {currentPage + 1} de {totalPages}
                </span>
                <button
                  className={styles.pageButton}
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path
                d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z"
                fill="currentColor"
              />
            </svg>
            <h3 className={styles.emptyTitle}>Nenhuma atividade encontrada</h3>
            <p className={styles.emptyText}>
              {selectedSubject
                ? 'Não há atividades para esta matéria.'
                : 'Comece criando sua primeira atividade!'}
            </p>
          </div>
        )}
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
        <button className={`${styles.navItem} ${styles.active}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"
              fill="currentColor"
            />
          </svg>
          <span>Histórico</span>
        </button>
        <button className={styles.navItem} onClick={() => navigate('/perfil')}>
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

export default HistoryPage;
