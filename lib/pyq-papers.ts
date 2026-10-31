// PYQ + model question papers bundled with the app (public/pyq/).
// Every file ships inside the app - no external Drive dependency for papers.
// View: link directly to the file path (browser PDF viewer).
// Download: same path with the `download` attribute.

export interface PaperFile {
  id: string;
  label: string; // e.g. "Oct 2019" or "Model Paper"
  title: string; // e.g. "B.Sc Computer Science DBMS"
  file: string; // public path, e.g. "/pyq/dbms/PYQ-DBMS-Oct2019.pdf"
  kind: "pyq" | "model";
  note?: string;
}

const COMBINED = "/pyq/combined/PYQ-BCA-Theory-Combined-Oct2025.pdf";

export const PAPERS_BY_SUBJECT: Record<string, PaperFile[]> = {
  DBMS: [
    {
      id: "dbms-model",
      label: "Model Paper",
      title: "MGU BCA (Honours) DBMS - Official Model Paper",
      file: COMBINED,
      kind: "model",
      note: "2024 Honours scheme, 70 marks / 2 hrs. Inside the official MGU combined PDF.",
    },
    { id: "dbms-oct2019", label: "Oct 2019", title: "B.Sc Computer Science DBMS (CBCS)", file: "/pyq/dbms/PYQ-DBMS-Oct2019.pdf", kind: "pyq" },
    { id: "dbms-mar2021", label: "Mar 2021", title: "B.Sc Computer Science DBMS (CBCS)", file: "/pyq/dbms/PYQ-DBMS-Mar2021.pdf", kind: "pyq" },
    { id: "dbms-dec2021", label: "Dec 2021", title: "B.Sc / BCA DBMS (CBCS)", file: "/pyq/dbms/PYQ-DBMS-Dec2021.pdf", kind: "pyq" },
  ],
  SF: [
    {
      id: "sf-model",
      label: "Model Paper",
      title: "MGU BCA (Honours) Software Engineering - Official Model Paper",
      file: COMBINED,
      kind: "model",
      note: "2024 Honours scheme, 50 marks / 1.5 hrs. Inside the official MGU combined PDF.",
    },
    { id: "sf-feb2025", label: "Feb 2025", title: "BCA Software Engineering (CBCS)", file: "/pyq/sf/PYQ-SF-Feb2025.pdf", kind: "pyq" },
    { id: "sf-mar2021", label: "Mar 2021", title: "BCA System Analysis & Software Engineering (CBCS)", file: "/pyq/sf/PYQ-SF-Mar2021.pdf", kind: "pyq" },
    { id: "sf-oct2021", label: "Oct 2021", title: "BCA System Analysis & Software Engineering (CBCS)", file: "/pyq/sf/PYQ-SF-Oct2021.pdf", kind: "pyq" },
  ],
  DAA: [
    {
      id: "daa-oct2025",
      label: "Oct 2025",
      title: "MGU BCA (Honours) DAA - Oct 2025 Paper",
      file: COMBINED,
      kind: "model",
      note: "Very likely the actual first Honours exam (not marked Model). 50 marks / 1.5 hrs. Inside the official MGU combined PDF.",
    },
    { id: "daa-feb2025", label: "Feb 2025", title: "BCA Design & Analysis of Algorithms (CBCS)", file: "/pyq/daa/PYQ-DAA-Feb2025.pdf", kind: "pyq" },
  ],
  PYTHON: [
    {
      id: "python-model",
      label: "Model Paper",
      title: "MGU BCA (Honours) Python Programming - Official Model Paper",
      file: COMBINED,
      kind: "model",
      note: "2024 Honours scheme, 50 marks / 1.5 hrs. Inside the official MGU combined PDF.",
    },
    { id: "python-mar2024", label: "Mar 2024", title: "B.Sc Python Programming (CBCS)", file: "/pyq/python/PYQ-Python-Mar2024.pdf", kind: "pyq" },
    { id: "python-nov2025", label: "Nov 2025", title: "M.Sc Python Programming", file: "/pyq/python/PYQ-Python-Nov2025.pdf", kind: "pyq" },
  ],
  FE: [
    {
      id: "fe-model",
      label: "Model Paper",
      title: "MGU BCA (Honours) Feature Engineering - Official Model Paper",
      file: COMBINED,
      kind: "model",
      note: "2024 Honours scheme, 35 marks / 1 hr. Inside the official MGU combined PDF.",
    },
    { id: "fe-ml-dec2023", label: "Dec 2023", title: "M.Sc Machine Learning Techniques", file: "/pyq/fe/PYQ-FE-ML-Dec2023.pdf", kind: "pyq" },
    { id: "fe-ml-oct2025", label: "Oct 2025", title: "M.Sc Machine Learning Techniques", file: "/pyq/fe/PYQ-FE-ML-Oct2025.pdf", kind: "pyq" },
    { id: "fe-ds-dec2025", label: "Dec 2025", title: "IMCA Data Science", file: "/pyq/fe/PYQ-FE-DataScience-Dec2025.pdf", kind: "pyq" },
  ],
  QT: [
    {
      id: "qt-apr2022",
      label: "Apr 2022",
      title: "B.Com Quantitative Techniques for Business 1",
      file: "/pyq/qt/PYQ-QT-Apr2022.pdf",
      kind: "pyq",
      note: "Closest MGU papers available - no BCA QT paper has been published.",
    },
    {
      id: "qt-oct2021",
      label: "Oct 2021",
      title: "B.Com Quantitative Techniques for Business 2",
      file: "/pyq/qt/PYQ-QT-Oct2021.pdf",
      kind: "pyq",
    },
    {
      id: "qt-qtb1",
      label: "2024",
      title: "B.Com Quantitative Techniques for Business 1",
      file: "/pyq/qt/PYQ-QT-QTforBusiness1.pdf",
      kind: "pyq",
    },
  ],
};

export function papersFor(subjectShort: string): PaperFile[] {
  return PAPERS_BY_SUBJECT[subjectShort.toUpperCase()] ?? [];
}

export function modelPapersFor(subjectShort: string): PaperFile[] {
  return papersFor(subjectShort).filter((p) => p.kind === "model");
}

export function pyqPapersFor(subjectShort: string): PaperFile[] {
  return papersFor(subjectShort).filter((p) => p.kind === "pyq");
}

export function allPapers(): { subject: string; paper: PaperFile }[] {
  return Object.entries(PAPERS_BY_SUBJECT).flatMap(([subject, papers]) =>
    papers.map((paper) => ({ subject, paper })),
  );
}
