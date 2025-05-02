import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import { FaBell, FaCloudUploadAlt, FaUsers, FaYoutube } from "react-icons/fa";

export default function Features() {
  const features = [
    {
      icon: <FaCloudUploadAlt className="h-5 w-5 text-foreground" />,
      title: "Centralized Video Storage",
      description:
        "Keep all your raw and edited content in one secure location, accessible to authorized team members.",
      bullets: [
        "Unlimited video storage",
        "Secure cloud access",
        "Version history tracking",
      ],
    },
    {
      icon: <FaUsers className="h-5 w-5 text-foreground" />,
      title: "Team Permission Management",
      description:
        "Control who can access, edit, and publish your content with customizable team permissions.",
      bullets: [
        "Add multiple editors",
        "Custom access levels",
        "Activity tracking",
      ],
    },
    {
      icon: <FaYoutube className="h-5 w-5 text-foreground" />,
      title: "Direct YouTube Publishing",
      description:
        "Publish approved videos directly to your YouTube channels without downloading and re-uploading.",
      bullets: [
        "Connect multiple channels",
        "Schedule publications",
        "Metadata management",
      ],
    },
    {
      icon: <FaBell className="h-5 w-5 text-foreground" />,
      title: "Notifications & Alerts",
      description:
        "Stay informed with real-time notifications about uploads, feedback, and publishing.",
      bullets: [
        "Email notifications",
        "In-app alerts",
        "Custom notification settings",
      ],
    },
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Powerful Features
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to streamline your content creation workflow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                <CardBody className="p-6">
                  <div className="text-foreground rounded-full p-3 inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{feature.description}</p>
                  <ul className="mt-4 space-y-2">
                    {feature.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
