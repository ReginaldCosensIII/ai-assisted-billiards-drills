import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const GenerateDrillSchema = z.object({
  prompt: z.string().min(1),
});

export async function aiRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post('/api/generate-drill', {
    schema: {
      body: GenerateDrillSchema,
    }
  }, async (request, reply) => {
    const { prompt } = request.body;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional billiards instructor and expert drill designer.
Your task is to take a natural language description of a drill and translate it into a structured JSON layout suitable for a training platform.

**Coordinate System**: Normalize coordinates (0.0 to 1.0).
- x: 0.0 (Left) to 1.0 (Right).
- y: 0.0 (Top) to 1.0 (Bottom).
- Table has a physical 2:1 aspect ratio, but coordinates are always normalized between 0 and 1.

**Orientation & Terminology**:
Assume a horizontal pool table. 
- X=0.0 is the Head Rail (where you break from).
- X=1.0 is the Foot Rail. 
- Y=0.0 is the Top Long Rail.
- Y=1.0 is the Bottom Long Rail. 
- The Head String is at X=0.25. 
- The Foot Spot is at X=0.75, Y=0.5.

**Drill Categories**:
You must categorize the shot using one of these keys: 'cut_shot', 'position_play', 'safety', 'bank', 'break'.

**Target Zones**:
If the user asks for "positional play", "shape", or specifies where the cue ball should land after the shot, you must generate a `target_zones` array. A target zone requires: `id` (string), `x` (number), `y` (number), and `radius` (number, typically 0.05 to 0.15).

**Execution Parameters**:
You must infer the optimal execution intent:
- speed: 1 to 10 (1 is incredibly soft, 10 is breaking speed).
- spin: an object with 'vertical' (-1.0 for draw to 1.0 for follow) and 'horizontal' (-1.0 for left english to 1.0 for right english).
- elevation: 0 to 90 degrees (typically 0-5 for level, >=30 for masse/jump).

**Output Requirements**:
Return a valid layout that perfectly matches the provided instructions. If multiple object balls are needed, number them sequentially. Include the computed execution parameters.
`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "drill_generation",
            strict: true,
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                category: { 
                  type: "string", 
                  enum: ["cut_shot", "position_play", "safety", "bank", "break"] 
                },
                layout: {
                  type: "object",
                  properties: {
                    cue_ball: {
                      type: "object",
                      properties: {
                        x: { type: "number" },
                        y: { type: "number" }
                      },
                      required: ["x", "y"],
                      additionalProperties: false
                    },
                    object_balls: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          number: { type: "number" },
                          position: {
                            type: "object",
                            properties: {
                              x: { type: "number" },
                              y: { type: "number" }
                            },
                            required: ["x", "y"],
                            additionalProperties: false
                          }
                        },
                        required: ["id", "number", "position"],
                        additionalProperties: false
                      }
                    },
                    target_zones: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          x: { type: "number" },
                          y: { type: "number" },
                          radius: { type: "number" }
                        },
                        required: ["id", "x", "y", "radius"],
                        additionalProperties: false
                      }
                    }
                  },
                  required: ["cue_ball", "object_balls"],
                  additionalProperties: false
                },
                execution: {
                  type: "object",
                  properties: {
                    speed: { type: "number" },
                    spin: {
                      type: "object",
                      properties: {
                        vertical: { type: "number" },
                        horizontal: { type: "number" }
                      },
                      required: ["vertical", "horizontal"],
                      additionalProperties: false
                    },
                    elevation: { type: "number" }
                  },
                  required: ["speed", "spin", "elevation"],
                  additionalProperties: false
                }
              },
              required: ["title", "category", "layout", "execution"],
              additionalProperties: false
            }
          }
        }
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('AI returned an empty response.');
      }

      return JSON.parse(content);
    } catch (err: any) {
      request.log.error(err);
      reply.status(500).send({ error: 'Failed to generate drill layout.', details: err.message });
    }
  });
}
