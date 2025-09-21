import { AuthTemplateOptions } from '../types';

export function getAuthContextTemplate(options: AuthTemplateOptions): string {
  return `
import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [token, setToken] = useState(localStorage.getItem('token'));

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
`;
}

export function getLoginPageTemplate(options: AuthTemplateOptions): string {
  const { theme } = options;
  const isDark = theme === 'dark';
  
  const bgClass = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardClass = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const inputClass = isDark 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500';

  return `
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/api/v1/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(\`\${API_URL}/login\`, {
        email: email,
        password: password
      });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      alert('Login gagal: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center ${bgClass} px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold ${textClass}">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <div className="${cardClass} border rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium ${textClass} mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border ${inputClass} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium ${textClass} mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 py-3 border ${inputClass} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} hover:${isDark ? 'text-gray-300' : 'text-gray-700'} transition duration-200" />
                  ) : (
                    <Eye className="h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} hover:${isDark ? 'text-gray-300' : 'text-gray-700'} transition duration-200" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'} px-2">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Google Login Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="group relative w-full flex justify-center py-3 px-4 border ${isDark ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
`;
}

export function getHomePageTemplate(options: AuthTemplateOptions): string {
  const { theme } = options;
  const isDark = theme === 'dark';
  
  const bgClass = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardClass = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textClass = isDark ? 'text-white' : 'text-gray-900';

  return `
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Home as HomeIcon } from 'lucide-react';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen ${bgClass}">
      {/* Header */}
      <header className="${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <HomeIcon className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold ${textClass}">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium ${textClass}">
                    {user.full_name || user.name || 'User'}
                  </span>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'} transition duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="${cardClass} border rounded-lg shadow-sm p-6">
            {user ? (
              <div className="text-center">
                <div className="mx-auto h-24 w-24 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold ${textClass} mb-2">
                  Welcome, {user.full_name || user.name || 'User'}!
                </h2>
                <p className="${isDark ? 'text-gray-400' : 'text-gray-600'}">
                  You are successfully logged in to your dashboard.
                </p>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4">
                    <h3 className="text-lg font-semibold ${textClass}">Profile</h3>
                    <p className="${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1">
                      Manage your account
                    </p>
                  </div>
                  <div className="${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4">
                    <h3 className="text-lg font-semibold ${textClass}">Settings</h3>
                    <p className="${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1">
                      Configure preferences
                    </p>
                  </div>
                  <div className="${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4">
                    <h3 className="text-lg font-semibold ${textClass}">Help</h3>
                    <p className="${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1">
                      Get support
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2">Loading...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
`;
}

export function getPrivateRouteTemplate(options: AuthTemplateOptions): string {
  return `
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

`;
}

export function getGoogleCallbackTemplate(options: AuthTemplateOptions): string {
  const { theme } = options;
  const isDark = theme === 'dark';
  
  const bgClass = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';

  return `
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userParam = urlParams.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        login(user, token);
        navigate("/");
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
      }
    } else {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        navigate("/");
      } else {
        navigate("/login");
      }
    }
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center ${bgClass}">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h2 className="mt-4 text-lg font-medium ${textClass}">Processing your login...</h2>
        <p className="mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}">
          Please wait while we authenticate your Google account.
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;
`;
}

export function getAppTemplate(options: AuthTemplateOptions): string {
  return `
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route element={<PrivateRoute/>}>
            <Route path='/' element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
`;
}
