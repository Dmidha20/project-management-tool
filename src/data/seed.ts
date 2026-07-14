import type { Member, Project, Task } from "./types";

/** The "signed in" user for this demo (an Admin). */
export const CURRENT_USER_ID = "u1";

// ----------------------------------------------------------------------
// Seed data — a believable snapshot so the demo looks "lived in".
// ----------------------------------------------------------------------

export const SEED_MEMBERS: Member[] = [
  { id: "u1", name: "Alice Johnson", email: "alice@studio.com", role: "Admin", title: "Project Director" },
  { id: "u2", name: "David Kim", email: "david@studio.com", role: "Manager", title: "Lead Reviewer" },
  { id: "u3", name: "Priya Patel", email: "priya@studio.com", role: "Member", title: "BIM Modeler" },
  { id: "u4", name: "Marcus Lee", email: "marcus@studio.com", role: "Member", title: "Draftsman" },
  { id: "u5", name: "Sofia Rossi", email: "sofia@studio.com", role: "Manager", title: "QA Reviewer" },
  { id: "u6", name: "Noah Williams", email: "noah@studio.com", role: "Member", title: "BIM Modeler" },
];

export const SEED_PROJECTS: Project[] = [
  {
    id: "p1",
    code: "RVT",
    name: "Riverside Tower",
    description: "42-storey mixed-use tower — structural & MEP coordination model.",
    color: "#4F46E5",
    status: "Active",
    memberIds: ["u1", "u2", "u3", "u4"],
    sections: [
      { id: "p1s1", name: "Architecture" },
      { id: "p1s2", name: "Structural" },
      { id: "p1s3", name: "MEP" },
    ],
    createdAt: "2026-05-02T09:00:00.000Z",
    dueDate: "2026-09-30",
  },
  {
    id: "p2",
    code: "HMC",
    name: "Harbor Medical Center",
    description: "Hospital expansion wing — coordination, drawings and closeout package.",
    color: "#0EA5E9",
    status: "Active",
    memberIds: ["u1", "u2", "u5", "u6"],
    sections: [
      { id: "p2s1", name: "Ground Floor" },
      { id: "p2s2", name: "Wards" },
      { id: "p2s3", name: "Roof Plant" },
    ],
    createdAt: "2026-05-20T09:00:00.000Z",
    dueDate: "2026-10-15",
  },
  {
    id: "p3",
    code: "LOG",
    name: "Logistics Hub",
    description: "Distribution warehouse — steel modeling and as-built drawing set.",
    color: "#10B981",
    status: "Planning",
    memberIds: ["u3", "u4", "u6"],
    sections: [
      { id: "p3s1", name: "Warehouse" },
      { id: "p3s2", name: "Office Block" },
    ],
    createdAt: "2026-06-10T09:00:00.000Z",
    dueDate: "2026-11-20",
  },
];

// ----------------------------------------------------------------------

type SeedTask = Omit<Task, "createdAt" | "updatedAt" | "attachments" | "links" | "checklist" | "comments" | "order"> &
  Partial<Pick<Task, "attachments" | "links" | "checklist" | "comments">>;

const now = Date.parse("2026-07-14T10:00:00.000Z");
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();

