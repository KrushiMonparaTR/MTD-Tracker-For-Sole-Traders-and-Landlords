import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus, FileText } from 'lucide-react';
import useStore from '../../store/useStore';
import { LoadingButton } from '../common/Loading';
import { BUSINESS_TYPES } from '../../config/categories';

const AuthForm = ({ businessType, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp, error } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password, businessType);
      } else {
        await signUp(email, password, businessType);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white p-3 rounded-lg shadow-lg">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-white ml-3">MTD Transaction Tracker</h1>
          </div>
          <h2 className="text-xl text-gray-300">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="text-gray-400 mt-1">
            {BUSINESS_TYPES[businessType]} Account
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <LoadingButton
              type="submit"
              isLoading={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isLogin ? (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Create Account</span>
                </>
              )}
            </LoadingButton>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>

          {/* Back Button */}
          <div className="mt-4 text-center">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-gray-300 text-sm"
            >
              ← Choose different business type
            </button>
          </div>

          {/* Demo Notice */}
          <div className="mt-6 bg-blue-900 border border-blue-700 rounded-lg p-4">
            <div className="text-blue-200 text-sm">
              <p className="font-semibold mb-1">Demo Mode Active</p>
              <p>Use the pre-filled credentials or any email/password to continue.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
