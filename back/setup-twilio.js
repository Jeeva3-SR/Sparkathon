const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🔧 Twilio SMS Setup Helper');
console.log('========================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Twilio SMS Configuration
# Get these from your Twilio Console: https://console.twilio.com/

# Replace these with your actual Twilio credentials:
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/touristSafety

# Server Configuration
PORT=5000`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!\n');
} else {
  console.log('✅ .env file already exists\n');
}

console.log('📋 QUICK SETUP STEPS:');
console.log('1. Go to https://console.twilio.com/');
console.log('2. Sign up for a FREE account (no credit card needed)');
console.log('3. Get your Account SID and Auth Token from dashboard');
console.log('4. Get a phone number (trial accounts get one free)');
console.log('5. Edit the .env file with your credentials\n');

console.log('🔍 .env file location:', envPath);
console.log('\n📱 SMS will be sent when:');
console.log('   • Tourist enters danger zone (immediate)');
console.log('   • Tourist doesn\'t respond in 20 seconds');
console.log('   • Tourist responds "no" to safety check\n');

console.log('🧪 To test:');
console.log('1. Configure Twilio credentials in .env file');
console.log('2. Run: npm start');
console.log('3. Submit danger zone coordinates with your phone number');
console.log('4. Check your phone for SMS!\n');

console.log('📖 For detailed instructions, see: SMS_SETUP_GUIDE.md');