const RAW_TASKS: SeedTask[] = [
  {
    id: "t1", code: "TSK-101", projectId: "p1", sectionId: "p1s2", type: "modeling",
    title: "Model podium transfer structure", status: "in_progress", critical: true, assigneeId: "u3",
    dueDate: "2026-07-22",
    description: "Build the transfer beams and columns between levels 5 and 7. Coordinate with MEP for penetration sleeves.",
    links: [{ id: "l1", label: "Column schedule", url: "https://sheets.google.com/", kind: "gsheet" }],
    comments: [
      { id: "c1", authorId: "u2", text: "Please keep beam depths under 900mm where possible.", createdAt: daysAgo(2) },
      { id: "c2", authorId: "u3", text: "Noted — reworking grid C. Will push an update tonight.", createdAt: daysAgo(1) },
    ],
  },
  {
    id: "t2", code: "TSK-102", projectId: "p1", sectionId: "p1s3", type: "modeling",
    title: "Route level 12 HVAC ductwork", status: "in_progress", critical: false, assigneeId: "u6",
    dueDate: "2026-07-25",
    description: "Primary supply and return ducts for the east wing. Maintain 2700mm clear ceiling height.",
  },
  {
    id: "t3", code: "TSK-103", projectId: "p1", sectionId: "p1s1", type: "drawing",
    title: "Produce GA plans L20–L25", status: "review_1", critical: false, assigneeId: "u4",
    dueDate: "2026-07-18",
    description: "General arrangement plans for the residential floors. Follow the L15 template.",
    comments: [{ id: "c3", authorId: "u5", text: "Check the dimension string on the core walls.", createdAt: daysAgo(1) }],
  },
  {
    id: "t4", code: "TSK-104", projectId: "p1", sectionId: "p1s2", type: "modeling",
    title: "Foundation pile cap layout", status: "review_2", critical: true, assigneeId: "u3",
    dueDate: "2026-07-16",
    description: "Model all pile caps per the geotechnical report. Flag any clashes with the basement drainage.",
    links: [{ id: "l2", label: "Geotech report", url: "https://docs.google.com/", kind: "gdoc" }],
  },
  {
    id: "t5", code: "TSK-105", projectId: "p1", sectionId: "p1s1", type: "drawing",
    title: "Facade detail sheets", status: "rework", critical: false, assigneeId: "u4",
    dueDate: "2026-07-12",
    description: "Curtain wall junction details. Reviewer flagged missing thermal break callouts.",
    comments: [{ id: "c4", authorId: "u2", text: "Thermal breaks missing on details 3 and 5 — please add.", createdAt: daysAgo(3) }],
  },
  {
    id: "t6", code: "TSK-106", projectId: "p1", sectionId: "p1s3", type: "modeling",
    title: "Sprinkler main coordination", status: "on_hold", critical: false, assigneeId: "u6",
    description: "Awaiting fire consultant's updated hydraulic calcs before proceeding.",
  },
  {
    id: "t7", code: "TSK-107", projectId: "p1", sectionId: "p1s1", type: "closeout",
    title: "Level 5 closeout package", status: "completed", critical: false, assigneeId: "u3",
    dueDate: "2026-07-05",
    description: "Compile the closeout checklist and hand over the coordinated model for L5.",
    checklist: [
      { id: "ck1", text: "Clash report cleared", done: true },
      { id: "ck2", text: "Model audited (warnings < 50)", done: true },
      { id: "ck3", text: "Drawings issued to client", done: true },
      { id: "ck4", text: "Sign-off recorded", done: true },
    ],
  },
  {
    id: "t8", code: "TSK-108", projectId: "p2", sectionId: "p2s1", type: "modeling",
    title: "Model imaging suite equipment", status: "in_progress", critical: true, assigneeId: "u6",
    dueDate: "2026-07-24",
    description: "MRI and CT rooms — model shielded walls and equipment clearances per manufacturer specs.",
    links: [{ id: "l3", label: "Equipment cutsheets", url: "https://onedrive.com/", kind: "excel" }],
    comments: [{ id: "c5", authorId: "u1", text: "Client confirmed Siemens units — use the updated footprints.", createdAt: daysAgo(1) }],
  },
  {
    id: "t9", code: "TSK-109", projectId: "p2", sectionId: "p2s2", type: "drawing",
    title: "Ward layout drawings", status: "in_progress", critical: false, assigneeId: "u5",
    dueDate: "2026-07-28",
    description: "Produce the ward floor drawings including bed bays and ensuite layouts.",
  },
  {
    id: "t10", code: "TSK-110", projectId: "p2", sectionId: "p2s3", type: "modeling",
    title: "Roof plant AHU coordination", status: "review_1", critical: false, assigneeId: "u6",
    dueDate: "2026-07-20",
    description: "Coordinate air handling units and access routes on the roof plant deck.",
  },
  {
    id: "t11", code: "TSK-111", projectId: "p2", sectionId: "p2s1", type: "drawing",
    title: "Entrance canopy details", status: "review_2", critical: false, assigneeId: "u5",
    dueDate: "2026-07-17",
    description: "Structural steel canopy over the main entrance — connection details.",
  },
  {
    id: "t12", code: "TSK-112", projectId: "p2", sectionId: "p2s2", type: "closeout",
    title: "Ward wing closeout", status: "rework", critical: true, assigneeId: "u6",
    dueDate: "2026-07-14",
    description: "Closeout checklist for the ward wing. QA returned for missing O&M links.",
    checklist: [
      { id: "ck5", text: "Clash report cleared", done: true },
      { id: "ck6", text: "Model audited", done: true },
      { id: "ck7", text: "O&M documents linked", done: false },
      { id: "ck8", text: "Sign-off recorded", done: false },
    ],
    comments: [{ id: "c6", authorId: "u5", text: "O&M links are missing — please attach before resubmitting.", createdAt: daysAgo(1) }],
  },
  {
    id: "t13", code: "TSK-113", projectId: "p2", sectionId: "p2s1", type: "modeling",
    title: "Ground floor lobby model", status: "completed", critical: false, assigneeId: "u1",
    dueDate: "2026-07-01",
    description: "Reception, lobby and public circulation modeled and coordinated.",
  },
  {
    id: "t14", code: "TSK-114", projectId: "p3", sectionId: "p3s1", type: "modeling",
    title: "Model primary steel frame", status: "in_progress", critical: true, assigneeId: "u4",
    dueDate: "2026-07-30",
    description: "Portal frames at 7.5m centers across the warehouse footprint.",
  },
  {
    id: "t15", code: "TSK-115", projectId: "p3", sectionId: "p3s2", type: "drawing",
    title: "Office block floor plans", status: "review_1", critical: false, assigneeId: "u3",
    dueDate: "2026-08-02",
    description: "Two-storey office block — general arrangement floor plans.",
  },
  {
    id: "t16", code: "TSK-116", projectId: "p3", sectionId: "p3s1", type: "modeling",
    title: "Loading dock levelers", status: "on_hold", critical: false, assigneeId: "u6",
    description: "On hold pending client selection of dock leveler vendor.",
  },
  {
    id: "t17", code: "TSK-117", projectId: "p3", sectionId: "p3s1", type: "drawing",
    title: "Roof bracing plan", status: "review_2", critical: false, assigneeId: "u4",
    dueDate: "2026-07-26",
    description: "Wind bracing layout for the warehouse roof.",
  },
  {
    id: "t18", code: "TSK-118", projectId: "p3", sectionId: "p3s2", type: "closeout",
    title: "Office block closeout", status: "completed", critical: false, assigneeId: "u3",
    dueDate: "2026-06-28",
    description: "Closeout package for the office block portion.",
    checklist: [
      { id: "ck9", text: "Clash report cleared", done: true },
      { id: "ck10", text: "Drawings issued", done: true },
      { id: "ck11", text: "Sign-off recorded", done: true },
    ],
  },
];

export const SEED_TASKS: Task[] = (() => {
  const orderByStatus: Record<string, number> = {};

  return RAW_TASKS.map((raw, index) => {
    const order = orderByStatus[raw.status] ?? 0;
    orderByStatus[raw.status] = order + 1;

    return {
      ...raw,
      order,
      createdAt: daysAgo(20 - index),
      updatedAt: daysAgo(index % 5),
      attachments: raw.attachments ?? [],
      links: raw.links ?? [],
      checklist: raw.checklist ?? [],
      comments: raw.comments ?? [],
    };
  });
})();
