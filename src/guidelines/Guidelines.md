# Studio‑Grade UI/UX Guidelines (v5)

---

## 1. Purpose & Vision 🎯
Deliver **studio‑quality user experience** (≥95 % parity with top-tier design agencies) by aligning research, logic, and visual systems into a unified, testable, and scalable design framework.

---

## 2. UX Research & Strategy 📊

### 2.1 Research Framework
- Conduct **continuous discovery**: interviews, contextual inquiries, diary studies.
- Mix **qualitative and quantitative** validation (analytics, A/B testing, funnel metrics).
- Define **UX success metrics**: task success ≥ 95 %, error rate ≤ 3 %, SUS ≥ 85.
- Maintain **research documentation** synced with design tokens and usability tests.

### 2.2 Heuristic Validation
- Apply **Nielsen’s 10 heuristics** during design reviews.
- Include **accessibility heuristics** (WCAG 2.2 AA) as baseline.
- Maintain a **UX Scorecard** (0–5) for usability, visual clarity, interaction logic.

---

## 3. Visual & Layout System 🎨

### 3.1 Grid & Layout Rules
- **8 pt base grid** for spacing and component padding.
- **Container widths:** 1440 px (desktop max), 1200 px (content), 768 px (tablet), 375 px (mobile).
- **Auto-layout** enabled for all Figma components.
- Maintain **consistent alignment**: left‑aligned content, centered modals, edge‑aligned navigation.

### 3.2 Typography Scale
| Role | Font | Weight | Size | Line Height | Usage |
|------|------|---------|------|--------------|--------|
| Display | Inter | 700 | 48 px | 1.1 | Hero titles |
| H1 | Inter | 600 | 32 px | 1.3 | Section headers |
| H2 | Inter | 500 | 24 px | 1.4 | Subsections |
| Body | Inter | 400 | 16 px | 1.5 | Default text |
| Caption | Inter | 400 | 12 px | 1.4 | Labels / hints |

### 3.3 Color & Semantics
- **Primary:** `#0066FF` → actions, CTAs.
- **Secondary:** `#4A4A4A` → supporting text.
- **Success:** `#16A34A` → positive feedback.
- **Warning:** `#F59E0B` → caution.
- **Error:** `#DC2626` → critical alerts.
- **Background:** `#FFFFFF` (light), `#0F172A` (dark).
- Use **semantic tokens** (e.g., `color.bg.primary`, `color.text.muted`).

### 3.4 Motion & Interaction
- Default duration: 150–250 ms.
- Easing curves:
  - **Ease‑in‑out:** `cubic‑bezier(0.4, 0, 0.2, 1)`
  - **Entrance:** `ease‑out`
  - **Exit:** `ease‑in`
- Use motion **only when it supports cognition or feedback**.
- Avoid non‑functional or continuous motion.

---

## 4. Interaction Logic & State Architecture ⚙️

### 4.1 Logic Principles
- All interactive components include **default, hover, active, focused, disabled, and error** states.
- Define clear **if/then logic chains** for component states:
  ```
  IF user.click(button.primary)
    THEN trigger(state.loading)
  WHEN data.success
    THEN transition(state.success) + close(modal)
  ELSE show(state.error)
  ```

### 4.2 Component Behavior Rules
| Component | Trigger | State Logic |
|------------|----------|--------------|
| Button | onClick | Hover → Active → Loading → Success/Error |
| Input Field | onFocus/onBlur | Validate → Error/Success → Reset |
| Modal | onOpen/onClose | Trap focus, animate in/out, return focus |
| Dropdown | onSelect | Update value → Collapse → Emit event |

### 4.3 Micro‑Interactions
- Use **subtle feedback (< 200 ms)** for state changes.
- Apply **haptic/vibration feedback** (mobile) only for critical actions.
- Avoid visual noise: ≤ 2 motion events per viewport.

---

## 5. Accessibility & Inclusive Design ♿
- All controls must be **keyboard navigable** (Tab, Enter, Space).
- Provide **ARIA roles** and **live regions** for dynamic content.
- Maintain **color contrast ≥ 4.5:1** for text, **≥ 3:1** for large text.
- Focus indicators must be **visible and consistent** across themes.
- Include **screen‑reader testing** in QA.

---

## 6. Ethical & Sustainable Design 🌱
- **No dark patterns.** Maintain user autonomy and transparency.
- Optimize **asset weights < 1 MB/page**.
- Prefer **vector icons (SVG)** and **compressed imagery (WebP)**.
- Support **dark mode** and **reduced motion settings**.
- Include **data privacy disclosure** for AI or personalization features.

---

## 7. Cross‑Platform Responsiveness 📱💻
- **Breakpoints:** 320, 480, 768, 1024, 1440 px.
- **Touch targets:** ≥ 44×44 px.
- Avoid **hover‑only behaviors**; include focus/press equivalents.
- Ensure **gesture parity** across platforms (e.g., swipe → click equivalence).
- Test across **low‑bandwidth and low‑power** devices.

---

## 8. Documentation & Handoff 📘
- Maintain **Figma component library** with usage annotations.
- Use **design tokens** synced with code variables.
- Provide **prototype notes** for motion and state changes.
- Implement **handoff checklist** (naming, constraints, tokens, variants).
- Host **documentation site (Storybook or Zeroheight)** with version tracking.

---

## 9. Testing & Validation 🧪
- **Usability testing:** ≥ 5 participants per iteration.
- **Accessibility testing:** NVDA/VoiceOver, keyboard navigation.
- **Performance audits:** Lighthouse score ≥ 90.
- **Design QA:** pixel parity ≥ 98 % with dev implementation.
- **Automated visual regression** for key components.

---

## 10. Summary ✅

**Design Principles:**
1. **Empathy First** — clarity, accessibility, trust.
2. **Systemic Logic** — predictable, testable, and reusable.
3. **Visual Precision** — consistent grids, rhythm, and hierarchy.
4. **Sustainability & Ethics** — minimal waste, maximal intent.
5. **Future‑Forward Design** — AI‑assisted yet human‑centered.

**Quality Target:** ≥ 95 % parity with veteran UI/UX studio quality across logic, layout, and interaction systems.

---
