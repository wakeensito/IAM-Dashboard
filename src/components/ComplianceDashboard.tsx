import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Skeleton } from "./ui/skeleton";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";
import { CalendarClock, RefreshCcw, ShieldAlert, ShieldCheck, Target, TrendingUp } from "lucide-react";

const complianceFrameworks = [
  {
    id: "cis",
    name: "CIS AWS Foundations",
    score: 82,
    lastAudited: "2 days ago",
    totalControls: 84,
    openControls: 7,
    criticalFindings: 2,
    trend: [
      { month: "Jun", score: 74 },
      { month: "Jul", score: 78 },
      { month: "Aug", score: 80 },
      { month: "Sep", score: 81 },
      { month: "Oct", score: 82 },
    ],
  },
  {
    id: "soc2",
    name: "SOC 2 Trust Services",
    score: 76,
    lastAudited: "5 days ago",
    totalControls: 96,
    openControls: 11,
    criticalFindings: 3,
    trend: [
      { month: "Jun", score: 68 },
      { month: "Jul", score: 70 },
      { month: "Aug", score: 72 },
      { month: "Sep", score: 75 },
      { month: "Oct", score: 76 },
    ],
  },
  {
    id: "pci",
    name: "PCI-DSS",
    score: 88,
    lastAudited: "1 day ago",
    totalControls: 112,
    openControls: 5,
    criticalFindings: 1,
    trend: [
      { month: "Jun", score: 80 },
      { month: "Jul", score: 82 },
      { month: "Aug", score: 85 },
      { month: "Sep", score: 86 },
      { month: "Oct", score: 88 },
    ],
  },
  {
    id: "hipaa",
    name: "HIPAA Security Rule",
    score: 73,
    lastAudited: "9 days ago",
    totalControls: 64,
    openControls: 14,
    criticalFindings: 4,
    trend: [
      { month: "Jun", score: 62 },
      { month: "Jul", score: 65 },
      { month: "Aug", score: 70 },
      { month: "Sep", score: 72 },
      { month: "Oct", score: 73 },
    ],
  },
];

const openActions = [
  {
    id: "IAM-001",
    framework: "CIS AWS Foundations",
    control: "1.1 – Root account MFA enabled",
    owner: "Cloud Security",
    dueDate: "Nov 18",
    status: "In Progress",
    severity: "High",
  },
  {
    id: "S3-014",
    framework: "SOC 2",
    control: "3.3 – Encryption enforced at rest",
    owner: "Storage Team",
    dueDate: "Nov 22",
    status: "Planned",
    severity: "Medium",
  },
  {
    id: "EC2-027",
    framework: "PCI-DSS",
    control: "7.1 – Restrict access to cardholder data",
    owner: "Platform",
    dueDate: "Dec 02",
    status: "Blocked",
    severity: "Critical",
  },
  {
    id: "LOG-039",
    framework: "HIPAA",
    control: "164.312(b) – Audit controls implemented",
    owner: "Compliance",
    dueDate: "Nov 29",
    status: "In Progress",
    severity: "High",
  },
];

const recentAudits = [
  {
    name: "Quarterly CIS Review",
    performedBy: "Automated Policy Engine",
    completedOn: "Oct 28, 2025",
    coverage: "84 controls evaluated",
    outcome: "On Track",
  },
  {
    name: "PCI-DSS Gap Analysis",
    performedBy: "External Assessor",
    completedOn: "Oct 12, 2025",
    coverage: "112 controls evaluated",
    outcome: "Action Required",
  },
  {
    name: "SOC 2 Evidence Collection",
    performedBy: "Internal Audit",
    completedOn: "Sep 24, 2025",
    coverage: "96 controls evaluated",
    outcome: "In Review",
  },
];

const frameworkScores = complianceFrameworks.map((framework) => ({
  name: framework.name,
  score: framework.score,
  open: framework.openControls,
  critical: framework.criticalFindings,
}));

