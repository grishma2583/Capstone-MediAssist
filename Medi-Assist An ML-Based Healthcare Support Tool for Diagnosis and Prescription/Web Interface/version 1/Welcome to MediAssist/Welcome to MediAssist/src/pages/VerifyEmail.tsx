import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || !type) {
          setStatus('error');
          setMessage('Invalid verification link. Missing required parameters.');
          return;
        }

        if (type === 'signup') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email',
          });

          if (error) {
            setStatus('error');
            setMessage(error.message);
          } else {
            setStatus('success');
            setMessage('Your email has been successfully verified! You can now sign in to your account.');
            toast.success('Email verified successfully!');
          }
        } else {
          setStatus('error');
          setMessage('Invalid verification type.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('An unexpected error occurred during verification.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-6 mx-auto">
          {status === 'loading' && <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />}
          {status === 'success' && <CheckCircle className="w-8 h-8 text-green-600" />}
          {status === 'error' && <XCircle className="w-8 h-8 text-red-600" />}
        </div>
        <h1 className="text-3xl font-bold mb-4">
          {status === 'loading' && 'Verifying Email...'}
          {status === 'success' && 'Email Verified Successfully!'}
          {status === 'error' && 'Verification Failed'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
