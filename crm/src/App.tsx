import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import Layout from './components/Layout';
import PointLoader from './components/PointLoader';
import Setup from './pages/Setup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pipeline from './pages/Pipeline';
import Accounts from './pages/Accounts';
import AccountDetail from './pages/AccountDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Money from './pages/Money';
import DocumentEditor from './pages/DocumentEditor';
import PrintDocument from './pages/PrintDocument';
import CalendarPage from './pages/CalendarPage';
import Settings from './pages/Settings';

function Shell() {
  const { session, loading } = useAuth();

  if (!supabase) return <Setup />;
  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <PointLoader />
      </div>
    );
  }
  if (!session) return <Login />;

  return (
    <Routes>
      {/* Print view renders without the app chrome */}
      <Route path="/print/:kind/:id" element={<PrintDocument />} />
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/accounts/:id" element={<AccountDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/money" element={<Money />} />
        <Route path="/money/quotes/new" element={<DocumentEditor kind="quote" />} />
        <Route path="/money/quotes/:id" element={<DocumentEditor kind="quote" />} />
        <Route path="/money/invoices/new" element={<DocumentEditor kind="invoice" />} />
        <Route path="/money/invoices/:id" element={<DocumentEditor kind="invoice" />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </BrowserRouter>
  );
}
