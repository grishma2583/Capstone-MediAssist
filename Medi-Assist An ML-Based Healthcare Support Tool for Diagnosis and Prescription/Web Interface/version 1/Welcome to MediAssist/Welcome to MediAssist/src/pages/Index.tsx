import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ChevronRight, Stethoscope, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import SymptomSelector from "@/components/SymptomSelector";
import DiagnosisResult from "@/components/DiagnosisResult";
import { toast } from "sonner";

interface DiagnosisData {
  disease: string;
  confidence: number;
  description: string;
  medications: string[];
  precautions: string[];
}

const Index = () => {
  const [showSymptomSelector, setShowSymptomSelector] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisData | null>(null);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleStartDiagnosis = () => {
    if (!user) {
      toast.error("Please log in to use the diagnosis feature");
      navigate("/login");
      return;
    }
    setShowSymptomSelector(true);
    setDiagnosisResult(null);
  };

  const handleDiagnosisComplete = (result: DiagnosisData) => {
    setDiagnosisResult(result);
    setShowSymptomSelector(false);
  };

  const handleNewDiagnosis = () => {
    setDiagnosisResult(null);
    setShowSymptomSelector(true);
  };

  const handleBackToHome = () => {
    setShowSymptomSelector(false);
    setDiagnosisResult(null);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  if (diagnosisResult) {
    return <DiagnosisResult data={diagnosisResult} onNewDiagnosis={handleNewDiagnosis} />;
  }

  if (showSymptomSelector) {
    return <SymptomSelector onDiagnosisComplete={handleDiagnosisComplete} onBack={handleBackToHome} />;
  }

  // Account Details Modal
  if (showAccountDetails && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
        <div className="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Account Details</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowAccountDetails(false)}>
              ✕
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Full Name</Label>
              <p className="text-sm text-muted-foreground">{user.user_metadata?.full_name || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">User ID</Label>
              <p className="text-sm text-muted-foreground">{user.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Account Created</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Last Sign In</Label>
              <p className="text-sm text-muted-foreground">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <Button variant="outline" onClick={() => setShowAccountDetails(false)} className="flex-1">
              Close
            </Button>
            <Button variant="destructive" onClick={handleSignOut} className="flex-1">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header with account and auth buttons */}
        <div className="flex justify-end items-center mb-8 pt-4">
          <div className="flex items-center gap-4">
            {user ? (
              <Button variant="outline" onClick={() => setShowAccountDetails(true)}>
                <User className="w-4 h-4 mr-2" />
                Account
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6 shadow-elevated">
            <Stethoscope className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Welcome to MediAssist
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered medical diagnosis system
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-card border border-border p-8 md:p-12 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">How It Works</h2>
                <p className="text-muted-foreground">
                  Our AI analyzes your symptoms using a hybrid machine learning model trained on medical data.
                  Simply select your symptoms and get instant predictions with detailed health information.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 rounded-xl bg-secondary/50 border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Select Symptoms</h3>
                <p className="text-sm text-muted-foreground">Choose from 130+ medical symptoms</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-secondary/50 border border-border">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-accent">2</span>
                </div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">Advanced prediction algorithm</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-secondary/50 border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Get Results</h3>
                <p className="text-sm text-muted-foreground">Diagnosis with medications & precautions</p>
              </div>
            </div>

            <Button 
              onClick={handleStartDiagnosis} 
              size="lg"
              className="w-full group bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-elevated"
            >
              Start Symptom Check
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Educational Disclaimer:</strong> This tool is designed for educational purposes only and should not be used for actual medical diagnosis. 
              It is a demonstration of AI and machine learning concepts. Always consult qualified healthcare professionals for accurate diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