const statusColorMap: Record<string, string> = {
  "On Track": "bg-[#00ff88] text-black",
  "Action Required": "bg-[#ffb000] text-black",
  "In Review": "bg-[#1f2937] text-white border border-border",
};

const severityColorMap: Record<string, string> = {
  Critical: "bg-[#ff0040] text-white",
  High: "bg-[#ff6b35] text-white",
  Medium: "bg-[#ffb000] text-black",
  Low: "bg-[#00ff88] text-black",
};

const statusBadgeColor: Record<string, string> = {
  "In Progress": "bg-primary text-primary-foreground",
  Planned: "bg-muted text-muted-foreground",
  Blocked: "bg-[#ff0040] text-white",
};

const overallScore = Math.round(
  complianceFrameworks.reduce((acc, framework) => acc + framework.score, 0) / complianceFrameworks.length
);

const criticalFindingsTotal = complianceFrameworks.reduce(
  (acc, framework) => acc + framework.criticalFindings,
  0
);

export function ComplianceDashboard() {
  const [activeFramework, setActiveFramework] = useState(complianceFrameworks[0].id);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedFramework = useMemo(
    () => complianceFrameworks.find((framework) => framework.id === activeFramework) ?? complianceFrameworks[0],
    [activeFramework]
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Compliance Dashboard</h1>
          <p className="text-muted-foreground">Track adherence to key security frameworks across your AWS estate.</p>
        </div>
        <Button
          variant="outline"
          className="border-border"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh Metrics
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cyber-card">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overall Compliance</span>
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <p className="text-4xl font-semibold">{overallScore}%</p>
            <Progress value={overallScore} className="h-2" />
            <p className="text-xs text-muted-foreground">Across {complianceFrameworks.length} active frameworks</p>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Critical Findings</span>
              <ShieldAlert className="h-6 w-6 text-[#ff0040]" />
            </div>
            <p className="text-4xl font-semibold text-[#ff0040]">{criticalFindingsTotal}</p>
            <p className="text-xs text-muted-foreground">Requires immediate remediation</p>
            <Badge variant="outline" className="w-fit border-[#ff0040]/60 text-xs">
              Auto escalation enabled
            </Badge>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Upcoming Audits</span>
              <CalendarClock className="h-6 w-6 text-primary" />
            </div>
            <p className="text-4xl font-semibold">3</p>
            <p className="text-xs text-muted-foreground">Next scheduled: Nov 18 (CIS)</p>
            <Badge className="w-fit bg-primary/10 text-primary">Automated evidence collection ready</Badge>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Positive Trend</span>
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <p className="text-4xl font-semibold">+6%</p>
            <p className="text-xs text-muted-foreground">Average improvement over last 90 days</p>
            <Badge variant="outline" className="w-fit border-primary/40 text-primary">
              Continuous monitoring enabled
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="cyber-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Framework Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {isRefreshing ? (
                <Skeleton className="h-[260px] w-full bg-muted/20" />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={frameworkScores} barCategoryGap={24}>
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
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(0, 255, 136, 0.3)",
                        borderRadius: "8px",
                        color: "#e2e8f0",
                      }}
                      cursor={{ fill: "rgba(0, 255, 136, 0.05)" }}
                    />
                    <Bar dataKey="score" name="Compliance Score" fill="#00ff88" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="open" name="Open Controls" fill="#ffb000" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="critical" name="Critical Findings" fill="#ff0040" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="space-y-4">
              {complianceFrameworks.map((framework) => (
                <button
                  key={framework.id}
                  onClick={() => setActiveFramework(framework.id)}
                  className={`w-full text-left p-4 rounded-lg transition-all border ${
                    framework.id === activeFramework
                      ? "cyber-glow border-primary/60 bg-primary/10"
                      : "border-transparent bg-muted/5 hover:bg-muted/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{framework.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {framework.score}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Last audited {framework.lastAudited}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-muted/5 border border-border/60">
              <CardHeader>
                <CardTitle className="text-base font-medium">{selectedFramework.name} Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {isRefreshing ? (
                  <Skeleton className="h-[200px] w-full bg-muted/20" />
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={selectedFramework.trend}>
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="10%" stopColor="#00ff88" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.1)" vertical={false} />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.95)",
                          border: "1px solid rgba(0, 255, 136, 0.3)",
                          borderRadius: "8px",
                          color: "#e2e8f0",
                        }}
                        cursor={{ stroke: "rgba(0, 255, 136, 0.4)", strokeWidth: 2 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#00ff88"
                        fillOpacity={1}
                        fill="url(#trendGradient)"
                        strokeWidth={2}
                        name="Score"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="cyber-glass border border-border/60">
              <CardHeader>
                <CardTitle className="text-base font-medium">Framework Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Open controls</span>
                  <span className="text-sm font-medium">{selectedFramework.openControls}</span>
                </div>
                <Progress value={(selectedFramework.totalControls - selectedFramework.openControls) / selectedFramework.totalControls * 100} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total controls</span>
                  <span className="text-sm font-medium">{selectedFramework.totalControls}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Critical findings</span>
                  <Badge className="text-xs bg-[#ff0040] text-white">
                    {selectedFramework.criticalFindings}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last audited</span>
                  <span className="text-sm font-medium">{selectedFramework.lastAudited}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="actions" className="space-y-6">
        <TabsList className="cyber-card border-border">
          <TabsTrigger value="actions">Open Actions</TabsTrigger>
          <TabsTrigger value="audits">Audit History</TabsTrigger>
          <TabsTrigger value="evidence">Evidence Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="actions">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle>Controls Requiring Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>ID</TableHead>
                      <TableHead>Framework</TableHead>
                      <TableHead>Control</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openActions.map((action) => (
                      <TableRow key={action.id} className="border-border hover:bg-accent/10 transition-colors">
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {action.id}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{action.framework}</TableCell>
                        <TableCell className="text-sm max-w-xs">{action.control}</TableCell>
                        <TableCell className="text-sm">{action.owner}</TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${statusBadgeColor[action.status] ?? "bg-muted text-muted-foreground"}`}>
                            {action.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${severityColorMap[action.severity] ?? "bg-muted text-muted-foreground"}`}>
                            {action.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{action.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle>Recent Audits & Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAudits.map((audit) => (
                <div key={audit.name} className="cyber-glass rounded-lg p-4 border border-border/50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{audit.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {audit.coverage} · Completed {audit.completedOn}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {audit.performedBy}
                      </Badge>
                      <Badge className={`text-xs ${statusColorMap[audit.outcome] ?? "bg-muted text-muted-foreground"}`}>
                        {audit.outcome}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle>Evidence Collection Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="cyber-glass rounded-lg p-4 border border-border/50 space-y-3">
                <p className="text-sm font-medium">Policies & Procedures</p>
                <Badge className="w-fit bg-primary/10 text-primary">34 / 36 Updated</Badge>
                <p className="text-xs text-muted-foreground">
                  Automated policy sync captures updates from the source repository every 12 hours.
                </p>
              </div>
              <div className="cyber-glass rounded-lg p-4 border border-border/50 space-y-3">
                <p className="text-sm font-medium">Technical Evidence</p>
                <Badge className="w-fit bg-primary/10 text-primary">128 artifacts</Badge>
                <p className="text-xs text-muted-foreground">
                  Includes IAM reports, S3 bucket policies, CloudTrail exports, and GuardDuty findings.
                </p>
              </div>
              <div className="cyber-glass rounded-lg p-4 border border-border/50 space-y-3">
                <p className="text-sm font-medium">Compensating Controls</p>
                <Badge className="w-fit bg-primary/10 text-primary">8 documented</Badge>
                <p className="text-xs text-muted-foreground">
                  Linked to high-risk controls awaiting remediation with reviewer sign-off.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


