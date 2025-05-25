#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🎉 Birthday Card Template Setup');
console.log('================================\n');

async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function setup() {
    try {
        // Get user input
        const childName = await askQuestion('👶 Child\'s name: ');
        const age = await askQuestion('🎂 Age: ');
        const theme = await askQuestion('🎨 Theme (petals/hearts/stars/snowflakes): ') || 'petals';
        const primaryColor = await askQuestion('🌈 Primary color (hex, e.g., #FFB6C1): ') || '#FFB6C1';
        
        console.log('\n✨ Customizing your birthday card...\n');

        // Read the template file
        const templatePath = path.join(__dirname, 'public', 'index.html');
        let content = fs.readFileSync(templatePath, 'utf8');

        // Replace placeholders
        content = content.replace(/\{\{CHILD_NAME\}\}/g, childName);
        content = content.replace(/\{\{AGE\}\}/g, age);
        
        // Update config in the file
        content = content.replace(
            /childName: '\{\{CHILD_NAME\}\}'/,
            `childName: '${childName}'`
        );
        content = content.replace(
            /age: \{\{AGE\}\}/,
            `age: ${age}`
        );
        content = content.replace(
            /fallingElementType: 'petals'/,
            `fallingElementType: '${theme}'`
        );
        content = content.replace(
            /--primary-color: #FFB6C1;/,
            `--primary-color: ${primaryColor};`
        );

        // Write the customized file
        fs.writeFileSync(templatePath, content);

        console.log('✅ Template customized successfully!');
        console.log('\n📋 Next Steps:');
        console.log('1. Add your images:');
        console.log('   - public/front-image.png (front of card)');
        console.log('   - public/back-image.png (back of card)');
        console.log('2. Test locally: npm run dev');
        console.log('3. Deploy: npx vercel --prod');
        console.log(`4. Your card will be: https://${childName.toLowerCase()}-birthday-card.vercel.app`);
        console.log('\n🎉 Happy Birthday to ' + childName + '! 🎂');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    } finally {
        rl.close();
    }
}

setup();