import { ObjectId } from 'mongodb';

import { connect } from "@/app/dbConfig/dbConfig";
import ReviewProduct from "@/app/models/ReviewProductModel";

export async function GET(request) {
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
        const product = await ReviewProduct.findById(new ObjectId(request_id)).populate('originalId');

        if (!product) {
            return new Response(
                JSON.stringify({ error: 'Product not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify(product),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (err) {
        console.log(err);
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
