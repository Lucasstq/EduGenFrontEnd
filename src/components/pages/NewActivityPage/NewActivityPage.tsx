import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { worksheetService } from '../../../services';
import { Button, Input, Card, Select } from '../../ui';
import {
  Subject,
  Grade,
  Difficulty,
  QuestionType,
  SubjectLabels,
  GradeLabels,
  DifficultyLabels,
  QuestionTypeLabels,
  CreateWorksheetRequest,
  VersionType,
} from '../../../types';
import styles from './NewActivityPage.module.css';

export function NewActivityPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'generating' | 'success'>('form');
  const [generatedVersionId, setGeneratedVersionId] = useState<number | null>(null);

  const [form, setForm] = useState<CreateWorksheetRequest>({
    subject: '' as Subject,
    grade: '' as Grade,
    topic: '',
    difficulty: '' as Difficulty,
    questionCount: 5,
    description: '',
    questionType: '' as QuestionType,
  });

  const subjectOptions = Object.values(Subject).map((value) => ({
    value,
    label: SubjectLabels[value],
  }));

  const gradeOptions = Object.values(Grade).map((value) => ({
    value,
    label: GradeLabels[value],
  }));

  const difficultyOptions = Object.values(Difficulty).map((value) => ({
    value,
    label: DifficultyLabels[value],
  }));

  const questionTypeOptions = Object.values(QuestionType).map((value) => ({
    value,
    label: QuestionTypeLabels[value],
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!form.subject || !form.grade || !form.topic || !form.difficulty || !form.questionType) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (form.questionCount < 1 || form.questionCount > 20) {
      setError('O número de questões deve ser entre 1 e 20.');
      return;
    }

    setIsLoading(true);
    setStep('generating');

    try {
      // 1. Criar worksheet
      const worksheet = await worksheetService.create(form);

      // 2. Gerar versão (aciona a IA)
      const version = await worksheetService.createVersion(worksheet.id, {
        versionType: VersionType.STUDENT_A,
        includeAnswers: false,
        includeExplanations: false,
      });

      setGeneratedVersionId(version.id);
      setStep('success');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao gerar atividade. Tente novamente.');
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewActivity = () => {
    if (generatedVersionId) {
      navigate(`/atividade/${generatedVersionId}`);
    }
  };

  const handleCreateAnother = () => {
    setForm({
      subject: '' as Subject,
      grade: '' as Grade,
      topic: '',
      difficulty: '' as Difficulty,
      questionCount: 5,
      description: '',
      questionType: '' as QuestionType,
    });
    setGeneratedVersionId(null);
    setStep('form');
    setError('');
  };

  const handleBack = () => {
    navigate('/');
  };

  if (step === 'generating') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <h2 className={styles.loadingTitle}>Gerando sua atividade...</h2>
          <p className={styles.loadingText}>
            Nossa IA está criando questões personalizadas para você.
            Isso pode levar alguns segundos.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className={styles.successTitle}>Atividade criada com sucesso!</h2>
          <p className={styles.successText}>
            Sua atividade sobre "{form.topic}" foi gerada e está pronta para uso.
          </p>
          <div className={styles.successActions}>
            <Button onClick={handleViewActivity} fullWidth>
              Ver Atividade
            </Button>
            <Button variant="outline" onClick={handleCreateAnother} fullWidth>
              Criar Outra
            </Button>
            <Button variant="ghost" onClick={handleBack} fullWidth>
              Voltar ao Início
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
          <div>
            <h1 className={styles.title}>Nova Atividade</h1>
            <p className={styles.subtitle}>Preencha os dados para gerar questões com IA</p>
          </div>
        </header>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Card className={styles.formCard}>
            <h2 className={styles.sectionTitle}>Informações Básicas</h2>

            <Select
              label="Matéria *"
              name="subject"
              options={subjectOptions}
              value={form.subject}
              onChange={(value) => setForm({ ...form, subject: value as Subject })}
              fullWidth
              required
            />

            <Select
              label="Ano Escolar *"
              name="grade"
              options={gradeOptions}
              value={form.grade}
              onChange={(value) => setForm({ ...form, grade: value as Grade })}
              fullWidth
              required
            />

            <Input
              label="Tópico/Tema *"
              name="topic"
              placeholder="Ex: Frações, Verbos no presente, Sistema Solar..."
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              fullWidth
              required
            />

            <Input
              label="Descrição (opcional)"
              name="description"
              placeholder="Informações adicionais sobre a atividade..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              fullWidth
            />
          </Card>

          <Card className={styles.formCard}>
            <h2 className={styles.sectionTitle}>Configurações das Questões</h2>

            <Select
              label="Dificuldade *"
              name="difficulty"
              options={difficultyOptions}
              value={form.difficulty}
              onChange={(value) => setForm({ ...form, difficulty: value as Difficulty })}
              fullWidth
              required
            />

            <Select
              label="Tipo de Questão *"
              name="questionType"
              options={questionTypeOptions}
              value={form.questionType}
              onChange={(value) => setForm({ ...form, questionType: value as QuestionType })}
              fullWidth
              required
            />

            <Input
              label="Número de Questões *"
              name="questionCount"
              type="number"
              min={1}
              max={20}
              placeholder="5"
              value={form.questionCount}
              onChange={(e) => setForm({ ...form, questionCount: parseInt(e.target.value) || 1 })}
              fullWidth
              required
            />
            <p className={styles.hint}>Mínimo: 1, Máximo: 20</p>
          </Card>

          <Button type="submit" fullWidth isLoading={isLoading} className={styles.submitButton}>
            Gerar Atividade
          </Button>
        </form>
      </div>
    </div>
  );
}

export default NewActivityPage;
