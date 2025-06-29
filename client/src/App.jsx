// Import statements at the top of App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Auth/Profile";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import RegistrationForm from "./pages/registration/RegistrationForm";
import PrivateDashboard from "./pages/Developers/PrivateDashboard";
import AdminEntryForm from "./pages/Developers/AdminEntryForm";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ExamBuilder from "./pages/Admin/ExamBuilder";
import StartPage from './pages/Exam_Section/StartPage';
import SubmitConfirmation from "./pages/Exam_Section/SubmitConfirmation";
import './index.css';
import ExamWindow from "./pages/Exam_Section/ExamWindow";
import UserDashboard from "./pages/Users/UserDashboard";
import AdminRoute from "./components/private/AdminRoute";
import UserRoute from "./components/private/UserRoute";
import FileUploader from "./pages/Admin/FileUploader";
import MyExams from "./pages/Users/MyExams";
import Result from './pages/Exam_Section/Result';
import RegisteredUsers from "./pages/Admin/RegisteredUsers";

// Import the FaceDetection component
import FaceDetection from "./components/FaceDetection"; // Adjust the path if necessary

function App() {
  const privatePassId = import.meta.env.VITE_PRIVATE_DASHBOARD_ID;

  return (
    <BrowserRouter>
      <Header />
      <div className='pt-20'>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />

          {/* Add the FaceDetection route here */}
          <Route path='/face-detection' element={<FaceDetection />} />

          {/* Admin-only Routes */}
          <Route element={<AdminRoute />}>
            <Route path='/admin-dashboard' element={<AdminDashboard />} />
            <Route path='/exam-builder' element={<ExamBuilder />} />
            <Route path='/converter' element={<FileUploader />} />
            <Route path='/registered-users' element={<RegisteredUsers />} />
          </Route>

          {/* User-only Routes */}
          <Route element={<UserRoute />}>
            <Route path='/user-dashboard' element={<UserDashboard />} />
          </Route>

          {/* Private Routes (authenticated users) */}
          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/registration-form' element={<RegistrationForm />} />
            <Route path='/start' element={<StartPage />} />
            <Route path='/exam-window' element={<ExamWindow />} />
            {/* <Route path="/exam-window/:examId" element={<ExamWindow />} /> */}
            <Route path='/submit-confirmation' element={<SubmitConfirmation />} />
            <Route path='/my-exams' element={<MyExams />} />
          </Route>

          {/* For Owners */}
          <Route path={`/private-dashboard/${privatePassId}`} element={<PrivateDashboard />} />
          <Route path={`/private-dashboard/${privatePassId}/admin-entry`} element={<AdminEntryForm />} />

          {/* Catch-all Route for 404 */}
          <Route path='*' element={<Home />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;