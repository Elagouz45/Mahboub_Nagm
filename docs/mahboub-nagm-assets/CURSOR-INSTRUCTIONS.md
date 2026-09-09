# Cursor Integration Instructions

Use this asset pack when implementing the Angular frontend for **محبوب نجم للأجهزة الكهربائية**.

## Required workflow

1. Inspect the existing Angular project and locate its configured public assets directory.
2. Copy the folders `banners`, `categories`, `products`, `lifestyle`, and `services` into a dedicated path such as:

   `src/assets/images/mahboub-nagm/`

3. Preserve all kebab-case filenames.
4. Do not place images directly in the app root.
5. Do not use `preview-contact-sheet.jpg` in the website; it is only for visual review.
6. Read `assets-manifest.json` before mapping images to sections.
7. Keep image paths in typed view models, configuration, or API mapping layers—not scattered as duplicated strings across templates.
8. Add meaningful Arabic alt text based on the image's documented usage.
9. Use lazy loading for images below the fold.
10. Do not lazy-load the primary LCP hero image.
11. Set explicit dimensions or aspect ratios to prevent layout shift.
12. Use `object-fit: cover` for banners and lifestyle scenes.
13. Use `object-fit: contain` for product and category cards.
14. Preserve the clean off-white image backgrounds; do not remove them with CSS filters.
15. Do not stretch, distort, recolor, or add fake brand logos to these images.
16. Keep the implementation fully responsive and RTL.
17. If Angular image optimization is already configured, use it according to the installed Angular version.
18. Reuse a typed image model and reusable image/card components where appropriate.
19. Follow the project's Feature-Based Folder Structure, Kebab-Case Naming Convention, Shared Components Isolation, Core rules, Lazy Loading, Single Responsibility Principle, Memory Leak Prevention, and Modern Signals Architecture.
20. Run build, lint, and focused tests after integration.

## Suggested homepage mapping

- Main hero: `banners/hero-appliance-collection.webp`
- Laundry campaign: `banners/hero-laundry-care.webp`
- TV campaign: `banners/hero-home-entertainment.webp`
- Air-conditioner campaign: `banners/hero-summer-cooling.webp`
- Small-appliance campaign: `banners/hero-kitchen-appliances.webp`
- Full-home bundle: `banners/home-bundle-showcase.webp`
- Category grid: use the ten files inside `categories/`
- Product sections: use files inside `products/`
- Editorial/home sections: use files inside `lifestyle/`
- Trust and service sections: use files inside `services/`

Use these images as high-quality project assets and connect them to real product/category API data later without tightly coupling UI components to local filenames.

