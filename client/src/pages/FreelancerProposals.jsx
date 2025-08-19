import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import Loader from '../components/Loader.jsx';
import { UserContext } from '../context/UserContext.jsx';
import { Link } from 'react-router-dom';
import API from '../api/axios.js';

const FreelancerProposals = () => {
    const { user } = useContext(UserContext);
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProposals = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            
            try {
                // Assuming your backend is correctly configured to fetch the proposals for the logged-in freelancer
                const { data } = await API.get('/proposals/my-proposals');
                setProposals(data.data);
            } catch (err) {
                console.error("Failed to fetch proposals:", err);
                setError(err.response?.data?.message || 'An error occurred while fetching proposals.');
                toast.error('Failed to fetch proposals.');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.user?.role === 'freelancer') {
            fetchProposals();
        }
    }, [user]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (proposals.length === 0) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">You haven't submitted any proposals yet.</h2>
                <p className="text-gray-600">
                    Browse open jobs to find projects you'd like to work on.
                </p>
                <Link to="/jobs" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Browse Jobs
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Proposals</h1>
            <div className="space-y-4">
                {proposals.map((proposal) => (
                    <div key={proposal._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-blue-600 mb-2">
                            <Link to={`/jobs/${proposal.job._id}`}>{proposal.job.title}</Link>
                        </h2>
                        <p className="text-gray-700 mb-2">Bid Amount: ₹{proposal.bidAmount}</p>
                        <p className="text-gray-500 text-sm">
                            Status: <span className={`font-medium ${proposal.status === 'accepted' ? 'text-green-600' : proposal.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{proposal.status}</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FreelancerProposals;