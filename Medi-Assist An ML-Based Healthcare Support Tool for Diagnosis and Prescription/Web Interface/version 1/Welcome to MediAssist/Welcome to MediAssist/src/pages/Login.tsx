import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stethoscope, Loader2, ArrowLeft, Cross, Shield, Clock, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message);
        toast.error("Login failed");
      } else {
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#ADD8E6' }}>
      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 -left-40 w-64 h-64 bg-blue-200 rounded-full opacity-15"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-100 rounded-full opacity-25"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-center items-center px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Cross className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-900">Welcome to MediAssist</span>
        </div>
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
        <Card className="w-full max-w-7xl bg-white/95 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Left side - Content */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Access Your Account, Your Health Partner.
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Securely access your personalized health dashboard. Get instant insights, track your symptoms, and connect with healthcare professionals.
                </p>

                {/* Info bar */}
                <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 inline-block">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <Shield className="w-6 h-6 text-blue-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Secure Login</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Clock className="w-6 h-6 text-blue-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">24/7 Support</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Lock className="w-6 h-6 text-blue-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Privacy Protected</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle - Doctor Image */}
              <div className="flex-shrink-0">
                <div className="w-80 h-80 overflow-hidden rounded-lg">
                  <img
                    src="/images/doctor madam.png"
                    alt="Doctor"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Right side - Login form */}
              <div className="flex-1 max-w-md">
                <div className="text-center mb-6 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-0 top-0"
                    onClick={() => navigate("/")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 mb-4 mx-auto">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl text-gray-900 font-semibold">Welcome Back</h2>
                  <p className="text-gray-600">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link to="/register" className="text-blue-600 hover:underline font-medium">
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
