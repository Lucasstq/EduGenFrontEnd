import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { worksheetService } from '../../../services';
import { Button, Card } from '../../ui';
import {
  VersionSpec,
  Question,
  QuestionType,
  Audience,
} from '../../../types';
import styles from './ActivityDetailPage.module.css';

export function ActivityDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [spec, setSpec] = useState<VersionSpec | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadActivitySpec();
    }
  }, [id]);

  const loadActivitySpec = async () => {
    try {
      setIsLoading(true);
      const data = await worksheetService.getVersionSpec(Number(id));
      setSpec(data);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string } } };
      if (error.response?.status === 400) {
        setError('Atividade ainda está sendo gerada. Aguarde um momento.');
      } else {
        setError(error.response?.data?.message || 'Erro ao carregar atividade.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownload = async (audience: Audience) => {
    if (!id) return;

    setIsDownloading(true);
    try {
      const blob = await worksheetService.downloadPdf(Number(id), audience);
      const filename = `atividade_${id}_${audience.toLowerCase()}.pdf`;
      worksheetService.downloadPdfFile(blob, filename);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Erro ao baixar PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    return (
      <Card key={index} className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <span className={styles.questionNumber}>Questão {question.orderNumber}</span>
          <span className={styles.questionType}>{getQuestionTypeLabel(question.type)}</span>
        </div>

        <p className={styles.questionStatement}>{question.statement}</p>

        {/* Opções para múltipla escolha */}
        {question.type === QuestionType.MCQ && question.options && (
          <div className={styles.options}>
            {question.options.map((option, optIndex) => (
              <div
                key={optIndex}
                className={`${styles.option} ${
                  showAnswers && option.label === question.correctAnswer
                    ? styles.correctOption
                    : ''
                }`}
              >
                <span className={styles.optionLabel}>{option.label}</span>
                <span className={styles.optionText}>{option.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Verdadeiro/Falso */}
        {question.type === QuestionType.TRUE_FALSE && (
          <div className={styles.options}>
            <div
              className={`${styles.option} ${
                showAnswers && question.correctAnswer === 'TRUE' ? styles.correctOption : ''
              }`}
            >
              <span className={styles.optionLabel}>V</span>
              <span className={styles.optionText}>Verdadeiro</span>
            </div>
            <div
              className={`${styles.option} ${
                showAnswers && question.correctAnswer === 'FALSE' ? styles.correctOption : ''
              }`}
            >
              <span className={styles.optionLabel}>F</span>
              <span className={styles.optionText}>Falso</span>
            </div>
          </div>
        )}

        {/* Preencher Lacunas e Dissertativa - Área de resposta */}
        {(question.type === QuestionType.FILL_BLANK || question.type === QuestionType.OPEN) && (
          <div className={styles.answerArea}>
            <span className={styles.answerLabel}>Resposta:</span>
            <div className={styles.answerLine}></div>
          </div>
        )}

        {/* Mostrar resposta correta */}
        {showAnswers && question.correctAnswer && (
          <div className={styles.correctAnswer}>
            <span className={styles.correctAnswerLabel}>Resposta correta:</span>
            <span className={styles.correctAnswerText}>{question.correctAnswer}</span>
          </div>
        )}

        {/* Mostrar explicação */}
        {showAnswers && question.explanation && (
          <div className={styles.explanation}>
            <span className={styles.explanationLabel}>Explicação:</span>
            <p className={styles.explanationText}>{question.explanation}</p>
          </div>
        )}
      </Card>
    );
  };

  const getQuestionTypeLabel = (type: QuestionType): string => {
    const labels: Record<QuestionType, string> = {
      [QuestionType.MCQ]: 'Múltipla Escolha',
      [QuestionType.OPEN]: 'Dissertativa',
      [QuestionType.TRUE_FALSE]: 'V ou F',
      [QuestionType.FILL_BLANK]: 'Lacunas',
      [QuestionType.VARIABLE]: 'Variado',
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <header className={styles.header}>
            <button className={styles.backButton} onClick={handleBack}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <h1 className={styles.title}>Detalhes da Atividade</h1>
          </header>
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
            <Button onClick={loadActivitySpec} variant="outline">
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Atividade</h1>
            <p className={styles.subtitle}>
              {spec?.questions.length || 0} questões
            </p>
          </div>
        </header>

        {/* Description */}
        {spec?.description && (
          <Card className={styles.descriptionCard}>
            <p className={styles.description}>{spec.description}</p>
          </Card>
        )}

        {/* Toggle Answers */}
        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleButton} ${showAnswers ? styles.active : ''}`}
            onClick={() => setShowAnswers(!showAnswers)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                fill="currentColor"
              />
            </svg>
            {showAnswers ? 'Ocultar Respostas' : 'Mostrar Respostas'}
          </button>
        </div>

        {/* Questions */}
        <div className={styles.questionsList}>
          {spec?.questions.map((question, index) => renderQuestion(question, index))}
        </div>

        {/* Download Actions */}
        <div className={styles.downloadSection}>
          <h3 className={styles.downloadTitle}>Baixar PDF</h3>
          <div className={styles.downloadButtons}>
            <Button
              onClick={() => handleDownload(Audience.STUDENTS)}
              isLoading={isDownloading}
              fullWidth
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z"
                  fill="currentColor"
                />
              </svg>
              PDF para Alunos
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDownload(Audience.TEACHERS)}
              isLoading={isDownloading}
              fullWidth
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z"
                  fill="currentColor"
                />
              </svg>
              PDF para Professores
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityDetailPage;
