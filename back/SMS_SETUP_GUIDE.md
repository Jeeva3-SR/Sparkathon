# 📱 Real SMS Setup Guide

This guide will help you set up real SMS functionality using Twilio.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Twilio Account
1. Go to [https://console.twilio.com/](https://console.twilio.com/)
2. Sign up for a **FREE** account (no credit card required for trial)
3. Verify your phone number

### Step 2: Get Your Credentials
1. After login, you'll see your **Account SID** and **Auth Token** on the dashboard
2. Copy these values - you'll need them in Step 3

### Step 3: Get a Phone Number
1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. For trial accounts, you can use the trial number provided
3. Copy the phone number (format: +1234567890)

### Step 4: Configure Your App
1. Create `.env` file in the `back/` directory
2. Add your credentials:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/touristSafety

# Server Configuration
PORT=5000
```

### Step 5: Install Dependencies and Test
```bash
cd back
npm install
npm start
```

## 🧪 Testing SMS

1. **Start the server**: `npm start`
2. **Open frontend**: Go to http://localhost:3000
3. **Test with danger zone**:
   - Name: "Test User"
   - Lat: 12.900
   - Lon: 80.100
   - Mobile: Your real phone number (e.g., +1234567890)
4. **Check your phone** - you should receive an SMS!

## 📱 SMS Triggers

SMS will be sent to relatives when:
- ✅ Tourist enters a **danger zone** (immediate SMS)
- ✅ Tourist doesn't respond within **20 seconds** (timeout SMS)
- ✅ Tourist responds **"no"** to safety check (emergency SMS)

## 🔧 Troubleshooting

### "SMS not working"
1. Check console for error messages
2. Verify your `.env` file has correct credentials
3. Make sure your Twilio account is verified
4. Check if you have SMS credits (trial accounts have limited credits)

### "Invalid phone number"
- Use international format: +1234567890
- Include country code (e.g., +1 for US, +91 for India)

### "Twilio error"
- Check your Account SID and Auth Token
- Ensure your Twilio phone number is correct
- Verify your account is not suspended

## 💰 Cost Information

- **Trial Account**: Free SMS to verified numbers only
- **Paid Account**: ~$0.0075 per SMS (very cheap!)
- **Monthly Cost**: ~$1 for phone number + SMS costs

## 🆘 Need Help?

1. Check Twilio Console for account status
2. Look at server console for detailed error messages
3. Verify your `.env` file format
4. Test with a simple phone number first

## 📞 Example SMS Message

```
🚨 EMERGENCY ALERT 🚨

John Doe is in a DANGER zone and needs immediate attention!

📍 Location: 12.900, 80.100
⏰ Time: 12/25/2024, 3:45:30 PM

Please contact emergency services or check on John Doe immediately.

- Tourist Safety Monitoring System
```
