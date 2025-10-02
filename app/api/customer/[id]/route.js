import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";

export async function GET(req, { params }) {
  await dbConnect();
  const customer = await Customer.findById(params.id);
  if (!customer)
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  return new Response(JSON.stringify(customer), { status: 200 });
}

export async function PUT(req, { params }) {
  await dbConnect();
  const data = await req.json();
  const updated = await Customer.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  await Customer.findByIdAndDelete(params.id);
  return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
}
