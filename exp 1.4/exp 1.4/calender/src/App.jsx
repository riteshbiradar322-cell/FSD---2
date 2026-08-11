import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;