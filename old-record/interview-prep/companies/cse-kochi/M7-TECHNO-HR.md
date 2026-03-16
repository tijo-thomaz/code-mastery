# M7: Techno-HR Discussion + Fintech Domain

> **Round 3:** Technical + HR combined. They'll mix behavioral with technical.
> **Time:** 20 min prep

---

## SECTION A: Introduction Script

### "Tell me about yourself"

> "I'm Tijo — a Senior Frontend Engineer with about 8 years of experience, focused on React and TypeScript. My most impactful work was building a config-driven KYC portal for a regulated financial environment — migrated from a legacy system to a modern React + TypeScript stack. The config-driven architecture meant adding new jurisdictions was a config change, not a code change.
>
> I've led feature deliveries, set up code review processes, mentored developers transitioning into React, and worked in environments where compliance, audit trails, and data accuracy are non-negotiable — which is exactly what CSE's banking and capital markets work demands.
>
> I relocated from the UK to India in late 2025 and I'm available for immediate joining."

---

## SECTION B: Behavioral Questions (STAR Format)

---

### Q: "Tell me about a complex technical problem you solved"

> **S:** At the KYC project, our verification flow started failing silently for one jurisdiction after a backend deployment.
> **T:** I needed to identify the root cause and restore the flow without affecting other jurisdictions.
> **A:** Correlated the timing with deployment logs, scoped it to one jurisdiction's selfie step. The backend changed the API response format without updating the contract. I disabled that step via feature flag within 20 minutes — degraded but functional. Then deployed a fix that handled both response formats. Added runtime validation with Zod for API responses.
> **R:** 20-minute mitigation instead of 2-hour outage. Added contract tests to prevent recurrence.

---

### Q: "How do you handle tight deadlines?"

> "I negotiate scope, not quality. I'll talk to the product team: 'We can ship the core functionality by deadline X, and the remaining features in the next sprint.' I break work into shippable increments — the user gets value early, and we iterate. What I never do is cut testing or skip code review to meet a date — that creates tech debt that costs 3x later."

---

### Q: "Describe your code review process"

> "PRs under 400 lines — large PRs get sloppy reviews. I review for: correctness, readability, performance, and tests. I leave 'why' comments, not just 'change this' — the team learns from reviews. I block on bugs and security issues, suggest on style preferences. Automated checks run first — lint, tests, type checking — so my review focuses on logic and architecture, not formatting."

---

### Q: "How do you onboard new team members?"

> "Day 1: environment setup and first PR — even a typo fix. Shipping on day one builds confidence and teaches the pipeline. Week 1: pair programming on a small feature. Month 1: own a feature with review support. I document everything — onboarding friction reveals documentation gaps."

---

### Q: "Why CSE?"

> "Two reasons. Domain fit — I've built financial UIs in regulated environments. I understand compliance-driven development where data accuracy and audit trails aren't optional. CSE's 30+ years in banking and capital markets means real engineering problems, not toy apps.
>
> Stack fit — React, TypeScript, Redux, modern tooling. That's my core. And the immediate joiner requirement works because I'm available right now."

---

### Q: "What's your expected salary?"

> "I'm flexible on compensation — I'm looking for the right role and team. What's the range budgeted for this position?"

> *If pushed:* State your range based on market research. Don't go first if you can avoid it.

---

### Q: "Are you comfortable with Sunday–Thursday schedule?"

> "Yes, absolutely. I understand CSE follows the Saudi calendar. I'm adaptable and ready to align with the team's working hours."

---

## SECTION C: Fintech Domain Knowledge

> They may ask fintech-specific questions given CSE builds trading and banking systems.

---

### Key terms to know:

| Term | What | Your connection |
|------|------|-----------------|
| KYC | Know Your Customer — identity verification | Built a full KYC portal |
| AML | Anti-Money Laundering — transaction monitoring | KYC is the first line of AML defense |
| Tadawul | Saudi stock exchange | CSE builds trading systems for it |
| Custody | Holding securities on behalf of clients | CSE product: iCustody Plus |
| Portfolio management | Tracking investments and performance | Data-heavy dashboards — your experience |
| Audit trail | Log of every action with timestamps | Built this in case management dashboard |
| Compliance | Regulatory adherence | Your KYC work was compliance-driven |
| Settlement | Finalizing a trade — transferring ownership | CSE's IOMSS and LETS systems |

### If they ask: "How do you ensure data accuracy in financial UIs?"

> "Three layers. First, TypeScript strict mode for type safety — the compiler catches mismatches before runtime. Second, runtime validation with Zod or similar — never trust API response shapes. Third, display formatting with Intl.NumberFormat for consistent decimal precision — in financial systems, showing 10.1 instead of 10.10 is a bug. I also ensure idempotent submissions — prevent double-submit on trade actions with loading states and button disabling."

### If they ask: "How do you handle sensitive data in the frontend?"

> "Never store sensitive data in localStorage or sessionStorage — use httpOnly cookies for tokens. Sanitize all user input to prevent XSS. Use HTTPS everywhere. Mask sensitive fields in the UI — show last 4 digits of account numbers. Clear sensitive data from component state on unmount. In the KYC portal, we redacted document images client-side before displaying to lower-privilege agents."

---

## SECTION D: Your Questions for Them

**Pick 2-3:**

1. "What does the tech stack look like on the frontend — are you using React 18, and how do you handle state management?"
2. "How is the development team structured — frontend and backend separate, or full-stack?"
3. "What does a typical sprint look like — two weeks? What's the release cadence?"
4. "What does success look like for this role in the first 90 days?"
5. "Is the work primarily for Saudi banking clients, or international as well?"

---

## 🎯 EMERGENCY PHRASES

| Situation | Say This |
|-----------|----------|
| You blank | "That's a great question. Let me organize my thoughts..." |
| Don't know the tech | "I haven't used that in production, but here's how I'd approach it..." |
| Rambling | Stop. Breathe. "The key point is..." |
| Salary pressure | "I'd prefer to understand the full scope first. What's the budgeted range?" |
| Java/Spring Boot gap | "My backend experience is with Go, but I integrate with backend APIs regardless of the language. The frontend patterns are the same — REST contracts, error handling, loading states." |

---

## ✅ Checklist

- [ ] Can deliver "about yourself" in 90 seconds smooth
- [ ] Have 3 STAR stories ready (KYC problem, deadline, tech decision)
- [ ] Know fintech terms (KYC, AML, Tadawul, custody, audit trail)
- [ ] Have 2-3 questions to ask them
- [ ] Can handle the Java gap question confidently
- [ ] Can explain data accuracy and security in financial UIs
