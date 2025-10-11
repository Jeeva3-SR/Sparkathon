# Tourist Safety Monitoring System

A full-stack MERN application for monitoring tourist safety in real-time with danger zone detection and emergency response capabilities.

## 🚀 Features

- **Real-time Location Tracking**: Tourists can submit their location coordinates
- **Danger Zone Detection**: Automatic detection of danger and near-danger zones
- **Emergency Alerts**: Real-time alerts via Socket.io for immediate response
- **20-Second Timeout**: Automatic timeout for danger zone alerts with no response
- **Responder Dashboard**: Complete overview of tourists in danger zones only
- **Modern UI**: Clean, responsive design with real-time updates

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **Socket.io** - Real-time communication
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - Frontend framework
- **Socket.io-client** - Real-time client communication
- **Modern CSS** - Responsive design with animations

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn package manager
- Twilio account for SMS functionality (optional - can use mock SMS)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to the project directory
cd Tourist-Safety-Monitoring

# Install backend dependencies
cd back
npm install

# Install frontend dependencies
cd ../front
npm install
```

### 2. SMS Configuration (Optional)

For SMS functionality, set up Twilio:

```bash
# Create .env file in back/ directory
cd back
cp .env.example .env

# Edit .env with your Twilio credentials:
# TWILIO_ACCOUNT_SID=your_account_sid
# TWILIO_AUTH_TOKEN=your_auth_token  
# TWILIO_PHONE_NUMBER=+1234567890
```

**Note**: If you don't set up Twilio, the system will log SMS attempts to console instead of sending real SMS.

### 3. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# For Windows
net start MongoDB

# For macOS/Linux
sudo systemctl start mongod
```

### 4. Start the Application

**Terminal 1 - Backend Server:**
```bash
cd back
npm start
# Server will run on http://localhost:5000
```

**Terminal 2 - Frontend React App:**
```bash
cd front
npm start
# App will run on http://localhost:3000
```

## 🎯 How to Use

### For Tourists:
1. Open http://localhost:3000
2. Select "Tourist" role
3. Enter your name, coordinates, and relatives mobile number
4. Submit your location
5. If you're in a danger zone, you'll receive real-time alerts
6. Respond to safety check alerts with "Yes" or "No"
7. **SMS will be sent to relatives** if you're in danger or don't respond

### For Responders:
1. Open http://localhost:3000
2. Select "Responder" role
3. View tourists in danger zones and emergency situations
4. Monitor tourists who haven't responded within 20 seconds
5. Track emergency status updates in real-time

## 🗺️ Test Coordinates

Use these coordinates to test different scenarios:

### Danger Zones (Will trigger "Are you okay?" alert):
- **Zone 1**: Lat: 12.900, Lon: 80.100
- **Marina Beach**: Lat: 13.0500, Lon: 80.2800
- **Guindy Park**: Lat: 13.0105, Lon: 80.2201

### Near Zones (Will trigger "You are near a danger zone" alert):
- **Zone 2**: Lat: 12.920, Lon: 80.080
- **IIT Madras Edge**: Lat: 13.0080, Lon: 80.2400
- **Besant Nagar**: Lat: 13.0000, Lon: 80.2660

### Safe Zones (No alerts):
- **Safe Area**: Lat: 12.800, Lon: 80.000
- **Remote Location**: Lat: 11.000, Lon: 79.000

## 🏗️ Project Structure

```
Tourist-Safety-Monitoring/
├── back/                    # Backend server
│   ├── models/
│   │   └── Tourist.js      # MongoDB schema
│   ├── package.json        # Backend dependencies
│   └── server.js           # Express server with Socket.io
├── front/                   # React frontend
│   ├── src/
│   │   ├── Tourist.js      # Tourist dashboard component
│   │   ├── Responder.js    # Responder dashboard component
│   │   ├── RoleSelect.js   # Role selection component
│   │   ├── App.js          # Main app component
│   │   └── App.css         # Styling
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## 🔧 API Endpoints

### POST /api/tourist
Submit tourist location and get zone detection
```json
{
  "name": "John Doe",
  "lat": 12.900,
  "lon": 80.100,
  "relativesMobile": "+1234567890"
}
```

### POST /api/reply
Tourist response to safety check
```json
{
  "name": "John Doe",
  "reply": "yes"
}
```

### SMS Notifications
- **Danger Zone SMS**: Immediate SMS sent to relatives when tourist enters danger zone
- **No Response SMS**: SMS sent to relatives if tourist doesn't respond within 20 seconds
- **Emergency SMS**: SMS sent to relatives if tourist responds "no" to safety check
- **SMS Content**: Includes tourist name, location coordinates, timestamp, and emergency details

### Timeout Handling
- **20-Second Timeout**: Danger zone alerts automatically timeout after 20 seconds
- **No Response Status**: Tourists who don't respond are marked as "no_response"
- **Real-time Updates**: Responders see timeout status immediately

### GET /api/responder
Get all tourists data for responder dashboard

## 🔌 Socket.io Events

### Server → Client
- `alert` - Send safety alerts to tourists
- `updateResponder` - Update responder dashboard

### Client → Server
- `connection` - Client connects to server
- `disconnect` - Client disconnects

## 🎨 Features in Detail

### Real-time Alerts
- **Danger Zone**: "🚨 Are you okay?" with Yes/No buttons and 20-second countdown
- **Near Zone**: "⚠️ You are near a danger zone!" warning (not shown to responders)
- **Safe Zone**: No alerts, normal operation
- **Timeout**: Automatic "no_response" status after 20 seconds

### Responder Dashboard
- **Active Alerts**: Only tourists with emergency status or no-response timeouts
- **Safe Tourists**: Tourists who responded "yes" to safety checks
- **Clean Display**: No status field shown - only essential information
- **Selective Updates**: Only updates on timeout (20s) or "no" response (emergency)
- **No Initial Updates**: Dashboard doesn't update on initial tourist submissions

### Modern UI
- **Responsive Design**: Works on desktop and mobile
- **Smooth Animations**: CSS transitions and keyframes
- **Color-coded Alerts**: Red for danger, orange for near, green for safe
- **Clean Typography**: Modern font stack and spacing

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"

# Start MongoDB service
sudo systemctl start mongod  # Linux
net start MongoDB            # Windows
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

### Socket.io Connection Issues
- Ensure backend is running on port 5000
- Check CORS settings in server.js
- Verify Socket.io client URL matches server

## 📝 Development Notes

- All coordinates are in decimal degrees format
- Danger zones use Euclidean distance calculation
- Socket.io enables real-time bidirectional communication
- MongoDB stores all tourist data with timestamps
- React components use hooks for state management

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**: Set production MongoDB URL
2. **Build Frontend**: `npm run build` in front/ directory
3. **Serve Static Files**: Configure Express to serve React build
4. **Process Manager**: Use PM2 for Node.js process management
5. **Reverse Proxy**: Use Nginx for load balancing

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for tourist safety monitoring**
