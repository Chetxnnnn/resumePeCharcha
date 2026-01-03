import React, { useState } from "react";
import PercentageCard from "./percentageCard";
import Button from "@mui/material/Button";
import axios from "axios";
import { toast } from "react-toastify";
import ListAnalysisSection from './ListAnalysisSection';
import TagListSection from './TagListSection';
import supabase from "../../utils/supabase";

/* Dummy section to force scroll */


const JobFitCheck = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [apiResponse, setApiResponse] = useState(null);

  const [step, setStep] = useState("upload"); // upload | uploaded | result
  const [loading, setLoading] = useState(false);

  const [skills, setSkills] = useState([]);
  const [experienceAnalysis, setExperienceAnalysis] = useState([]);
  const [keyword, setKeyword] = useState([]);
  const [recc, setRecc] = useState([]);
  const [valid, setValid] = useState(true);
  const [ats, setAts] = useState(null)
  const [skillMatch, setSkillMatch] = useState(null)
  const [experienceMatch, setExperienceMatch] = useState(null)
  const [chance, setChance] = useState(null)


  const DummySection = ({ title, array }) => (
    <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
      <h3 className="mb-2 font-semibold text-md text-slate-800">{title}</h3>

      <div className="flex flex-wrap gap-2">
        {array?.map((item, index) => (
          <span
            key={index}
            className="px-3 py-1 text-sm font-medium rounded-full bg-slate-200 text-slate-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );

  /* ---------------- Upload Resume ---------------- */
  const handleFileUpload = async () => {
    if (!file || !jd) {
      toast.error("Please add job description and resume");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        BACKEND_URL + "/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log();

      const safeFileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

      const { data, error } = await supabase
        .storage
        .from("resumes")
        .upload(safeFileName, file, {
          contentType: "application/pdf",
        });

      if (error) {
        console.error("Supabase upload error:", error);
        toast.error("Supabase upload failed");
        return;
      }

      const publicUrl = supabase
        .storage
        .from("resumes")
        .getPublicUrl(safeFileName).data.publicUrl;

      console.log("Public Resume URL:", publicUrl);
      


      if (!res.data.path) {
        toast.error("File upload failed");
        return;
      }
      console.log(res.data);

      const fileUrl = `${res.data.path}`;

      setPdfUrl(publicUrl);
      setResumeUrl(res.data.path);
      setStep("uploaded");

      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error uploading resume");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Check Job Fit ---------------- */
  const handleCheck = async () => {
    try {
      setLoading(true);

      const res = await axios.post(BACKEND_URL + "/api/check", {
        jd,
        resume: pdfUrl,
      });
      console.log(res.data);

      setChance(res.data.chance)
      setAts(res.data.ats)
      setSkillMatch(res.data.skillMatch)
      setExperienceMatch(res.data.experienceMatch)
      setSkills(res.data.candidateSkills)
      setExperienceAnalysis(res.data.experienceAnalysis)
      setKeyword(res.data.keywordCoverage)
      setRecc(res.data.finalRecomendation)
      setApiResponse(res.data);
      setValid(res.data.isResume)
      setStep("result");
      if (!valid) {
        toast.error("Please upload a valid resume")
        return
      }
      else
        toast.success("Job fit analysis complete");
    } catch (error) {
      console.error(error);
      toast.error("Error checking job fit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= UPLOAD STEP ================= */}
      {step === "upload" && (
        <div className="max-w-md mx-auto my-8 space-y-4">

          {/* Upload Card */}
          <div className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm border-slate-200">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm cursor-pointer text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-yellow-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-yellow-700 hover:file:bg-yellow-100"
            />

            <Button
              variant="contained"
              disabled={!jd || !file || loading}
              onClick={handleFileUpload}
              className="!bg-green-500 hover:!bg-green-400 !font-bold"
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>

          {/* Job Description */}
          <div className="p-4 bg-white border rounded-lg shadow-sm border-slate-200">
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Job Description <span className="text-red-400">*</span>
            </label>

            <textarea
              required
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste job description here..."
              rows={4}
              className="w-full px-3 py-2 text-sm border rounded-md resize-none border-slate-300 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
      )}

      {/* ================= AFTER UPLOAD ================= */}
      {step === "uploaded" && (
        <div className="max-w-md mx-auto my-8 space-y-4">
          <div className="p-4 bg-white border rounded-lg shadow-sm border-slate-200">
            <p className="mb-3 text-sm text-slate-700">
              ✅ Resume uploaded successfully
            </p>

            <Button
              variant="contained"
              onClick={handleCheck}
              disabled={loading}
              className="!bg-green-500 hover:!bg-green-400 !font-bold"
            >
              {loading ? "Checking..." : "Check Job Fit"}
            </Button>
          </div>
        </div>
      )}

      {/* ================= RESULT LAYOUT ================= */}
      {step === "result" && (
        <div className="flex gap-4 p-4">

          {/* Left: Resume */}
          <div className="w-2/5">
            <div className="sticky top-4 h-[calc(100vh-2rem)] p-4 bg-white border shadow-sm rounded-xl border-slate-200">
              <iframe
                src={BACKEND_URL + "" + pdfUrl}
                className="w-full h-full border rounded-lg"
                title="Resume Preview"
              />
            </div>
          </div>

          {/* Right: Analysis */}
          <div className="flex-1 h-[calc(100vh-2rem)] overflow-y-auto pr-2">
            <div className="flex flex-col gap-4">

              <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
                <h2 className="mb-4 text-lg font-semibold text-slate-800">
                  Job Fit Analysis
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <PercentageCard title="Overall Fit" score={ats + "%"} color="sky" />
                  <PercentageCard title="Skill Match" score={skillMatch + "%"} color="emerald" />
                  <PercentageCard title="Risk Factors" score={chance + "%"} color="danger" />
                  <PercentageCard title="Experience Match" score={experienceMatch + "%"} color="warning" />
                </div>
              </div>
              <TagListSection
                title="Skills Breakdown"
                items={skills}
              />
              <ListAnalysisSection
                title="Experience Analysis"
                items={experienceAnalysis}
              />
              <TagListSection
                title="Keyword Coverage"
                items={keyword}
              />
              <ListAnalysisSection
                title="Final Recommendation"
                items={recc}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFitCheck;
