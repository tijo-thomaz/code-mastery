# 🎨 Three.js + GSAP — Learning Roadmap

> **Goal:** Become interview-ready for roles requiring 3D/animation skills.
> **Timeline:** 3 weeks (30 min/day alongside existing drills)
> **Rule:** Build, don't read. Every concept → a mini project.

---

## Your Advantage

You already know: **React, TypeScript, JavaScript deep, performance optimization.**
Three.js and GSAP are just libraries. The hard part (JS, browser APIs, rendering concepts) — you already have.

---

## Week 1: GSAP Fundamentals (Animation First — Easier Win)

| Day | Drill | Time | Build |
|-----|-------|------|-------|
| 1 | GSAP basics: `gsap.to()`, `gsap.from()`, `gsap.fromTo()` | 30 min | Animate a box: fade, slide, scale |
| 2 | Timelines: `gsap.timeline()`, sequencing, staggering | 30 min | Staggered card reveal animation |
| 3 | ScrollTrigger: scroll-based animations | 30 min | Section fade-in on scroll (portfolio style) |
| 4 | Easing + advanced: `ease`, `repeat`, `yoyo`, `delay` | 30 min | Bouncing loader animation |
| 5 | GSAP + React: `useRef` + `useGSAP` hook, cleanup | 30 min | Animated React component with cleanup |
| 6 | Text animations: SplitText, character-by-character | 30 min | Hero text reveal animation |
| 7 | Review: Rebuild Day 3 + Day 6 from memory | 30 min | Portfolio hero section with scroll + text |

**Week 1 Output:** Animated portfolio landing page section (hero + scroll reveals)

---

## Week 2: Three.js Fundamentals (3D)

| Day | Drill | Time | Build |
|-----|-------|------|-------|
| 1 | Three.js basics: Scene, Camera, Renderer, Mesh | 30 min | Spinning cube |
| 2 | Geometry + Materials: BoxGeometry, MeshStandardMaterial, lighting | 30 min | Lit 3D object with shadows |
| 3 | OrbitControls + responsive canvas | 30 min | Interactive 3D scene, resize-aware |
| 4 | Textures + loading: TextureLoader, loading manager | 30 min | Textured 3D earth/globe |
| 5 | Animation loop: `requestAnimationFrame`, Clock, delta time | 30 min | Smooth rotating scene with multiple objects |
| 6 | React Three Fiber: `<Canvas>`, `useFrame`, `useThree` | 30 min | Rebuild Day 5 scene in React |
| 7 | Review: Scene + controls + lighting from memory | 30 min | Interactive 3D product viewer |

**Week 2 Output:** Interactive 3D product viewer in React

---

## Week 3: Combine + Portfolio Pieces

| Day | Drill | Time | Build |
|-----|-------|------|-------|
| 1 | GSAP + Three.js: scroll-driven 3D scene transitions | 30 min | 3D scene that reacts to scroll |
| 2 | Particle systems: BufferGeometry + Points | 30 min | Particle background effect |
| 3 | GLTF model loading: useGLTF, Draco compression | 30 min | Load and display a 3D model |
| 4 | Shaders intro: vertex + fragment basics, uniforms | 30 min | Gradient shader on a plane |
| 5 | Performance: instancing, LOD, dispose(), memory management | 30 min | Optimized scene with 1000+ objects |
| 6 | Full project build | 60 min | Portfolio piece: 3D interactive landing page |
| 7 | Polish + deploy | 60 min | Deploy on Vercel, record demo |

**Week 3 Output:** Deployable 3D interactive landing page for portfolio

---

## Key Libraries to Install

```bash
# GSAP
npm install gsap @gsap/react

# Three.js (vanilla)
npm install three @types/three

# React Three Fiber (Three.js + React)
npm install @react-three/fiber @react-three/drei
```

---

## Interview-Ready Explanations

### "What is GSAP?"
> "GreenSock Animation Platform — a JavaScript animation library that's faster and more flexible than CSS animations. It can animate any numeric property on any object, supports complex timelines with sequencing and staggering, and has ScrollTrigger for scroll-based animations. It's the industry standard for production web animation."

### "What is Three.js?"
> "A JavaScript library that abstracts WebGL — the browser's 3D rendering API. You work with Scenes, Cameras, Meshes (geometry + material), and lights. requestAnimationFrame drives the render loop. React Three Fiber is the React renderer for Three.js — lets you write 3D scenes declaratively with JSX."

### "GSAP vs CSS animations?"
> "CSS animations work for simple transitions — hover effects, fades. GSAP handles complex choreography — timelines, scroll-driven sequences, physics-based easing, staggered reveals. GSAP is also more performant for complex sequences because it batches DOM updates and uses requestAnimationFrame under the hood."

### "React Three Fiber vs vanilla Three.js?"
> "R3F is a React renderer for Three.js — you write `<mesh>`, `<boxGeometry>` as JSX components. It handles scene graph management, cleanup on unmount, and integrates with React state. Use R3F in React apps, vanilla Three.js for non-React projects."

### "How do you handle Three.js performance?"
> "Instanced meshes for repeated objects. Dispose textures and geometries on unmount — Three.js doesn't garbage collect GPU resources. LOD (Level of Detail) for distant objects. Draco compression for GLTF models. Monitor with `stats.js` and Chrome DevTools Performance tab."

---

## Resources (Bookmark, Don't Binge)

| Resource | What | When |
|----------|------|------|
| [GSAP Docs](https://gsap.com/docs/v3/) | Official API reference | During drills |
| [GSAP + React guide](https://gsap.com/resources/React/) | Official React integration | Week 1 Day 5 |
| [Three.js Journey](https://threejs-journey.com/) | Best Three.js course (Bruno Simon) | If you want to go deep |
| [React Three Fiber docs](https://r3f.docs.pmnd.rs/) | R3F API reference | Week 2 Day 6+ |
| [drei](https://github.com/pmndrs/drei) | Helper components for R3F | Week 2+ |
| [Awwwards](https://www.awwwards.com/) | Inspiration for 3D web | Portfolio ideas |

---

## The Rule

> **Don't start this until after Tech Versant (Friday Mar 13).**
> Your core stack (React + TS + Go) is your bread and butter.
> Three.js + GSAP is a skill multiplier — it makes you rare, not replaceable.
> A React dev who can do 3D + animation is a unicorn. That's the goal.
