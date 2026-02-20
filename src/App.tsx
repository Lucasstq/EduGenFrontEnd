import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts';
import {
  LoginPage,
  DashboardPage,
  NewActivityPage,
  HistoryPage,
  ActivityDetailPage,
  ProtectedRoute,
} from './components';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/historico" element={<HistoryPage />} />
            <Route path="/nova-atividade" element={<NewActivityPage />} />
            <Route path="/atividade/:id" element={<ActivityDetailPage />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

