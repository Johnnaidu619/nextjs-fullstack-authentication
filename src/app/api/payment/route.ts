const Razorpay = require("razorpay");

// Initialize Razorpay instance with key and secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req:any, res:any) {
  if (req.method === "POST") {
    const { amount } = req.body; // Amount is in the smallest currency unit (e.g., paise for INR)

    // Create an order in Razorpay
    const options = {
      amount: amount * 100, // Amount is multiplied by 100 because Razorpay expects it in paise
      currency: "INR",
      receipt: `receipt_${Math.random() * 1000}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      res.status(200).json(order); // Send order details back to client
    } catch (error) {
      res
        .status(500)
        .json({ error: "Something went wrong in creating the order" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
