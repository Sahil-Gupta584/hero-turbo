import { motion } from "framer-motion";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

const painPoints = [
  "Record and download the video",
  "Upload to Google Drive or Dropbox",
  "Send link to editor via WhatsApp or Email",
  "Editor downloads and edits",
  "Sends back via new link",
  "Download again and upload to YouTube",
];

const ourSolution = [
  "Upload video to your workspace",
  "Assign editor(s) with one click",
  "Editor downloads and re-uploads edited version",
  "You review and approve",
  "Directly publish to YouTube",
];

const stats = [
  { value: "60%", label: "Less time spent on file management" },
  { value: "40%", label: "Faster publishing process" },
  { value: "100%", label: "More seamless collaboration" },
];

export default function WhyUs() {
  return (
    <section id="whyUs" className="bg-gray-50 dark:bg-gray-900 py-16 px-4 md:px-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
        Why Creators Love Our Workflow 🚀
      </h2>
      <p className="text-center text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
        A simple visual comparison between the old way (pain) and our new solution
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-red-500 text-center">
            The Struggle is Real 😩
          </h3>
          <ul className="space-y-4 w-fit m-auto">
            {painPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <FaArrowRight className="text-red-400 mt-1" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-green-500 text-center">
            The New Workflow ✨
          </h3>
          <ul className="space-y-4 w-fit m-auto">
            {ourSolution.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <FaCheckCircle className="text-green-400 mt-1" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <motion.div
        className="bg-primary-50 dark:bg-gray-800 rounded-2xl p-8 border border-primary-100 dark:border-gray-700 max-w-[56rem] mt-16 mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              The ContentFlow Difference
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Our platform eliminates the endless cycle of downloading and uploading, saving you hours each week.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm text-center"
              >
                <div className="text-accent-500 dark:text-accent-400 font-bold text-2xl">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
