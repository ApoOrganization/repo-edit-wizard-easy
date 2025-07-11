import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/brand';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message || 'Login failed');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
      <Card className="w-full max-w-2xl bg-[#EDF252] border-none shadow-xl">
        <CardHeader className="text-center p-8">
          <div className="flex justify-center mb-6">
            <Logo variant="icon" width={100} height={100} showName={false} />
          </div>
          <CardTitle className="text-2xl font-bold text-[#0D0D0D] mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Welcome Back
          </CardTitle>
          <CardDescription className="text-[#C861FF] text-3xl font-black mb-6" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Venture forth as an Eventturer!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0D0D0D] font-medium" style={{ fontFamily: 'Satoshi, sans-serif' }}>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="rounded-xl border-2 border-[#737373] focus:border-[#C861FF] bg-white px-4 py-3 text-[#0D0D0D] placeholder:text-[#737373] transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#0D0D0D] font-medium" style={{ fontFamily: 'Satoshi, sans-serif' }}>Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="rounded-xl border-2 border-[#737373] focus:border-[#C861FF] bg-white px-4 py-3 text-[#0D0D0D] placeholder:text-[#737373] transition-colors"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-[#737373]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-[#020126] hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;