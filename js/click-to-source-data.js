/* ═══════════════════════════════════════════════════
   Click-to-Source 3D — Centralized Data
   ═══════════════════════════════════════════════════
   To add a new document, simply add an object to the
   `documents` array below. The page will auto-render it.
   ═══════════════════════════════════════════════════ */

const CTS_DATA = {
  /* ── Documentation ── */
  documents: [
    {
      title: "Project Proposal",
      description: "Initial concept and problem definition for the Click-to-Source 3D tool — bridging the gap between visual 3D elements and their source code.",
      stage: 1,
      file: "Click-to-Source_Project_Proposal.pdf",
      completed: true
    },
    {
      title: "Technical Approaches",
      description: "Survey and evaluation of four candidate architectures: runtime hooking, AST-based static analysis, hybrid source mapping, and Babel plugin injection.",
      stage: 1,
      file: "Click-to-Source_Technical_Approaches.pdf",
      completed: true
    },
    {
      title: "Technology Stack",
      description: "Detailed breakdown of the chosen technology stack — Three.js, Babel, Acorn, and VSCode extension API — with rationale for each choice.",
      stage: 1,
      file: "Click-to-Source_Tech_Stack.pdf",
      completed: true
    },
    {
      title: "Final Approach",
      description: "The selected architecture combining AST static analysis with runtime object tagging for reliable source-to-visual mapping.",
      stage: 1,
      file: "Click-to-Source_Final_Approach.pdf",
      completed: true
    },
    {
      title: "Stage 1 — Experimental Report",
      description: "Comprehensive experimental results from Stage 1: prototype implementation, accuracy benchmarks, edge case analysis, and performance profiling.",
      stage: 1,
      file: "Stage1_Experimental_Report.pdf",
      completed: true
    },
    {
      title: "Stage 2 Architectural Validation Report",
      description: "The primary architectural validation report representing the architectural work completed after Stage 1.",
      stage: 2,
      file: "Stage2_Architectural_Validation_Report.pdf",
      completed: true
    },
    {
      title: "Metadata Convention",
      description: "Permanent v0.1 architectural contract defining the canonical way provenance metadata is structured.",
      stage: 2,
      file: "metadata-convention.pdf",
      completed: true
    },
    {
      title: "Future Auto-Instrumentation Design",
      description: "Design-only document for future automatic instrumentation strategies. (Not implemented)",
      stage: 2,
      file: "future-auto-instrumentation-design.md",
      completed: true
    },
    {
      title: "Stage 2 Desk Audit",
      description: "Source-level audit confirming Stage 1 compliance with the finalized Stage 2 convention.",
      stage: 2,
      file: "stage2-desk-audit.md",
      completed: true
    }
  ],

  /* ── Overview Cards ── */
  overview: [
    {
      title: "The Problem",
      description: "In complex Three.js projects, finding which line of code creates a specific 3D object is painful. Developers waste time manually searching through source files.",
      icon: "problem"
    },
    {
      title: "Current Solutions",
      description: "Browser DevTools can inspect DOM elements, but 3D scenes rendered on a single <canvas> have no element-level inspector. There is no production-ready tool for this.",
      icon: "current"
    },
    {
      title: "My Solution",
      description: "Click-to-Source 3D uses AST analysis and runtime instrumentation to map every Three.js object back to its exact source location — then navigates your editor there.",
      icon: "solution"
    }
  ],

  /* ── Progress Stages (matches actual staged plan from project docs) ── */
  stages: [
    { label: "Stage 0", title: "Scope & Planning", status: "completed" },
    { label: "Stage 1", title: "Prove the Mechanism", status: "completed" },
    { label: "Stage 2", title: "Metadata Convention", status: "completed" },
    { label: "Stage 3", title: "Core Engine + Overlay", status: "in-progress" },
    { label: "Stage 4", title: "Dogfooding", status: "upcoming" },
    { label: "Stage 5", title: "Package Polish", status: "upcoming" },
    { label: "Stage 6–7", title: "MCP / AI Mode + Ship", status: "upcoming" }
  ],

  /* ── Roadmap (traces to documented stages) ── */
  roadmap: [
    { text: "Scope & Planning — problem definition, research, architecture, documentation", done: true },
    { text: "Prove the Mechanism — 7 experiments, experimental validation report", done: true },
    { text: "Metadata Convention — SourceRef contract and tagging rule", done: true },
    { text: "Core Engine + Overlay — MVP: raycast, resolve, edit (no AI)", done: false },
    { text: "Dogfooding — apply to Procedural World Generator, fix known regressions", done: false },
    { text: "Package Polish — install experience, README, demo", done: false },
    { text: "MCP / AI Mode — agent tool surface for LLM-driven workflows", done: false },
    { text: "Ship — npm publish, GitHub release", done: false }
  ]
};
