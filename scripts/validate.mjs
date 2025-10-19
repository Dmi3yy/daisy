#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

console.log("🔍 Evolution Build Validator\n");
console.log("=" .repeat(50));

let hasErrors = false;
let hasWarnings = false;

// Check Node version
console.log("\n📦 Checking Node version...");
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
  console.error(`  ✗ Node ${nodeVersion} is not supported. Requires Node >= 18`);
  hasErrors = true;
} else {
  console.log(`  ✓ Node ${nodeVersion} is supported`);
}

// Check if required directories exist
console.log("\n📁 Checking directory structure...");
const requiredDirs = [
  "src",
  "src/templates",
  "src/components",
  "src/content",
  "scripts"
];

for (const dir of requiredDirs) {
  const dirPath = path.join(root, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✓ ${dir}/ exists`);
  } else {
    console.error(`  ✗ ${dir}/ is missing`);
    hasErrors = true;
  }
}

// Check if required files exist
console.log("\n📄 Checking required files...");
const requiredFiles = [
  "package.json",
  "src/app.css",
  "src/templates/base.html",
  "src/components/navbar.html",
  "src/components/footer.html",
  "src/components/settings.html",
  "src/content/home.html",
  "scripts/build.mjs",
  "scripts/inline.mjs"
];

for (const file of requiredFiles) {
  const filePath = path.join(root, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ ${file} exists`);
  } else {
    console.error(`  ✗ ${file} is missing`);
    hasErrors = true;
  }
}

// Check if dependencies are installed
console.log("\n📦 Checking dependencies...");
const nodeModulesPath = path.join(root, "node_modules");
if (!fs.existsSync(nodeModulesPath)) {
  console.error("  ✗ node_modules not found. Run 'npm install' first.");
  hasErrors = true;
} else {
  console.log("  ✓ node_modules exists");
  
  const requiredPackages = ["tailwindcss", "daisyui", "juice"];
  for (const pkg of requiredPackages) {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (fs.existsSync(pkgPath)) {
      console.log(`  ✓ ${pkg} is installed`);
    } else {
      console.error(`  ✗ ${pkg} is not installed`);
      hasErrors = true;
    }
  }
}

// Check package.json structure
console.log("\n📋 Validating package.json...");
try {
  const pkgPath = path.join(root, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  
  if (pkg.type === "module") {
    console.log("  ✓ type is set to 'module'");
  } else {
    console.error("  ✗ package.json must have 'type': 'module'");
    hasErrors = true;
  }
  
  const requiredScripts = ["clean", "build:css", "build:html", "build:inline", "build", "dev"];
  for (const script of requiredScripts) {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`  ✓ Script '${script}' is defined`);
    } else {
      console.error(`  ✗ Script '${script}' is missing`);
      hasErrors = true;
    }
  }
} catch (e) {
  console.error(`  ✗ Failed to parse package.json: ${e.message}`);
  hasErrors = true;
}

// Check app.css structure
console.log("\n🎨 Validating app.css...");
try {
  const cssPath = path.join(root, "src/app.css");
  const css = fs.readFileSync(cssPath, "utf8");
  
  if (css.includes('@import "tailwindcss"')) {
    console.log('  ✓ Tailwind CSS import found');
  } else {
    console.error('  ✗ Missing @import "tailwindcss"');
    hasErrors = true;
  }
  
  if (css.includes('@plugin "daisyui"')) {
    console.log('  ✓ daisyUI plugin found');
  } else {
    console.error('  ✗ Missing @plugin "daisyui"');
    hasErrors = true;
  }
  
  const hasLegacyEvoTheme = css.includes('name: "evo"');
  const hasSplitEvoThemes =
    css.includes('name: "light-evo"') && css.includes('name: "dark-evo"');

  if (hasSplitEvoThemes) {
    console.log('  ✓ Custom themes "light-evo"/"dark-evo" found');
  } else {
    console.error('  ✗ Missing custom themes "light-evo" and "dark-evo"');
    hasErrors = true;
  }

  if (hasLegacyEvoTheme) {
    console.error('  ✗ Legacy custom theme "evo" found. Remove legacy definition.');
    hasErrors = true;
  }
} catch (e) {
  console.error(`  ✗ Failed to read app.css: ${e.message}`);
  hasErrors = true;
}

// Check HTML templates for markers
console.log("\n🔖 Validating HTML templates...");
try {
  const basePath = path.join(root, "src/templates/base.html");
  const base = fs.readFileSync(basePath, "utf8");
  
  const markers = ["@@NAVBAR", "@@FOOTER", "@@CONTENT", "@@SETTINGS"];
  for (const marker of markers) {
    if (base.includes(`<!-- ${marker} -->`)) {
      console.log(`  ✓ Marker ${marker} found`);
    } else {
      console.error(`  ✗ Marker ${marker} missing`);
      hasErrors = true;
    }
  }
  
  const placeholders = ["[[THEME]]", "[[LANG]]"];
  for (const placeholder of placeholders) {
    if (base.includes(placeholder)) {
      console.log(`  ✓ Placeholder ${placeholder} found`);
    } else {
      console.error(`  ✗ Placeholder ${placeholder} missing`);
      hasErrors = true;
    }
  }
} catch (e) {
  console.error(`  ✗ Failed to validate base.html: ${e.message}`);
  hasErrors = true;
}

// Try to run a test build (if dependencies are installed)
if (!hasErrors && fs.existsSync(nodeModulesPath)) {
  console.log("\n🔨 Running test build...");
  try {
    execSync("npm run build", { 
      cwd: root, 
      stdio: "pipe",
      encoding: "utf8"
    });
    console.log("  ✓ Test build completed successfully");
    
    // Check if output files were created
    const distFiles = ["dist/styles.css", "dist/index.html", "dist/index.inline.html"];
    for (const file of distFiles) {
      const filePath = path.join(root, file);
      if (fs.existsSync(filePath)) {
        const size = (fs.statSync(filePath).size / 1024).toFixed(2);
        console.log(`  ✓ ${file} created (${size} KB)`);
      } else {
        console.error(`  ✗ ${file} was not created`);
        hasErrors = true;
      }
    }
  } catch (e) {
    console.error(`  ✗ Test build failed: ${e.message}`);
    hasErrors = true;
  }
}

// Summary
console.log("\n" + "=".repeat(50));
if (hasErrors) {
  console.error("\n❌ Validation failed with errors!");
  process.exit(1);
} else if (hasWarnings) {
  console.warn("\n⚠️  Validation passed with warnings");
  process.exit(0);
} else {
  console.log("\n✅ All validations passed!");
  console.log("\n🚀 You're ready to build!");
  console.log("\nNext steps:");
  console.log("  • Run 'npm run build' to create production build");
  console.log("  • Run 'npm run dev' to start development mode");
  process.exit(0);
}

