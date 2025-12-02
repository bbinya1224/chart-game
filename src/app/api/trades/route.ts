import { NextResponse } from 'next/server';
import { fetchTradesFromSheet } from '@/shared/api/google-sheets';

export async function GET() {
  try {
    const trades = await fetchTradesFromSheet();
    return NextResponse.json(trades);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 });
  }
}
