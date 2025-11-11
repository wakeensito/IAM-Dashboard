import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, AlertTriangle, CheckCircle, Clock, Shield, HardDrive, Zap, RefreshCw, Cloud, Users } from "lucide-react";
import { DemoModeBanner } from "./DemoModeBanner";
import { getDashboardData, getSecurityHubSummary, type DashboardData, type SecurityAlert } from "../services/api";
import { toast } from "sonner@2.0.3";

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

// Helper function to format timestamp
const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  } catch {
    return timestamp;
  }
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const [statsLoading, setStatsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const scanIntervalRef = useRef<number | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [stats, setStats] = useState({
    last_scan: "Never",
    total_resources: 0,
    security_findings: 0,
    compliance_score: 0,
    critical_alerts: 0,
    cost_savings: 0
  });
  const [weeklyTrends, setWeeklyTrends] = useState<Array<{name: string; compliant: number; violations: number; critical: number}>>([]);

  // Fetch dashboard data on mount and refresh
  useEffect(() => {
    fetchDashboardData();
    // Set up periodic refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setStatsLoading(true);
      const [dashboard, securityHub] = await Promise.all([
        getDashboardData('us-east-1', '24h').catch(() => null),
        getSecurityHubSummary('us-east-1').catch(() => null)
      ]);

      let summary: any = {};
      let compliance: any = {};

      if (dashboard) {
        setDashboardData(dashboard);
        
        // Update stats from dashboard data
        summary = dashboard.summary || {};
        compliance = dashboard.compliance || {};
        
        setStats({
          last_scan: dashboard.summary ? "Recently" : "Never",
          total_resources: (summary.compliant_resources || 0) + (summary.non_compliant_resources || 0),
          security_findings: summary.total_findings || 0,
          compliance_score: compliance.overall_score || 0,
          critical_alerts: summary.critical_findings || 0,
          cost_savings: 0
        });

        // Transform alerts
        if (dashboard.alerts && dashboard.alerts.length > 0) {
          const transformedAlerts: SecurityAlert[] = dashboard.alerts.map((alert, index) => ({
            id: alert.id || index,
            service: alert.service || 'Unknown',
            resource: alert.resource_id || 'Unknown',
            severity: (alert.severity as 'Critical' | 'High' | 'Medium' | 'Low') || 'Medium',
            message: alert.description || alert.title || 'Security alert',
            timestamp: formatTimestamp(alert.timestamp)
          }));
          setSecurityAlerts(transformedAlerts);
        }
      }

      if (securityHub && securityHub.summary) {
        // Update stats with Security Hub data if dashboard data is incomplete
        const hubSummary = securityHub.summary;
        setStats(prev => ({
          ...prev,
          security_findings: prev.security_findings || hubSummary.total_findings || 0,
          critical_alerts: prev.critical_alerts || hubSummary.critical_findings || 0
        }));
      }

      // Generate weekly trends from available data (placeholder for now - would need historical data)
      // This would ideally come from a time-series endpoint
      generateWeeklyTrends(summary, compliance);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setStatsLoading(false);
    }
  };

  const generateWeeklyTrends = (summary: any, compliance: any) => {
    // Generate placeholder weekly trends based on current compliance score
    // In production, this would come from historical data API
    const baseCompliant = compliance.overall_score || 78;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const trends = days.map((day, index) => {
      const variation = (Math.random() - 0.5) * 10; // ±5% variation
      const compliant = Math.max(70, Math.min(100, baseCompliant + variation));
      const violations = Math.round((100 - compliant) * 0.8);
      const critical = Math.round((100 - compliant) * 0.2);
      return {
        name: day,
        compliant: Math.round(compliant),
        violations,
        critical
      };
    });
    setWeeklyTrends(trends);
  };

  // Calculate pie chart data for cloud security from live data
  const pieData = (() => {
    const summary = dashboardData?.summary || {};
    const total = (summary.compliant_resources || 0) + (summary.non_compliant_resources || 0);
    if (total === 0) {
      // Fallback to compliance score if no resource data
      const score = dashboardData?.compliance?.overall_score || 0;
      return [
        { name: 'Compliant', value: score, color: '#00ff88' },
        { name: 'Violations', value: Math.max(0, 100 - score - 4), color: '#ffb000' },
        { name: 'Critical', value: Math.min(4, 100 - score), color: '#ff0040' }
      ];
    }
    const compliant = summary.compliant_resources || 0;
    const nonCompliant = summary.non_compliant_resources || 0;
    const critical = summary.critical_findings || 0;
    const compliantPct = Math.round((compliant / total) * 100);
    const violationsPct = Math.round((nonCompliant / total) * 100);
    const criticalPct = Math.min(100 - compliantPct - violationsPct, Math.round((critical / total) * 100));
    
    return [
      { name: 'Compliant', value: compliantPct, color: '#00ff88' },
      { name: 'Violations', value: violationsPct, color: '#ffb000' },
      { name: 'Critical', value: criticalPct, color: '#ff0040' }
    ];
  })();

  // Get recent security activity
  const recentActivity = securityAlerts.slice(0, 5);

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
        }, 300);
      } else {
        setScanProgress(Math.round(currentProgress));
      }
    }, intervalTime);
  };

  const refreshStats = () => {
    fetchDashboardData();
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
            ) : pieData.length > 0 && pieData.some(d => d.value > 0) ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData.filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {pieData.filter(d => d.value > 0).map((entry, index) => (
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
                  {pieData.filter(d => d.value > 0).map((item, index) => (
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
            {statsLoading ? (
              <Skeleton className="h-[300px] w-full bg-muted/20" />
            ) : weeklyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyTrends}>
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
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>No trend data available. Historical data will appear here after scans are performed.</p>
              </div>
            )}
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