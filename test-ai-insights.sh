#!/bin/bash
# Test AI Insights Endpoint
# This script tests the AI insights endpoint to verify it's working

echo "=== Testing AI Insights Endpoint ==="
echo ""

# Test 1: Check if backend is running
echo "1. Checking if backend is running on port 5001..."
if curl -s http://localhost:5001/ > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not responding"
    exit 1
fi

echo ""
echo "2. Testing AI insights endpoint (without auth - should fail)..."
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:5001/api/ai/insights)
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$HTTP_STATUS" = "401" ]; then
    echo "✅ Endpoint requires authentication (expected)"
else
    echo "⚠️  Unexpected status code: $HTTP_STATUS"
fi

echo ""
echo "=== Instructions for Manual Testing ==="
echo ""
echo "To test AI insights properly:"
echo "1. Open http://localhost:5173 in your browser"
echo "2. Open Developer Console (F12)"
echo "3. Sign up or log in"
echo "4. Add 3-4 transactions with different categories"
echo "5. Check the console for these messages:"
echo "   - 'Fetching AI insights with token...'"
echo "   - 'AI insights received: [...]'"
echo "6. The AI Insights section should show personalized advice"
echo ""
echo "If you see errors:"
echo "- 401 Unauthorized: Authentication issue (check Supabase session)"
echo "- Network error: Backend not running or CORS issue"
echo "- No insights: Need more transaction data"
echo ""
