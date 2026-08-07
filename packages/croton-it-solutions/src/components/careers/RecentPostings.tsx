import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// section wrapper marker added below

const jobs = [
  {
    country: "United States",
    title: "Test Engineer – Tosca & Telecom Domain IRC294638",
  },
  {
    country: "United States",
    title: "Trainee Internship IRC294463",
  },
  {
    country: "United States",
    title: "Sales Director for Industrial BU IRC290868",
  },
  {
    country: "United States",
    title: "Senior Data Engineer – PySpark & Python IRC290839",
  },
  {
    country: "United States",
    title: "Lead C++ System Engineer / Android IRC294161",
  },
  {
    country: "United States",
    title: "Senior Automation Engineer (Cypress/Playwright) IRC293241",
  },
  {
    country: "United States",
    title: "Senior Azure Architect IRC290930",
  },
  {
    country: "United States",
    title: "Shopify Architect IRC292882",
  },
  {
    country: "United States",
    title: "Cloud Solutions Engineer IRC294555",
  },
  {
    country: "United States",
    title: "Frontend Developer – React IRC294777",
  },
  {
    country: "United States",
    title: "Senior DevOps Engineer IRC294999",
  },
  {
    country: "United States",
    title: "Java Full Stack Engineer IRC295100",
  },
];

export default function RecentPostings() {
  return (
    <section
      id="postings"
      data-section="postings"
      data-label="Openings"
      className="bg-[#545C78] text-white min-h-screen"
    >
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="grid lg:grid-cols-[420px_1fr] gap-10">
          {/* Left Section */}
          <div className="sticky top-0 h-screen flex flex-col justify-center">
            <h2 className="text-5xl md:text-6xl font-medium mb-8 leading-tight">Newest Postings</h2>

            <p className="text-white/80 text-xl mb-10 max-w-sm leading-relaxed">
              Explore the latest opportunities in GlobalLogic
            </p>

            <Link
              to="/careers"
              className="inline-flex items-center gap-3 text-2xl font-semibold hover:text-orange-400 transition"
            >
              Explore more vacancies
              <ArrowRight className="w-7 h-7" />
            </Link>
          </div>

          {/* Right Scrollable Jobs */}
          <div data-lenis-prevent className="h-screen overflow-y-auto py-10 pr-3 scrollable">
            <div className="grid sm:grid-cols-2 gap-5">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="group relative bg-[#5B6381] hover:bg-[#ff5f2e] transition-all duration-300 p-8 min-h-[190px] cursor-pointer"
                >
                  <p className="text-sm text-white/80 mb-6">{job.country}</p>

                  <h3 className="text-2xl font-medium leading-snug max-w-[85%]">{job.title}</h3>

                  <ArrowRight className="absolute top-8 right-8 w-7 h-7 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
