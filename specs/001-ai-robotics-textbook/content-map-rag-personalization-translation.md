# Content Map: RAG, Personalization, and Translation Planning

**Feature Branch**: `001-ai-robotics-textbook`
**Created**: 2025-12-05
**Status**: Draft
**Spec**: [./spec.md](spec.md)
**Chapter Outline**: [./chapter-outline.md](chapter-outline.md)

## Personalization Feature Plan

-   **Mechanism**: User preferences will be stored client-side (e.g., using browser's `localStorage` or Docusaurus's theme context). This allows for dynamic adjustments without backend user accounts.
-   **Impact Areas**:
    -   **Code Examples**: Ability to toggle between simplified and advanced code snippets, or different programming language examples where applicable (e.g., Python vs. C++ for ROS 2).
    -   **Learning Path**: Suggesting next chapters or related resources based on user's progress or declared interests.
    -   **Terminology Depth**: Toggling definitions for advanced terms (e.g., tooltips or expanded sections).
-   **Integration Points**:
    -   **Docusaurus Theme/Layout**: A global toggle or setting in the Docusaurus theme (`docusaurus.config.js`) and layout components for overall content adjustment.
    -   **Individual Chapter Components**: Custom React components within MDX files (`.mdx`) that conditionally render content based on personalization settings.

## Urdu Translation Feature Plan

-   **Mechanism**: Leverage Docusaurus's native Internationalization (i18n) support. This involves creating language-specific content directories.
-   **Workflow**:
    -   **Core Content**: Markdown (`.md`) and MDX (`.mdx`) files will be duplicated and translated into `i18n/ur/docusaurus-plugin-content-docs/current/` (for Urdu).
    -   **UI Strings**: Translatable strings for navigation, labels, and custom components will be managed using JSON message files (`i18n/ur/code.json`).
    -   **Dynamic Content**: For dynamically generated content (e.g., RAG chatbot responses), a translation API (e.g., Google Translate API) may be integrated as a fallback if manual translations are not available.
-   **Integration Points**:
    -   **Docusaurus Configuration**: `docusaurus.config.js` to define supported locales and paths.
    -   **Language Switcher Component**: A built-in Docusaurus language switcher in the navbar for users to select Urdu.
    -   **Content Rendering**: Docusaurus handles routing to the correct language version of content automatically.

## RAG Chatbot Embedding Points

-   **Mechanism**: A custom React component will be developed and embedded within the Docusaurus site. This component will interface with a (conceptual) RAG backend service.
-   **Content Context**: The RAG system's knowledge base will be primarily built from all markdown content of the textbook chapters. Embeddings will be generated for all text sections.
-   **Embedding Strategy and Locations**:
    -   **Global Chatbot Widget**: A persistent widget accessible from any page of the Docusaurus site, providing a general Q&A interface for the entire textbook content. This could be integrated into the Docusaurus layout via `src/theme/Layout/index.js`.
    -   **Contextual Chatbot Sections (Chapter-Specific)**: Within complex chapters (e.g., advanced ROS 2 concepts, VLA systems), a small, embedded RAG component could provide contextual help, focusing its retrieval on the current chapter's content. These would be inserted directly into specific `.mdx` files.
    -   **Interactive Code Blocks**: RAG could be triggered by questions related to specific code examples, offering explanations or alternative implementations.
    -   **Glossary/Terminology Lookup**: Users could highlight terms, triggering a RAG query to define them based on the textbook.

## Research Paper Word Count Assignment

-   **Total Target**: 5,000-7,000 words (as per constitution and spec.md)

| Section                   | Assigned Word Count | Notes                                                              |
| :------------------------ | :------------------ | :----------------------------------------------------------------- |
| **Abstract**              | 150-250 words       | Concise summary of paper, objectives, methods, key findings.       |
| **Introduction**          | 500-700 words       | Background, problem statement, research questions, paper structure. |
| **Background & Related Work** (ROS 2, Sim, AI for Robotics) | 1000-1500 words     | Comprehensive review of relevant technologies and prior research, aligning with Modules 1-3. |
| **Methodology** (VLA Systems, Integration) | 1000-1500 words     | Detailed description of proposed system architecture, VLA integration, simulation setup. |
| **Results & Discussion** (Analysis, Outcomes) | 1500-2000 words     | Presentation of simulation results, analysis of AI impact, discussion of findings against success criteria. |
| **Conclusion & Future Work** | 300-500 words       | Summary of contributions, limitations, and future research directions. |
| **References**            | N/A                 | APA style, minimum 15 sources (≥50% peer-reviewed).                |
| **Appendices**            | N/A                 | Supplemental code, simulation details, data if applicable.         |
