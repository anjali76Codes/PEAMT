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
import StartPage from './pages/Exam_Section/StartPage';
import SubmitConfirmation from "./pages/Exam_Section/SubmitConfirmation";

import './index.css';


import ExamWindow from "./pages/Exam_Section/ExamWindow";
import UserDashboard from "./pages/Users/UserDashboard";


function App() {
  const privatePassId = import.meta.env.VITE_PRIVATE_DASHBOARD_ID;

  return (
    <BrowserRouter>
      <Header />
      <div className='pt-20'> {/* Adjusted padding-top to match header height */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/admin-dashboard' element={<AdminDashboard />} />

          {/* for owners */}
          <Route path={`/private-dashboard/${privatePassId}`} element={<PrivateDashboard />} />
          <Route path={`/private-dashboard/${privatePassId}/admin-entry`} element={<AdminEntryForm />} />

          <Route element={<PrivateRoute />}>
            {/* For the user */}
            <Route path='/profile' element={<Profile />} />
            <Route path='/registration-form' element={<RegistrationForm />} />
            <Route path='/user-dashboard' element={<UserDashboard />} />

            {/* Exam section part */}
            <Route path="/start" element={<StartPage />} />
            <Route path='/exam-section' element={<ExamWindow />} />
            <Route path='/submit-confirmation' element={<SubmitConfirmation />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
