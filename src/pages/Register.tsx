import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/brand';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const { signUp, checkApprovedEmail } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailApproval = async (email: string) => {
    if (!validateEmail(email)) return;
    
    setIsCheckingEmail(true);
    try {
      const isApproved = await checkApprovedEmail(email);
      if (!isApproved) {
        setError('This email is not authorized to register. Please contact your administrator to get access.');
      } else {
        setError(''); // Clear any previous errors
      }
    } catch (err) {
      setError('Error checking email approval status');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleEmailBlur = () => {
    if (email) {
      checkEmailApproval(email);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        setError(error.message || 'Registration failed');
      } else {
        setSuccess('Registration successful! Please check your email to verify your account.');
        // Don't navigate immediately, let user read the message
        setTimeout(() => {
          navigate('/login');
        }, 3000);
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
            Create Account
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
            
            {success && (
              <Alert className="border-green-500 text-green-700 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0D0D0D] font-medium" style={{ fontFamily: 'Satoshi, sans-serif' }}>Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  disabled={isLoading || isCheckingEmail}
                  required
                  className="rounded-xl border-2 border-[#737373] focus:border-[#C861FF] bg-white px-4 py-3 text-[#0D0D0D] placeholder:text-[#737373] transition-colors"
                />
                {isCheckingEmail && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>
              <p className="text-xs text-[#737373]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                Only approved business emails can register
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#0D0D0D] font-medium" style={{ fontFamily: 'Satoshi, sans-serif' }}>Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="rounded-xl border-2 border-[#737373] focus:border-[#C861FF] bg-white px-4 py-3 text-[#0D0D0D] placeholder:text-[#737373] transition-colors"
              />
              <p className="text-xs text-[#737373]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                Minimum 6 characters
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#0D0D0D] font-medium" style={{ fontFamily: 'Satoshi, sans-serif' }}>Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
                className="rounded-xl border-2 border-[#737373] focus:border-[#C861FF] bg-white px-4 py-3 text-[#0D0D0D] placeholder:text-[#737373] transition-colors"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isCheckingEmail}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-[#737373]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#020126] hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;