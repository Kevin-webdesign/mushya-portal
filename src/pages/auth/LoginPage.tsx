import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Building2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'credentials' | 'otp';

export function LoginPage() {
  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('admin@mushyagroup.com');
  const [password, setPassword] = useState('admin123');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    
    if (success) {
      setStep('otp');
      toast.info('OTP sent to your email', {
        description: 'Use 123456 for demo purposes',
      });
    } else {
      toast.error('Invalid credentials', {
        description: 'Please check your email and password',
      });
    }
    
    setIsLoading(false);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await verifyOTP(otp);
    
    if (success) {
      toast.success('Welcome back!', {
        description: 'You have successfully logged in',
      });
      navigate('/dashboard');
    } else {
      toast.error('Invalid OTP', {
        description: 'Please enter the correct code',
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-glow">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Mushya Group</h1>
          <p className="text-muted-foreground">Internal Portal</p>
        </div>

        <Card className="card-elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {step === 'credentials' ? 'Sign in to your account' : 'Verify your identity'}
            </CardTitle>
            <CardDescription>
              {step === 'credentials'
                ? 'Enter your credentials to access the portal'
                : 'Enter the 6-digit code sent to your email'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'credentials' ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@mushyagroup.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-focus"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-focus"
                    required
                  />
                </div>
                <Button type="submit" className="w-full btn-glow" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-2" />
                  )}
                  Continue
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <p className="text-sm text-muted-foreground text-center">
                    For demo, use code: <span className="font-mono font-bold text-primary">123456</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep('credentials')}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 btn-glow" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 mr-2" />
                    )}
                    Verify
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Register
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            Demo: <span className="font-mono">admin@mushyagroup.com</span> / <span className="font-mono">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
