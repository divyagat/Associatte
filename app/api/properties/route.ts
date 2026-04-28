// app/api/properties/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || 'apartments';
    const status = searchParams.get('status');

    // 🔹 Mock data - Replace with your database/API call
    const mockProperties = [
      {
        id: '1',
        title: 'Luxury Apartment in Andheri',
        location: 'Andheri West, Mumbai',
        price: '₹1.2 Cr',
        type: 'apartment',
        status: 'sale',
        image: '/assets/image/property1.jpg',
      },
      {
        id: '2',
        title: '3 BHK in Powai',
        location: 'Powai, Mumbai',
        price: '₹95 L',
        type: 'apartment',
        status: 'sale',
        image: '/assets/image/property2.jpg',
      },
      // Add more mock data or fetch from DB
    ];

    // 🔹 Filter logic
    let results = mockProperties;
    
    if (search) {
      const lowerSearch = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerSearch) ||
          p.location.toLowerCase().includes(lowerSearch)
      );
    }
    
    if (type && type !== 'all') {
      results = results.filter((p) => p.type === type);
    }
    
    if (status) {
      results = results.filter((p) => p.status === status);
    }

    return NextResponse.json({ 
      success: true, 
      data: results,
      count: results.length 
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}