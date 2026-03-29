import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProblemsPage from "./pages/ProblemsPage.jsx";
import ProblemPage from "./pages/ProblemPage.jsx";
import SheetsPage from "./pages/SheetsPage.jsx";
import SubmissionsPage from "./pages/SubmissionsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import LogoutPage from "./pages/LogoutPage.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                
                <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/problems" element={<ProtectedRoute><ProblemsPage /></ProtectedRoute>} />
                <Route path="/problem/:id" element={<ProtectedRoute><ProblemPage /></ProtectedRoute>} />
                <Route path="/sheets" element={<ProtectedRoute><SheetsPage /></ProtectedRoute>} />
                <Route path="/custom-sheets" element={<ProtectedRoute><SheetsPage /></ProtectedRoute>} />
                <Route path="/submissions" element={<ProtectedRoute><SubmissionsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}
export default AppRoutes;