#!/usr/bin/env node

const { program } = require('commander');
const { glob } = require('glob');
const fs = require('fs').promises;
const path = require('path');
const inquirer = require('inquirer');

program
  .version('1.0.0')
  .arguments('<globPattern> <searchString> <replaceString>')
  .option('-r, --regex', 'Use regex for search')
  .option('-c, --respect-caps', 'Respect existing capitalization')
  .option('-d, --dry-run', 'Perform a dry run')
  .action(findAndReplace);

  async function findAndReplace(globPattern, searchString, replaceString, options) {
    try {
      const files = await glob(globPattern);
      
      if (files.length === 0) {
        console.log('No files found matching the glob pattern.');
        return;
      }
  
      for (const file of files) {
        // Check if the item is a file
        const stats = await fs.stat(file);
        if (!stats.isFile()) {
          console.log(`Skipping directory: ${file}`);
          continue;
        }
  
        const content = await fs.readFile(file, 'utf8');
        // ... rest of your existing code ...
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

function respectCapsReplace(content, search, replace) {
  const variations = [
    search.toLowerCase(),
    search.toUpperCase(),
    search.charAt(0).toUpperCase() + search.slice(1).toLowerCase()
  ];

  variations.forEach((variation, index) => {
    const replaceVariation = index === 1 ? replace.toUpperCase() :
      index === 2 ? replace.charAt(0).toUpperCase() + replace.slice(1).toLowerCase() :
      replace.toLowerCase();
    content = content.replaceAll(variation, replaceVariation);
  });

  return content;
}

function diffString(oldStr, newStr) {
  const oldLines = oldStr.split('\n');
  const newLines = newStr.split('\n');
  let result = '';

  for (let i = 0; i < Math.max(oldLines.length, newLines.length); i++) {
    if (i < oldLines.length && i < newLines.length && oldLines[i] !== newLines[i]) {
      result += `- ${oldLines[i]}\n+ ${newLines[i]}\n`;
    } else if (i >= oldLines.length) {
      result += `+ ${newLines[i]}\n`;
    } else if (i >= newLines.length) {
      result += `- ${oldLines[i]}\n`;
    }
  }

  return result;
}

program.parse(process.argv);