import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import useStore from '../../store/useStore';
import { LoadingButton } from '../common/Loading';
import { validateEmail } from '../../utils/helpers';
import { DEMO_MODE } from '../../config/firebase';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, loading, error } = useStore();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      if (isSignUp) {
        // For signup, don't specify business type - user will select later
        await signUp(data.email, data.password, null);
      } else {
        await signIn(data.email, data.password);
      }
      reset();
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            MTD Transaction Tracker
          </p>
        </div>

        {/* Demo Mode Notice */}
        {DEMO_MODE && (
          <div className="bg-blue-900 border border-blue-700 text-blue-100 px-4 py-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium">Demo Mode Active</p>
                <p className="text-sm">
                  You can use any email and password to create an account or sign in. 
                  Data will be stored locally in your browser.
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register('email', {
                    required: 'Email is required',
                    validate: value => validateEmail(value) || 'Please enter a valid email address'
                  })}
                  type="email"
                  id="email"
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

          </div>

          <div>
            <LoadingButton
              type="submit"
              isLoading={loading}
              className="btn-primary w-full text-base py-3"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </LoadingButton>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium focus:outline-none focus:underline"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>This application helps you track income and expenses for MTD compliance.</p>
          <p className="mt-1">Secure authentication powered by Firebase.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
