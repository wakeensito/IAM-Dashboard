import { AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export function DemoModeBanner() {
  return (
    <Alert className="border-primary bg-primary/10 mb-6">
      <Info className="h-4 w-4 text-primary" />
      <AlertDescription className="text-primary">
        <strong>Demo Mode Active:</strong> This is a fully functional demonstration of the AWS interface. 
        All features work with real AWS security scan data to showcase the application's capabilities for cloud security monitoring and compliance tracking.
      </AlertDescription>
    </Alert>
  );
}