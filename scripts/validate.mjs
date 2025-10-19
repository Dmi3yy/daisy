#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

console.log("🔍 Evolution Build Validator\n");
console.log("=" .repeat(50));

let hasErrors = false;
let hasWarnings = false;

const relativeToRoot = (targetPath) => path.relative(root, targetPath);
const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const colorValuePattern =
  /^(#([0-9a-fA-F]{3,8})|oklch\(|rgba?\(|hsla?\(|hwb\(|lab\(|lch\(|color-mix\(|var\()/;

function parseJsonFile(filePath, description, options = {}) {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(fileContents);
    if (options.returnRaw) {
      return { data: parsed, raw: fileContents };
    }
    return parsed;
  } catch (error) {
    const label = description ? `${description} ` : "";
    console.error(`  ✗ ${label}failed to parse ${relativeToRoot(filePath)}: ${error.message}`);
    hasErrors = true;
    return null;
  }
}

function collectJsonFiles(directoryPath) {
  const files = [];
  if (!fs.existsSync(directoryPath)) {
    return files;
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectJsonFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(entryPath);
    }
  }

  return files;
}

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
const requiredDirs = ["src", "src/templates", "src/components", "src/content", "scripts", "themes"];

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

// Validate theme JSON structure
console.log("\n🎯 Validating theme definitions...");
const themesDir = path.join(root, "themes");
if (!fs.existsSync(themesDir)) {
  console.error("  ✗ themes/ directory is missing");
  hasErrors = true;
} else {
  const themeFiles = collectJsonFiles(themesDir);
  if (themeFiles.length === 0) {
    console.error("  ✗ No JSON theme definitions were found under themes/");
    hasErrors = true;
  } else {
    const requiredColorKeys = [
      "base-100",
      "base-200",
      "base-300",
      "base-content",
      "primary",
      "primary-content",
      "secondary",
      "secondary-content",
      "accent",
      "accent-content",
      "neutral",
      "neutral-content",
      "info",
      "info-content",
      "success",
      "success-content",
      "warning",
      "warning-content",
      "error",
      "error-content"
    ];
    const requiredCustomKeys = [
      "--radius-selector",
      "--radius-field",
      "--radius-box",
      "--size-selector",
      "--size-field",
      "--border",
      "--depth",
      "--noise",
      "--glass"
    ];
    const requiredNavbarKeys = ["light", "dark"];
    const themeNameMap = new Map();
    const canonicalThemePrefix = "themes/evo/";
    const aliasThemePrefixes = ["themes/light/", "themes/dark/"];
    const isCanonicalThemePath = (p) => p.startsWith(canonicalThemePrefix);
    const isAliasThemePath = (p) => aliasThemePrefixes.some((prefix) => p.startsWith(prefix));
    const isAliasPair = (a, b) =>
      (isCanonicalThemePath(a) && isAliasThemePath(b)) ||
      (isCanonicalThemePath(b) && isAliasThemePath(a));

    for (const themePath of themeFiles) {
      const relPath = relativeToRoot(themePath);
      const parsedTheme = parseJsonFile(themePath, "Theme", { returnRaw: true });

      if (!parsedTheme) {
        continue;
      }

      const { data: theme, raw } = parsedTheme;

      if (!isPlainObject(theme)) {
        console.error(`  ✗ Theme definition must be an object: ${relPath}`);
        hasErrors = true;
        continue;
      }

      const themeContentHash = createHash("sha1").update(raw).digest("hex");
      const normalizedName = typeof theme.name === "string" ? theme.name.trim() : "";

      let themeIsValid = true;

      if (normalizedName === "") {
        console.error(`  ✗ Missing or empty 'name' in ${relPath}`);
        themeIsValid = false;
        hasErrors = true;
      } else if (themeNameMap.has(normalizedName)) {
        const existing = themeNameMap.get(normalizedName);
        if (isAliasPair(existing.path, relPath) && existing.hash === themeContentHash) {
          const canonicalPath = isCanonicalThemePath(existing.path)
            ? existing.path
            : isCanonicalThemePath(relPath)
            ? relPath
            : existing.path;
          const aliasPath = canonicalPath === existing.path ? relPath : existing.path;
          console.log(
            `  ℹ️ Theme '${normalizedName}' alias found in ${aliasPath} (canonical: ${canonicalPath})`
          );
          if (!existing.canonical && isCanonicalThemePath(relPath)) {
            themeNameMap.set(normalizedName, {
              path: relPath,
              hash: themeContentHash,
              canonical: true,
            });
          }
        } else {
          console.error(
            `  ✗ Duplicate theme name '${normalizedName}' detected in ${relPath} (already defined in ${existing.path})`
          );
          themeIsValid = false;
          hasErrors = true;
        }
      } else {
        themeNameMap.set(normalizedName, {
          path: relPath,
          hash: themeContentHash,
          canonical: isCanonicalThemePath(relPath),
        });
      }

      if (typeof theme.mode !== "string" || !["light", "dark"].includes(theme.mode)) {
        console.error(`  ✗ Theme ${relPath} must declare mode as 'light' or 'dark'`);
        themeIsValid = false;
        hasErrors = true;
      }

      if (typeof theme.default !== "boolean") {
        console.error(`  ✗ Theme ${relPath} must define 'default' as a boolean`);
        themeIsValid = false;
        hasErrors = true;
      }

      if (typeof theme.prefersdark !== "boolean") {
        console.error(`  ✗ Theme ${relPath} must define 'prefersdark' as a boolean`);
        themeIsValid = false;
        hasErrors = true;
      } else if (theme.mode === "light" && theme.prefersdark) {
        console.warn(`  ⚠️ Theme ${relPath} is light but has prefersdark=true`);
        hasWarnings = true;
      } else if (theme.mode === "dark" && !theme.prefersdark) {
        console.warn(`  ⚠️ Theme ${relPath} is dark but has prefersdark=false`);
        hasWarnings = true;
      }

      if (typeof theme.colorScheme !== "string" || theme.colorScheme.trim() === "") {
        console.error(`  ✗ Theme ${relPath} must include a non-empty 'colorScheme' value`);
        themeIsValid = false;
        hasErrors = true;
      } else if (theme.mode && theme.colorScheme && theme.colorScheme !== theme.mode) {
        console.warn(
          `  ⚠️ Theme ${relPath} colorScheme ('${theme.colorScheme}') does not match mode ('${theme.mode}')`
        );
        hasWarnings = true;
      }

      if (!isPlainObject(theme.navbar)) {
        console.error(`  ✗ Theme ${relPath} must provide a navbar object`);
        themeIsValid = false;
        hasErrors = true;
      } else {
        for (const key of requiredNavbarKeys) {
          const value = theme.navbar[key];
          if (typeof value !== "string" || value.trim() === "") {
            console.error(`  ✗ Theme ${relPath} navbar.${key} must be a non-empty string`);
            themeIsValid = false;
            hasErrors = true;
          }
        }
      }

      if (!isPlainObject(theme.colors)) {
        console.error(`  ✗ Theme ${relPath} must include a colors object`);
        themeIsValid = false;
        hasErrors = true;
      } else {
        for (const key of requiredColorKeys) {
          const value = theme.colors[key];
          if (typeof value !== "string" || value.trim() === "") {
            console.error(`  ✗ Theme ${relPath} colors['${key}'] must be a non-empty string`);
            themeIsValid = false;
            hasErrors = true;
          } else if (!colorValuePattern.test(value.trim())) {
            console.warn(
              `  ⚠️ Theme ${relPath} colors['${key}'] uses an unrecognised format ('${value}')`
            );
            hasWarnings = true;
          }
        }

        for (const key of requiredCustomKeys) {
          const value = theme.colors[key];
          if (typeof value !== "string" || value.trim() === "") {
            console.error(`  ✗ Theme ${relPath} colors['${key}'] must be a non-empty string`);
            themeIsValid = false;
            hasErrors = true;
          }
        }
      }

      if (themeIsValid) {
        console.log(`  ✓ ${relPath} passed theme validation`);
      }
    }
  }
}

