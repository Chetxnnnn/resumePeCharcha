import React, { useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { toast } from "react-toastify";

const MyResumes = () => {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:3000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!res.data.path) {
        toast.error("File not uploaded successfully");
        return;
      }

      const fileUrl = `http://localhost:3000${res.data.path}`;

      setResumes((prev) => [
        ...prev,
        { name: file.name, path: fileUrl },
      ]);

      toast.success("File uploaded successfully");
      setFile(null);
    } catch (error) {
      toast.error("Error uploading file");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      {/* Upload Section */}
      <div className="flex items-center max-w-md gap-3 p-4 mx-auto mb-8 bg-white border shadow-sm rounded-xl border-slate-200">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm cursor-pointer text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-yellow-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-yellow-700 hover:file:bg-yellow-100"
        />

        <Button
          variant="contained"
          onClick={handleFileUpload}
          className="!bg-yellow-500 !font-bold hover:!bg-yellow-400"
        >
          Upload
        </Button>
      </div>

      {/* Resumes Grid */}
      {resumes.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            My Resumes
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {resumes.map((resume, index) => (
              <div
                key={index}
                className="flex flex-col justify-between p-4 transition bg-white border shadow-sm group rounded-xl border-slate-200 hover:shadow-md hover:border-slate-300"
              >
                <div>
                  <h3 className="mb-2 text-sm font-semibold truncate text-slate-800">
                    {resume.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    PDF Document
                  </p>
                </div>

                <a
                  href={resume.path}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-3 py-2 mt-4 text-sm font-medium transition rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  View Resume
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyResumes;
