import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';

function AppContent() {
  const { currentPage } = useApp();

  return (
    <Layout>
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'transactions' && <Transactions />}
      {currentPage === 'insights' && <Insights />}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