// Validate palettes configuration
console.log("\n🎨 Validating palette configuration...");
const palettesPath = path.join(root, "src/palettes.json");
if (!fs.existsSync(palettesPath)) {
  console.error("  ✗ src/palettes.json is missing");
  hasErrors = true;
} else {
  const paletteData = parseJsonFile(palettesPath, "Palette configuration");
  if (!paletteData || !isPlainObject(paletteData)) {
    console.error("  ✗ src/palettes.json must export an object with a palettes array");
    hasErrors = true;
  } else if (!Array.isArray(paletteData.palettes)) {
    console.error("  ✗ src/palettes.json must define a 'palettes' array");
    hasErrors = true;
  } else if (paletteData.palettes.length === 0) {
    console.error("  ✗ src/palettes.json must include at least one palette definition");
    hasErrors = true;
  } else {
    const paletteIds = new Map();

    for (const palette of paletteData.palettes) {
      let paletteIsValid = true;

      if (!palette || !isPlainObject(palette)) {
        console.error("  ✗ Palette entries must be objects");
        hasErrors = true;
        paletteIsValid = false;
        continue;
      }

      if (typeof palette.id !== "string" || palette.id.trim() === "") {
        console.error("  ✗ Palette entry is missing a non-empty 'id'");
        paletteIsValid = false;
        hasErrors = true;
      } else if (paletteIds.has(palette.id.trim())) {
        console.error(
          `  ✗ Duplicate palette id '${palette.id.trim()}' detected (also defined earlier)`
        );
        paletteIsValid = false;
        hasErrors = true;
      } else {
        paletteIds.set(palette.id.trim(), true);
      }

      if (typeof palette.name !== "string" || palette.name.trim() === "") {
        console.error(`  ✗ Palette '${palette.id ?? "<unknown>"}' is missing a display name`);
        paletteIsValid = false;
        hasErrors = true;
      }

      if (typeof palette.description !== "string" || palette.description.trim() === "") {
        console.error(`  ✗ Palette '${palette.id ?? "<unknown>"}' is missing a description`);
        paletteIsValid = false;
        hasErrors = true;
      }

      if (!isPlainObject(palette.colors)) {
        console.error(`  ✗ Palette '${palette.id ?? "<unknown>"}' must include a colors object`);
        paletteIsValid = false;
        hasErrors = true;
      } else {
        const colorEntries = Object.entries(palette.colors);
        if (palette.id !== "default" && colorEntries.length === 0) {
          console.error(`  ✗ Palette '${palette.id}' must define at least one CSS variable override`);
          paletteIsValid = false;
          hasErrors = true;
        }

        for (const [colorKey, colorValue] of colorEntries) {
          if (typeof colorValue !== "string" || colorValue.trim() === "") {
            console.error(
              `  ✗ Palette '${palette.id}' value for '${colorKey}' must be a non-empty string`
            );
            paletteIsValid = false;
            hasErrors = true;
          } else if (!colorValuePattern.test(colorValue.trim())) {
            console.warn(
              `  ⚠️ Palette '${palette.id}' value '${colorValue}' for '${colorKey}' uses an unrecognised format`
            );
            hasWarnings = true;
          }

          if (!colorKey.startsWith("--color-")) {
            console.warn(
              `  ⚠️ Palette '${palette.id}' key '${colorKey}' should start with "--color-"`
            );
            hasWarnings = true;
          }
        }
      }

      if (paletteIsValid) {
        console.log(`  ✓ Palette '${palette.id}' passed validation`);
      }
    }
  }
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

