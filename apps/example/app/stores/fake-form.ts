import { z } from "zod";

interface ContactForm {
  name: string;
  email: string;
  role: string;
  department: string;
  bio: string;
  skills: string[];
  notify: boolean;
  priority: string;
  startDate?: unknown;
}

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  notify: z.boolean(),
  priority: z.string().min(1, "Priority is required"),
  startDate: z.unknown().refine((v) => v !== undefined, "Start date is required"),
});

export const accessFakeForm = createForm<ContactForm>("fake-form", {
  title: "New Contact",
  fields: [
    { key: "name", type: "text", label: "Full Name", placeholder: "Jane Doe", required: true, colspan: 6 },
    { key: "email", type: "email", label: "Email", placeholder: "jane@example.com", required: true, colspan: 6 },
    { key: "role", type: "select", label: "Role", placeholder: "Select a role", required: true, colspan: 4, options: [
      { value: "engineer", label: "Engineer" },
      { value: "designer", label: "Designer" },
      { value: "manager", label: "Manager" },
      { value: "analyst", label: "Analyst" },
    ] },
    { key: "department", type: "radio", label: "Department", required: true, colspan: 8, options: [
      { value: "engineering", label: "Engineering" },
      { value: "marketing", label: "Marketing" },
      { value: "sales", label: "Sales" },
      { value: "support", label: "Support" },
    ], orientation: "horizontal" },
    { key: "bio", type: "textarea", label: "Bio", placeholder: "Tell us about yourself...", required: true, rows: 4, colspan: 12 },
    { key: "skills", type: "tags-input", label: "Skills", placeholder: "Add a skill...", required: true, colspan: 6 },
    { key: "startDate", type: "date", label: "Start Date", placeholder: "Pick a date", required: true, colspan: 6 },
    { key: "priority", type: "select", label: "Priority Level", placeholder: "Select priority", required: true, colspan: 6, options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ] },
    { key: "notify", type: "checkbox", label: "Enable notifications", colspan: 6 },
  ],
  schema: ContactSchema,
  submit: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form submitted:", data);
  },
  defaults: {
    name: "",
    email: "",
    role: "",
    department: "",
    bio: "",
    skills: [],
    notify: false,
    priority: "",
    startDate: undefined,
  },
});
