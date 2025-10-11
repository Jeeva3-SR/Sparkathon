// Load environment variables first
require('dotenv').config();

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const Tourist = require("./models/Tourist");
const twilio = require("twilio");

// Twilio configuration (replace with your actual credentials)
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'your_account_sid';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'your_auth_token';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

// Check if Twilio is properly configured
const isTwilioConfigured = accountSid !== 'your_account_sid' && 
                          authToken !== 'your_auth_token' && 
                          accountSid && authToken && 
                          accountSid.startsWith('AC') && 
                          authToken.length > 20;

let client = null;

if (isTwilioConfigured) {
  try {
    client = twilio(accountSid, authToken);
    console.log('✅ Twilio SMS service configured successfully');
    console.log(`📱 Twilio Phone Number: ${twilioPhoneNumber}`);
  } catch (error) {
    console.error('❌ Twilio configuration error:', error.message);
    client = null;
  }
} else {
  console.log('⚠️  Twilio not configured - SMS will be logged to console only');
  console.log('💡 Run "npm run setup-sms" for setup instructions');
}

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/touristSafety")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Hardcoded danger zones (lat, lon, radius)
// Hardcoded danger zones (lat, lon, radius)
const dangerZones = [
  // DANGER zones
  { lat: 12.900, lon: 80.100, radius: 0.010, level: "danger" }, // Zone 1
  { lat: 13.0105, lon: 80.2201, radius: 0.010, level: "danger" }, // Guindy Park
  { lat: 13.0500, lon: 80.2800, radius: 0.008, level: "danger" }, // Marina Beach
  { lat: 12.6200, lon: 80.1900, radius: 0.010, level: "danger" }, // Mahabalipuram

  // NEAR danger zones
  { lat: 12.920, lon: 80.080, radius: 0.030, level: "near" }, // Zone 2
  { lat: 13.0080, lon: 80.2400, radius: 0.020, level: "near" }, // IIT Madras Edge
  { lat: 13.0000, lon: 80.2660, radius: 0.015, level: "near" }, // Besant Nagar Beach
  { lat: 13.0200, lon: 80.2600, radius: 0.020, level: "near" }, // East Coast Road area
];


// Helper to calculate if tourist is in a zone
function calculateZone(lat, lon) {
  for (const zone of dangerZones) {
    const dist = Math.sqrt(
      Math.pow(lat - zone.lat, 2) + Math.pow(lon - zone.lon, 2)
    );
    if (dist <= zone.radius) return zone.level;
  }
  return "safe";
}

// Helper function to notify law enforcement
async function notifyLawEnforcement(touristName, lat, lon, zone, caseId) {
  try {
    // In a real system, this would integrate with police dispatch systems
    // For now, we'll simulate the notification
    const lawEnforcementMessage = `🚨 EMERGENCY DISPATCH ALERT 🚨

CASE ID: ${caseId}
TOURIST: ${touristName}
LOCATION: ${lat}, ${lon}
ZONE: ${zone.toUpperCase()}
TIME: ${new Date().toLocaleString()}

IMMEDIATE RESPONSE REQUIRED
Priority: HIGH
Status: ACTIVE

Please dispatch emergency services to the location immediately.

- Tourist Safety Monitoring System`;

    console.log('\n' + '='.repeat(80));
    console.log('🚔 LAW ENFORCEMENT NOTIFICATION');
    console.log('='.repeat(80));
    console.log(lawEnforcementMessage);
    console.log('='.repeat(80));
    console.log('📞 This would be sent to police dispatch system');
    console.log('='.repeat(80) + '\n');

    return { success: true, caseId };
  } catch (error) {
    console.error('❌ Law enforcement notification failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Helper function to send SMS
async function sendSMS(mobileNumber, touristName, lat, lon, zone) {
  const message = `🚨 EMERGENCY ALERT 🚨
    
${touristName} is in a ${zone.toUpperCase()} zone and needs immediate attention!

📍 Location: ${lat}, ${lon}
⏰ Time: ${new Date().toLocaleString()}

Please contact emergency services or check on ${touristName} immediately.

- Tourist Safety Monitoring System`;

  // If Twilio is not configured, log the SMS to console
  if (!isTwilioConfigured || !client) {
    console.log('\n' + '='.repeat(60));
    console.log('📱 MOCK SMS NOTIFICATION');
    console.log('='.repeat(60));
    console.log(`To: ${mobileNumber}`);
    console.log(`From: ${twilioPhoneNumber}`);
    console.log('Message:');
    console.log(message);
    console.log('='.repeat(60));
    console.log('💡 To send real SMS, configure Twilio credentials in .env file');
    console.log('='.repeat(60) + '\n');
    
    return { success: true, messageId: 'mock-sms-' + Date.now() };
  }

  // Send real SMS via Twilio
  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: mobileNumber
    });

    console.log(`📱 ✅ REAL SMS SENT SUCCESSFULLY!`);
    console.log(`   To: ${mobileNumber}`);
    console.log(`   Message ID: ${result.sid}`);
    console.log(`   Status: ${result.status}`);
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('❌ SMS sending failed:', error.message);
    console.log('\n' + '='.repeat(60));
    console.log('📱 FALLBACK SMS NOTIFICATION (Twilio failed)');
    console.log('='.repeat(60));
    console.log(`To: ${mobileNumber}`);
    console.log(`Message: ${message}`);
    console.log('='.repeat(60));
    console.log('💡 Check your Twilio credentials and account status');
    console.log('='.repeat(60) + '\n');
    
    return { success: false, error: error.message };
  }
}

