import { Search } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [query, setQuery] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query))
    navigate("/browse")
  }

  return (
    <div className="text-center">
      <div className="flex flex-col gap-5 my-10">
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#f83002] font-medium">
          No. 1 Job Searching Website
        </span>
        <motion.h1 
          initial={{ opacity: 0, y: 100 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="text-5xl font-bold"
        >
          Search, Apply & <br />
          Get Your <span className="text-[#6a38c2]">Dream Jobs</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 100 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeInOut' }}
        >
          Discover your dream job today! Our platform connects talented professionals with exciting opportunities. Browse thousands of listings,<br /> upload your resume, and get matched with companies that align with your career goals. Start your job search now and find your perfect fit.
        </motion.p>
      </div>
      <div className="w-[40%] flex shadow-lg border border-gray-300 pl-3 rounded-full items-center gap-4 mx-auto mt-3">
        <input 
            type="text" 
            placeholder="Find your dream jobs"
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-full"
        />
        <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6a38c2]">
            <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;