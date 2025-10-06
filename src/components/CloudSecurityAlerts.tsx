import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Clock, 
  Filter,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Settings,
  Shield,
  Trash2,
  Users
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { DemoModeBanner } from "./DemoModeBanner";

interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  service: string;
  resource_id: string;
  timestamp: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  assignee?: string;
  rule_id: string;
}

interface AlertRule {
  id: string;
  name: string;
  description: string;
  service: string;
  condition: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  enabled: boolean;
  notifications: string[];
}

const mockAlerts: SecurityAlert[] = [
  {
    id: 'alert-001',
    title: 'S3 Bucket Made Public',
    description: 'Bucket "company-backups" was configured to allow public read access',
    severity: 'Critical',
    service: 'S3',
    resource_id: 'company-backups',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    status: 'Active',
    rule_id: 'rule-s3-public'
  },
  {
    id: 'alert-002',
    title: 'Security Group Allows All Traffic',
    description: 'Security group "sg-web-public" allows inbound traffic from 0.0.0.0/0 on port 22',
    severity: 'High',
    service: 'EC2',
    resource_id: 'sg-web-public',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    status: 'Acknowledged',
    assignee: 'Security Team',
    rule_id: 'rule-sg-unrestricted'
  },
  {
    id: 'alert-003',
    title: 'IAM User Without MFA',
    description: 'User "admin-user-dev" has administrator privileges but no MFA enabled',
    severity: 'High',
    service: 'IAM',
    resource_id: 'admin-user-dev',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    status: 'Active',
    rule_id: 'rule-iam-no-mfa'
  },
  {
    id: 'alert-004',
    title: 'Unencrypted RDS Instance',
    description: 'RDS instance "prod-database" does not have encryption at rest enabled',
    severity: 'Medium',
    service: 'RDS',
    resource_id: 'prod-database',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    status: 'Resolved',
    assignee: 'DevOps Team',
    rule_id: 'rule-rds-encryption'
  }
];

const mockAlertRules: AlertRule[] = [
  {
    id: 'rule-s3-public',
    name: 'S3 Bucket Public Access',
    description: 'Triggers when an S3 bucket is configured for public access',
    service: 'S3',
    condition: 'bucket.public_access = true',
    severity: 'Critical',
    enabled: true,
    notifications: ['email', 'slack']
  },
  {
    id: 'rule-sg-unrestricted',
    name: 'Unrestricted Security Group',
    description: 'Triggers when security group allows traffic from 0.0.0.0/0',
    service: 'EC2',
    condition: 'security_group.cidr = "0.0.0.0/0"',
    severity: 'High',
    enabled: true,
    notifications: ['email']
  },
  {
    id: 'rule-iam-no-mfa',
    name: 'IAM User Without MFA',
    description: 'Triggers when privileged IAM user has no MFA enabled',
    service: 'IAM',
    condition: 'user.privileged = true AND user.mfa = false',
    severity: 'High',
    enabled: true,
    notifications: ['email', 'sms']
  },
  {
    id: 'rule-rds-encryption',
    name: 'Unencrypted RDS Instance',
    description: 'Triggers when RDS instance lacks encryption at rest',
    service: 'RDS',
    condition: 'rds.encryption = false',
    severity: 'Medium',
    enabled: false,
    notifications: ['email']
  }
];

export function CloudSecurityAlerts() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>(mockAlerts);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(mockAlertRules);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-[#ff0040] text-white';
      case 'High': return 'bg-[#ff6b35] text-white';
      case 'Medium': return 'bg-[#ffb000] text-black';
      case 'Low': return 'bg-[#00ff88] text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-[#ff0040] text-white';
      case 'Acknowledged': return 'bg-[#ffb000] text-black';
      case 'Resolved': return 'bg-[#00ff88] text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'Acknowledged' as const, assignee: 'Current User' }
        : alert
    ));
    toast.success('Alert acknowledged');
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'Resolved' as const }
        : alert
    ));
    toast.success('Alert resolved');
  };

  const filteredAlerts = alerts.filter(alert => {
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false;
    if (selectedService !== 'all' && alert.service !== selectedService) return false;
    if (selectedStatus !== 'all' && alert.status !== selectedStatus) return false;
    return true;
  });

  const alertsStats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'Active').length,
    critical: alerts.filter(a => a.severity === 'Critical').length,
    high: alerts.filter(a => a.severity === 'High').length
  };

  return (
    <div className="p-6 space-y-6">
      <DemoModeBanner />
      
      {/* Alert Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cyber-card">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-medium">{alertsStats.total}</p>
            <p className="text-sm text-muted-foreground">Total Alerts</p>
          </CardContent>
        </Card>
        
        <Card className="cyber-card">
          <CardContent className="p-4 text-center">
            <Bell className="h-8 w-8 text-[#ff0040] mx-auto mb-2" />
            <p className="text-2xl font-medium text-[#ff0040]">{alertsStats.active}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        
        <Card className="cyber-card">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-[#ff0040] mx-auto mb-2" />
            <p className="text-2xl font-medium text-[#ff0040]">{alertsStats.critical}</p>
            <p className="text-sm text-muted-foreground">Critical</p>
          </CardContent>
        </Card>
        
        <Card className="cyber-card">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-[#ff6b35] mx-auto mb-2" />
            <p className="text-2xl font-medium text-[#ff6b35]">{alertsStats.high}</p>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
      </div>

      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Security Alerts Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="alerts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
              <TabsTrigger value="rules">Alert Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="severity-filter">Severity</Label>
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="All Severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Label htmlFor="service-filter">Service</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="IAM">IAM</SelectItem>
                      <SelectItem value="EC2">EC2</SelectItem>
                      <SelectItem value="S3">S3</SelectItem>
                      <SelectItem value="RDS">RDS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" className="border-border">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              {/* Alerts List */}
              <div className="space-y-3">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className="cyber-glass p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                          <Badge variant="outline">
                            {alert.service}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                          <span>Resource: {alert.resource_id}</span>
                          {alert.assignee && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {alert.assignee}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {alert.status === 'Active' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                            className="border-border"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Acknowledge
                          </Button>
                        )}
                        {alert.status !== 'Resolved' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleResolveAlert(alert.id)}
                            className="border-border"
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rules" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Alert Rules Configuration</h3>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/80">
                  <Settings className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
              
              <div className="space-y-3">
                {alertRules.map((rule) => (
                  <div key={rule.id} className="cyber-glass p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{rule.name}</h4>
                          <Badge className={getSeverityColor(rule.severity)}>
                            {rule.severity}
                          </Badge>
                          <Badge variant="outline">
                            {rule.service}
                          </Badge>
                          {rule.enabled && (
                            <Badge className="bg-[#00ff88] text-black text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {rule.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Condition: {rule.condition}</span>
                          <span className="flex items-center gap-1">
                            Notifications: {rule.notifications.join(', ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={rule.enabled}
                          onCheckedChange={() => {
                            toast.info(`Rule ${rule.enabled ? 'disabled' : 'enabled'}`);
                          }}
                        />
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}