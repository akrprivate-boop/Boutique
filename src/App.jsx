import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Loader from './components/common/Loader';
import './styles/global.css';
import './styles/components.css';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fullpage-loader">
        <Loader text="Initializing Secure Session..." />
      </div>
    );
  }

  return isAuthenticated ? <DashboardPage /> : <LoginPage />;
}

export default App;
