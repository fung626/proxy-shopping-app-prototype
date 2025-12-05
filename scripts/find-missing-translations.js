#!/usr/bin/env node
/**
 * Translation Key Comparison Script
 * Finds missing translation keys across all languages
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/locales');
const LANGUAGES = ['en', 'zh-cn', 'zh-tw', 'ja', 'ko'];

// Extract all keys from a translation object
function extractKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...extractKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Load all translation files for a language
function loadTranslations(lang) {
  const langDir = path.join(LOCALES_DIR, lang);
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.ts'));
  
  const translations = {};
  for (const file of files) {
    const filePath = path.join(langDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract the export const name = {...} part
    const exportMatch = content.match(/export const (\w+) = ({[\s\S]*?});?\s*$/m);
    if (exportMatch) {
      const [, exportName, objContent] = exportMatch;
      try {
        // Simple eval to get the object (in production, use a proper parser)
        const obj = eval(`(${objContent})`);
        const keys = extractKeys(obj);
        translations[file.replace('.ts', '')] = keys;
      } catch (e) {
        console.error(`Error parsing ${lang}/${file}:`, e.message);
      }
    }
  }
  return translations;
}

// Main comparison
function compareTranslations() {
  console.log('Loading translations for all languages...\n');
  
  const allTranslations = {};
  for (const lang of LANGUAGES) {
    allTranslations[lang] = loadTranslations(lang);
  }
  
  // Use English as the reference
  const referenceTranslations = allTranslations['en'];
  const missingKeys = {};
  
  console.log('Comparing translations...\n');
  
  // For each namespace
  for (const namespace of Object.keys(referenceTranslations)) {
    const referenceKeys = new Set(referenceTranslations[namespace]);
    
    for (const lang of LANGUAGES) {
      if (lang === 'en') continue;
      
      const langKeys = new Set(allTranslations[lang][namespace] || []);
      const missing = [...referenceKeys].filter(k => !langKeys.has(k));
      
      if (missing.length > 0) {
        if (!missingKeys[lang]) missingKeys[lang] = {};
        missingKeys[lang][namespace] = missing;
      }
    }
  }
  
  // Report findings
  console.log('='.repeat(70));
  console.log('MISSING TRANSLATION KEYS REPORT');
  console.log('='.repeat(70));
  
  let totalMissing = 0;
  for (const [lang, namespaces] of Object.entries(missingKeys)) {
    console.log(`\n\n${lang.toUpperCase()}:`);
    console.log('-'.repeat(70));
    
    for (const [namespace, keys] of Object.entries(namespaces)) {
      console.log(`\n  ${namespace}.ts (${keys.length} missing keys):`);
      keys.forEach(key => {
        console.log(`    - ${key}`);
        totalMissing++;
      });
    }
  }
  
  if (totalMissing === 0) {
    console.log('\n✅ All translations are complete! No missing keys found.');
  } else {
    console.log(`\n\n📊 Total missing keys: ${totalMissing}`);
  }
  
  console.log('\n' + '='.repeat(70));
}

compareTranslations();
