import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How do I apply for a vacancy?",
    a: "You can explore our current openings directly on the careers page. Each role includes detailed information about responsibilities and requirements. Once you find a suitable position, submit your application through the form provided. Our team reviews every application carefully and will reach out if your profile matches the role.",
  },
  {
    q: "Can I submit an unsolicited application if there’s no suitable job for me?",
    a: "Yes, you can share your resume and a brief introduction about your skills and interests. We keep unsolicited applications on file and may contact you when a relevant opportunity becomes available in the future.",
  },
  {
    q: "Can I apply for more than one job?",
    a: "Yes, you’re welcome to apply for multiple roles if they align with your skills. However, we recommend focusing on positions that best match your experience and tailoring your application accordingly.",
  },
  {
    q: "Are there opportunities available for interns or recent graduates?",
    a: "Yes, we offer internships and entry-level roles for students and recent graduates. These roles are designed to provide practical experience, mentorship, and a pathway to full-time opportunities.",
  },
  {
    q: "Do you offer remote or hybrid work options?",
    a: "Many of our roles support remote or hybrid work depending on the team and project requirements. Specific details are mentioned in each job description.",
  },
  {
    q: "What is your hiring process like?",
    a: "Our hiring process typically includes an initial screening, one or more technical or functional interviews, and a final discussion. The exact steps may vary depending on the role.",
  },
  {
    q: "How long does the hiring process take?",
    a: "The process usually takes between 1 to 3 weeks, depending on the role and candidate availability. We aim to keep candidates informed at every stage.",
  },
  {
    q: "Will I receive feedback after my interview?",
    a: "Yes, we strive to provide constructive feedback whenever possible, especially for candidates who reach advanced stages of the interview process.",
  },
  {
    q: "What qualities do you look for in candidates?",
    a: "We look for individuals who demonstrate strong problem-solving skills, a growth mindset, collaboration, and alignment with our values. Role-specific skills are equally important.",
  },
  {
    q: "Do you provide relocation support?",
    a: "Yes, relocation assistance may be offered for certain roles that require on-site presence. Details are shared during the hiring process.",
  },
  {
    q: "What kind of work environment can I expect?",
    a: "We foster a collaborative, inclusive, and growth-oriented environment where employees are encouraged to share ideas, take ownership, and continuously learn.",
  },
  {
    q: "Do you support learning and development?",
    a: "Yes, we provide access to learning resources, certifications, workshops, and mentorship programs to help employees grow professionally.",
  },
  {
    q: "What benefits do you offer employees?",
    a: "Our benefits include competitive compensation, flexible work arrangements, health benefits, paid time off, and learning opportunities. Specific benefits may vary by role and location.",
  },
  {
    q: "Is there a probation period?",
    a: "Yes, most roles include a probation period during which both the employee and the company assess mutual fit and performance.",
  },
  {
    q: "Can I reapply if I was not selected previously?",
    a: "Yes, you are encouraged to reapply for roles that match your updated skills and experience. Many candidates succeed in future applications.",
  },
  {
    q: "Do you hire international candidates?",
    a: "We consider international candidates for certain roles, depending on legal requirements and work authorization policies.",
  },
  {
    q: "What is the expected notice period for joining?",
    a: "We are flexible with notice periods and try to accommodate candidates’ current commitments wherever possible.",
  },
  {
    q: "How do you ensure diversity and inclusion?",
    a: "We are committed to building a diverse and inclusive workplace where everyone feels valued and respected. Our hiring and workplace practices reflect this commitment.",
  },
  {
    q: "Can I connect with the team before applying?",
    a: "While we encourage applications through official channels, you can follow us on our platforms to learn more about our culture and team.",
  },
  {
    q: "Who can I contact for further questions?",
    a: "If you have additional questions, you can reach out to our careers team via email. We’re happy to assist and provide more information.",
  },
];

export default function CareersFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      id="faq"
      data-section="faq"
      data-label="FAQ"
      className="max-w-[1500px] mx-auto px-6 py-24"
    >
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between gap-10 mb-16">
        <div>
          <p className="text-sm text-gray-500 mb-4">Frequently asked questions</p>

          <h2 className="text-4xl sm:text-6xl text-gray-900 leading-tight">
            We answer your questions
          </h2>
        </div>

        <p className="text-gray-500 max-w-sm text-base leading-relaxed">
          Explore answers to some of the most frequently asked questions.
        </p>
      </div>

      {/* FAQ List */}
      <div className="border-t border-gray-300">
        {FAQS.map((f, i) => (
          <div key={f.q} className="border-b border-gray-300">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex justify-between items-center py-6 text-left"
            >
              <span className="text-2xl sm:text-3xl text-gray-900 font-medium">{f.q}</span>

              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                  openFaq === i ? "rotate-180" : ""
                }`}
              />
            </button>

            {openFaq === i && (
              <div className="pb-6 pr-10">
                <p className="text-gray-600 leading-relaxed">{f.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
