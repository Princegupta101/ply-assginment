import { ObjectId } from 'mongodb';

import { connect } from "@/app/dbConfig/dbConfig"; // Correct function name
import ReviewProduct from "@/app/models/ReviewProductModel"; // Ensure correct import paths
import User from "@/app/models/userModel";

export async function GET(request) {
    await connect(); // Ensure correct database connection function

    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    try {
        // Validate ObjectId before querying
        if (!ObjectId.isValid(user_id)) {
            return new Response(
                JSON.stringify({ error: 'Invalid user ID format' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Fetch user by ID and populate reviewProduct
        const user = await User.findById(new ObjectId(user_id)).populate('reviewProduct');

        // Handle case where user is not found
        if (!user) {
            return new Response(
                JSON.stringify({ error: 'User not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Return the user's review products
        return new Response(
            JSON.stringify({ reviewProduct: user.reviewProduct }),
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
