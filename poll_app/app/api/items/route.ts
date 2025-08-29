import { NextRequest, NextResponse } from 'next/server';

interface Item {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
}

// Mock database for items
const items: Item[] = [
  { id: '1', name: 'Item 1', description: 'Description for Item 1' },
  { id: '2', name: 'Item 2', description: 'Description for Item 2' },
  { id: '3', name: 'Item 3', description: 'Description for Item 3' },
];

// GET /api/items - Return all items
export async function GET() {
  return NextResponse.json(items);
}

// POST /api/items - Add a new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // Create a new item with a unique ID
    const newItem = {
      id: Date.now().toString(),
      name: body.name,
      description: body.description || '',
      createdAt: new Date().toISOString(),
    };
    
    // Add to our "database"
    items.push(newItem);
    
    // Return the created item with 201 status
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}