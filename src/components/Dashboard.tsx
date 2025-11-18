import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, AlertTriangle, CheckCircle, Clock, Shield, HardDrive, Zap, RefreshCw, Cloud, Users, Database, Activity } from "lucide-react";
import { DemoModeBanner } from "./DemoModeBanner";
import type { ReportRecord } from "../types/report";

// Mock data for charts (replace with API data in full implementation)
const mockBarData = [
  { name: 'Mon', compliant: 85, violations: 8, critical: 2 },
  { name: 'Tue', compliant: 78, violations: 12, critical: 3 },
  { name: 'Wed', compliant: 92, violations: 5, critical: 1 },
  { name: 'Thu', compliant: 88, violations: 9, critical: 2 },
  { name: 'Fri', compliant: 94, violations: 4, critical: 1 },
  { name: 'Sat', compliant: 90, violations: 6, critical: 0 },
  { name: 'Sun', compliant: 87, violations: 7, critical: 2 },
];

interface DashboardProps {
  onNavigate?: (tab: string) => void;
  onFullScanComplete?: (report: ReportRecord) => void;
}

// Mock cloud security stats
const mockCloudStats = {
  last_scan: "3 min ago",
  total_resources: 1247,
  security_findings: 23,
  compliance_score: 78,
  critical_alerts: 5,
  cost_savings: 2840
};

const mockCloudAlerts = [
  {
    id: 1,
    service: 'S3',
    resource: 'company-backups',
    severity: 'Critical',
    message: 'Bucket configured for public access',
    timestamp: '2 min ago'
  },
  {
    id: 2,
    service: 'EC2',
    resource: 'i-0abcd1234efgh5678',
    severity: 'High',
    message: 'Security group allows unrestricted SSH',
    timestamp: '15 min ago'
  },
  {
    id: 3,
    service: 'IAM',
    resource: 'admin-user-dev',
    severity: 'High',
    message: 'User has admin privileges without MFA',
    timestamp: '1 hour ago'
  }
];

const FULL_SCAN_PROCESSES_PLACEHOLDER = 550;
const FULL_SCAN_REPORT_SIZE = "1.5 MB";
const FULL_SCAN_FINDINGS_BREAKDOWN = {
  critical: 1,
  high: 2,
  medium: 2,
};

function buildFullScanReport(): ReportRecord {
  const now = new Date();
  const datePart = now.toLocaleDateString("en-CA");
  const timePart = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const timeZoneToken = now
    .toLocaleTimeString("en-US", { timeZoneName: "short" })
    .split(" ")
    .pop() ?? "UTC";

  const totalThreats =
    FULL_SCAN_FINDINGS_BREAKDOWN.critical +
    FULL_SCAN_FINDINGS_BREAKDOWN.high +
    FULL_SCAN_FINDINGS_BREAKDOWN.medium;

  return {
    id: now.getTime().toString(),
    name: `Full Security Scan - ${datePart} ${timePart} ${timeZoneToken}`,
    type: "Automated",
    date: datePart,
    status: "Completed",
    threats: totalThreats,
    processes: FULL_SCAN_PROCESSES_PLACEHOLDER,
    size: FULL_SCAN_REPORT_SIZE,
  };
}

