// src/components/JobsTable.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming react-router for navigation
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

const JobsTable = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from SQLite database (pseudo-code, replace with actual data fetching logic)
    const fetchData = async () => {
      const data = await fetchJobsFromDatabase(); // Implement this function to fetch jobs
      setJobs(data);
    };
    
    fetchData();
  }, []);

  const handleRowClick = (jobId) => {
    // Navigate to job details page or process flow, replace '/job-details' with actual path
    navigate(`/job-details/${jobId}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>MPRN</TableCell>
            <TableCell>Job Type</TableCell>
            <TableCell>Postcode</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id} hover onClick={() => handleRowClick(job.id)}>
              <TableCell>{job.mprn}</TableCell>
              <TableCell>{job.jobType}</TableCell>
              <TableCell>{job.postcode}</TableCell>
              <TableCell>{job.startDate}</TableCell>
              <TableCell>{job.startTime}</TableCell>
              <TableCell>{job.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default JobsTable;

// Note: Ensure you have a router setup to handle '/job-details/:jobId' route
