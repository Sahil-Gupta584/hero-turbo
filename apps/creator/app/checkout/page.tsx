"use client";
import { getRazorPayOrderId } from "@/lib/paymentActions";
import { PlanType } from "@repo/db";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import { FiArrowLeft, FiCheckCircle, FiLoader } from "react-icons/fi";
import { plans } from "../components/pricing";

export type TPaymentMethod = "stripe" | "razorpay";
export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planType: PlanType =
    (searchParams.get("planType") as PlanType) ?? "PRO";
  const [loading, setLoading] = useState<TPaymentMethod | null>(null);

  const handlePayment = async (method: TPaymentMethod) => {
    setLoading(method);
    try {
      const amount: number = Number(
        plans.find((plan) => plan.name === planType)?.price.replace("$", "")
      );
      if (!amount) throw new Error("Invalid amount");
      console.log("amount", amount);

      if (method === "razorpay") {
        // const res = await getRazorPaySubscriptionId({
        //   'amount',
        //   currency: "USD",
        // });
        const res = await getRazorPayOrderId({
          amount,
          currency: "USD",
        });
        if (!res.ok || !res.result?.orderId)
          throw new Error("Failed to create Razorpay orderId");

        const razorpay = new (window as any).Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          // subscription_id: res.result.subscriptionId,
          orderId: res.result.orderId,
          name: "Syncly",
          description: "Monthly Subscription",
          theme: { color: "#6366F1" },

          handler: function (response: any) {
            alert("Subscription successful: " + JSON.stringify(response));
          },
        });

        razorpay.open();
      }
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-100 dark:bg-gray-900">
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm  hover:text-indigo-600 transition mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <FiCheckCircle className="text-indigo-600 w-6 h-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold ">Complete Your Purchase</h1>
          <p className=" mt-1">
            Selected Plan:{"  "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {planType}
            </span>
          </p>
        </div>

        <div className="space-y-5">
          <div
            onClick={() => (loading ? null : handlePayment("stripe"))}
            className={`group relative cursor-pointer border-2 rounded-lg p-5 transition duration-200 ${
              loading === "stripe"
                ? "opacity-60 pointer-events-none"
                : "hover:shadow-md hover:border-indigo-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src="https://logo.clearbit.com/stripe.com"
                  alt="Stripe"
                  className="h-8"
                />
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    Credit/Debit Card
                  </h3>
                  <p className="text-sm text-gray-500">
                    Visa, Mastercard, Amex
                  </p>
                </div>
              </div>
              {loading === "stripe" ? (
                <FiLoader className="animate-spin text-gray-400" />
              ) : (
                <span className="text-lg text-gray-600 dark:text-gray-300">
                  {plans.find((plan) => plan.name === planType)?.price ?? "N/A"}
                </span>
              )}
            </div>
          </div>

          {/* Razorpay */}
          <div
            onClick={() => (loading ? null : handlePayment("razorpay"))}
            className={`group relative cursor-pointer border-2 rounded-lg p-5 transition duration-200 ${
              loading === "razorpay"
                ? "opacity-60 pointer-events-none"
                : "hover:shadow-md hover:border-blue-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src="https://logo.clearbit.com/razorpay.com"
                  alt="Razorpay"
                  className="h-8"
                />

                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    Razorpay
                  </h3>
                  <p className="text-sm text-gray-500">
                    UPI, Netbanking, Wallets
                  </p>
                </div>
              </div>
              {loading === "razorpay" ? (
                <FiLoader className="animate-spin text-gray-400" />
              ) : (
                <span className="text-lg text-gray-600 dark:text-gray-300">
                  {plans.find((plan) => plan.name === planType)?.price ?? "N/A"}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-gray-400 mt-10">
          🔒 Secure payments powered by{" "}
          <span className="font-medium">Stripe</span> &{" "}
          <span className="font-medium">Razorpay</span>. Your data is encrypted
          and safe.
        </p>
      </div>
    </div>
  );
}
