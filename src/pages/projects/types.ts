export interface IProject {
  id: string;
  name: string;
  owner: string;
  ownerAvatar?: string;
  priority: "Low" | "Medium" | "High";
  status: "Planning" | "In Progress" | "Review" | "Completed";
  progress: number;
  members: number;
  dueDate: string;
}