"""
Health check endpoint for monitoring and load balancers
"""

from flask_restful import Resource
import psutil
import time

class HealthResource(Resource):
    """Health check endpoint"""
    
    def get(self):
        """Return application health status"""
        try:
            # Basic health metrics
            health_data = {
                'status': 'healthy',
                'timestamp': time.time(),
                'uptime': time.time() - psutil.boot_time(),
                'memory': {
                    'used': psutil.virtual_memory().used,
                    'available': psutil.virtual_memory().available,
                    'percent': psutil.virtual_memory().percent
                },
                'cpu': {
                    'percent': psutil.cpu_percent(interval=1)
                },
                'disk': {
                    'used': psutil.disk_usage('/').used,
                    'free': psutil.disk_usage('/').free,
                    'percent': psutil.disk_usage('/').percent
                }
            }
            
            return health_data, 200
            
        except Exception as e:
            return {
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': time.time()
            }, 500
