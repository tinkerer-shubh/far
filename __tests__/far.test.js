const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const runFar = (args) => execSync(`node ${path.join(__dirname, '../far.js')} ${args}`, { encoding: 'utf8' });

describe('far', () => {
    beforeEach(() => {
        fs.writeFileSync('test.txt', 'This is a test tile with some text to replace');
    });
    
    afterEach(()=> {
        fs.unlinkSync('test.txt');
    });

    test('basic replacement', () => {
        runFar('"test.txt" "text" "content" --dry-run');
        const result = fs.readFileSync('test.txt', 'utf8');
        expect(result).toContain('text');
        expect(result).not.toContain('content');
    });
});