const fs = require('fs');
const path = require('path');

function replaceColors(content) {
  // Backgrounds
  content = content.replace(/bg-\[#09090b\]/g, 'bg-background');
  content = content.replace(/bg-\[#030014\]/g, 'bg-background');
  content = content.replace(/bg-\[#16161e\]/g, 'bg-card');
  content = content.replace(/bg-\[#16161f\]/g, 'bg-card');
  content = content.replace(/bg-\[#18181f\]/g, 'bg-surface');
  content = content.replace(/bg-\[#181822\]/g, 'bg-surface');
  content = content.replace(/bg-\[#1e1b2e\]/g, 'bg-surface');
  content = content.replace(/bg-\[#1e1e2a\]/g, 'bg-surface');
  
  // Borders
  content = content.replace(/border-white\/5(?!0)/g, 'border-border');
  content = content.replace(/border-white\/10/g, 'border-border');
  content = content.replace(/border-white\/\[0\.04\]/g, 'border-border');
  content = content.replace(/border-white\/\[0\.05\]/g, 'border-border');
  content = content.replace(/border-white\/\[0\.06\]/g, 'border-border');
  content = content.replace(/border-white\/\[0\.07\]/g, 'border-border');
  content = content.replace(/border-white\/\[0\.08\]/g, 'border-border');
  content = content.replace(/border-white\/\[0\.14\]/g, 'border-border-hover');
  content = content.replace(/border-white\/20/g, 'border-border-hover');

  // Text Hexes
  content = content.replace(/text-\[#f1f0ff\]/g, 'text-foreground');
  content = content.replace(/text-\[#a09cb0\]/g, 'text-secondary');
  content = content.replace(/text-\[#5e5a72\]/g, 'text-muted');

  // Replace text-white globally, then revert it for specific buttons
  content = content.replace(/\btext-white\b/g, 'text-foreground');
  content = content.replace(/\btext-white\/[0-9]+\b/g, 'text-secondary'); // simplified

  // Revert for buttons/badges (purple, orange, red, green)
  // We want to make sure purple buttons remain text-white
  content = content.replace(/from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-foreground/g, 'from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white');
  content = content.replace(/bg-orange-500 hover:bg-orange-600 text-foreground/g, 'bg-orange-500 hover:bg-orange-600 text-white');
  content = content.replace(/bg-\[#F16421\] hover:bg-\[#E35D1F\] rounded-xl transition-colors shadow-\[0_0_10px_rgba\(241,100,33,0\.2\)\] flex items-center justify-center text-xs font-bold text-foreground/g, 'bg-[#F16421] hover:bg-[#E35D1F] rounded-xl transition-colors shadow-[0_0_10px_rgba(241,100,33,0.2)] flex items-center justify-center text-xs font-bold text-white');
  
  return content;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('.next')) {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const original = fs.readFileSync(fullPath, 'utf8');
      const modified = replaceColors(original);
      if (original !== modified) {
        fs.writeFileSync(fullPath, modified, 'utf8');
      }
    }
  }
}

processDirectory('/Users/oguzhanozdemir/Desktop/etsy/src');
console.log("Done refactoring UI hex colors.");
