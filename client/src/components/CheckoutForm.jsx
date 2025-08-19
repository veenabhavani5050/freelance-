import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success`, // Redirect on success
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            toast.error(error.message);
        } else {
            toast.error("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <PaymentElement id="payment-element" />
            <button disabled={isLoading || !stripe || !elements} id="submit" className="mt-4 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                <span id="button-text">
                    {isLoading ? "Processing..." : "Pay now"}
                </span>
            </button>
        </form>
    );
};

export default CheckoutForm;