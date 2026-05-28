import { useState } from 'react';
import { login } from '../api/login';

const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await login({ email, password });
      onSuccess(); // refetch auth
    } catch (e) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-20">
      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="w-full border p-2 rounded"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="w-full bg-primary text-white py-2 rounded">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
