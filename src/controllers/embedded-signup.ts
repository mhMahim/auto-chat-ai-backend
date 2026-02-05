import { Request, Response } from "express";
import {
  reqAccessToken,
  businessInformation,
  getPhoneNumberInfo,
  subscribeApp,
  registerPhoneNumber,
} from "../util/apiHandler";

export const sendBusinessInfo = async (req: Request, res: Response) => {
  try {
    const { whatsAppBusinessId, phone_number_id, exchangeCode, business_id } =
      req.body;
    console.log("whatsappbusinessid", whatsAppBusinessId);
    console.log("phone_number_id", phone_number_id);
    console.log("exchangecode", exchangeCode);
    console.log("business_id", business_id);

    if (!whatsAppBusinessId || !phone_number_id || !exchangeCode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // access token
    const token = await reqAccessToken(exchangeCode);
    console.log("Access_Token:", token);

    if (!token) {
      return res.status(400).json({ message: "Invalid exchange code" });
    }

    //to get the Business Information
    const businessInfo = await businessInformation(token);

    // to get the Phone Number Info
    const phoneInfo = await getPhoneNumberInfo(token, whatsAppBusinessId);

    if (!phoneInfo) {
      return res.status(400).json({ message: "Phone Number ID not found" });
    }

    //to get the  Registered the phone number
    const registered = await registerPhoneNumber(token, phone_number_id);

    //  to get the Subscribed the app
    const subscribed = await subscribeApp(token, whatsAppBusinessId);

    if (registered && subscribed) {
      return res.status(200).json({
        message: "Embedded Signup completed successfully",
        registered,
        subscribed,
        businessInfo,
        phoneInfo,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Failed during registration or subscription" });
    }
  } catch (error) {
    console.error("Error in Embedded Signup process:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
