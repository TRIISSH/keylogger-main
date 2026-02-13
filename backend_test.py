import requests
import sys
import json
from datetime import datetime
import uuid

class KeyloggerAPITester:
    def __init__(self, base_url="https://inputspy.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.session_id = f"test_session_{int(datetime.now().timestamp())}"

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, params=params)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_create_keystroke(self):
        """Test creating a keystroke"""
        keystroke_data = {
            "key": "a",
            "code": "KeyA",
            "key_code": 65,
            "modifiers": {"shift": False, "ctrl": False, "alt": False, "meta": False},
            "session_id": self.session_id
        }
        return self.run_test("Create Keystroke", "POST", "keystrokes", 200, keystroke_data)

    def test_get_keystrokes_all(self):
        """Test getting all keystrokes"""
        return self.run_test("Get All Keystrokes", "GET", "keystrokes", 200)

    def test_get_keystrokes_by_session(self):
        """Test getting keystrokes by session ID"""
        params = {"session_id": self.session_id}
        return self.run_test("Get Keystrokes by Session", "GET", "keystrokes", 200, params=params)

    def test_get_stats(self):
        """Test getting statistics"""
        return self.run_test("Get Statistics", "GET", "stats", 200)

    def test_get_sessions(self):
        """Test getting sessions"""
        return self.run_test("Get Sessions", "GET", "sessions", 200)

    def test_exfiltrate_data(self):
        """Test data exfiltration simulation"""
        exfiltration_data = {
            "method": "web",
            "data": "test_password_123",
            "session_id": self.session_id
        }
        return self.run_test("Simulate Exfiltration", "POST", "exfiltrate", 200, exfiltration_data)

    def test_clear_keystrokes_session(self):
        """Test clearing keystrokes for specific session"""
        params = {"session_id": self.session_id}
        return self.run_test("Clear Session Keystrokes", "DELETE", "keystrokes", 200, params=params)

    def test_clear_all_keystrokes(self):
        """Test clearing all keystrokes"""
        return self.run_test("Clear All Keystrokes", "DELETE", "keystrokes", 200)

def main():
    print("🚀 Starting Keylogger API Tests")
    print("=" * 50)
    
    tester = KeyloggerAPITester()
    
    # Test sequence
    tests = [
        tester.test_root_endpoint,
        tester.test_get_stats,
        tester.test_get_sessions,
        tester.test_create_keystroke,
        tester.test_get_keystrokes_all,
        tester.test_get_keystrokes_by_session,
        tester.test_exfiltrate_data,
        tester.test_clear_keystrokes_session,
        # Don't clear all at the end to preserve data for frontend testing
    ]
    
    # Run all tests
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All backend API tests passed!")
        return 0
    else:
        print("⚠️  Some backend API tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())