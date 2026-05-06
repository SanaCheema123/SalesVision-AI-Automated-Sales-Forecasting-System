import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  return (
    <div className="flex h-screen" style={{ background: '#0f1117' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto" style={{ background: '#0f1117' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}