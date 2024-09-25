import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";

const shortListingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, {status}, {withCredentials: true})
      if(res.data.success){
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  return (
    <div>
      <Table>
        <TableCaption>List of the applicants</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact No.</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date of Application</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants &&
            applicants?.applications?.map((item) => (
              <tr key={item._id}>
                <TableCell>{item?.applicant?.fullname}</TableCell>
                <TableCell>{item?.applicant?.email}</TableCell>
                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                <TableCell>
                  {item.applicant?.profile.resume ? (
                    <Link
                      to={item?.applicant?.profile?.resume}
                      style={{ textDecoration: "none", color: "blue", cursor: 'pointer' }}
                      target="_blank"
                      rel="noopener norefferer"
                    >
                      {item?.applicant?.profile?.resumeOriginalName}
                    </Link>
                  ) : (
                    <span>No Resume</span>
                  )}
                </TableCell>
                <TableCell>
                  {item?.applicant?.createdAt.split("T")[0]}
                </TableCell>
                <TableCell className="float-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      {shortListingStatus.map((status, index) => {
                        return (
                          <div
                            onClick={() => statusHandler(status, item?._id)}
                            key={index}
                            className="flex items-center my-2 w-fit cursor-pointer"
                          >
                            <span>{status}</span>
                          </div>
                        );
                      })}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </tr>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;