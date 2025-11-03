import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Auth/Signin/LoginPage";
import SigninPage from "./Auth/Signup/SignupPage";
import AdminMenu from "./Components/Dashboard/AdminMenu";
import StudentMenu from "./Components/Dashboard/StudentMenu";
import LostItemSubmit from "./Components/LostItem/LostItemSubmit";
import LostItemReport from "./Components/LostItem/LostItemReport";
import FoundItemSubmission from "./Components/FoundItem/FoundItemSubmission";
import FoundItemReport from "./Components/FoundItem/FoundItemReport";
import DeleteStudentList from "./Components/DeleteStudentList";
import LostItemTrack from "./Components/LostItem/LostItemTrack";
import FoundItemTrack from "./Components/FoundItem/FoundItemTrack";
import MarkAsFound from "./Components/MarkAsFound";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Profile from "./Components/Profile";
import "./App.css";
import NotFound from "./Components/NotFound";

// --- IMPORTS FOR CHAT ---
import { WebSocketProvider } from "./Context/WebSocketContext";
import ChatPage from "./Components/ChatPage";
import RoleBasedLayout from "./Components/Layout/RoleBasedLayout";

function App() {
  return (
    // --- WRAP APP WITH WEBSOCKET PROVIDER FOR GLOBAL ACCESS ---
    <WebSocketProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/Register" element={<SigninPage />} />

            {/* Admin Routes */}
            <Route
              path="/AdminMenu"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <RoleBasedLayout>
                    <AdminMenu />
                  </RoleBasedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/DeleteStudentList"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <RoleBasedLayout>
                    <DeleteStudentList />
                  </RoleBasedLayout>
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/StudentMenu"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <RoleBasedLayout>
                    <StudentMenu />
                  </RoleBasedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/LostSubmit"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <RoleBasedLayout>
                    <LostItemSubmit />
                  </RoleBasedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/LostItemTrack"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <RoleBasedLayout>
                    <LostItemTrack />
                  </RoleBasedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/FoundSubmit"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <RoleBasedLayout>
                    <FoundItemSubmission />
                  </RoleBasedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/FoundItemTrack"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <RoleBasedLayout>
                    <FoundItemTrack />
                  </RoleBasedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mark-found/:id"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <RoleBasedLayout>
                    <MarkAsFound />
                  </RoleBasedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Personal"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <RoleBasedLayout>
                    <Profile />
                  </RoleBasedLayout>
                </ProtectedRoute>
              }
            />

            {/* CHAT ROUTE: Accessible to Admin and Student */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute allowedRoles={["Admin", "Student"]}>
                  <RoleBasedLayout>
                    <ChatPage />
                  </RoleBasedLayout>
                </ProtectedRoute>
              }
            />

            {/* Generic Routes */}
            <Route
              path="/LostReport"
              element={
                <ProtectedRoute allowedRoles={["Admin", "Student"]}>
                  <RoleBasedLayout>
                    <LostItemReport />
                  </RoleBasedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/FoundReport"
              element={
                <ProtectedRoute allowedRoles={["Admin", "Student"]}>
                  <RoleBasedLayout>
                    <FoundItemReport />
                  </RoleBasedLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </WebSocketProvider>
  );
}

export default App;
