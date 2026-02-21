import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts';
import {
  LoginPage,
  DashboardPage,
  NewActivityPage,
  HistoryPage,
  ActivityDetailPage,
  ProfilePage,
  ProtectedRoute,
} from './components';
import './styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

