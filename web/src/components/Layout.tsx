import { ReactNode } from "react";

export type Page =
  | "teacher-dashboard"
  | "assignments"
  | "create-assignment"
  | "pending-queue"
  | "review-submission"
  | "class-management"
  | "student-dashboard"
  | "submit-assignment"
  | "view-feedback"
  | "progress-report"
  | "class-report";

export type Role = "teacher" | "student" | "admin";

interface LayoutProps {
  children: ReactNode;
  currentPage: Page;
  role: Role;
  onNavigate: (page: Page) => void;
  onRoleChange: (role: Role) => void;
}

const teacherNav = [
  { id: "teacher-dashboard" as Page, label: "Dashboard", icon: "⊞" },
  { id: "assignments" as Page, label: "Assignments", icon: "📋" },
  { id: "pending-queue" as Page, label: "Pending Queue", icon: "⏳" },
  { id: "class-management" as Page, label: "Classes", icon: "🏫" },
  { id: "progress-report" as Page, label: "Reports", icon: "📊" },
];

const studentNav = [
  { id: "student-dashboard" as Page, label: "My Assignments", icon: "⊞" },
  { id: "view-feedback" as Page, label: "My Feedback", icon: "⭐" },
  { id: "progress-report" as Page, label: "My Progress", icon: "📈" },
];

const adminNav = [
  { id: "teacher-dashboard" as Page, label: "Overview", icon: "⊞" },
  { id: "class-management" as Page, label: "All Classes", icon: "🏫" },
  { id: "pending-queue" as Page, label: "All Submissions", icon: "⏳" },
  { id: "progress-report" as Page, label: "Reports", icon: "📊" },
];

export default function Layout({ children, currentPage, role, onNavigate, onRoleChange }: LayoutProps) {
  const navItems = role === "student" ? studentNav : role === "admin" ? adminNav : teacherNav;

  const roleLabel = role === "teacher" ? "Ms. Johnson" : role === "student" ? "Emma Chen" : "Admin";
  const roleTitle = role === "teacher" ? "Teacher" : role === "student" ? "Student · Grade 2" : "System Admin";
  const roleInitial = role === "teacher" ? "J" : role === "student" ? "E" : "A";
  const roleBg = role === "teacher" ? "bg-[#FFD147]" : role === "student" ? "bg-[#47D6B5]" : "bg-[#FF6B47]";

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-none flex flex-col bg-[#1A0F3C] text-white relative overflow-hidden">
        {/* Memphis decorative shapes */}
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#6C47FF] opacity-20 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-40 left-0 w-16 h-16 bg-[#FF6B47] opacity-15 -translate-x-8 rotate-45" />
        <div className="absolute bottom-20 right-4 w-10 h-10 rounded-full border-4 border-[#FFD147] opacity-30" />

        {/* Logo */}
        <div className="px-6 pt-7 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6C47FF] flex items-center justify-center text-lg font-black">
              L
            </div>
            <div>
              <div className="font-black text-lg leading-none" style={{ fontFamily: "Nunito, sans-serif" }}>LMS</div>
              <div className="text-xs text-purple-300 leading-none mt-0.5">English for Kids</div>
            </div>
          </div>
        </div>

        {/* Role switcher */}
        <div className="mx-4 mb-5 p-1 bg-white/10 rounded-xl flex gap-1 relative z-10">
          {(["teacher", "student", "admin"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all capitalize ${
                role === r ? "bg-white text-[#1A0F3C]" : "text-white/60 hover:text-white"
              }`}
            >
              {r === "admin" ? "Admin" : r}
            </button>
          ))}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 relative z-10 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                  isActive
                    ? "bg-[#6C47FF] text-white shadow-lg shadow-purple-900/40"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
                {item.id === "pending-queue" && (
                  <span className="ml-auto bg-[#FF6B47] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    7
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="p-4 border-t border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${roleBg} flex items-center justify-center text-[#1A0F3C] font-black text-sm`}>
              {roleInitial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">{roleLabel}</div>
              <div className="text-xs text-white/50 truncate">{roleTitle}</div>
            </div>
            <button className="text-white/40 hover:text-white transition-colors text-lg">⋯</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-[#FAFAF5]">
        {children}
      </main>
    </div>
  );
}
