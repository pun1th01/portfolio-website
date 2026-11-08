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
      title: "Stage 3 Implementation & Validation Report",
      description: "The implementation and validation report for Stage 3, detailing the core engine and overlay construction.",
      stage: 3,
      file: "Stage3_Implementation_Validation_Report.pdf",
      completed: true
    },
    {
      title: "Stage 4 Dogfooding Report",
      description: "Results and lessons from dogfooding the tool on the Procedural World Generator, addressing known regressions.",
      stage: 4,
      file: "Stage4_Dogfooding_Report.pdf",
      completed: true
    },
    {
      title: "Auto-Instrumentation Experiment Design",
      description: "Experiment design document for Auto-Instrumentation.",
      stage: 5,
      file: "AutoInstrumentation_Experiment_Design.pdf",
      completed: true
    },
    {
      title: "Auto-Instrumentation Experimental Results",
      description: "Experimental results for Auto-Instrumentation.",
      stage: 5,
      file: "AutoInstrumentation_Experimental_Results.pdf",
      completed: true
    },
    {
      title: "Auto-Instrumentation Implementation Plan",
      description: "Implementation plan for Auto-Tagging and Auto-Instrumentation.",
      stage: 5,
      file: "Implementation_Plan_AutoTagging.pdf",
      completed: true
    },
    {
      title: "Stage 5 Package Polish Report",
      description: "Report for Stage 5 Package Polish.",
      stage: 5,
      file: "Stage5_Report.pdf",
      completed: true
    },
    {
      title: "Stage 6 Report",
      description: "Report for Stage 6.",
      stage: 6,
      file: "Stage6_Report.pdf",
      completed: true
    },
    {
      title: "Implementation Plan — 0.1.5 to 0.2.0",
      description: "The plan for one-command setup with no wiring, the AI agent panel, and support for plain three.js with nothing tagged by hand.",
      stage: "8–9",
      file: "Click-to-Source_Implementation_Plan_0.1.5-0.2.0.pdf",
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
      description: "A Vite plugin that reads your code and records where every object is made, so clicking any mesh shows the exact line that made it and lets you edit its values live. One command to set up, nothing to add to your code.",
      icon: "solution"
    }
  ],

  /* ── Features (what the released tool does) ── */
  features: [
    {
      title: "Click a mesh, see its line",
      description: "Works in plain three.js and React Three Fiber, even both in one scene. Finds objects made in functions, classes, loops and loaded models, across files."
    },
    {
      title: "The calls that led there",
      description: "Shows the calls that built the object with the values they were given, and the helpers behind it, such as a noise function."
    },
    {
      title: "Edit values live",
      description: "Drag a number to preview it in the scene, then press Enter to save it to the source file. Colours, positions and geometry sizes all work."
    },
    {
      title: "Works with AI assistants",
      description: "An MCP server lets Claude Code, Cursor and VS Code see the objects you point at and edit them. One button in the panel turns it on."
    },
    {
      title: "One command to set up",
      description: "npx click-to-source-3d init sets up an existing Vite app, a monorepo, or a bare folder with only a page and a script."
    },
    {
      title: "Nothing in production",
      description: "Your objects get nothing added to them, and none of the inspector reaches a production build, a server render or a test run."
    }
  ],

  /* ── Progress Stages (matches actual staged plan from project docs) ── */
  stages: [
    { label: "Stage 0", title: "Scope & Planning", status: "completed" },
    { label: "Stage 1", title: "Prove the Mechanism", status: "completed" },
    { label: "Stage 2", title: "Architectural Validation", status: "completed" },
    { label: "Stage 3", title: "Core Engine + Overlay", status: "completed" },
    { label: "Stage 4", title: "Dogfooding", status: "completed" },
    { label: "Stage 5", title: "Package Polish", status: "completed" },
    { label: "Stage 6", title: "MCP / AI Mode", status: "completed" },
    { label: "Stage 7", title: "Ship", status: "completed" },
    { label: "Stage 8", title: "One Command & Agent Panel", status: "completed" },
    { label: "Stage 9", title: "Plain three.js", status: "completed" }
  ],

  /* ── Roadmap (traces to documented stages) ── */
  roadmap: [
    { text: "Scope & Planning — problem definition, research, architecture, documentation", done: true },
    { text: "Prove the Mechanism — 7 experiments, experimental validation report", done: true },
    { text: "Architectural Validation — evaluating candidate approaches, selecting AST analysis", done: true },
    { text: "Core Engine + Overlay — MVP: raycast, resolve, edit (no AI)", done: true },
    { text: "Dogfooding — apply to Procedural World Generator, fix known regressions", done: true },
    { text: "Package Polish — install experience, README, demo", done: true },
    { text: "MCP / AI Mode — agent tool surface for LLM-driven workflows", done: true },
    { text: "Ship — npm publish, GitHub release (0.1.0)", done: true },
    { text: "One command, no wiring — setup with nothing to add to your code, for React Three Fiber (0.1.5)", done: true },
    { text: "Agent panel — point an AI assistant at objects, watch what it does, live previews (0.1.6)", done: true },
    { text: "Plain three.js — nothing tagged by hand, call traces and helpers, an MCP button (0.2.0)", done: true },
    { text: "Beyond Vite — webpack and Next.js support", done: false }
  ]
};
