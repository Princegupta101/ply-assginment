import { connect } from "@/app/dbConfig/dbConfig"; // Correct function name
import ReviewProduct from "@/app/models/ReviewProductModel"; // Ensure correct import paths
import User from '@/app/models/userModel';

export async function GET(request) {
    await connect(); // Ensure correct database connection function

    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');

    try {
        // Fetch the user and populate reviewProduct
        const user = await User.findById(userId).populate('reviewProduct');

        // Handle case where user is not found
        if (!user) {
            return new Response(
                JSON.stringify({ error: 'User not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Calculate review statistics
        const totalRequests = user.reviewProduct.length;
        const pendingRequests = user.reviewProduct.filter(product => product.status === 'pending').length;
        const rejectedRequests = user.reviewProduct.filter(product => product.status === 'rejected').length;

        // Return statistics in JSON format
        return new Response(
            JSON.stringify({
                totalRequests,
                pendingRequests,
                rejectedRequests
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (err) {
        // Return error response in case of exception
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
