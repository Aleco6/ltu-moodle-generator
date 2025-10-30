import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { $Enums } from '@prisma/client';

export async function GET() {
  try {
    const attempts = await prisma.attempt.findMany({
      where: { completed: true },
      orderBy: [
        { durationSec: 'asc' },
        { createdAt: 'asc' }
      ],
      take: 100 // Limit to top 100 attempts
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attempts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { player, difficulty, durationSec, completed } = body;

    // Validate required fields
    if (!player || !difficulty || typeof durationSec !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: player, difficulty, durationSec' },
        { status: 400 }
      );
    }

    // Validate difficulty enum
    if (!Object.values($Enums.Difficulty).includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty. Must be easy, medium, or hard' },
        { status: 400 }
      );
    }

    const attempt = await prisma.attempt.create({
      data: {
        player,
        difficulty,
        durationSec,
        completed: completed ?? false
      }
    });

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error('Error creating attempt:', error);
    return NextResponse.json(
      { error: 'Failed to create attempt' },
      { status: 500 }
    );
  }
}