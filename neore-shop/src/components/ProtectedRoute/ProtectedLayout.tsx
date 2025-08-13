import { Outlet } from 'react-router-dom';
import NavBar from '../Navbar/NavBar';

export default function ProtectedLayout() {
  return (
    <div>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
