import Sidebar from './Sidebar';
import Header from './Header';
import Notification from '../shared/Notification';

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="main-content">
          {children}
        </main>
      </div>
      <Notification />
    </div>
  );
}
