import { Button, Card, CardBody } from "@heroui/react";
import { PlanType } from "@repo/db";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

type TPlan = {
  name: PlanType;
  price: "$9" | "$14" | "$49" | "Custom";
  period: "/month" | "";
  description: string;
  features: {
    included: boolean;
    text: string;
  }[];
  cta: string;
  popular: boolean;
};
export const plans: TPlan[] = [
  {
    name: "BASE",
    price: "$9",
    period: "/month",
    description: "Perfect for individual creators getting started.",
    features: [
      { included: true, text: "1 YouTube channel" },
      { included: true, text: "Up to 3 editors" },
      { included: true, text: "Use your own Google Drive for storage" },
      { included: false, text: "Cloud storage included" },
      { included: false, text: "Priority support" },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "PRO",
    price: "$14",
    period: "/month",
    description: "Ideal for creators managing multiple channels.",
    features: [
      { included: true, text: "Up to 5 YouTube channels" },
      { included: true, text: "Up to 10 editors" },
      { included: true, text: "50GB cloud storage included" },
      { included: true, text: "Basic analytics" },
      { included: false, text: "Priority support" },
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "GROWTH",
    price: "$49",
    period: "/month",
    description: "For small production teams scaling up.",
    features: [
      { included: true, text: "Up to 10 YouTube channels" },
      { included: true, text: "Up to 20 editors" },
      { included: true, text: "200GB cloud storage included" },
      { included: true, text: "Advanced analytics" },
      { included: true, text: "Priority support" },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "ENTERPRISE",
    price: "Custom",
    period: "",
    description: "For large teams needing unlimited flexibility.",
    features: [
      { included: true, text: "Unlimited YouTube channels" },
      { included: true, text: "Unlimited editors" },
      { included: true, text: "2TB+ cloud storage (negotiable)" },
      { included: true, text: "Dedicated account manager" },
      { included: true, text: "24/7 priority support" },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];
export default function Pricing() {
  return (
    <section
      id="pricing"
      className="py-20 bg-background dark:bg-gray-900 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the plan that works best for your content creation needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col h-full"
            >
              <Card
                className={`h-full overflow-hidden ${plan.popular ? "border-2 border-primary shadow-xl relative" : "border border-gray-200 dark:border-gray-700 shadow-md"}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                <CardBody className="p-8 flex flex-col h-full">
                  <h3 className="text-xl font-bold text-foreground dark:text-foreground-dark">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-foreground dark:text-foreground-dark">
                      {plan.price}
                    </span>
                    <span className="ml-1 text-xl text-foreground-secondary dark:text-foreground-secondary-dark">
                      {plan.period}
                    </span>
                  </div>
                  {plan.name !== "ENTERPRISE" && (
                    <span className="w-fit inline-block bg-primary/10 dark:bg-primary text-primary dark:text-white text-xs font-semibold px-3 py-1 rounded-full mt-3">
                      14-day free trial
                    </span>
                  )}

                  <p className="mt-2 text-foreground-secondary dark:text-foreground-secondary-dark">
                    {plan.description}
                  </p>

                  <ul className="mt-6 space-y-4 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        {feature.included ? (
                          <FaCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        ) : (
                          <RxCross2 className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-3 flex-shrink-0" />
                        )}
                        <span
                          className={
                            feature.included
                              ? "text-foreground-secondary dark:text-foreground-secondary-dark"
                              : "text-gray-400 dark:text-gray-600"
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`${process.env.CREATOR_BASE_URL}/auth?planType=${plan.name}`}
                  >
                    <Button
                      className={`mt-8 w-full ${
                        plan.popular
                          ? "bg-primary hover:bg-primary/90 text-white dark:bg-primary/90 dark:hover:bg-primary/80"
                          : "bg-gray-100 hover:bg-gray-200 text-foreground-secondary dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-foreground"
                      }`}
                      variant={plan.popular ? "solid" : "bordered"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 bg-background-secondary rounded-lg p-6 text-center dark:bg-background-secondary-dark"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-foreground-secondary dark:text-foreground-secondary-dark">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
