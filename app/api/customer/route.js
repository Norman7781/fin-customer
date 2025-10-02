import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";

export async function GET() {
  await dbConnect();
  const customers = await Customer.find();
  return new Response(JSON.stringify(customers), { status: 200 });
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const customer = await Customer.create(data);
  return new Response(JSON.stringify(customer), { status: 201 });
}
