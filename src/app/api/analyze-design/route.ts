import { NextRequest, NextResponse } from 'next/server';
import { runAIDesignAnalysis } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fileName = body.fileName || 'app-screenshot.png';

    const report = runAIDesignAnalysis(fileName);

    return NextResponse.json({ success: true, report });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to analyze design.' },
      { status: 500 }
    );
  }
}
