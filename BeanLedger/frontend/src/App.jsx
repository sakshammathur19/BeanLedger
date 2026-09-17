import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import AddMember from "./pages/AddMember";
import MemberDetails from "./pages/MemberDetails";
import Purchase from "./pages/Purchase";
import Rewards from "./pages/Rewards";
import Transactions from "./pages/Transactions";


function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function App() {
  return (
    <Routes>

      {/* Landing */}
      <Route
        path="/"
        element={<LandingPage />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Members */}
      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <Members />
          </ProtectedRoute>
        }
      />

      {/* Add Member */}
      <Route
        path="/members/add"
        element={
          <ProtectedRoute>
            <AddMember />
          </ProtectedRoute>
        }
      />

      {/* Member Details */}
      <Route
        path="/members/:id"
        element={
          <ProtectedRoute>
            <MemberDetails />
          </ProtectedRoute>
        }
      />

      {/* Purchase */}
      <Route
        path="/members/:id/purchase"
        element={
          <ProtectedRoute>
            <Purchase />
          </ProtectedRoute>
        }
      />

      {/* Rewards */}
      <Route
        path="/members/:id/rewards"
        element={
          <ProtectedRoute>
            <Rewards />
          </ProtectedRoute>
        }
      />

      {/* Transactions */}
      <Route
        path="/members/:id/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />

      {/* Unknown URL */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;