// Token extraction, normalization, and DESIGN.md / SKILL.md generation from multiple crawled HTML & CSS pages

export interface ExtractedPageData {
  url: string;
  title: string;
  html: string;
  cssTexts?: string[];
}

export function extractTokensFromPages(pages: ExtractedPageData[], targetUrl: string) {
  const colorSet = new Map<string, number>();
  const fontSet = new Map<string, number>();
  const fontSizeSet = new Map<string, number>();
  const radiusSet = new Map<string, number>();
  const spacingSet = new Map<string, number>();
  const shadowSet = new Map<string, number>();
  const headings: string[] = [];
  const ctas: string[] = [];
  const navTexts: string[] = [];
  let buttonCount = 0;
  let formCount = 0;
  let inputCount = 0;
  let tableCount = 0;
  let codeCount = 0;
  let cardCount = 0;

  const colorHexRegex = /#(?:[0-9a-fA-F]{3,4}){1,2}\b/g;
  const rgbRegex = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)/gi;
  const fontFamRegex = /font-family\s*:\s*([^;}]+)/gi;
  const fontSizeRegex = /font-size\s*:\s*([^;}]+)/gi;
  const radiusRegex = /border-radius\s*:\s*([^;}]+)/gi;
  const paddingRegex = /padding(?:-(?:top|bottom|left|right))?\s*:\s*([^;}]+)/gi;
  const marginRegex = /margin(?:-(?:top|bottom|left|right))?\s*:\s*([^;}]+)/gi;
  const shadowRegex = /box-shadow\s*:\s*([^;}]+)/gi;

  for (const page of pages) {
    const combinedText = page.html + "\n" + (page.cssTexts || []).join("\n");

    // Colors
    let m;
    while ((m = colorHexRegex.exec(combinedText)) !== null) {
      const hex = m[0].toLowerCase();
      colorSet.set(hex, (colorSet.get(hex) || 0) + 1);
    }
    while ((m = rgbRegex.exec(combinedText)) !== null) {
      const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]);
      const hex = "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
      colorSet.set(hex, (colorSet.get(hex) || 0) + 1);
    }

    // Font families
    while ((m = fontFamRegex.exec(combinedText)) !== null) {
      const cleanFont = m[1].replace(/['"!]/g, "").trim();
      if (cleanFont && cleanFont.length < 50 && !cleanFont.includes("var(")) {
        fontSet.set(cleanFont, (fontSet.get(cleanFont) || 0) + 1);
      }
    }

    // Font sizes
    while ((m = fontSizeRegex.exec(combinedText)) !== null) {
      const size = m[1].trim();
      if (size && (size.endsWith("px") || size.endsWith("rem") || size.endsWith("em"))) {
        fontSizeSet.set(size, (fontSizeSet.get(size) || 0) + 1);
      }
    }

    // Border radius
    while ((m = radiusRegex.exec(combinedText)) !== null) {
      const rad = m[1].trim();
      if (rad && rad !== "0px" && rad !== "0") {
        radiusSet.set(rad, (radiusSet.get(rad) || 0) + 1);
      }
    }

    // Padding / Margins (spacing)
    while ((m = paddingRegex.exec(combinedText)) !== null) {
      const sp = m[1].trim().split(" ")[0];
      if (sp && sp.endsWith("px")) spacingSet.set(sp, (spacingSet.get(sp) || 0) + 1);
    }
    while ((m = marginRegex.exec(combinedText)) !== null) {
      const sp = m[1].trim().split(" ")[0];
      if (sp && sp.endsWith("px")) spacingSet.set(sp, (spacingSet.get(sp) || 0) + 1);
    }

    // Shadows
    while ((m = shadowRegex.exec(combinedText)) !== null) {
      const sh = m[1].trim();
      if (sh && sh !== "none") shadowSet.set(sh, (shadowSet.get(sh) || 0) + 1);
    }

    // HTML semantic extraction
    const hMatches = page.html.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi) || [];
    for (const h of hMatches) {
      const text = h.replace(/<[^>]+>/g, "").trim();
      if (text && text.length < 90 && !headings.includes(text)) headings.push(text);
    }

    const btnMatches = page.html.match(/<(?:button|a)[^>]*class=["'][^"']*(?:btn|button|cta)[^"']*["'][^>]*>(.*?)<\/(?:button|a)>/gi) || [];
    for (const btn of btnMatches) {
      buttonCount++;
      const text = btn.replace(/<[^>]+>/g, "").trim();
      if (text && text.length < 40 && !ctas.includes(text)) ctas.push(text);
    }

    buttonCount += (page.html.match(/<button/gi) || []).length;
    formCount += (page.html.match(/<form/gi) || []).length;
    inputCount += (page.html.match(/<input/gi) || []).length;
    tableCount += (page.html.match(/<table/gi) || []).length;
    codeCount += (page.html.match(/<(?:pre|code)/gi) || []).length;
    cardCount += (page.html.match(/class=["'][^"']*card[^"']*["']/gi) || []).length;
  }

  // Top ranked items
  const sortedColors = Array.from(colorSet.entries())
    .filter(([hex]) => hex !== "#000000" && hex !== "#ffffff")
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([hex]) => hex);

  const primaryColor = sortedColors[0] || "#da291c";
  const secondaryColor = sortedColors[1] || "#303030";
  const accentColor = sortedColors[2] || "#f6e500";

  const sortedFonts = Array.from(fontSet.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([font]) => font);
  const primaryFont = sortedFonts[0] || "Inter, system-ui, sans-serif";

  const sortedFontSizes = Array.from(fontSizeSet.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([sz]) => sz);

  const sortedRadius = Array.from(radiusSet.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([r]) => r);
  const dominantRadius = sortedRadius[0] || "0px";

  const sortedSpacing = Array.from(spacingSet.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([sp]) => sp);

  const domain = new URL(targetUrl).hostname.replace(/^www\./, "");
  const systemName = domain.toUpperCase() + " DESIGN SYSTEM";

  // Generate combined DESIGN.md
  const designMd = `# ${systemName}
Extracted by Web CRAWLer // DESIGN.md Extractor Engine
Target: ${targetUrl}
Pages Crawled & Analyzed: ${pages.length}
Generated: ${new Date().toISOString()}

## Mission
Provide an authoritative, implementation-ready design system specification extracted from all active pages of ${domain}. Optimized for frontend code generation with Claude Code, OpenAI Codex, and Cursor IDE.

## Brand & Context
- Target URL: ${targetUrl}
- Primary Domain: ${domain}
- Component Density: buttons (${buttonCount}), forms (${formCount}), inputs (${inputCount}), cards (${cardCount}), codeblocks (${codeCount})
- Core Page Titles Sample:
${pages.slice(0, 6).map(p => `  - ${p.title || p.url}`).join("\n")}

## Color Palette
- Primary Brand Accent: \`${primaryColor}\`
- Secondary / Surface: \`${secondaryColor}\`
- High-Voltage Accent: \`${accentColor}\`
- Extracted Palette:
${sortedColors.map(c => `  - \`${c}\``).join("\n")}

## Typography Foundations
- Primary Font Stack: \`${primaryFont}\`
- Detected Hierarchy Scales:
${sortedFontSizes.length ? sortedFontSizes.map(s => `  - \`${s}\``).join("\n") : "  - `14px`, `16px`, `24px`, `36px`, `56px`"}
- Dominant CTA Text Style: Uppercase tracking with prominent action wording.

