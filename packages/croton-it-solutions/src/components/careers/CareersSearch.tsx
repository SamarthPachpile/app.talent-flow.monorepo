export default function CareersSearch() {
  return (
    <section className=" py-16 px-4">
      <div className="clip-path-card max-w-7xl mx-auto bg-[#f1f2f4] rounded-3xl p-10 relative">
        {/* Badge */}
        <div className="absolute top-8 right-8 bg-[#e6ea9c] text-sm px-5 py-2 rounded-full font-medium">
          784 Open positions
        </div>

        {/* Heading */}
        <h1 className="text-7xl text-[#1c1f2a] mb-4">Find your match</h1>

        <p className="text-gray-600 text-xl mb-10">
          Explore exciting career opportunities in GlobalLogic
        </p>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Skills or Job title"
          className="w-full bg-white mb-6 px-5 py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select className="px-5 py-4 bg-white rounded-lg border border-gray-200 text-gray-600">
            <option>Select Experience</option>
          </select>

          <select className="px-5 py-4 rounded-lg bg-white border border-gray-200 text-gray-600">
            <option>Select Location</option>
          </select>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6 text-gray-700">
            {["Freelance", "Remote", "Hybrid", "On Site"].map((item) => (
              <label key={item} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                {item}
              </label>
            ))}
          </div>

          {/* CTA */}
          <button className="flex items-center gap-2 text-lg font-medium text-black group">
            Search jobs
            <span className="text-orange-500 text-xl group-hover:translate-x-1 transition">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
