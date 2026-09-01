import { useState } from "react";
import Layout, { Page, Role } from "./components/Layout";
import TeacherDashboard from "./pages/TeacherDashboard";
import AssignmentList from "./pages/AssignmentList";
import CreateAssignment from "./pages/CreateAssignment";
import PendingQueue from "./pages/PendingQueue";
import ReviewSubmission from "./pages/ReviewSubmission";
import ClassManagement from "./pages/ClassManagement";
import StudentDashboard from "./pages/StudentDashboard";
import SubmitAssignment from "./pages/SubmitAssignment";
import ViewFeedback from "./pages/ViewFeedback";
import ProgressReport from "./pages/ProgressReport";

export default function App() {
  const [role, setRole] = useState<Role>("teacher");
  const [currentPage, setCurrentPage] = useState<Page>("teacher-dashboard");

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    if (newRole === "student") {
      setCurrentPage("student-dashboard");
    } else {
      setCurrentPage("teacher-dashboard");
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "teacher-dashboard":
        return <TeacherDashboard onNavigate={setCurrentPage} />;
      case "assignments":
        return <AssignmentList onNavigate={setCurrentPage} />;
      case "create-assignment":
        return <CreateAssignment onNavigate={setCurrentPage} />;
      case "pending-queue":
        return <PendingQueue onNavigate={setCurrentPage} />;
      case "review-submission":
        return <ReviewSubmission onNavigate={setCurrentPage} />;
      case "class-management":
        return <ClassManagement />;
      case "student-dashboard":
        return <StudentDashboard onNavigate={setCurrentPage} />;
      case "submit-assignment":
        return <SubmitAssignment onNavigate={setCurrentPage} />;
      case "view-feedback":
        return <ViewFeedback onNavigate={setCurrentPage} />;
      case "progress-report":
        return <ProgressReport />;
      default:
        return <TeacherDashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      role={role}
      onNavigate={setCurrentPage}
      onRoleChange={handleRoleChange}
    >
      {renderPage()}
    </Layout>
  );
}
