import requests
import time

def test_endpoint(url):
    print(f"Testing {url}...")
    try:
        start_time = time.time()
        response = requests.get(url, timeout=20)
        duration = time.time() - start_time
        print(f"Status: {response.status_code}")
        print(f"Time: {duration:.2f} seconds")
        print(f"Response: {response.text[:100]}...")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
    print("---")

if __name__ == "__main__":
    base_url = "https://pp-relief-backend.onrender.com"
    
    # Test root endpoint
    test_endpoint(f"{base_url}/")
    
    # Test admin endpoint
    test_endpoint(f"{base_url}/admin/")
    
    # Test API endpoint
    test_endpoint(f"{base_url}/api/")
    
    # Test product types endpoint
    test_endpoint(f"{base_url}/api/product-types/")
    
    # Test CSRF endpoint
    test_endpoint(f"{base_url}/api/csrf/") 