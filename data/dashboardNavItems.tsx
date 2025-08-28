import {
  UserRoundCog,
  UsersRound,
  School,
  BookOpen,
  Hourglass,
  ListChecks,
  Wallet,
  BookCheck,
  Activity,
  ListTodo,
  Images,
  Star,
  Settings,
  BookOpenCheck,
  UserPen,
  Notebook,
  BookOpenText,
  SquareMenu,
  Video,
  ThumbsUp,
  UserStar,
  Medal,
  BookCopy,
  Eye,
  ChartSpline,
} from "lucide-react";
export const UserManagement = [
  { key: "admin", name: "Admin", url: "/admin", icon: <UserRoundCog /> },
  { key: "staff", name: "Staff", url: "/staff", icon: <UsersRound /> },
  { key: "teacher", name: "Teacher", url: "/teacher", icon: <UserPen /> },
  { key: "student", name: "Student", url: "/student", icon: <UserStar /> },
];

export const AcademicManagement = [
  { key: "class", name: "Class", url: "/class", icon: <School /> },
  { key: "program", name: "Programs", url: "/program", icon: <BookOpenText /> },
  { key: "subject", name: "Subjects", url: "/subject", icon: <BookOpen /> },
  { key: "chapter", name: "Chapter", url: "/chapter", icon: <Notebook /> },
  { key: "topic", name: "Topics", url: "/topic", icon: <BookOpenText /> },
  { key: "mcq", name: "MCQs", url: "/mcq", icon: <ListChecks /> },
  { key: "cq", name: "CQs", url: "/cq", icon: <SquareMenu /> },
];

export const OlympiadManagement = [
  { key: "olympiad", name: "Olympiad", url: "/olympiad", icon: <Medal /> },
  {
    key: "olympiad-stats",
    name: "Olympiad Stats",
    url: "/olympiad-stats",
    icon: <ChartSpline />,
  },
];

export const CourseManagement = [
  { key: "course", name: "Course", url: "/course", icon: <BookCopy /> },
  {
    key: "course-stats",
    name: "Course Stats",
    url: "/course-stats",
    icon: <ChartSpline />,
  },
];
export const Visitors = [
  {
    key: "visitor",
    name: "Visitor",
    url: `/visitor?year=${new Date().getFullYear()}`,
    icon: <Eye />,
  },
];

export const StudentRecords = [
  { key: "fines", name: "Fines", url: "/fines", icon: <Hourglass /> },
  {
    key: "fine-types",
    name: "Fine Types",
    url: "/fine-types",
    icon: <ListChecks />,
  },
  { key: "fees", name: "Fees", url: "/fees", icon: <Wallet /> },
  {
    key: "exam-results",
    name: "Exam Results",
    url: "/exam-results",
    icon: <BookCheck />,
  },
  {
    key: "exam-summery",
    name: "Exam Summery",
    url: "/exam-summery",
    icon: <BookOpenCheck />,
  },
];

export const Highlights = [
  { key: "banner", name: "Banner", url: "/banner", icon: <Images /> },
  {
    key: "video-section",
    name: "Video Section",
    url: "/video-section",
    icon: <Video />,
  },
  {
    key: "why-choose-us",
    name: "Why Choose Us",
    url: "/why-choose-us",
    icon: <ThumbsUp />,
  },
  { key: "review", name: "Review", url: "/review", icon: <Star /> },
];

export const OthersRecords = [
  {
    key: "audit-logs",
    name: "Audit Logs",
    url: "/audit-logs",
    icon: <Activity />,
  },
  { key: "todos", name: "Todos", url: "/todos", icon: <ListTodo /> },
  { key: "my-todos", name: "My Todos", url: "/my-todos", icon: <ListTodo /> },
  {
    key: "site-settings",
    name: "Site Settings",
    url: "/site-settings",
    icon: <Settings />,
  },
];
