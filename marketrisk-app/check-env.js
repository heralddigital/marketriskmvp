// Quick script to check if environment variables are set
// Run with: node check-env.js

const fs = require('fs');
const path = require('path');

console.log('Checking environment variables...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.log('\nPlease create a .env.local file with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
  process.exit(1);
}

// Read .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

let hasUrl = false;
let hasKey = false;

lines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    const value = line.split('=')[1]?.trim();
    if (value && value !== 'your_supabase_url' && !value.includes('your-')) {
      console.log('✅ NEXT_PUBLIC_SUPABASE_URL is set');
      hasUrl = true;
    } else {
      console.log('❌ NEXT_PUBLIC_SUPABASE_URL is not properly configured');
    }
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    const value = line.split('=')[1]?.trim();
    if (value && value !== 'your_anon_key' && !value.includes('your-') && value.length > 20) {
      console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set');
      hasKey = true;
    } else {
      console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not properly configured');
    }
  }
});

if (!hasUrl || !hasKey) {
  console.log('\n⚠️  Please check your .env.local file and ensure both variables are set correctly.');
  process.exit(1);
}

console.log('\n✅ All environment variables appear to be configured correctly!');
console.log('\nIf you still see errors, try:');
console.log('1. Restart your dev server (npm run dev)');
console.log('2. Clear Next.js cache: rm -rf .next');
console.log('3. Verify your Supabase project is active and the URL is correct');

