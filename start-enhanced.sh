
#!/bin/bash

echo "🚀 Starting MagajiCo Enhanced Platform..."

# Clean up any existing processes
pkill -f "pnpm"
pkill -f "python"
pkill -f "uvicorn"

echo "📦 Installing dependencies..."

# Install frontend dependencies
cd apps/frontend && pnpm install &

# Install backend dependencies  
cd ../backend && pnpm install &

# Install ML dependencies
cd ../backend/ml && pip install -r requirements.txt &

wait

echo "🤖 Starting ML Service..."
cd apps/backend/ml && python main.py &

echo "🔧 Starting Backend Service..."
cd ../../../apps/backend && pnpm run dev &

echo "🌐 Starting Frontend Service..." 
cd ../frontend && pnpm run dev &

echo "✅ All services started successfully!"
echo "🌐 Frontend: http://0.0.0.0:5000"
echo "🔧 Backend: http://0.0.0.0:3000" 
echo "🤖 ML Service: http://0.0.0.0:8000"

wait
