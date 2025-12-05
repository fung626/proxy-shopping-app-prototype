#!/usr/bin/env node
/**
 * Scan React components for translation key usage and verify they exist
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
const LOCALES_DIR = path.join(__dirname, '../src/locales');
const LANGUAGES = ['en', 'zh-cn', 'zh-tw', 'ja', 'ko'];

// Extract all translation keys from a TypeScript/TSX file
function extractTranslationKeys(content, filePath) {
    const keys = new Set();

    // Match patterns like t('namespace.key') or t("namespace.key")
    const tFunctionRegex = /\bt\s*\(\s*['"]([^'"]+)['"]/g;

    let match;
    while ((match = tFunctionRegex.exec(content)) !== null) {
        const fullKey = match[1];
        keys.add(fullKey);
    }

    return Array.from(keys);
}

// Recursively scan directory for .tsx and .ts files
function scanDirectory(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules, locales directory
            if (!file.startsWith('.') && file !== 'node_modules' && file !== 'locales') {
                scanDirectory(filePath, fileList);
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Load all available translation keys from locale files
function loadAvailableKeys(lang) {
    const langDir = path.join(LOCALES_DIR, lang);
    const availableKeys = new Set();

    try {
        const files = fs.readdirSync(langDir).filter(f => f.endsWith('.ts'));

        for (const file of files) {
            const namespace = file.replace('.ts', '');
            const filePath = path.join(langDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');

            // Extract keys from the exported object
            const exportMatch = content.match(/export const \w+ = \{([\s\S]*?)\};?\s*$/m);
            if (exportMatch) {
                const objContent = exportMatch[1];
                // Simple key extraction (matches key: 'value' patterns)
                const keyRegex = /^\s*(\w+):/gm;
                let match;
                while ((match = keyRegex.exec(objContent)) !== null) {
                    const fullKey = `${namespace}.${match[1]}`;
                    availableKeys.add(fullKey);
                }
            }
        }
    } catch (error) {
        console.error(`Error loading keys for ${lang}:`, error.message);
    }

    return availableKeys;
}

// Main analysis
console.log('🔍 Scanning React components for translation key usage...\n');

// Step 1: Extract all translation keys used in code
const sourceFiles = scanDirectory(SRC_DIR);
const usedKeys = new Set();
const keysByFile = new Map();

sourceFiles.forEach(filePath => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const keys = extractTranslationKeys(content, filePath);

        if (keys.length > 0) {
            const relativePath = path.relative(SRC_DIR, filePath);
            keysByFile.set(relativePath, keys);
            keys.forEach(key => usedKeys.add(key));
        }
    } catch (error) {
        // Skip files that can't be read
    }
});

console.log(`✅ Found ${usedKeys.size} unique translation keys used in ${keysByFile.size} files\n`);

// Step 2: Load available keys from all languages
console.log('📚 Loading translation keys from locale files...\n');
const availableKeysByLang = {};
LANGUAGES.forEach(lang => {
    availableKeysByLang[lang] = loadAvailableKeys(lang);
    console.log(`  ${lang}: ${availableKeysByLang[lang].size} keys available`);
});

// Step 3: Find missing keys
console.log('\n' + '='.repeat(70));
console.log('MISSING TRANSLATION KEYS REPORT');
console.log('='.repeat(70));

let totalMissingKeys = 0;
const missingByLang = {};

LANGUAGES.forEach(lang => {
    const available = availableKeysByLang[lang];
    const missing = [];

    usedKeys.forEach(key => {
        if (!available.has(key)) {
            missing.push(key);
        }
    });

    if (missing.length > 0) {
        missingByLang[lang] = missing;
        totalMissingKeys += missing.length;
    }
});

if (totalMissingKeys === 0) {
    console.log('\n✅ EXCELLENT! All translation keys used in code exist in all language files.\n');
} else {
    console.log('\n⚠️  Found translation keys used in code but missing from translation files:\n');

    Object.entries(missingByLang).forEach(([lang, keys]) => {
        console.log(`\n${lang.toUpperCase()} - ${keys.length} missing keys:`);
        console.log('-'.repeat(70));

        // Group by namespace
        const byNamespace = {};
        keys.forEach(key => {
            const [namespace] = key.split('.');
            if (!byNamespace[namespace]) byNamespace[namespace] = [];
            byNamespace[namespace].push(key);
        });

        Object.entries(byNamespace).forEach(([namespace, nsKeys]) => {
            console.log(`\n  ${namespace}.ts (${nsKeys.length} keys):`);
            nsKeys.forEach(key => console.log(`    - ${key}`));
        });
    });

    console.log(`\n📊 Total missing: ${totalMissingKeys} keys across ${Object.keys(missingByLang).length} languages`);
}

console.log('\n' + '='.repeat(70));

// Report files using the most translations
console.log('\n📝 Top files using translations:\n');
const topFiles = Array.from(keysByFile.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10);

topFiles.forEach(([file, keys]) => {
    console.log(`  ${file}: ${keys.length} keys`);
});

console.log('\n');
