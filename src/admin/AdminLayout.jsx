import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import './admin-styles.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Sermons from './pages/Sermons';
import Events from './pages/Events';
import Donations from './pages/Donations';
import Blog from './pages/Blog';
import Prayer from './pages/Prayer';
import Ministries from './pages/Ministries';
import Leadership from './pages/Leadership';

function Shell() {
  const location = useLocation();
  const showHeader = location.pathname !== '/admin' && location.pathname !== '/admin/';

  return (
    <div className="admin-scope min-h-screen">
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="sermons" element={<Sermons />} />
        <Route path="events" element={<Events />} />
        <Route path="ministries" element={<Ministries />} />
        <Route path="donations" element={<Donations />} />
        <Route path="blog" element={<Blog />} />
        <Route path="prayer" element={<Prayer />} />
        <Route path="leadership" element={<Leadership />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
}

export default Shell;
