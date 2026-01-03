import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { NavLink, Routes, Route } from "react-router-dom";

import ResumeAnalysis from "./components/ResumeAnalysis";
import JobFitCheck from "./components/JobFitCheck";
import MyResumes from "./components/MyResumes";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar/>

      {/* Main Content */}
      <main className="px-6 py-6 mx-auto max-w-7xl">
        <Routes>
          <Route
            path="/"
            element={
              <div className="mt-20 text-center">
                <h1 className="text-3xl font-semibold text-slate-800">
                  Welcome 👋
                </h1>
                <p className="mt-2 text-slate-500">
                  Upload your resume and get instant insights.
                </p>
              </div>
            }
          />
          <Route path="/resume_analysis" element={<ResumeAnalysis />} />
          <Route path="/fitcheck" element={<JobFitCheck />} />
          <Route path="/resumes" element={<MyResumes />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      <ToastContainer />
    </>
  );
};

export default App;
