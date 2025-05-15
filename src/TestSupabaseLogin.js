import { useState } from 'react';
import { supabase } from './config/supabaseClient';

export default function TestSupabaseLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setResult('Logging in...');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setResult(error ? error.message : JSON.stringify(data));
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button type="submit">Test Login</button>
      <div>{result}</div>
    </form>
  );
}
