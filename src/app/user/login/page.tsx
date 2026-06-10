'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/button';
import { checkIsLogged } from "@/store/store";
import { RootState } from '@/store/store';
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "@/store/slices/userSlice";

export default function LoginPage() {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // Store user with token
      dispatch(setCurrentUser({ 
        email: data.email,
        token: data.token,
        expiresAt: data.expiresAt
      }));
      
      router.push('/user');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <main className="flex items-center justify-center">
      <div className="px-8 py-4 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full px-3 bg-white py-2 border rounded-md shadow-sm focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 block w-full px-3 bg-white py-2 border  rounded-md shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="p-3 bg-gradient-primary text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit">
            {'Login'}
          </Button>
        </form>
      </div>
    </main>
  );
}
