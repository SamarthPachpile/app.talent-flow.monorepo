import React, { useState, useMemo } from "react";
import { Eye, RotateCcw } from "lucide-react";
import { AppliedJob, StageId } from "../../types/candidate";
import { EmptyJobsIllustration } from "../EmptyJobsIllustration";

interface DashboardJobListViewProps {
  appliedJobs: AppliedJob[];
  onBrowseJobs?: () => void;
  onNavigateToStage?: (stageId: StageId) => void;
  onAddJob?: (newJob: AppliedJob) => void;
  onSelectJobForFullPage: (job: AppliedJob) => void;
}

export const DashboardJobListView: React.FC<DashboardJobListViewProps> = ({
  appliedJobs = [],
  onBrowseJobs,
  onSelectJobForFullPage,
}) => {
  // Search Filters
  const [keywordInput, setKeywordInput] = useState<string>("");
  const [locationInput, setLocationInput] = useState<string>("");
  const [countryInput, setCountryInput] = useState<string>("");

  const [activeKeyword, setActiveKeyword] = useState<string>("");
  const [activeLocation, setActiveLocation] = useState<string>("");
  const [activeCountry, setActiveCountry] = useState<string>("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveKeyword(keywordInput.trim());
    setActiveLocation(locationInput.trim());
    setActiveCountry(countryInput.trim());
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setKeywordInput("");
    setLocationInput("");
    setCountryInput("");
    setActiveKeyword("");
    setActiveLocation("");
    setActiveCountry("");
    setCurrentPage(1);
  };

  const isFiltered = Boolean(activeKeyword || activeLocation || activeCountry);

  // Filter Jobs
  const filteredJobs = useMemo(() => {
    return appliedJobs.filter((job) => {
      const matchKeyword =
        !activeKeyword ||
        job.jobTitle.toLowerCase().includes(activeKeyword.toLowerCase()) ||
        (job.department && job.department.toLowerCase().includes(activeKeyword.toLowerCase())) ||
        (job.jobCode && job.jobCode.toLowerCase().includes(activeKeyword.toLowerCase()));

      const matchLocation =
        !activeLocation || job.location.toLowerCase().includes(activeLocation.toLowerCase());

      const matchCountry =
        !activeCountry ||
        (job.country && job.country.toLowerCase().includes(activeCountry.toLowerCase())) ||
        job.location.toLowerCase().includes(activeCountry.toLowerCase());

      return matchKeyword && matchLocation && matchCountry;
    });
  }, [appliedJobs, activeKeyword, activeLocation, activeCountry]);

  // Paginated Slices
  const totalRecords = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  const displayStartRecord = totalRecords === 0 ? 0 : startIndex + 1;
  const displayEndRecord = endIndex;

  const handleViewJob = (job: AppliedJob) => {
    onSelectJobForFullPage(job);
  };

  return (
    <div className="space-y-3.5 animate-fadeIn">
      {/* 1. Search Jobs Box */}
      <div className="bg-white dark:bg-slate-850 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4 transition-all">
        <h2 className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-100 tracking-tight mb-2.5">
          Search Jobs
        </h2>

        <form
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-center"
        >
          {/* Keyword Input */}
          <div className="relative">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Keyword"
              className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00c0ef] focus:border-[#00c0ef] transition-colors"
            />
          </div>

          {/* Location Input */}
          <div className="relative">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Location"
              className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00c0ef] focus:border-[#00c0ef] transition-colors"
            />
          </div>

          {/* Country Input */}
          <div className="relative">
            <input
              type="text"
              value={countryInput}
              onChange={(e) => setCountryInput(e.target.value)}
              placeholder="Country"
              className="w-full h-8 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00c0ef] focus:border-[#00c0ef] transition-colors"
            />
          </div>

          {/* Search Action Button */}
          <div className="flex items-center gap-1.5">
            <button
              type="submit"
              className="flex-1 h-8 px-4 bg-[#00c0ef] hover:bg-[#00abdc] active:bg-[#009ac6] text-white font-medium text-xs rounded shadow-2xs transition-colors flex items-center justify-center cursor-pointer"
            >
              <span>Search</span>
            </button>

            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                title="Reset Filters"
                className="h-8 px-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold rounded transition-colors flex items-center justify-center cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 2. Job List Box */}
      <div className="bg-white dark:bg-slate-850 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs p-3.5 sm:p-4 transition-all space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h2 className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            Job List
          </h2>

          {/* Optional Quick Browse Action */}
          {onBrowseJobs && (
            <button
              onClick={onBrowseJobs}
              className="text-[11px] font-semibold text-[#00c0ef] hover:text-[#00abdc] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Openings</span>
            </button>
          )}
        </div>

        {/* If no jobs applied / no matches found -> Show Illustration with Title & Description */}
        {filteredJobs.length === 0 ? (
          <EmptyJobsIllustration
            title={isFiltered ? "No Matching Jobs Found" : "No Applied Jobs Found"}
            description={
              isFiltered
                ? "No applications matched your keyword, location, or country filters. Try adjusting your query or resetting filters."
                : "You haven't submitted any job applications for this company yet. Explore our open positions and find the role that matches your skills and aspirations."
            }
            onAction={onBrowseJobs}
            actionText="Explore Available Roles"
            isFiltered={isFiltered}
            onResetFilters={handleResetFilters}
          />
        ) : (
          <>
            {/* Responsive Table Container */}
            <div className="overflow-x-auto -mx-3.5 sm:-mx-4 px-3.5 sm:px-4">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700/80 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                    <th className="py-2 px-2.5 font-semibold text-slate-800 dark:text-slate-200">
                      Job Title
                    </th>
                    <th className="py-2 px-2.5 font-semibold text-slate-800 dark:text-slate-200">
                      Location
                    </th>
                    <th className="py-2 px-2.5 font-semibold text-slate-800 dark:text-slate-200">
                      Applied On
                    </th>
                    <th className="py-2 px-2.5 font-semibold text-slate-800 dark:text-slate-200">
                      Status
                    </th>
                    <th className="py-2 px-2.5 font-semibold text-slate-800 dark:text-slate-200">
                      Interview Date
                    </th>
                    <th className="py-2 px-2.5 font-semibold text-slate-800 dark:text-slate-200 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  {paginatedJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      {/* Job Title */}
                      <td className="py-2 px-2.5 font-normal text-slate-700 dark:text-slate-200">
                        <span
                          className="font-medium hover:text-[#00c0ef] transition-colors cursor-pointer"
                          onClick={() => handleViewJob(job)}
                        >
                          {job.jobTitle}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-2 px-2.5 text-slate-600 dark:text-slate-300">
                        {job.location || "-"}
                      </td>

                      {/* Applied On */}
                      <td className="py-2 px-2.5 text-slate-600 dark:text-slate-300">
                        {job.appliedDate || "-"}
                      </td>

                      {/* Status Badge */}
                      <td className="py-2 px-2.5">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wide text-white bg-[#28a745] shadow-2xs">
                          {job.status}
                        </span>
                      </td>

                      {/* Interview Date */}
                      <td className="py-2 px-2.5 text-slate-600 dark:text-slate-300 font-sans">
                        {job.interviewDate || "-"}
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-2.5 text-center">
                        <button
                          onClick={() => handleViewJob(job)}
                          title="View Application Details"
                          className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 inline-flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
                          aria-label={`View ${job.jobTitle}`}
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer: Total Badge & Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              {/* Cyan Total Record Pill Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#00c0ef] text-white text-[10.5px] font-semibold tracking-normal shadow-2xs">
                Total : {totalRecords} Record: {displayStartRecord} to {displayEndRecord}
              </div>

              {/* Pagination Nav */}
              <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                {/* First Page */}
                {totalPages > 1 && (
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={validCurrentPage === 1}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer text-slate-500"
                    title="First Page"
                  >
                    «
                  </button>
                )}

                {/* Prev Page */}
                {totalPages > 1 && (
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={validCurrentPage === 1}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer text-slate-500"
                    title="Previous Page"
                  >
                    ‹
                  </button>
                )}

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-6 h-6 rounded-full text-[11px] font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      validCurrentPage === pageNum
                        ? "bg-[#00c0ef] text-white shadow-2xs"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next Page */}
                {totalPages > 1 && (
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={validCurrentPage === totalPages}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer text-slate-500"
                    title="Next Page"
                  >
                    ›
                  </button>
                )}

                {/* Last Page */}
                {totalPages > 1 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={validCurrentPage === totalPages}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer text-slate-500"
                    title="Last Page"
                  >
                    »
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
