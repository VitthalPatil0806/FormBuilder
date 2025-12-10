                               ┌────────────────────────────┐
                               │  Browser / User Interface  │
                               │  (React + Tailwind + TS)   │
                               └────────────┬───────────────┘  
                                            │
                                            ▼
                       ┌────────────────────────────────────────┐
                       │  Form Layout Builder Page              │
                       │  (Create / Edit Layout)                │
                       │                                        │
                       │  • Sections / Rows / Fields editor     │
                       │  • Field metadata (label/type/size)    │
                       │                                        │
                       └───────────────┬────────────────────────┘
                                       │ uses
                                       ▼
                ┌────────────────────────────────────────────┐
                │  Global State: Form Builder Context         │
                │  (holds current form config metadata)      │
                │                                            │
                └───────────────┬────────────────────────────┘
                                │ on Save Layout
                                ▼
                ┌────────────────────────────────────────────┐
                │  Global State: Form History Context        │
                │  (stores list of saved submissions)        │
                │  Each submission = { config, values, id } │
                └───────────────┬────────────────────────────┘
                                │
                                ├─────────▶ View / Edit Values Page / Modal
                                │             (React components)
                                │
                                └─────────▶ PDF Export Utility
                                              (jsPDF + pdfGenerator.ts)

