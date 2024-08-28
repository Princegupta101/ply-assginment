import { connect } from "@/app/dbConfig/dbConfig"; // Correct function name
import ReviewProduct from '@/app/models/ReviewProductModel'; // Ensure model path is correct

// GET function to fetch review statistics
export async function GET() {
    await connect(); // Ensure correct database connection function

    try {
        // Fetch review statistics
        const totalRequests = await ReviewProduct.countDocuments();
        const pendingRequests = await ReviewProduct.countDocuments({ status: 'pending' });
        const rejectedRequests = await ReviewProduct.countDocuments({ status: 'rejected' });

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
        // Return error response if an exception occurs
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
