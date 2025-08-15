import {
  Menu,
  GraduationCap,
  UserRoundCog,
  UsersRound,
  Presentation,
  School,
  Group,
  SwatchBook,
  BanknoteArrowUp,
  BanknoteArrowDown,
  HandCoins,
  BookOpen,
  Hourglass,
  ListChecks,
  BarChart4,
  Wallet,
  BookCheck,
  Banknote,
  Megaphone,
  Activity,
  ListTodo,
  BadgeDollarSign,
  GalleryHorizontal,
  Images,
  Star,
  Pen,
  Pencil,
  CalendarClock,
  Settings,
  BookMarked,
  BookOpenCheck,
  FileText,
  UserPen,
  Notebook,
  BookOpenText,
  SquareMenu,
  Layers,
  Video,
  ThumbsUp,
  UserStar,
} from "lucide-react";
export const UserManagement = [
  { key: "admins", name: "Admin", url: "/admins", icon: <UserRoundCog /> },
  { key: "staffs", name: "Staff", url: "/staffs", icon: <UsersRound /> },
  { key: "teachers", name: "Teacher", url: "/teachers", icon: <UserPen /> },
  { key: "students", name: "Student", url: "/students", icon: <UserStar /> },
];

export const AcademicManagement = [
  { key: "class", name: "Classes", url: "/class", icon: <School /> },
  { key: "subject", name: "Subjects", url: "/subject", icon: <BookOpen /> },
  { key: "course", name: "Course", url: "/course", icon: <BookOpenText /> },
  { key: "chapter", name: "Chapter", url: "/chapter", icon: <Notebook /> },
  { key: "topic", name: "Topics", url: "/topic", icon: <BookOpenText /> },
  { key: "mcq", name: "MCQs", url: "/mcq", icon: <ListChecks /> },
  { key: "cq", name: "CQs", url: "/cq", icon: <SquareMenu /> },
];

export const StudentRecords = [
  { key: "fines", name: "Fines", url: "/fines", icon: <Hourglass /> },
  { key: "fine-types", name: "Fine Types", url: "/fine-types", icon: <ListChecks /> },
  { key: "fees", name: "Fees", url: "/fees", icon: <Wallet /> },
  { key: "exam-results", name: "Exam Results", url: "/exam-results", icon: <BookCheck /> },
  { key: "exam-summery", name: "Exam Summery", url: "/exam-summery", icon: <BookOpenCheck /> },
];

export const Highlights = [
  { key: "banner", name: "Banner", url: "/banner", icon: <Images /> },
  { key: "video-section", name: "Video Section", url: "/video-section", icon: <Video /> },
  { key: "why-choose-us", name: "Why Choose Us", url: "/why-choose-us", icon: <ThumbsUp /> },
  { key: "reviews", name: "Reviews", url: "/reviews", icon: <Star /> },
];

export const OthersRecords = [
  { key: "audit-logs", name: "Audit Logs", url: "/audit-logs", icon: <Activity /> },
  { key: "todos", name: "Todos", url: "/todos", icon: <ListTodo /> },
  { key: "my-todos", name: "My Todos", url: "/my-todos", icon: <ListTodo /> },
  { key: "site-settings", name: "Site Settings", url: "/site-settings", icon: <Settings /> },
];
