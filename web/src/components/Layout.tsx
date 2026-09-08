import { ReactNode, useState } from "react";

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
  { id: "assignments" as Page, label: "Summaries", icon: "📋" },
  { id: "pending-queue" as Page, label: "Pending", icon: "⏳" },
  { id: "class-management" as Page, label: "Classes", icon: "🏫" },
  { id: "progress-report" as Page, label: "Reports", icon: "📊" },
];

const studentNav = [
  { id: "student-dashboard" as Page, label: "Assignments", icon: "⊞" },
  { id: "view-feedback" as Page, label: "Feedback", icon: "⭐" },
  { id: "progress-report" as Page, label: "Progress", icon: "📈" },
];

const adminNav = [
  { id: "teacher-dashboard" as Page, label: "Overview", icon: "⊞" },
  { id: "class-management" as Page, label: "Classes", icon: "🏫" },
  { id: "pending-queue" as Page, label: "Submissions", icon: "⏳" },
  { id: "progress-report" as Page, label: "Reports", icon: "📊" },
];

export default function Layout({ children, currentPage, role, onNavigate, onRoleChange }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navItems = role === "student" ? studentNav : role === "admin" ? adminNav : teacherNav;

  const roleLabel = role === "teacher" ? "Ms. Johnson" : role === "student" ? "Emma Chen" : "Admin";
  const roleTitle = role === "teacher" ? "Teacher" : role === "student" ? "Student · Grade 2" : "System Admin";
  const roleInitial = role === "teacher" ? "J" : role === "student" ? "E" : "A";
  const roleBg = role === "teacher" ? "bg-[#FFD147]" : role === "student" ? "bg-[#47D6B5]" : "bg-[#FF6B47]";

  const SidebarContent = () => (
    <>
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
            onClick={() => { onRoleChange(r); setDrawerOpen(false); }}
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
              onClick={() => { onNavigate(item.id); setDrawerOpen(false); }}
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
    </>
  );

  return (
    <div className="flex h-full overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-none flex-col bg-[#1A0F3C] text-white relative overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile: overlay drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-72 flex flex-col bg-[#1A0F3C] text-white overflow-hidden shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors"
            >
              ✕
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#1A0F3C] text-white flex items-center px-4 gap-3 shadow-lg">
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-none"
          aria-label="Open menu"
        >
          <span className="text-base leading-none">☰</span>
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 rounded-lg bg-[#6C47FF] flex items-center justify-center text-sm font-black">L</div>
          <span className="font-black text-sm" style={{ fontFamily: "Nunito, sans-serif" }}>LMS</span>
          <span className="text-purple-300 text-xs hidden xs:inline">English for Kids</span>
        </div>
        {/* Role quick-switcher pills */}
        <div className="flex items-center gap-1 p-0.5 bg-white/10 rounded-lg">
          {(["teacher", "student", "admin"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              className={`text-[10px] px-2 py-1 rounded-md font-bold capitalize transition-all ${
                role === r ? "bg-white text-[#1A0F3C]" : "text-white/50 hover:text-white"
              }`}
            >
              {r === "admin" ? "adm" : r.slice(0, 3)}
            </button>
          ))}
        </div>
        <div className={`w-8 h-8 rounded-xl ${roleBg} flex items-center justify-center text-[#1A0F3C] font-black text-xs flex-none`}>
          {roleInitial}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[#FAFAF5] pt-14 pb-16 md:pt-0 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A0F3C] border-t border-white/10 flex">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors relative ${
                isActive ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#6C47FF] rounded-full" />
              )}
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-[9px] font-bold leading-none mt-0.5">{item.label}</span>
              {item.id === "pending-queue" && (
                <span className="absolute top-1.5 right-[calc(50%-16px)] bg-[#FF6B47] text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  7
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
