import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./hooks/useAuth";
import { ThemeProvider as StyledProvider } from "styled-components";
import { GlobalStyles } from "./styles/globalStyles";
import { lightTheme, darkTheme } from "./styles/themes";
import { useTheme } from "./context/ThemeContext";

// Components
import Navbar from "./components/common/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import DailyView from "./components/dashboard/DailyView";
import WeeklyReview from "./components/dashboard/WeeklyReview";
import AreasList from "./components/areas/AreasList";
import AreaDetail from "./components/areas/AreaDetail";
import EditArea from "./components/areas/EditArea";
import CreateArea from "./components/areas/CreateArea";
import CoursesList from "./components/courses/CoursesList";
import CreateCourse from "./components/courses/CreateCourse";
import EditCourse from "./components/courses/EditCourse";
import CourseDetail from "./components/courses/CourseDetail";
import BooksList from "./components/books/BooksList";
import CreateBook from "./components/books/CreateBook";
import EditBook from "./components/books/EditBook";
import BookDetail from "./components/books/BookDetail";
import GoalsList from "./components/goals/GoalsList";
import CreateGoal from "./components/goals/CreateGoal";
import EditGoal from "./components/goals/EditGoal";
import GoalDetail from "./components/goals/GoalDetail";
import PrayerTracker from "./components/prayers/PrayerTracker";
import AdminDashboard from "./components/admin/AdminDashboard";
import CreateTopic from "./components/courses/CreateTopic";
import CreateSession from "./components/books/CreateSession";
import CreateTask from "./components/goals/CreateTask";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  const { theme } = useTheme();
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  return (
    <StyledProvider theme={currentTheme}>
      <GlobalStyles />
      <Router>
        <div className="app">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: currentTheme.surface,
                color: currentTheme.text,
              },
            }}
          />
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/daily/:date?"
              element={
                <ProtectedRoute>
                  <DailyView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/weekly"
              element={
                <ProtectedRoute>
                  <WeeklyReview />
                </ProtectedRoute>
              }
            />

            <Route
              path="/areas"
              element={
                <ProtectedRoute>
                  <AreasList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/areas/create"
              element={
                <ProtectedRoute>
                  <CreateArea />
                </ProtectedRoute>
              }
            />

            <Route
              path="/areas/:id"
              element={
                <ProtectedRoute>
                  <AreaDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CoursesList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <BooksList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <GoalsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CoursesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/areas/:id/edit"
              element={
                <ProtectedRoute>
                  <EditArea />
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses/:id/edit"
              element={
                <ProtectedRoute>
                  <EditCourse />
                </ProtectedRoute>
              }
            />

            <Route
              path="/books/:id/edit"
              element={
                <ProtectedRoute>
                  <EditBook />
                </ProtectedRoute>
              }
            />

            <Route
              path="/goals/:id/edit"
              element={
                <ProtectedRoute>
                  <EditGoal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/create/:areaId"
              element={
                <ProtectedRoute>
                  <CreateCourse />
                </ProtectedRoute>
              }
            />

            <Route
              path="/courses/:id"
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id/topics/create"
              element={
                <ProtectedRoute>
                  <CreateTopic />
                </ProtectedRoute>
              }
            />

            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <BooksList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/books/create/:areaId"
              element={
                <ProtectedRoute>
                  <CreateBook />
                </ProtectedRoute>
              }
            />

            <Route
              path="/books/:id"
              element={
                <ProtectedRoute>
                  <BookDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/:id/sessions/create"
              element={
                <ProtectedRoute>
                  <CreateSession />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <GoalsList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/goals/create/:areaId"
              element={
                <ProtectedRoute>
                  <CreateGoal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals/:id/tasks/create"
              element={
                <ProtectedRoute>
                  <CreateTask />
                </ProtectedRoute>
              }
            />

            <Route
              path="/goals/:id"
              element={
                <ProtectedRoute>
                  <GoalDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/prayers"
              element={
                <ProtectedRoute>
                  <PrayerTracker />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </StyledProvider>
  );
}

export default App;
