import React from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login: React.FC = () => {
  const router = useRouter();
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const loginInfo = {
      email: formData.get('user_email'),
      password: formData.get('user_password'),
    };
    try {
      await axios.post('http://localhost:3001/user/login', loginInfo, {
        withCredentials: true,
      });
      router.replace('/');
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-8 w-full max-w-md">
      <form onSubmit={handleFormSubmit} className="mt-12 max-w-96">
        <div className="pb-4">
          <label
            htmlFor="user_email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <Input name="user_email" type="email" />
        </div>
        <div className="pb-6">
          <label
            htmlFor="user_password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input name="user_password" type="password" />
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </form>
      <Link href="/register">
        <div className="mt-4 text-sm font-medium w-fit underline">
          Register
        </div>
      </Link>
      </div>
    </div>
  );
};

export default Login;
