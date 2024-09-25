import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setSingleJob } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const JobDescription = () => {
  const {singleJob} = useSelector(store => store.job)
  const {user} = useSelector(store => store.auth)
  const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false
  const [isApplied, setIsApplied] = useState(isInitiallyApplied)

  const params = useParams()
  const jobId = params.id
  const dispatch = useDispatch()

  const applyJobHandler = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials: true})
        console.log(res.data);
        if(res.data.success){
          setIsApplied(true)
          const updatedSingleJob = {...singleJob, applications: [...singleJob.applications, {applicant:user?._id}]}
          dispatch(setSingleJob(updatedSingleJob))
          toast.success(res.data.message)
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
      }
  }

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id))
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleJob?.title}</h1>
          <div className="flex items-center gap-2 mt-5">
            <Badge className="text-blue-700 font-bold" variant="ghost">
              {singleJob?.position} Positions
            </Badge>
            <Badge className="text-[#f83002] font-bold" variant="ghost">
              {singleJob?.jobType}
            </Badge>
            <Badge className="text-[#7209b7] font-bold" variant="ghost">
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>
        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`rounded-lg ${
            isApplied
              ? "bg-black cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied ? "Already applied" : "Apply Now"}
        </Button>
      </div>
      <h1 className="border-b-2 border-b-gray-300 font-medium py-5">Job Description</h1>
      <div className="my-4">
          <h1 className="font-bold my-2">Role: <span className="font-medium pl-3 text-gray-700">{singleJob?.title}</span></h1>
          <h1 className="font-bold my-2">Location: <span className="font-medium pl-3 text-gray-700">{singleJob?.location}</span></h1>
          <h1 className="font-bold my-2">Description: <span className="font-medium pl-3 text-gray-700">{singleJob?.description}</span></h1>
          <h1 className="font-bold my-2">Experience: <span className="font-medium pl-3 text-gray-700">{singleJob?.experience} years</span></h1>
          <h1 className="font-bold my-2">Salary: <span className="font-medium pl-3 text-gray-700">{singleJob?.salary} LPA</span></h1>
          <h1 className="font-bold my-2">Total Applicants: <span className="font-medium pl-3 text-gray-700">{singleJob?.applications?.length}</span></h1>
          <h1 className="font-bold my-2">Posted at: <span className="font-medium pl-3 text-gray-700">{singleJob?.createdAt.split("T")[0]}</span></h1>
      </div>
    </div>
  );
};

export default JobDescription;