// 🟢 Tourist submission route
app.post("/api/tourist", async (req, res) => {
  const { name, lat, lon } = req.body;

  const zone = calculateZone(parseFloat(lat), parseFloat(lon));
  const caseId = `CASE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const tourist = new Tourist({
    name,
    lat,
    lon,
    zone,
    caseId,
    status: "pending",
    timestamp: new Date().toISOString(),
  });

  await tourist.save();

  // Send alerts to tourist frontend
  if (zone === "near") {
    io.emit("alert", { name, message: "⚠️ You are near a danger zone!", zone });
  } else if (zone === "danger") {
    io.emit("alert", { name, message: "🚨 Are you okay?", zone });
    // Start 20-second timeout for danger zone
    setDangerTimeout(tourist._id, name);

    // Notify law enforcement immediately for danger zones
    const lawEnforcementResult = await notifyLawEnforcement(name, lat, lon, zone, caseId);
    if (lawEnforcementResult.success) {
      tourist.lawEnforcementNotified = true;
      await tourist.save();
      console.log(`🚔 Law enforcement notified for case ${caseId}`);
    }
  }

  // Don't notify responder dashboard initially - only on timeout or "no" response
  res.json({ message: "Tourist data received", zone, caseId });
});

// 🟡 Tourist reply (Are you okay? -> yes/no)
app.post("/api/reply", async (req, res) => {
  const { name, reply } = req.body;
  const tourist = await Tourist.findOne({ name });

  if (!tourist) return res.status(404).json({ error: "Tourist not found" });

  // Clear timeout if tourist responds
  clearDangerTimeout(tourist._id);

  tourist.status = reply === "yes" ? "safe" : "emergency";
  await tourist.save();

  // Only notify responders if tourist responds "no" (emergency)
  if (reply === "no") {
    io.emit("updateResponder", tourist);
  }
  
  res.json({ message: "Reply recorded successfully" });
});

// 🟠 Timeout handler for danger zone alerts (20 seconds)
const dangerTimeouts = new Map(); // Store timeouts for each tourist

function setDangerTimeout(touristId, touristName) {
  // Clear existing timeout if any
  if (dangerTimeouts.has(touristId)) {
    clearTimeout(dangerTimeouts.get(touristId));
  }

      // Set new 20-second timeout
      const timeout = setTimeout(async () => {
        try {
          const tourist = await Tourist.findById(touristId);
          if (tourist && tourist.status === "pending") {
            tourist.status = "no_response";
            await tourist.save();
            
            // Only notify responders about no response (not tourists)
            io.emit("updateResponder", tourist);
            console.log(`⏰ No response from ${touristName} after 20 seconds - marked as no_response`);
          }
        } catch (error) {
          console.error("Error handling timeout:", error);
        }
        
        // Remove timeout from map
        dangerTimeouts.delete(touristId);
      }, 20000); // 20 seconds

  dangerTimeouts.set(touristId, timeout);
}

function clearDangerTimeout(touristId) {
  if (dangerTimeouts.has(touristId)) {
    clearTimeout(dangerTimeouts.get(touristId));
    dangerTimeouts.delete(touristId);
  }
}

// 🟣 Responder data fetch (get all tourists)
app.get("/api/responder", async (req, res) => {
  const tourists = await Tourist.find().sort({ timestamp: -1 });
  res.json(tourists);
});

// 🔧 Resolve case endpoint
app.post("/api/resolve-case/:id", async (req, res) => {
  const { id } = req.params;
  const { resolvedBy } = req.body;

  try {
    const tourist = await Tourist.findById(id);
    if (!tourist) {
      return res.status(404).json({ error: "Case not found" });
    }

    tourist.resolved = true;
    tourist.resolvedAt = new Date();
    tourist.resolvedBy = resolvedBy || "Emergency Responder";
    await tourist.save();

    // Notify all responders about case resolution
    io.emit("caseResolved", tourist);

    console.log(`✅ Case ${tourist.caseId} resolved by ${tourist.resolvedBy}`);

    res.json({
      success: true,
      message: `Case ${tourist.caseId} has been resolved`,
      case: tourist
    });
  } catch (error) {
    console.error("Error resolving case:", error);
    res.status(500).json({ error: "Failed to resolve case" });
  }
});

// 🧩 Socket.io events
io.on("connection", (socket) => {
  console.log("🟢 Client connected");
  socket.on("disconnect", () => console.log("🔴 Client disconnected"));
});

// 🚀 Start server
server.listen(5000, () => console.log("🚀 Server running on port 5000"));
