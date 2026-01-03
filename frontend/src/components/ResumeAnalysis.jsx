import React, { useState } from 'react'
import axios from "axios"
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ReactMarkdown from "react-markdown"

const ResumeAnalysis = () => {
  const [hoveredStrength, setHoveredStrength] = useState(null)
  const [hoveredWeakness, setHoveredWeakness] = useState(null)
  const [hoveredRec, setHoveredRec] = useState(null)
  const [loading, setLoading] = useState(false)

  const [apiData, setApiData] = useState({
    "summary": "",
    "strengths": [
    ],
    "weaknesses": [],
    "recommendations": []
  })
  const strengths = [
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!"
  ]

  const weaknesses = [
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!"
  ]

  const recommendations = [
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deserunt!"
  ]

  const analyze = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:3000/api/analyze")
      setApiData(res.data)
    } catch (error) {
      console.log("error occured", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={analyze}>Get Analysis</button>
      <div className='flex h-screen gap-4 bg-white'>
        <div className='w-2/5 h-full p-4 bg-white border-r border-slate-200'>
          <div className='h-full overflow-hidden border rounded-lg shadow-sm border-slate-200'>
            <iframe className='w-full h-full' src="./resume (1).pdf" frameBorder="0"></iframe>
          </div>
        </div>

        <div className='w-3/5 p-4 space-y-4 overflow-y-auto'>
          <div className="p-5 border rounded-lg bg-slate-50 border-slate-200">
            <h1 className="mb-3 text-2xl font-bold text-slate-900">
              Summary
            </h1>

            {loading ? (
              <Skeleton baseColor="#ebebeb" count={10} />
            ) : (
              <p className="text-sm leading-relaxed text-slate-600">
                <ReactMarkdown>{apiData.summary}</ReactMarkdown>
              </p>
            )}
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className="p-5 bg-white border rounded-lg border-slate-200">
              <h2 className="mb-3 text-xl font-bold text-slate-900">Strengths</h2>

              {loading ? (
                <ul className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <li key={i} className="p-2">
                      <Skeleton height={16} baseColor='#dcfce7' />
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  {apiData.strengths.map((strength, i) => (
                    <li
                      key={i}
                      onMouseEnter={() => setHoveredStrength(i)}
                      onMouseLeave={() => setHoveredStrength(null)}
                      className={`text-sm p-2 rounded cursor-pointer transition-all duration-200 ${hoveredStrength === i
                        ? "bg-green-50 text-slate-900 pl-3"
                        : "text-slate-600"
                        }`}
                    >
                      <ReactMarkdown>
                        {strength}
                      </ReactMarkdown>
                    </li>
                  ))}
                </ul>
              )}
            </div>


            <div className="p-5 bg-white border rounded-lg border-slate-200">
              <h2 className="mb-3 text-xl font-bold text-slate-900">Weaknesses</h2>

              {loading ? (
                <ul className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <li key={i} className="p-2">
                      <Skeleton height={16} baseColor='#ffedd5' />
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  {apiData.weaknesses.map((weakness, i) => (
                    <li
                      key={i}
                      onMouseEnter={() => setHoveredWeakness(i)}
                      onMouseLeave={() => setHoveredWeakness(null)}
                      className={`text-sm p-2 rounded cursor-pointer transition-all duration-200 ${hoveredWeakness === i
                        ? "bg-orange-50 text-slate-900 pl-3"
                        : "text-slate-600"
                        }`}
                    >
                      <ReactMarkdown>
                        {weakness}
                      </ReactMarkdown>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className='flex gap-4 bg-white border-t border-slate-200'>

        <div className="w-1/2 p-4">
          <div className="h-full p-5 bg-white border rounded-lg border-slate-200">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Recommendations
            </h2>

            {loading ? (
              <ul className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <li key={i} className="p-2">
                    <Skeleton height={16} direction='rtl' />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2">
                {apiData.recommendations.map((rec, i) => (

                  <li
                    key={i}
                    onMouseEnter={() => setHoveredRec(i)}
                    onMouseLeave={() => setHoveredRec(null)}
                    className={`text-sm p-2 rounded cursor-pointer transition-all duration-200 ${hoveredRec === i
                      ? "bg-blue-50 text-slate-900 pl-3"
                      : "text-slate-600"
                      }`}
                  >
                    <ReactMarkdown>{rec}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>


        <div className="w-1/2 p-4">
          <div className="flex flex-col h-full p-5 bg-white border shadow-sm rounded-xl border-slate-200">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Resources
            </h2>

            {/* Scrollable list */}
            <div className="space-y-4 overflow-y-auto pr-2 h-[320px]">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden border rounded-lg border-slate-200 bg-slate-50"
                >
                  {/* Responsive iframe */}
                  <div className="relative aspect-video">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src="https://www.youtube.com/embed/SqcY0GlETPk?controls=0"
                      title={`YouTube video ${i + 1}`}
                      allow=""
                      allowFullScreen
                    />
                  </div>

                  {/* Optional caption */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-slate-700">
                      Resume Optimization Tips
                    </p>
                    <p className="text-xs text-slate-500">
                      Improve ATS score & job fit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 border-t bg-slate-50 border-slate-200">
        <h2 className="mb-6 text-3xl font-bold text-center text-slate-900">
          30-Day Skill Improvement Roadmap
        </h2>

        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {/* Week 1 */}
          <div className="p-5 transition bg-white border rounded-xl border-slate-200 hover:shadow-md hover:bg-amber-100 hover:scale-105">
            <h3 className="mb-3 text-xl font-black text-slate-800">
              Week 1: Foundations & Core Strengthening
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>📌 Revise JavaScript fundamentals</li>
              <li>📌 React basics (hooks, state, props)</li>
              <li>📌 Easy DSA problems</li>
              <li>📌 Resume cleanup</li>
            </ul>
            <p className="mt-3 text-xs font-semibold text-amber-500">
              ⏱ 1.5h JS/React + 1h DSA + 30m revision
            </p>
          </div>

          {/* Week 2 */}
          <div className="p-5 transition bg-white border rounded-xl border-slate-200 hover:shadow-md hover:bg-amber-100 hover:scale-105">
            <h3 className="mb-3 text-xl font-black text-slate-800">
              Week 2: Backend & Problem Solving
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>📌 Node.js + Express</li>
              <li>📌 REST APIs & middleware</li>
              <li>📌 Hashing, sliding window</li>
              <li>📌 Build a CRUD API</li>
            </ul>
            <p className="mt-3 text-xs font-semibold text-amber-500">
              ⏱ 1.5h backend + 1h DSA + 30m notes
            </p>
          </div>

          {/* Week 3 */}
          <div className="p-5 transition bg-white border rounded-xl border-slate-200 hover:shadow-md hover:bg-amber-100 hover:scale-105">
            <h3 className="mb-3 text-xl font-black text-slate-800">
              Week 3: Projects & Real-world Skills
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>📌 Full-stack project</li>
              <li>📌 API integration</li>
              <li>📌 Tailwind UI polish</li>
              <li>📌 README & screenshots</li>
            </ul>
            <p className="mt-3 text-xs font-semibold text-amber-500">
              ⏱ 2h project + 1h polish + 30m review
            </p>
          </div>

          {/* Week 4 */}
          <div className="p-5 transition bg-white border rounded-xl border-slate-200 hover:shadow-md hover:bg-amber-100 hover:scale-105">
            <h3 className="mb-3 text-xl font-black text-slate-800">
              Week 4: Interview Readiness
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>📌 Medium DSA problems</li>
              <li>📌 Mock interviews</li>
              <li>📌 System design basics</li>
              <li>📌 Resume & LinkedIn</li>
            </ul>
            <p className="mt-3 text-xs font-semibold text-amber-500">
              ⏱ 1.5h DSA + 1h prep + 30m reflection
            </p>
          </div>

          {/* Outcome – spans full width on large screens */}
          <div className="p-5 border border-green-200 bg-green-50 rounded-xl lg:col-span-3 xl:col-span-4">
            <h3 className="mb-2 text-lg font-semibold text-green-800">
              🎯 Outcome After 30 Days
            </h3>
            <ul className="space-y-1 text-sm text-green-700">
              <li>✔ Strong fundamentals</li>
              <li>✔ 1 solid full-stack project</li>
              <li>✔ Better DSA confidence</li>
              <li>✔ Interview-ready resume</li>
            </ul>
          </div>
        </div>
      </div>


    </>
  )
}

export default ResumeAnalysis