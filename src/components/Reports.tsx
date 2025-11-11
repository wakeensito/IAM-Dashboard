import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FileText, Download, Calendar, Filter, Search, Eye, Plus } from "lucide-react";
import type { ReportRecord } from "../types/report";

const REPORT_TYPE_TABS = [
  {
    value: "security-hub",
    label: "Security Hub",
    title: "Security Hub Report",
    description: "Summarises findings, control status, and automated actions from AWS Security Hub.",
  },
  {
    value: "guardduty",
    label: "GuardDuty",
    title: "GuardDuty Report",
    description: "Highlights anomaly detections, IP reputation events, and resource compromises from GuardDuty.",
  },
  {
    value: "config",
    label: "Config",
    title: "Config Compliance Report",
    description: "Tracks configuration drift, compliance packs, and remediation timelines captured by AWS Config.",
  },
  {
    value: "inspector",
    label: "Inspector",
    title: "Inspector Vulnerability Report",
    description: "Provides CVE coverage, package findings, and remediation progress from AWS Inspector scans.",
  },
  {
    value: "macie",
    label: "Macie",
    title: "Macie Data Protection Report",
    description: "Details sensitive data discovery, classification results, and access anomalies surfaced by Macie.",
  },
  {
    value: "iam-security",
    label: "IAM & Access",
    title: "IAM & Access Control Report",
    description: "Reviews user permissions, role changes, and high-risk policies detected across IAM resources.",
  },
  {
    value: "ec2-security",
    label: "EC2 Compute",
    title: "EC2 & Compute Report",
    description: "Analyses instance posture, patch status, exposed services, and runtime events for compute resources.",
  },
  {
    value: "s3-security",
    label: "S3 Storage",
    title: "S3 Storage Report",
    description: "Surfaces bucket misconfigurations, access issues, and sensitive data exposures within S3.",
  },
  {
    value: "alerts",
    label: "Security Alerts",
    title: "Security Alerts Digest",
    description: "Aggregates alert spikes, suppressed signals, and rule coverage across monitoring channels.",
  },
] as const;

const DEFAULT_REPORT_TYPE = REPORT_TYPE_TABS[0].value;

interface ReportsProps {
  reports: ReportRecord[];
}

export function Reports({ reports }: ReportsProps) {
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [reportType, setReportType] = useState<string>(DEFAULT_REPORT_TYPE);
  const [reportDescription, setReportDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedReport = REPORT_TYPE_TABS.find((tab) => tab.value === reportType) ?? REPORT_TYPE_TABS[0];

  const generateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setShowGenerateDialog(false);
      setReportDescription("");
      setReportType(DEFAULT_REPORT_TYPE);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-[#00ff88] text-black";
      case "In Progress": return "bg-[#ffb000] text-black";
      case "Failed": return "bg-[#ff0040] text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Incident": return "border-[#ff0040] text-[#ff0040]";
      case "Manual": return "border-[#ffb000] text-[#ffb000]";
      case "Automated": return "border-[#00ff88] text-[#00ff88]";
      default: return "border-border";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Report Generation */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Generate New Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPE_TABS.map((tab) => (
                    <SelectItem key={tab.value} value={tab.value}>
                      {tab.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="rounded-md border border-dashed border-border bg-muted/40 p-4 space-y-1">
                <h4 className="text-sm font-medium">
                  {selectedReport.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedReport.description}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-description">Description</Label>
                <Textarea 
                  id="report-description"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Optional description or notes..."
                  className="bg-input border-border resize-none"
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Export Format</Label>
                <div className="flex gap-2 mt-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">PDF</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">CSV</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">JSON</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button 
              onClick={generateReport}
              disabled={!reportType || isGenerating}
              className="bg-primary text-primary-foreground hover:bg-primary/80 cyber-glow"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate Report"}
            </Button>
            
            <Button variant="outline" className="border-border">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {reports.length > 0 && (
        <Card className="cyber-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Report History</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search reports..."
                    className="pl-10 bg-input border-border w-64"
                  />
                </div>
                <Button variant="outline" className="border-border">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Threats Found</TableHead>
                  <TableHead>Processes</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} className="border-border">
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getTypeColor(report.type)}
                      >
                        {report.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{report.date}</TableCell>
                    <TableCell>
                      <Badge 
                        className={getStatusColor(report.status)}
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={report.threats > 10 ? "text-[#ff0040]" : report.threats > 0 ? "text-[#ffb000]" : "text-[#00ff88]"}>
                        {report.threats}
                      </span>
                    </TableCell>
                    <TableCell>{report.processes}</TableCell>
                    <TableCell>{report.size}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-accent/20"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-accent/20"
                          disabled={report.status === "In Progress"}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Report Templates */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle>Quick Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="cyber-glass p-4 rounded-lg">
              <h4 className="font-medium mb-2">Security Summary</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Complete overview of all security findings
              </p>
              <Button variant="outline" size="sm" className="border-border w-full">
                Generate
              </Button>
            </div>
            
            <div className="cyber-glass p-4 rounded-lg">
              <h4 className="font-medium mb-2">Threat Intelligence</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Detailed analysis of detected threats
              </p>
              <Button variant="outline" size="sm" className="border-border w-full">
                Generate
              </Button>
            </div>
            
            <div className="cyber-glass p-4 rounded-lg">
              <h4 className="font-medium mb-2">Executive Summary</h4>
              <p className="text-sm text-muted-foreground mb-3">
                High-level summary for management
              </p>
              <Button variant="outline" size="sm" className="border-border w-full">
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}