"""
Script to keep the Render.com backend alive by pinging it every 14 minutes.
This prevents the free tier service from spinning down due to inactivity.

To use this script:
1. Make sure you have requests installed: pip install requests
2. Run this script in the background: python keep_backend_alive.py &
   Or schedule it to run using a service like cron-job.org

The script will log each ping attempt to the console and to a log file.
"""

import requests
import time
import datetime
import sys
import os

# Configuration
BACKEND_URL = "https://pp-relief-backend.onrender.com/api/product-types/"
PING_INTERVAL = 14 * 60  # 14 minutes in seconds
LOG_FILE = "backend_ping.log"

def log_message(message):
    """Log a message to both console and log file"""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] {message}"
    
    print(log_entry)
    
    with open(LOG_FILE, "a") as f:
        f.write(log_entry + "\n")

def ping_backend():
    """Send a request to the backend to keep it alive"""
    try:
        start_time = time.time()
        response = requests.get(BACKEND_URL, timeout=30)
        duration = time.time() - start_time
        
        if response.status_code == 200:
            log_message(f"Backend is alive! Response time: {duration:.2f} seconds, Status: {response.status_code}")
            return True
        else:
            log_message(f"Backend returned non-200 status code: {response.status_code}, Response time: {duration:.2f} seconds")
            return False
    except requests.exceptions.RequestException as e:
        log_message(f"Error pinging backend: {str(e)}")
        return False

def main():
    """Main function to periodically ping the backend"""
    log_message("Starting backend keep-alive script")
    log_message(f"Will ping {BACKEND_URL} every {PING_INTERVAL // 60} minutes")
    
    try:
        while True:
            success = ping_backend()
            time.sleep(PING_INTERVAL)
    except KeyboardInterrupt:
        log_message("Script stopped manually")
    except Exception as e:
        log_message(f"Unexpected error: {str(e)}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 