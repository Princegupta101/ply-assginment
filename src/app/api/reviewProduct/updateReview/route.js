import { ObjectId } from 'mongodb';

import { connect } from "@/app/dbConfig/dbConfig";
import ReviewProduct from "@/app/models/ReviewProductModel";

export async function PUT(request) {
    await connect();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const request_id = searchParams.get('request_id');

    // Validate request_id
    if (!request_id || !ObjectId.isValid(request_id)) {
        return new Response(
            JSON.stringify({ error: 'Valid Request ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        // Update the review's status to "rejected"
        const updatedReview = await ReviewProduct.findByIdAndUpdate(
            new ObjectId(request_id),
            { $set: { status: "rejected" } },
            { new: true } // Return the updated document
        );

        // Handle case where the review is not found
        if (!updatedReview) {
            return new Response(
                JSON.stringify({ error: 'No review found with the given ID' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Respond with success message
        return new Response(
            JSON.stringify({ message: "Review status updated successfully", review: updatedReview }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (err) {
        // Handle any errors during the process
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
