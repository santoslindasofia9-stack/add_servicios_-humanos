---
name: Serene Marketplace
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#43474b'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#73787b'
  outline-variant: '#c3c7cb'
  surface-tint: '#50616b'
  primary: '#50616b'
  on-primary: '#ffffff'
  primary-container: '#e0f2fe'
  on-primary-container: '#5e6f79'
  inverse-primary: '#b7c9d5'
  secondary: '#6b5a60'
  on-secondary: '#ffffff'
  secondary-container: '#f4dce4'
  on-secondary-container: '#716066'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#efefef'
  on-tertiary-container: '#6b6c6d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e5f1'
  primary-fixed-dim: '#b7c9d5'
  on-primary-fixed: '#0c1e26'
  on-primary-fixed-variant: '#384953'
  secondary-fixed: '#f4dce4'
  secondary-fixed-dim: '#d7c1c8'
  on-secondary-fixed: '#25181e'
  on-secondary-fixed-variant: '#524249'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  h1:
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 32px
  section-gap: 80px
  card-padding: 24px
---

## Brand & Style
The design system is anchored in a philosophy of "Ethereal Trust." It moves away from the cold, transactional nature of traditional marketplaces and toward a serene, boutique-inspired environment. The brand personality is gentle, optimistic, and highly curated, designed to evoke a sense of safety and calm for the user.

The style is **Soft Minimalism**. It prioritizes vast amounts of whitespace (Snow White) to allow products and interactions to breathe. By combining high-radius curves with a pastel-dominant palette, the interface feels tactile yet lightweight—almost cloud-like. It avoids harsh lines and high-contrast aggression, favoring subtle tonal shifts and soft-focus depth to guide the user's journey.

## Colors
The palette is built on a foundation of **Snow White (#FFFFFF)**, ensuring the interface feels expansive and pristine. 

- **Pastel Sky Blue (#E0F2FE)** serves as the "Trust Anchor." It is used for navigation bars, verification badges, and secure zones to subconsciously signal stability and reliability.
- **Soft Pink (#FCE4EC)** is the "Interaction Spark." It is reserved for primary actions, buttons, and notifications, providing a warm, human-centric contrast to the cool blue tones.
- **Text & Accents**: For readability, a muted Slate (#475569) is used for body text, ensuring contrast remains accessible without breaking the soft aesthetic.

## Typography
**Plus Jakarta Sans** is the sole typeface for this design system. Its geometric yet friendly letterforms perfectly complement the extremely rounded UI elements. 

Typography should be implemented with generous line-heights to enhance the feeling of "airiness." Headlines utilize a slight negative letter-spacing to appear more cohesive, while labels and small metadata use increased tracking for better legibility against pastel backgrounds. All text should avoid pure black; instead, use deep muted blues or slates to maintain the soft visual harmony.

## Layout & Spacing
This design system utilizes a **Fixed Grid** model for desktop, centered on a 1280px container to create a "boutique" feel. The spacing rhythm is based on an 8px scale, but emphasizes "Large Spacing" (32px+ gutters) to prevent the interface from feeling cluttered.

Layouts should favor asymmetrical balance in carousels and galleries. Margin and padding values are intentionally high—particularly within cards and containers—to accommodate the 24px corner radii without text feeling cramped.

## Elevation & Depth
Depth is created through **Ambient Shadows** and tonal layering rather than traditional skeuomorphism. Shadows are extremely diffused (Blur: 40px+) and set at very low opacities (3-5%), often tinted with the secondary sky blue color to maintain palette harmony.

Layering follows a "Cloud Stack" logic:
1.  **Level 0 (Background):** Snow White.
2.  **Level 1 (Cards/Containers):** Snow White with a subtle diffuse shadow.
3.  **Level 2 (Navigation/Overlays):** Pastel Sky Blue or glassmorphic translucent white.
4.  **Level 3 (Pop-overs/Tooltips):** Floating elements with a slightly more pronounced shadow.

## Shapes
The shape language is defined by **Extremely Rounded Borders**. A standard radius of **24px (rounded-3xl)** is applied to all primary containers, cards, and input fields. 

Buttons and small chips often utilize a full pill-shape (9999px) to emphasize their interactive nature. This high-radius approach softens the overall visual impact of the marketplace, making the digital environment feel more organic and inviting.

## Components
- **Aesthetic Cards**: Cards feature 24px rounded corners, a Snow White background, and a 5% opacity blue-tinted shadow. Content inside should have at least 24px of internal padding.
- **Interaction Buttons**: Primary buttons are Soft Pink (#FCE4EC) with a pill-shape. Hover states should involve a gentle scale-up (1.02x) rather than a dramatic color change.
- **Pastel Carousels**: Carousel backgrounds alternate between very faint Sky Blue and Snow White. Navigational arrows are housed in circular white containers with soft shadows.
- **Celestial Chat Bubbles**: Bubbles for the buyer use Pastel Sky Blue, while the seller uses Snow White with a Soft Pink border. Bubbles feature a high 20px radius, except for the "tail" corner which is slightly sharper (8px).
- **Silver-Style Maps**: Maps use a customized "Silver" JSON style (low saturation, high brightness). Map pins are custom Soft Pink teardrops with a white center dot.
- **Input Fields**: Borders are 1px solid Sky Blue, but the field background is Snow White. On focus, the field gains a soft blue outer glow.