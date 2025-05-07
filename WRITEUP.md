# CosmosCamera – Technical Overview

## 1. Project Goal

CosmosCamera is a single-page, server-rendered web application that lets users browse NASA's **Astronomy Picture of the Day (APOD)** collection through an infinite-scrolling gallery and deep-link detail views. The goal was to showcase the buildout of a simple two-page web app with strong performance fundamentals and accessibility focused design

---

## 2. Architectural Notes

1. **Server Components** fetch the **first page** of photos on the server (`app/gallery/page.tsx`) for instant‐load TTI.<br>Subsequent pages stream in on the client via `useInfiniteApodList`.
2. Images use the **Next <Image/>** component with `remotePatterns` whitelisted in `next.config.ts`, unlocking automatic image optimization layer for WebP/AVIF conversion and CDN optimisation.
3. Components are split into small, memoised units (`ApodCard`, `ImageWithShimmer`, `ShimmerCard`) to minimise re-renders.

---

## 3. Performance Deep Dive

- **Lighthouse 100/100/100/100** was achieved in both mobile & desktop profiles.

Key perf techniques:

1. **Server-side data prefetch**: The first gallery page is fetched on the server, so HTML arrives hot-wired with content and zero client waterfalls.
2. **React Server Components**: Utilizing React's Server Components keeps the heavy work off the client bundle.
3. **Intersection Observer** loads the next page only when the sentinel is ~200 px from the viewport, balancing perceived smoothness with network use.
4. **React Query cache** is configured with `staleTime: Infinity` and a 15-minute GC window, eliminating refetches during a browsing session.
5. **Next <Image/> optimisation** automatically compresses, lazy-loads, and serves AVIF/WebP when supported.
6. **Shimmer placeholders** keep CLS at 0 by reserving exact aspect ratios.

Potential further wins:
• Virtualise long photo lists to keep the DOM footprint small.<br>• Add a Service Worker for full offline browsing.

---

## 4. Accessibility Highlights

The automated a11y score is also **100**. Manual checks show:

1. **Alt text everywhere** – image & icon meaning is conveyed.
2. **ARIA roles & labels** – grid/list semantics (`role="grid"`), live regions announce loading states.
3. **Keyboard support** – cards are real `<a>` links, focus rings use `:focus-visible` utility classes, theme toggle is a native `<button>`.
4. **Prefers-color-scheme** – dark/light themes respect OS settings, maintaining WCAG AA contrast.
5. **Reduced Motion** – no non-essential motion animations are used; shimmer uses opacity only.

Future a11y tasks: add skip-to-content link, test with screen readers, ensure captions for all embedded videos.

---

## 5. What I'd Do Differently in Production

1. **Robust API layer** – Add retry/back-off, typed clients (zod-validated), and server-side caching (Redis) to protect NASA's rate limits.
2. **CI & E2E** – GitHub Actions running ESLint, type-check, Lighthouse CI, and Playwright flows.
3. **Pre-Commit Hooks** - Utilize `husky` for pre-commit hooks to maintain high quality standard.
4. **Monitoring** – Sentry for errors.
5. **Feature flags & experimentation** – LaunchDarkly for feature flags.
6. **Testing, Testing, Testing** - The timeline of the project demanded that I prioritize certain aspects over others. In production, I would have more thoroughly tested the application including adding integration and E2E tests.

### Nice-to-Have Future Features

• Favourites / local collections (persisted in IndexedDB).<br>• Text search & filters (date range, media type).<br>• Progressive Web App with offline support and home-screen install prompt.<br>• Internationalisation (NASA APOD supports many languages).
