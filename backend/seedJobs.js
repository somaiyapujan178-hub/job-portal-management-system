const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Job = require("./models/JobRoutes");
const Application = require("./models/ApplicationRoutes");

dotenv.config();

const jobs = [
  {
    title: "Software Engineer",
    company: "Infosys Limited",
    location: "Bengaluru, India",
    salary: "₹12L - ₹18L",
    type: "",
    description: "Build scalable web applications, collaborate with product teams, and deliver high-quality software features.",
    facilities: [
      "Health insurance coverage",
      "Employee stock option plan",
      "Learning & development programs",
      "Gym and wellness facilities",
    ],
    postedBy: "Infosys Limited",
  },
  {
    title: "Chemical Engineer",
    company: "Reliance Industries Limited",
    location: "Mumbai, India",
    salary: "₹9L - ₹12L",
    type: "",
    description: "Design and optimize chemical processes, support plant operations, and improve materials production efficiency.",
    facilities: [
      "On-site laboratory facilities",
      "Safety training and certifications",
      "Process simulation tools",
      "Canteen and company transportation",
    ],
    postedBy: "Reliance Industries Limited",
  },
  {
    title: "Mechanical Engineer",
    company: "Adani Enterprises Limited",
    location: "Pune, India",
    salary: "₹8L - ₹11L",
    type: "",
    description: "Develop mechanical systems, perform CAD design, and support manufacturing improvements for aerospace products.",
    facilities: [
      "Advanced R&D workshop",
      "3D printing and prototyping lab",
      "Design software licenses",
      "Mentorship and career guidance",
    ],
    postedBy: "Adani Enterprises Limited",
  },
  {
    title: "Data Scientist",
    company: "Amazon.com, Inc.",
    location: "Hyderabad, India",
    salary: "₹16L - ₹22L",
    type: "",
    description: "Analyze complex data sets, build predictive models, and deliver actionable insights for business growth.",
    facilities: [
      "Cloud computing credits",
      "Data visualization platforms",
      "Research and analytics lab",
      "Flexible work environment",
    ],
    postedBy: "Amazon.com, Inc.",
  },
  {
    title: "Product Manager",
    company: "Pulse Creative Solutions Private Limited",
    location: "Noida, India",
    salary: "₹14L - ₹20L",
    type: "",
    description: "Lead product strategy, define roadmaps, and work with engineering teams to launch customer-focused solutions.",
    postedBy: "Pulse Creative Solutions Private Limited",
  },
  {
    title: "DevOps Engineer",
    company: "Nexa Solutions Private Limited",
    location: "Gurgaon, India",
    salary: "₹11L - ₹17L",
    type: "",
    description: "Automate deployment pipelines, monitor infrastructure, and maintain reliable cloud systems.",
    postedBy: "Nexa Solutions Private Limited",
  },
  {
    title: "Civil Engineer",
    company: "BridgePoint Design Limited",
    location: "Chennai, India",
    salary: "₹7L - ₹10L",
    type: "",
    description: "Plan infrastructure projects, develop structural designs, and collaborate with field teams to ensure safe builds.",
    postedBy: "BridgePoint Design Limited",
  },
  {
    title: "Marketing Manager",
    company: "BrightWave Labs LLC",
    location: "Remote, India",
    salary: "₹8L - ₹12L",
    type: "",
    description: "Create campaign strategies, manage digital channels, and grow brand awareness through data-driven marketing.",
    postedBy: "BrightWave Labs LLC",
  },
  {
    title: "HR Coordinator",
    company: "ModoTech Inc.",
    location: "Ahmedabad, India",
    salary: "₹5L - ₹8L",
    type: "",
    description: "Support recruitment, onboarding, and employee communications across a growing technology team.",
    postedBy: "ModoTech Inc.",
  },
  {
    title: "Finance Analyst",
    company: "SecureNet Corporation",
    location: "Kolkata, India",
    salary: "₹9L - ₹13L",
    type: "",
    description: "Build financial models, track business performance, and help guide strategic planning decisions.",
    postedBy: "SecureNet Corporation",
  },
];

const seedJobs = async () => {
  try {
    await connectDB();
    await Job.deleteMany({});
    await Application.deleteMany({});

    const created = await Job.create(jobs);
    console.log(`Seeded ${created.length} jobs.`);

    const applicationTemplates = [
      {
        jobTitle: "Software Engineer",
        applicantName: "Aarav Singh",
        applicantEmail: "aarav.singh@example.com",
        message: "Excited to build products with JobSphere Labs and improve the platform experience.",
        resumeUrl: "https://example.com/resumes/aarav-singh.pdf",
        status: "Submitted",
      },
      {
        jobTitle: "Chemical Engineer",
        applicantName: "Neha Patel",
        applicantEmail: "neha.patel@example.com",
        message: "I have strong experience in process optimization and would love to join your Mumbai team.",
        resumeUrl: "https://example.com/resumes/neha-patel.pdf",
        status: "Reviewed",
      },
      {
        jobTitle: "Data Scientist",
        applicantName: "Rohan Mehta",
        applicantEmail: "rohan.mehta@example.com",
        message: "Looking forward to applying data science models to real business challenges.",
        resumeUrl: "https://example.com/resumes/rohan-mehta.pdf",
        status: "Accepted",
      },
    ];

    const createdApplications = [];
    for (const template of applicationTemplates) {
      const job = created.find((jobItem) => jobItem.title === template.jobTitle);
      if (job) {
        createdApplications.push(
          await Application.create({
            job: job._id,
            applicantName: template.applicantName,
            applicantEmail: template.applicantEmail,
            message: template.message,
            resumeUrl: template.resumeUrl,
            status: template.status,
          })
        );
      }
    }

    console.log(`Seeded ${createdApplications.length} applications.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedJobs();
