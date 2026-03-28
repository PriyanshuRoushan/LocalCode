import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProblemPage from "./pages/ProblemPage.jsx";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/problem/:id" element={<ProblemPage />} />
            </Routes>
        </BrowserRouter>
    );
}
export default AppRoutes;