## Shape & Border Radius
- Dominant Border Radius: \`${dominantRadius}\`
${sortedRadius.map(r => `  - Token: \`${r}\``).join("\n")}

## Spacing & Grid System
${sortedSpacing.length ? sortedSpacing.map(s => `  - Grid Token: \`${s}\``).join("\n") : "  - `4px`, `8px`, `16px`, `24px`, `32px`, `48px`"}

## Sample CTAs & Action Tokens
${ctas.slice(0, 8).map(c => `- "${c}"`).join("\n")}

## Implementation Rules
1. Always utilize the extracted token palette (\`${primaryColor}\`) for primary actions.
2. Honor the dominant border radius (\`${dominantRadius}\`) across newly generated components.
3. Keep layout structure consistent with the extracted 8px/16px spacing scale.
4. Ensure interactive states (default, hover, active, focus, disabled) maintain WCAG 2.2 AA contrast.
`;

  // Generate SKILL.md
  const skillMd = `---
name: design-system-${domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}
description: Applies the extracted ${domain} design guidelines, color tokens, and components when writing frontend code.
---

<!-- TYPEUI_SH_MANAGED_START -->

# ${systemName} Guidelines

Apply this design system when authoring HTML, React, or Tailwind components for ${domain}:

- Primary Color: \`${primaryColor}\`
- Secondary Color: \`${secondaryColor}\`
- Font Family: \`${primaryFont}\`
- Border Radius: \`${dominantRadius}\`

## Quality Gates
- Every button must use primary brand accent \`${primaryColor}\`.
- Radius must strictly match \`${dominantRadius}\`.
- Ensure keyboard focus indicators are clearly visible.

<!-- TYPEUI_SH_MANAGED_END -->
`;

  return {
    designMd,
    skillMd,
    tokens: {
      primaryColor,
      secondaryColor,
      dominantRadius,
      primaryFont,
      colors: sortedColors,
      pagesAnalyzed: pages.length,
    }
  };
}
