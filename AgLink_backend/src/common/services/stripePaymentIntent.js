import stripe from "../../common/config/stripe.js";

const createPaymentIntent = async (data) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(data.amount * 100),

            currency: data.currency || "inr",

            customer: data.user.stripe_customer_id,

            description: data.description || "Order Payment",

            receipt_email: data.user.email,

            automatic_payment_methods: {
                enabled: true,
            },

            metadata: {
                user_id: data.user.id,
                order_id: data.order_id || "",
                type: data.type || "order",
            },
        });

        return paymentIntent;
    } catch (error) {
        console.error("Error creating payment intent:", error);
        throw error;
    }
};

export default createPaymentIntent;