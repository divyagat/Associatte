import { NextResponse } from "next/server";

const builders = [
  { name:"Mantra", slug:"mantra", city:["pune"] },
  { name:"Lodha", slug:"lodha", city:["mumbai"] },
  { name:"Godrej", slug:"godrej", city:["mumbai","pune"] },
  { name:"Birla", slug:"birla", city:["mumbai","pune"] },
  { name:"Kumar", slug:"kumar", city:["pune"] },
  { name:"Today Group", slug:"today-group", city:["pune"] },
  { name:"L&T", slug:"lnt", city:["mumbai"] },
  { name:"Runwal Group", slug:"runwal", city:["mumbai"] },
  { name:"Adani", slug:"adani", city:["mumbai"] },
  { name:"Mahindra", slug:"mahindra", city:["pune"] }
];

export async function GET() {
  return NextResponse.json(builders);
}