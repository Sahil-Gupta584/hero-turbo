"use server";
import { backendRes } from "@repo/lib/utils";
import Razorpay from "razorpay";

export async function getRazorPaySubscriptionId({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_ID,
    });
    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "PRO",
        amount: 50000,
        currency: "USD",
      },
    });

    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.id,
      customer_notify: 1,
      total_count: 12, // 12 months
    });
    return backendRes({
      ok: true,
      result: { subscriptionId: subscription.id },
    });
  } catch (error) {
    console.log("Error from getRazorPaySubscriptionId:", error);
    return backendRes({ ok: false, error: error as Error });
  }
}
export async function getRazorPayOrderId({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_ID,
    });
    const order = await razorpay.orders.create({
      amount,
      currency,
    });

    return backendRes({
      ok: true,
      result: { orderId: order.id },
    });
  } catch (error) {
    console.log("Error from getRazorPaySubscriptionId:", error);
    return backendRes({ ok: false, error: error as Error });
  }
}
