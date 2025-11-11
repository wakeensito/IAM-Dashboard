import { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { SecurityHub } from "./components/SecurityHub";
import { GuardDuty } from "./components/GuardDuty";
import { AWSConfig } from "./components/AWSConfig";
import { Inspector } from "./components/Inspector";
import { Macie } from "./components/Macie";
import { AWSIAMScan } from "./components/AWSIAMScan";
import { EC2Security } from "./components/EC2Security";
import { S3Security } from "./components/S3Security";
import { GrafanaIntegration } from "./components/GrafanaIntegration";
import { CloudSecurityAlerts } from "./components/CloudSecurityAlerts";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";
import { Toaster } from "./components/ui/sonner";
import { ScanResultsProvider } from "./context/ScanResultsContext";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveTab} />;
      case "security-hub":
        return <SecurityHub />;
      case "guardduty":
        return <GuardDuty />;
      case "config":
        return <AWSConfig />;
      case "inspector":
        return <Inspector />;
      case "macie":
        return <Macie />;
      case "iam-security":
        return <AWSIAMScan />;
      case "ec2-security":
        return <EC2Security />;
      case "s3-security":
        return <S3Security />;
      case "network-security":
        return <div className="p-6"><div className="cyber-card p-8 text-center"><h2 className="text-xl mb-4">VPC & Network Security</h2><p className="text-muted-foreground">Network security scanning coming soon...</p></div></div>;
      case "database-security":
        return <div className="p-6"><div className="cyber-card p-8 text-center"><h2 className="text-xl mb-4">RDS & Database Security</h2><p className="text-muted-foreground">Database security scanning coming soon...</p></div></div>;
      case "lambda-security":
        return <div className="p-6"><div className="cyber-card p-8 text-center"><h2 className="text-xl mb-4">Lambda & Serverless Security</h2><p className="text-muted-foreground">Serverless security scanning coming soon...</p></div></div>;
      case "cloudtrail":
        return <div className="p-6"><div className="cyber-card p-8 text-center"><h2 className="text-xl mb-4">CloudTrail Monitoring</h2><p className="text-muted-foreground">CloudTrail analysis coming soon...</p></div></div>;
      case "compliance":
        return <div className="p-6"><div className="cyber-card p-8 text-center"><h2 className="text-xl mb-4">Compliance Dashboard</h2><p className="text-muted-foreground">Comprehensive compliance tracking coming soon...</p></div></div>;
      case "cost-optimization":
        return <div className="p-6"><div className="cyber-card p-8 text-center"><h2 className="text-xl mb-4">Cost & Optimization</h2><p className="text-muted-foreground">Cost optimization analysis coming soon...</p></div></div>;
      case "alerts":
        return <CloudSecurityAlerts />;
      case "grafana":
        return <GrafanaIntegration />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <ScanResultsProvider>
      <div className="h-screen flex flex-col bg-background dark">
        <Header onNavigate={setActiveTab} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
        <Toaster 
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              color: '#e2e8f0',
            },
          }}
        />
      </div>
    </ScanResultsProvider>
  );
}