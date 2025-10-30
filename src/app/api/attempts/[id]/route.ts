import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attempt = await prisma.attempt.findUnique({
      where: { id }
    });

    if (!attempt) {
      return NextResponse.json(
        { error: 'Attempt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(attempt);
  } catch (error) {
    console.error('Error fetching attempt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attempt' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { completed, durationSec } = body;

    const attempt = await prisma.attempt.update({
      where: { id },
      data: {
        ...(typeof completed === 'boolean' && { completed }),
        ...(typeof durationSec === 'number' && { durationSec })
      }
    });

    return NextResponse.json(attempt);
  } catch (error) {
    console.error('Error updating attempt:', error);
    return NextResponse.json(
      { error: 'Failed to update attempt' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.attempt.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Attempt deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting attempt:', error);
    return NextResponse.json(
      { error: 'Failed to delete attempt' },
      { status: 500 }
    );
  }
}