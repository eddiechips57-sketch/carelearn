import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ClickTrackingProvider } from './contexts/ClickTrackingContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import FindCourses from './pages/FindCourses';
import CareerGuides from './pages/CareerGuides';
import FundingHub from './pages/FundingHub';
import RoleLibrary from './pages/RoleLibrary';
import RoleDetail from './pages/RoleDetail';
import Community from './pages/Community';
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Support from './pages/Support';

export default function App() {
  return (
    <AuthProvider>
      <ClickTrackingProvider>
        <Router>
          <div className="flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/courses" element={<FindCourses />} />
                <Route path="/guides" element={<CareerGuides />} />
                <Route path="/guides/:slug" element={<CareerGuides />} />
                <Route path="/funding" element={<FundingHub />} />
                <Route path="/roles" element={<RoleLibrary />} />
                <Route path="/roles/:slug" element={<RoleDetail />} />
                <Route path="/community" element={<Community />} />
                <Route path="/community/blog/:slug" element={<BlogPost />} />
                <Route path="/support" element={<Support />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ClickTrackingProvider>
    </AuthProvider>
  );
}
