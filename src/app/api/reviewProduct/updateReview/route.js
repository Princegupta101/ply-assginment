import { ObjectId } from 'mongodb';

import { connect } from "@/app/dbConfig/dbConfig"; // Ensure correct function name
import ReviewProduct from "@/app/models/ReviewProductModel";

export async function PUT(request) {
    await connect();

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
        // Update the product's status to "rejected"
        const product = await ReviewProduct.findByIdAndUpdate(
            new ObjectId(request_id),
            { $set: { status: "rejected" } },
            { new: true } // Option to return the updated document
        );

        // Handle case where the product is not found
        if (!product) {
            return new Response(
                JSON.stringify({ error: 'No product found with the given ID' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Respond with success message
        return new Response(
            JSON.stringify({ message: "Product status updated successfully", product }),
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
