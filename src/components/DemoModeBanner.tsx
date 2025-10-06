import { AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export function DemoModeBanner() {
  return (
    <Alert className="border-primary bg-primary/10 mb-6">
      <Info className="h-4 w-4 text-primary" />
      <AlertDescription className="text-primary">
        <strong>Demo Mode Active:</strong> This is a fully functional demonstration of the Memory Forensics Toolkit interface. 
        All features work with simulated data to showcase the application's capabilities.
      </AlertDescription>
    </Alert>
  );
}