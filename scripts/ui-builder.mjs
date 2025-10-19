import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load UI components config
const uiConfig = JSON.parse(
  readFileSync(join(__dirname, '../src/config/ui-components.json'), 'utf-8')
);

/**
 * Generate Theme Mode buttons
 */
export function buildThemeModeButtons() {
  const { modes } = uiConfig.themeMode;
  
  return modes.map(mode => `
    <button onclick="__setThemeMode('${mode.id}')" class="btn btn-sm flex-1" id="mode-${mode.id}">
      <span class="text-lg">${mode.icon}</span>
      <span class="text-xs capitalize">${mode.label}</span>
    </button>
  `).join('\n');
}

/**
 * Generate Backgrounds list
 */
export function buildBackgroundsList() {
  const { items } = uiConfig.navbar.backgrounds;
  
  const grouped = {
    static: items.filter(i => !i.animated),
    animated: items.filter(i => i.animated)
  };
  
  let html = '';
  
  // Static backgrounds
  grouped.static.forEach(bg => {
    html += `
      <li>
        <button onclick="__setBackground('${bg.id}')" class="flex w-full items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:shadow-sm bg-item" data-bg="${bg.id}">
          <span class="text-lg">${bg.icon}</span>
          <span class="flex-1 text-left text-sm">${bg.label}</span>
          <svg class="h-3.5 w-3.5 flex-shrink-0 opacity-0 bg-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </li>`;
  });
  
  // Animated backgrounds section
  if (grouped.animated.length > 0) {
    html += `
      <li class="pt-2">
        <div class="text-xs opacity-60 px-3 mb-1">Animated</div>
      </li>`;
    
    grouped.animated.forEach(bg => {
      html += `
      <li>
        <button onclick="__setBackground('${bg.id}')" class="flex w-full items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:shadow-sm bg-item" data-bg="${bg.id}">
          <span class="text-lg">${bg.icon}</span>
          <span class="flex-1 text-left text-sm">${bg.label}</span>
          <svg class="h-3.5 w-3.5 flex-shrink-0 opacity-0 bg-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </li>`;
    });
  }
  
  return html;
}

/**
 * Generate Theme Parameters section
 */
export function buildThemeParametersSection() {
  const { customSettings, rotation, depth, noise, glass } = uiConfig.navbar.themeParameters;
  
  return `
    <!-- Custom Settings Toggle -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 90" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 evo-logo" id="evo-logo-mini">
          <path d="m37.361 37.392 6.783 16.393 6.792-16.393M32.017 45.49h-7.908M33.161 37.392h-9.3v16.393h9.293M61.732 37.392c4.239 0 7.675 3.51 7.675 8.097 0 4.588-3.437 8.296-7.676 8.296-4.239 0-7.675-3.708-7.675-8.296 0-4.587 3.435-8.097 7.674-8.097h.002z"/>
        </svg>
        <div>
          <div class="text-sm font-medium">${customSettings.label}</div>
          <div class="text-xs opacity-60">${customSettings.description}</div>
        </div>
      </div>
      <input type="checkbox" class="toggle toggle-primary toggle-sm" id="${customSettings.id}" onchange="__toggleEvoCustom()" />
    </div>

    <!-- Theme Rotation Speed -->
    <div id="evo-speed-section" class="pt-3 border-t border-base-300">
      <div class="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-2">${rotation.label}</div>
      <div class="space-y-2">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-mono badge badge-ghost badge-sm" id="${rotation.displayId}">Off</span>
        </div>
        <input type="range" min="${rotation.min}" max="${rotation.max}" value="${rotation.default}" step="${rotation.step}" 
               class="range range-primary range-xs" id="${rotation.id}" oninput="__updateEvoSpeed(this.value)" />
        <div class="flex justify-between text-xs opacity-50 px-1">
          <span>Off</span>
          <span>2.5s</span>
          <span>5s</span>
          <span>7.5s</span>
          <span>10s</span>
        </div>
      </div>
    </div>

    <!-- 3D Depth -->
    <div class="flex items-center justify-between pt-3 border-t border-base-300">
      <div class="flex items-center gap-2">
        <span class="text-sm">${depth.label}</span>
        <span class="text-xs opacity-50">${depth.description}</span>
      </div>
      <input type="checkbox" class="toggle toggle-sm toggle-primary" id="${depth.id}" ${depth.default ? 'checked' : ''} onchange="__toggleDepth(this.checked)" />
    </div>
    
    <!-- Film Grain -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-sm">${noise.label}</span>
        <span class="text-xs opacity-50">${noise.description}</span>
      </div>
      <input type="checkbox" class="toggle toggle-sm toggle-primary" id="${noise.id}" ${noise.default ? 'checked' : ''} onchange="__toggleNoise(this.checked)" />
    </div>

    <!-- Glass Effect -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-sm">${glass.label}</span>
        <span class="text-xs opacity-50">${glass.description}</span>
      </div>
      <input type="checkbox" class="toggle toggle-sm toggle-primary" id="${glass.id}" ${glass.default ? 'checked' : ''} onchange="__toggleGlass(this.checked)" />
    </div>
  `;
}

