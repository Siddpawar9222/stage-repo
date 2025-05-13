import { Provider, useDispatch } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import store from "./app/store";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Forbidden from "./pages/403";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/dms/Student/Profile";
import { RoleProvider } from "./RoleContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Student from "./pages/dms/Student/Student";
import Attendance from "./pages/Teacher/Attendance";
import { roles } from './utils/roles';
import ClassCharge from "./pages/pms/ClassCharge";
import StudentPayment from "./pages/pms/StudentPayment";
import ClassSubject from "./pages/dms/Subject/ClassSubject";
import PaymentSuccess from "./pages/pms/PaymentSuccess";
import ClassDue from "./pages/pms/ClassDue";
import Reports from "./pages/pms/reports/Reports";
import Chapter from "./pages/dms/Chapter/Chapter";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import NotFound from "./pages/404";
import StudentAttendence from "./pages/dms/Student/StudentAttendence";
import StudentPaymentProfile from "./pages/dms/Student/StudentPaymentProfile";
import OnlineQuiz from "./pages/sms/OnlineQuiz";
import Quiz from "./pages/sms/Quiz";
import DisplayQuizMarks from "./pages/sms/DisplayQuizMarks";
import MarksEntry from "./pages/sms/MarksEntry";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { fetchSessions } from "./app/reducers/sessionSlice";
import StudentEnrollment from "./pages/dms/Student/StudentEnrollment";

const App = () => {
  return (
    <Provider store={store}>
      <RoleProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      ...roles.admin,
                      ...roles.operator,
                      ...roles.teacher,
                      ...roles.student,
                    ]}
                  >
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={roles.student}>
                    <Profile />
                  </ProtectedRoute>
                }
              />


              <Route
                path="/attendance"
                element={
                  <ProtectedRoute allowedRoles={roles.student}>
                    <StudentAttendence studentId={""} />
                  </ProtectedRoute>
                }
              />


              <Route
                path="/quiz/online-quiz"
                element={
                  <ProtectedRoute allowedRoles={roles.student}>
                    <OnlineQuiz />
                  </ProtectedRoute>
                }
              />


              <Route
                path="/payment"
                element={
                  <ProtectedRoute
                    allowedRoles={roles.student}
                  >
                    <StudentPaymentProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/course-enrollment"
                element={
                  <ProtectedRoute
                    allowedRoles={roles.student}
                  >
                    <StudentEnrollment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subjects"
                element={
                  <ProtectedRoute
                    allowedRoles={[...roles.admin, ...roles.operator]}
                  >
                    <ClassSubject />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/chapters"
                element={
                  <ProtectedRoute
                    allowedRoles={[...roles.teacher, ...roles.admin, ...roles.operator]}
                  >
                    <Chapter />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/attendence"
                element={
                  <ProtectedRoute
                    allowedRoles={[...roles.admin, ...roles.teacher]}
                  >
                    <Student />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute
                    allowedRoles={[...roles.teacher, ...roles.admin, ...roles.operator]}
                  >
                    <Student />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz"
                element={
                  <ProtectedRoute allowedRoles={roles.teacher}>
                    <Quiz />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/quiz/display-quiz-marks"
                element={
                  <ProtectedRoute allowedRoles={roles.teacher}>
                    <DisplayQuizMarks />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/quiz/mark-entry"
                element={
                  <ProtectedRoute allowedRoles={roles.teacher}>
                    <MarksEntry />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      ...roles.teacher,
                      ...roles.admin,
                      ...roles.operator,
                    ]}
                  >
                    <Student />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/classCharges"
                element={
                  <ProtectedRoute
                    allowedRoles={[...roles.admin, ...roles.operator]}
                  >
                    <ClassCharge />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/studentPayment"
                element={
                  <ProtectedRoute
                    allowedRoles={[...roles.admin, ...roles.operator]}
                  >
                    <StudentPayment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/classDue"
                element={
                  <ProtectedRoute
                    allowedRoles={[...roles.admin, ...roles.operator]}
                  >
                    <ClassDue />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute
                    allowedRoles={[...roles.admin, ...roles.operator]}
                  >
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/403" element={<Forbidden />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </RoleProvider>
    </Provider>
  )
}

export default App
