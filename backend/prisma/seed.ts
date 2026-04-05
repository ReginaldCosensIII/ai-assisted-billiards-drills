import { PrismaClient } from '@prisma/client';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with mock drills...');

  const drill1 = {
    id: crypto.randomUUID(),
    title: "Basic Cut Shot",
    category: "cut_shot",
    difficulty: 1,
    table_compatibility: ["9ft"],
    layout_data: {
      cue_ball: { x: 0.5, y: 0.5 },
      object_balls: [
        { id: "ball-1", number: 1, position: { x: 0.5, y: 0.25 } }
      ]
    },
    success_criteria: "Make the shot",
    coaching_notes: ["Keep head down"],
    version: "1.0",
    author_id: crypto.randomUUID()
  };

  const drill2 = {
    id: crypto.randomUUID(),
    title: "Straight In",
    category: "position_play",
    difficulty: 1,
    table_compatibility: ["9ft"],
    layout_data: {
      cue_ball: { x: 0.5, y: 0.75 },
      object_balls: [
        { id: "ball-2", number: 2, position: { x: 0.5, y: 0.1 } }
      ]
    },
    success_criteria: "Don't scratch",
    coaching_notes: ["Perfect center ball hit"],
    version: "1.0",
    author_id: crypto.randomUUID()
  };

  const drill3 = {
    id: crypto.randomUUID(),
    title: "Safety Practice",
    category: "safety",
    difficulty: 2,
    table_compatibility: ["9ft"],
    layout_data: {
      cue_ball: { x: 0.2, y: 0.8 },
      object_balls: [
        { id: "ball-3", number: 9, position: { x: 0.8, y: 0.2 } }
      ]
    },
    success_criteria: "Hide the cue ball",
    coaching_notes: ["Control the speed"],
    version: "1.0",
    author_id: crypto.randomUUID()
  };

  // Upsert ensures we don't break subsequent seed runs
  for (const drill of [drill1, drill2, drill3]) {
    await prisma.drill.upsert({
      where: { id: drill.id },
      update: {},
      create: drill
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
