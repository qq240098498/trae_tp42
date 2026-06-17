import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import EntryPage from '@/pages/EntryPage';
import ChatPage from '@/pages/ChatPage';
import DashboardPage from '@/pages/DashboardPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/entry" replace />} />
        <Route element={<Layout />}>
          <Route path="/entry" element={<EntryPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
