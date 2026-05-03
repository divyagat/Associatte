import { NextResponse } from "next/server";

const data:any = {
  mantra: {
    name:"Mantra",
    projects:[
      { name:"Mantra Riverside", slug:"mantra-riverside", city:"Pune" },
      { name:"Mantra One Residency", slug:"mantra-one-residency", city:"Pune" }
    ]
  },
  lodha: {
    name:"Lodha",
    projects:[
      { name:"Lodha Amara", slug:"lodha-amara", city:"Mumbai" },
      { name:"Lodha Belmondo", slug:"lodha-belmondo", city:"Pune" }
    ]
  }
};

export async function GET(_:any,{params}:any) {
  return NextResponse.json(data[params.slug]);
}