/**
 * Generate Solid Color Layer section
 */
export function buildSolidColorSection() {
  const { hue, opacity } = uiConfig.navbar.solidColor;
  
  return `
    <!-- Hue Slider -->
    <div>
      <div class="text-xs opacity-60 mb-2 flex justify-between">
        <span>${hue.label}</span>
        <span id="${hue.displayId}" class="font-mono">${hue.default}°</span>
      </div>
      <input type="range" min="${hue.min}" max="${hue.max}" value="${hue.default}" step="${hue.step}" 
             class="rainbow-slider w-full h-8 rounded-lg cursor-pointer" 
             id="${hue.id}" 
             oninput="__applySolidColorRealtime()" />
    </div>
    
    <!-- Opacity Slider -->
    <div>
      <div class="text-xs opacity-60 mb-2 flex justify-between">
        <span>${opacity.label}</span>
        <span id="${opacity.displayId}" class="font-mono">${opacity.default}%</span>
      </div>
      <input type="range" min="${opacity.min}" max="${opacity.max}" value="${opacity.default}" step="${opacity.step}" 
             class="opacity-slider w-full h-8 rounded-lg cursor-pointer" 
             id="${opacity.id}" 
             oninput="__applySolidColorRealtime()" />
    </div>
    
    <!-- Save Button -->
    <button onclick="__saveSolidColorToStorage()" class="btn btn-sm btn-block btn-primary">
      💾 Save to Storage
    </button>
  `;
}

/**
 * Build complete navbar dropdown
 */
export function buildNavbarDropdown() {
  const config = uiConfig.navbar;
  
  return `
    <!-- 1. Theme Mode Selector: System / Light / Dark -->
    <div class="mb-4 pb-4 border-b border-base-300">
      <div class="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-3">Theme Mode</div>
      <div class="flex gap-2">
        ${buildThemeModeButtons()}
      </div>
    </div>

    <!-- 2. Themes Accordion (Open by default) -->
    <div class="collapse collapse-arrow border-b border-base-300 rounded-none">
      <input type="checkbox" id="${config.themeSelector.accordion.id}" ${config.themeSelector.accordion.defaultOpen ? 'checked' : ''} />
      <div class="collapse-title px-0 py-3 min-h-0">
        <div class="flex items-center gap-2">
          <span class="text-lg theme-icon" id="theme-icon-light">☀️</span>
          <span class="text-lg theme-icon hidden" id="theme-icon-dark">🌙</span>
          <span class="text-sm font-semibold">${config.themeSelector.accordion.title}</span>
        </div>
      </div>
      <div class="collapse-content px-0 pb-3">
        <ul class="max-h-60 overflow-y-auto space-y-1" id="themeMenu">
          <li><!-- Will be filled by build.mjs with theme options --></li>
        </ul>
      </div>
    </div>

    <!-- 3. Theme Parameters -->
    <div class="collapse collapse-arrow border-b border-base-300 rounded-none">
      <input type="checkbox" id="${config.themeParameters.accordion.id}" />
      <div class="collapse-title px-0 py-3 min-h-0">
        <div class="flex items-center gap-2">
          <span class="text-lg">⚙️</span>
          <span class="text-sm font-semibold">${config.themeParameters.accordion.title}</span>
        </div>
      </div>
      <div class="collapse-content px-0 pb-3">
        <div class="space-y-4">
          ${buildThemeParametersSection()}
        </div>
      </div>
    </div>

    <!-- 4. Background -->
    <div class="collapse collapse-arrow border-b border-base-300 rounded-none">
      <input type="checkbox" id="${config.backgrounds.accordion.id}" />
      <div class="collapse-title px-0 py-3 min-h-0">
        <div class="flex items-center gap-2">
          <span class="text-lg">🖼️</span>
          <span class="text-sm font-semibold">${config.backgrounds.accordion.title}</span>
        </div>
      </div>
      <div class="collapse-content px-0 pb-3">
        <ul class="space-y-1">
          ${buildBackgroundsList()}
        </ul>
      </div>
    </div>

    <!-- 5. Solid Color Layer -->
    <div class="collapse collapse-arrow rounded-none">
      <input type="checkbox" id="${config.solidColor.accordion.id}" />
      <div class="collapse-title px-0 py-3 min-h-0">
        <div class="flex items-center gap-2">
          <span class="text-lg">🎨</span>
          <span class="text-sm font-semibold">${config.solidColor.accordion.title}</span>
          <span id="${config.solidColor.hue.miniDisplayId}" class="text-xs font-mono badge badge-sm ml-auto">${config.solidColor.hue.default}°</span>
        </div>
      </div>
      <div class="collapse-content px-0 pb-3">
        <div class="space-y-3">
          ${buildSolidColorSection()}
        </div>
      </div>
    </div>
  `;
}

