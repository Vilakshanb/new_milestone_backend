import razorpay from "razorpay";
import { CONFIG } from "./config";

let instance = new razorpay({ key_id: CONFIG.RAZOR_PAY_API_KEY, key_secret: CONFIG.RAZOR_PAY_API_SECRET });

export const createPaymentOrder = async (options) => {
  try {
    let orderObj = await instance.orders.create(options);
    return orderObj;
  } catch (error) {
    console.error(error);
    return error;
  }
};
