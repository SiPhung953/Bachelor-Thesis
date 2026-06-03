# Academic Nexus Design System

This document defines the frontend visual style and implementation guidelines for **AcademiaConnect**, a university recruitment platform designed to bridge campus talent (students, researchers, and graduates) with career opportunities.

---

## 1. Visual Language & Aesthetics

Academic Nexus combines contemporary web aesthetics with professional authority, creating a workspace that is both trustworthy and highly productive.

*   **Clean Light Theme:** The interface defaults to a clean, light-colored background with generous whitespace to ensure maximum readability and scannability.
*   **Trustworthy & Professional:** High-contrast layouts, structured components, and subtle borders replace overly complex animations or distracting decorations.
*   **Modern Academic Vibe:** The design feels academic yet modern, avoiding old-fashioned collegiate motifs in favor of sleek UI patterns and a clean technical layout.
*   **Recruitment/Productivity Focus:** The page structure prioritizes immediate utility (e.g., search bars, filtered job grids, and clear call-to-actions).

---

## 2. Color Palette

The system uses a curated, cohesive color palette designed to drive user action while maintaining a clean, professional workspace.

| Color Role | Color Hex | Tailwind Classes | Description |
| :--- | :--- | :--- | :--- |
| **Primary Accent** | `#0052ff` | `bg-brand`, `text-brand` | Used for primary action buttons, key brand marks, active status highlights, and interactive hover states. |
| **Background** | `#ffffff` | `bg-background` | Pure white background for high contrast. |
| **Secondary Background** | `#f8f9fa` | `bg-secondary/35` | Used for footers, section backgrounds, and card containers. |
| **Card Background** | `#ffffff` | `bg-card` | White cards with subtle borders. |
| **Foreground Text** | `#1a1a1a` | `text-foreground` | High-readability near-black text for primary content. |
| **Muted Foreground** | `#6c757d` | `text-muted-foreground` | Used for supporting copy, metadata, and placeholder text. |
| **Border Accent** | `rgba(0, 0, 0, 0.1)` | `border-foreground/10` | Sleek border accents to frame structural content. |

---

## 3. Typography

Academic Nexus utilizes a modern, approachable geometric sans-serif typeface to convey both contemporary clean design and professional authority.

*   **Primary Typeface:** **Hanken Grotesk**
    *   Loaded from Google Fonts with weights: `300` (Light), `400` (Regular), `500` (Medium), `600` (Semi-Bold), `700` (Bold), `800` (Extra-Bold), `900` (Black).
*   **Fallback Typeface:** System sans-serif (`system-ui`, `-apple-system`, `sans-serif`).
*   **Tailwind Font Class:** `font-sans` (mapped in `index.css` to `'Hanken Grotesk'`).

---

## 4. Component Styles

Academic Nexus components are designed to be fully compatible with the `shadcn/ui` style guidelines, utilizing Tailwind utility classes and Radix primitives.

*   **Clear Form Inputs:** Input fields must have distinct states, clear icon indicators, and highly readable placeholder labels (e.g., `h-11 px-4 border border-foreground/10 bg-transparent text-xs`).
*   **Strong Primary Buttons:** Call-to-actions are highly visible. Primary buttons feature the solid brand accent color (`bg-brand hover:bg-brand/90 text-white`) with high-contrast text and a firm uppercase weight.
*   **Subtle Borders:** UI sections and interactive items are separated by thin, clean borders (`border-foreground/10`) to provide high visual grid alignment without clutter.
*   **Good Spacing:** Elements utilize generous padding (`py-16 md:py-20`, `gap-6`, `space-y-4`) to make listings easy to scan.
*   **Responsive Layout:** Structuring follows a standard 12-column flexbox and grid system that transitions smoothly from mobile devices to desktop viewports.

---

## 5. Developer Implementation Rules

To ensure visual consistency and code maintainability, developers must strictly adhere to the following rules when building features:

1.  **Tech Stack:**
    *   Framework: React + Vite + TypeScript.
    *   Styling: Tailwind CSS.
    *   Primitives: Radix-based `shadcn/ui` components (e.g., Button, Card, Badge, Input, Label, Separator).
2.  **No Extraneous Packages:** Avoid introducing another UI library. Build custom feature components under `apps/web/src/features/` using standard Tailwind utilities.
3.  **Simplicity & Purpose:** Keep pages simple, clean, and thesis-MVP friendly. Focus on layout, scannability, and basic user flows.
4.  **Avoid Over-Engineered Animations:** Use subtle transitions (`transition-all duration-300`) for hovers. Do not introduce complex scroll animations or high-resource rendering loops.
5.  **Strict Light Theme Focus:** Do not implement dark mode variations unless explicitly requested. Ensure all designs look pristine under the light theme.
