import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import API from '../api/axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

// Correctly access environment variable using import.meta.env
// The variable name must be VITE_STRIPE_PUBLIC_KEY in your .env file
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
    const { jobId } = useParams();
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(true);
    const [jobDetails, setJobDetails] = useState(null);

    useEffect(() => {
        const fetchPaymentIntent = async () => {
            try {
                const jobRes = await API.get(`/jobs/${jobId}`);
                setJobDetails(jobRes.data);

                const { data } = await API.post('/payments/create-intent', { jobId });
                setClientSecret(data.clientSecret);
            } catch (err) {
                console.error(err);
                toast.error('Failed to create payment intent.');
            } finally {
                setLoading(false);
            }
        };
        fetchPaymentIntent();
    }, [jobId]);

    if (loading) {
        return <Loader />;
    }

    if (!jobDetails || !clientSecret) {
        return <div className="text-center p-8 text-red-500">Could not load payment information.</div>;
    }

    const appearance = { theme: 'stripe' };
    const options = { clientSecret, appearance };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Complete Payment for: {jobDetails.title}</h1>
            <p className="text-lg mb-4">Total Amount: ₹{jobDetails.budget.max}</p>
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
};

export default PaymentPage;