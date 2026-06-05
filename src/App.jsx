import React from 'react'
import DashBoard from './Dashboard/DashBoard'
import { Navigate, Route, Routes } from 'react-router'
import AdminLogin from './Admin/AdminLogin'
import ProtectedRoute, { } from './routes/ProtectedRoute'
import AdminDashboard from './Dashboard/AdminDashboard'


const App = () => {

    return (
        <Routes>
            {
                <Route path="/" element={<DashBoard />} />
            }
            {/* B. Secure Management Terminal Tracks */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* The Dashboard is now fully locked down behind the ProtectedRoute shield */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* C. Wild-Card Catch-All Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

    )
}

export default App
