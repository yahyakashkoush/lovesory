'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to admin dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 mb-2">
              Create Account
            </h1>
            <p className="text-rose-600">Admin Registration</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-smooth"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-smooth"
                placeholder="ahmed@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-smooth"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-rose-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-smooth"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-rose-600">
              Already have an account?{' '}
              <Link href="/admin/login" className="font-semibold hover:text-rose-700">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
