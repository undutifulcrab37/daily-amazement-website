#!/usr/bin/env node

// Database Test Script for Daily Amazement Competition
// This script tests the Supabase connection and database operations

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://gstyydgnyenjzeeeqrse.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdHl5ZGdueWVuanplZWVxcnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NDUzOTAsImV4cCI6MjA2OTMyMTM5MH0.41mI_Fn-S6bptZjK20PjXIMeKy62ScHJftUT3ahdJQ4';

async function testDatabase() {
    console.log('🚀 Starting database test...\n');
    
    try {
        // Initialize Supabase client
        console.log('1. Initializing Supabase client...');
        const supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Supabase client initialized\n');
        
        // Test 1: Check connection
        console.log('2. Testing database connection...');
        const { data: connectionTest, error: connectionError } = await supabase
            .from('competition_entries')
            .select('count')
            .limit(1);
            
        if (connectionError) {
            console.error('❌ Connection test failed:', connectionError);
            return;
        }
        console.log('✅ Database connection successful\n');
        
        // Test 2: Count existing entries
        console.log('3. Counting existing entries...');
        const { data: entries, error: countError } = await supabase
            .from('competition_entries')
            .select('*');
            
        if (countError) {
            console.error('❌ Error counting entries:', countError);
            return;
        }
        
        console.log(`✅ Found ${entries.length} existing entries in database`);
        if (entries.length > 0) {
            console.log('📋 Recent entries:');
            entries.slice(-3).forEach((entry, index) => {
                console.log(`   ${index + 1}. ${entry.firstname} ${entry.lastname} (${entry.email}) - Codeword: ${entry.codeword}`);
            });
        }
        console.log('');
        
        // Test 3: Insert a test entry
        console.log('4. Inserting test entry...');
        const testEntry = {
            firstname: 'Test',
            lastname: 'User',
            youtubename: '@TestUser' + Date.now(),
            codeword: 'TEST' + Math.random().toString(36).substr(2, 5),
            email: `test${Date.now()}@example.com`,
            submittedat: new Date().toISOString()
        };
        
        console.log('📝 Test entry data:', testEntry);
        
        const { data: insertData, error: insertError } = await supabase
            .from('competition_entries')
            .insert([testEntry])
            .select();
            
        if (insertError) {
            console.error('❌ Error inserting test entry:', insertError);
            return;
        }
        
        console.log('✅ Test entry inserted successfully!');
        console.log('📊 Inserted data:', insertData);
        console.log('');
        
        // Test 4: Check valid codewords
        console.log('5. Checking valid codewords...');
        const { data: validCodewords, error: codewordError } = await supabase
            .from('valid_codewords')
            .select('*');
            
        if (codewordError) {
            console.error('❌ Error fetching valid codewords:', codewordError);
        } else {
            console.log(`✅ Found ${validCodewords.length} valid codewords:`);
            validCodewords.forEach((cw, index) => {
                console.log(`   ${index + 1}. ${cw.codeword}`);
            });
        }
        console.log('');
        
        // Test 5: Check site config
        console.log('6. Checking site configuration...');
        const { data: siteConfig, error: configError } = await supabase
            .from('site_config')
            .select('*');
            
        if (configError) {
            console.error('❌ Error fetching site config:', configError);
        } else {
            console.log(`✅ Found ${siteConfig.length} configuration entries:`);
            siteConfig.forEach((config, index) => {
                console.log(`   ${index + 1}. ${config.config_key}: ${config.config_value?.substring(0, 50)}${config.config_value?.length > 50 ? '...' : ''}`);
            });
        }
        console.log('');
        
        console.log('🎉 All database tests completed successfully!');
        console.log('\n📋 Summary:');
        console.log(`   - Database connection: ✅ Working`);
        console.log(`   - Competition entries: ✅ ${entries.length} entries found`);
        console.log(`   - Test entry insertion: ✅ Working`);
        console.log(`   - Valid codewords: ✅ ${validCodewords.length} codewords`);
        console.log(`   - Site configuration: ✅ ${siteConfig.length} config entries`);
        
    } catch (error) {
        console.error('💥 Unexpected error during database test:', error);
    }
}

// Run the test
testDatabase();
