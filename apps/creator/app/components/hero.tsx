import heroImage from "@/public/heroImage.png";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="pt-20 pb-20 lg:pt-36 lg:pb-28 dark:bg-gray-900 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          <motion.div
            className="lg:col-span-6 mb-12 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Streamline Your{" "}
              <span className="text-primary dark:text-primary">
                Content Creation
              </span>{" "}
              Workflow
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
              The seamless collaboration platform for content creators and their
              editors. No more endless downloading and uploading.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <a href="#contact">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-6 h-auto text-lg">
                  Start for Free
                </Button>
              </a>
              <a href="#whyUs">
                <Button
                  variant="bordered"
                  className="w-full sm:w-auto px-8 py-6 h-auto text-lg dark:text-gray-300"
                >
                  Why Us
                </Button>
              </a>
            </div>
            <div className="mt-8 flex items-center space-x-4">
              <span className="text-gray-500 dark:text-gray-300 text-sm">
                Works with
              </span>
              <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-full h-10 w-10 shadow-sm">
                <FaYoutube className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-gray-500 dark:text-gray-300 text-sm">
                More platforms coming soon
              </span>
            </div>
          </motion.div>
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rounded-xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                <img
                  src={heroImage.src}
                  alt="Content creator workflow"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex items-center justify-center">
                  <div className="text-white text-center max-w-md px-6">
                    <h3 className="text-2xl font-bold mb-3 drop-shadow-md">
                      Streamlined Video Collaboration
                    </h3>
                    <p className="text-white/90 drop-shadow font-medium">
                      Connect your YouTube channels, invite your editors, and
                      start collaborating instantly.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-white dark:bg-gray-800 relative">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary dark:text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-center text-xl font-semibold mt-4 text-gray-900 dark:text-white">
                  All Your Content in One Place
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-300 mt-2">
                  Connect your YouTube channels, invite your editors, and start
                  collaborating instantly.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
