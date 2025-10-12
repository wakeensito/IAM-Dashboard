"""
Grafana Service for data visualization and monitoring
"""

import requests
import logging
import os
from typing import Dict, List, Optional
import json

logger = logging.getLogger(__name__)

class GrafanaService:
    """Service for Grafana integrations"""
    
    def __init__(self):
        self.base_url = os.environ.get('GRAFANA_URL', 'http://grafana:3000')
        self.api_key = None
        self.username = os.environ.get('GRAFANA_USERNAME', 'admin')
        self.password = os.environ.get('GRAFANA_PASSWORD', 'admin')
        
    def authenticate(self) -> bool:
        """Authenticate with Grafana"""
        try:
            auth_url = f"{self.base_url}/api/auth/keys"
            auth_data = {
                "name": "cybersecurity-dashboard",
                "role": "Admin"
            }
            
            response = requests.post(
                auth_url,
                json=auth_data,
                auth=(self.username, self.password),
                timeout=10
            )
            
            if response.status_code == 200:
                self.api_key = response.json().get('key')
                return True
            return False
            
        except Exception as e:
            logger.error(f"Grafana authentication error: {str(e)}")
            return False
    
    def get_dashboards(self) -> List[Dict]:
        """Get Grafana dashboards"""
        try:
            if not self.api_key:
                self.authenticate()
            
            url = f"{self.base_url}/api/search"
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            return []
            
        except Exception as e:
            logger.error(f"Error getting Grafana dashboards: {str(e)}")
            return []
    
    def get_dashboard(self, dashboard_id: int) -> Dict:
        """Get specific Grafana dashboard"""
        try:
            if not self.api_key:
                self.authenticate()
            
            url = f"{self.base_url}/api/dashboards/uid/{dashboard_id}"
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            return {}
            
        except Exception as e:
            logger.error(f"Error getting Grafana dashboard: {str(e)}")
            return {}
    
    def get_metrics(self, query: str, time_range: str = "24h") -> Dict:
        """Get metrics from Grafana"""
        try:
            if not self.api_key:
                self.authenticate()
            
            url = f"{self.base_url}/api/datasources/proxy/1/api/v1/query"
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            params = {
                'query': query,
                'time': time_range
            }
            
            response = requests.get(url, headers=headers, params=params, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            return {}
            
        except Exception as e:
            logger.error(f"Error getting Grafana metrics: {str(e)}")
            return {}
    
    def get_alerts(self) -> List[Dict]:
        """Get Grafana alerts"""
        try:
            if not self.api_key:
                self.authenticate()
            
            url = f"{self.base_url}/api/alerts"
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            return []
            
        except Exception as e:
            logger.error(f"Error getting Grafana alerts: {str(e)}")
            return []
    
    def get_datasources(self) -> List[Dict]:
        """Get Grafana datasources"""
        try:
            if not self.api_key:
                self.authenticate()
            
            url = f"{self.base_url}/api/datasources"
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            return []
            
        except Exception as e:
            logger.error(f"Error getting Grafana datasources: {str(e)}")
            return []
    
    def create_dashboard(self, dashboard_config: Dict) -> bool:
        """Create Grafana dashboard"""
        try:
            if not self.api_key:
                self.authenticate()
            
            url = f"{self.base_url}/api/dashboards/db"
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                url,
                json=dashboard_config,
                headers=headers,
                timeout=10
            )
            
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Error creating Grafana dashboard: {str(e)}")
            return False
    
    def get_system_metrics(self) -> Dict:
        """Get system metrics for cybersecurity dashboard"""
        try:
            metrics = {
                'cpu_usage': self._get_cpu_usage(),
                'memory_usage': self._get_memory_usage(),
                'disk_usage': self._get_disk_usage(),
                'network_throughput': self._get_network_throughput(),
                'response_time': self._get_response_time(),
                'error_rate': self._get_error_rate()
            }
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error getting system metrics: {str(e)}")
            return {}
    
    def _get_cpu_usage(self) -> float:
        """Get CPU usage percentage"""
        try:
            import psutil
            return psutil.cpu_percent(interval=1)
        except ImportError:
            return 0.0
    
    def _get_memory_usage(self) -> float:
        """Get memory usage percentage"""
        try:
            import psutil
            return psutil.virtual_memory().percent
        except ImportError:
            return 0.0
    
    def _get_disk_usage(self) -> float:
        """Get disk usage percentage"""
        try:
            import psutil
            return psutil.disk_usage('/').percent
        except ImportError:
            return 0.0
    
    def _get_network_throughput(self) -> float:
        """Get network throughput"""
        try:
            import psutil
            net_io = psutil.net_io_counters()
            return net_io.bytes_sent + net_io.bytes_recv
        except ImportError:
            return 0.0
    
    def _get_response_time(self) -> float:
        """Get average response time"""
        # This would be calculated from actual request logs
        return 0.0
    
    def _get_error_rate(self) -> float:
        """Get error rate percentage"""
        # This would be calculated from actual request logs
        return 0.0
