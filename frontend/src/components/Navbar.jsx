import React from 'react'
import { NavLink } from 'react-router-dom'
const Navbar = () => {
    return (
        <>
            {/* Top Navbar */}
            <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
                <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
                    <div className="text-2xl font-bold tracking-tight text-yellow-500">
                        <NavLink to="/">Resume-pe-Charcha</NavLink>
                    </div>

                    <NavLink
                        to="/signup"
                        className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-yellow-500 rounded-lg hover:bg-yellow-400"
                    >
                        Sign Up
                    </NavLink>
                </div>
            </nav>

            {/* Secondary Navigation */}
            <nav className="border-b border-slate-200 bg-slate-50">
                <ul className="flex gap-8 px-6 py-3 mx-auto text-sm font-medium max-w-7xl text-slate-600">
                    {[
                        { name: "Resume Analysis", path: "/resume_analysis" },
                        { name: "Job Fit Check", path: "/fitcheck" },
                        { name: "My Resumes", path: "/resumes" },
                    ].map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `relative transition-all duration-200 hover:text-slate-900
                  ${isActive
                                        ? "text-slate-900 font-semibold after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-yellow-500"
                                        : ""
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    )
}

export default Navbar
