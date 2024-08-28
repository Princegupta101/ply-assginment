import { connect } from "@/app/dbConfig/dbConfig";
import Products from '@/app/models/ProductModel';

export async function GET(request) {
    await connect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        // Validate the ID before querying the database
        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Product ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Fetch the product by ID
        const product = await Products.findById(id);

        if (!product) {
            return new Response(
                JSON.stringify({ error: 'No product found with the given ID' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify(product),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (err) {
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
