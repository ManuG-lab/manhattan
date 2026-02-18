#!/bin/bash

# Hardware Management System Setup Script

echo "=================================="
echo "Hardware Management System Setup"
echo "=================================="

# Backend Setup
echo ""
echo "Setting up Backend..."
cd backend
pip install -r requirements.txt
echo "Backend dependencies installed ✓"

# Frontend Setup
echo ""
echo "Setting up Frontend..."
cd ../frontend
npm install
echo "Frontend dependencies installed ✓"

echo ""
echo "=================================="
echo "Setup Complete!"
echo "=================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Backend (Terminal 1):"
echo "   cd backend"
echo "   python app.py"
echo ""
echo "2. Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Demo Credentials:"
echo "  Email: admin@hardware.com | Password: admin123"
echo "  Email: manager@hardware.com | Password: manager123"
echo "  Email: user@hardware.com | Password: user123"