export function Dashboard({ onNavigate, onFullScanComplete }: DashboardProps) {
  const [statsLoading, setStatsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const scanIntervalRef = useRef<number | null>(null);
  const stats = mockCloudStats;
  const notifications = mockCloudAlerts;

  // Calculate pie chart data for cloud security
  const pieData = [
    { 
      name: 'Compliant', 
      value: 78,
      color: '#00ff88'
    },
    { 
      name: 'Violations', 
      value: 18,
      color: '#ffb000'
    },
    { 
      name: 'Critical', 
      value: 4,
      color: '#ff0040'
    }
  ];

  // Get recent security activity
  const recentActivity = notifications.slice(0, 5);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  const handleQuickScan = async () => {
    // Clear any existing interval
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    setIsScanning(true);
    setScanProgress(0);
    
    // Animate progress from 0 to 100% over 3 seconds
    const duration = 3000; // 3 seconds
    const steps = 60; // 60 steps for smooth animation
    const increment = 100 / steps;
    const intervalTime = duration / steps;
    
    let currentProgress = 0;
    scanIntervalRef.current = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        setScanProgress(100);
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current);
          scanIntervalRef.current = null;
        }
        setTimeout(() => {
          setIsScanning(false);
          setScanProgress(0);
          if (onFullScanComplete) {
            onFullScanComplete(buildFullScanReport());
          }
        }, 300);
      } else {
        setScanProgress(Math.round(currentProgress));
      }
    }, intervalTime);
  };

  const refreshStats = () => {
    setStatsLoading(true);
    setTimeout(() => setStatsLoading(false), 1000);
  };

  const handleOldQuickScan = async () => {
    await startScan();
  };

  return (
    <div className="p-6 space-y-6">
      <DemoModeBanner />
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card 
          className="cyber-card cursor-pointer hover:cyber-glow transition-all duration-300"
          onClick={() => onNavigate?.('timeline')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Scan</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-24 bg-muted/20" />
                ) : (
                  <p className="text-2xl font-medium text-foreground">
                    {stats?.last_scan || 'Never'}
                  </p>
                )}
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="cyber-card cursor-pointer hover:cyber-glow transition-all duration-300"
          onClick={() => onNavigate?.('compliance')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AWS Resources</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16 bg-muted/20" />
                ) : (
                  <p className="text-2xl font-medium text-foreground">
                    {stats?.total_resources || 1247}
                  </p>
                )}
              </div>
              <Cloud className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="cyber-card cursor-pointer hover:cyber-glow transition-all duration-300"
          onClick={() => onNavigate?.('alerts')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Findings</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-12 bg-muted/20" />
                ) : (
                  <p className="text-2xl font-medium text-[#ffb000]">
                    {stats?.security_findings || 23}
                  </p>
                )}
              </div>
              <AlertTriangle className="h-8 w-8 text-[#ffb000]" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="cyber-card cursor-pointer hover:cyber-glow transition-all duration-300"
          onClick={() => onNavigate?.('compliance')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-20 bg-muted/20" />
                ) : (
                  <p className="text-2xl font-medium text-foreground">
                    {stats?.compliance_score || 78}%
                  </p>
                )}
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AWS Security Status */}
      <Card 
        className="cyber-card cursor-pointer hover:cyber-glow transition-all duration-300"
        onClick={() => onNavigate?.('aws-iam-scan')}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Cloud className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-medium">AWS IAM Security Status</h3>
                <p className="text-sm text-muted-foreground">Last scan: 5 min ago</p>
              </div>
            </div>
            <Badge className="bg-[#ffb000] text-black">
              78% Compliant
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="cyber-glass p-3 rounded-lg text-center">
              <p className="text-lg font-medium text-[#ff0040]">1</p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
            <div className="cyber-glass p-3 rounded-lg text-center">
              <p className="text-lg font-medium text-[#ff6b35]">2</p>
              <p className="text-xs text-muted-foreground">High</p>
            </div>
            <div className="cyber-glass p-3 rounded-lg text-center">
              <p className="text-lg font-medium text-[#ffb000]">2</p>
              <p className="text-xs text-muted-foreground">Medium</p>
            </div>
            <div className="cyber-glass p-3 rounded-lg text-center">
              <p className="text-lg font-medium text-[#00ff88]">39</p>
              <p className="text-xs text-muted-foreground">Resources</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scan Controls */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Actions
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto"
              onClick={refreshStats}
              disabled={statsLoading}
            >
              <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Scan Status */}
            {isScanning && (
              <div className="cyber-glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Security Scan in Progress</span>
                  <Badge className="bg-primary text-primary-foreground">
                    {scanProgress}%
                  </Badge>
                </div>
                <Progress value={scanProgress} className="h-2 transition-all duration-150 ease-out" />
              </div>
            )}

            <div className="flex gap-4 flex-wrap">
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/80 cyber-glow"
                onClick={handleQuickScan}
                disabled={isScanning}
              >
                <Play className="h-4 w-4 mr-2" />
                {isScanning ? 'Scanning...' : 'Full Security Scan'}
              </Button>
              <Button 
                variant="outline" 
                className="border-border"
                onClick={() => onNavigate?.('iam-security')}
              >
                <Users className="h-4 w-4 mr-2" />
                IAM Security
              </Button>
              <Button 
                variant="outline" 
                className="border-border"
                onClick={() => onNavigate?.('ec2-security')}
              >
                <Cloud className="h-4 w-4 mr-2" />
                EC2 Security
              </Button>
              <Button 
                variant="outline" 
                className="border-border"
                onClick={() => onNavigate?.('s3-security')}
              >
                <HardDrive className="h-4 w-4 mr-2" />
                S3 Security
              </Button>
              <Button 
                variant="outline" 
                className="border-border"
                onClick={() => onNavigate?.('reports')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle>Security Compliance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[300px] w-full bg-muted/20" />
                <div className="flex justify-center gap-4">
                  <Skeleton className="h-4 w-20 bg-muted/20" />
                  <Skeleton className="h-4 w-16 bg-muted/20" />
                  <Skeleton className="h-4 w-18 bg-muted/20" />
                </div>
              </div>
            ) : pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                        borderRadius: '8px',
                        color: '#e2e8f0'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-sm" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-xs text-muted-foreground">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>No security data available. Run a security scan to start analysis.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="cyber-card">
          <CardHeader>
            <CardTitle>Weekly Compliance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.1)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                  cursor={{ fill: 'rgba(0, 255, 136, 0.05)' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="circle"
                />
                <Bar dataKey="compliant" stackId="a" fill="#00ff88" name="Compliant" radius={[0, 0, 0, 0]} />
                <Bar dataKey="violations" stackId="a" fill="#ffb000" name="Violations" radius={[0, 0, 0, 0]} />
                <Bar dataKey="critical" stackId="a" fill="#ff0040" name="Critical" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle>Recent Security Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Service</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statsLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-border">
                    <TableCell><Skeleton className="h-4 w-16 bg-muted/20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 bg-muted/20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 bg-muted/20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32 bg-muted/20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 bg-muted/20" /></TableCell>
                  </TableRow>
                ))
              ) : recentActivity.length > 0 ? (
                recentActivity.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className="border-border cursor-pointer hover:bg-accent/10 transition-colors"
                    onClick={() => {
                      if (item.severity === "Critical" || item.severity === "High") {
                        onNavigate?.('alerts');
                      } else {
                        onNavigate?.(`${item.service.toLowerCase()}-security`);
                      }
                    }}
                  >
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {item.service}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.resource}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          item.severity === "Critical" ? "bg-[#ff0040] text-white" :
                          item.severity === "High" ? "bg-[#ff6b35] text-white" :
                          item.severity === "Medium" ? "bg-[#ffb000] text-black" :
                          "bg-[#00ff88] text-black"
                        }
                      >
                        {item.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{item.message}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.timestamp}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-border">
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No recent security alerts. All systems appear secure.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}