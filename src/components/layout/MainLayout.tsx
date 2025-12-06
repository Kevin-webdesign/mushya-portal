import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 transition-all duration-300">
        <TopNav />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
