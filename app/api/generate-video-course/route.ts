import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define the Zod schema for type-safe video course generation
const videoCourseSchema = z.object({
  title: z.string().describe("The video course title"),
  description: z.string().describe("Brief video course description"),
  total_sections: z
    .number()
    .describe("Total number of video sections (should be 5)"),
  sections: z.array(
    z.object({
      section_number: z.number().describe("The section number"),
      title: z.string().describe("The section title"),
      content: z
        .string()
        .describe(
          "Detailed content for the video section with examples and explanations"
        ),
      key_points: z
        .array(z.string())
        .describe("Key points to highlight in the video"),
      quiz: z.object({
        question: z.string().describe("The quiz question"),
        options: z.array(z.string()).length(4).describe("Four answer options"),
        correct_answer: z.string().describe("The correct answer"),
        explanation: z
          .string()
          .describe("Explanation of why this is the correct answer"),
      }),
    })
  ),
});

export async function POST(req: Request) {
  console.log("🎬 [GENERATE-VIDEO-COURSE] API called");

  try {
    const body = await req.json();
    console.log(
      "📥 [GENERATE-VIDEO-COURSE] Request body:",
      JSON.stringify(body, null, 2)
    );

    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      console.log("❌ [GENERATE-VIDEO-COURSE] Invalid prompt:", prompt);
      return NextResponse.json(
        { error: "Valid prompt is required" },
        { status: 400 }
      );
    }

    console.log("✅ [GENERATE-VIDEO-COURSE] Valid prompt received:", prompt);
    console.log("🔍 [GENERATE-VIDEO-COURSE] Prompt type:", typeof prompt);
    console.log("🔍 [GENERATE-VIDEO-COURSE] Prompt length:", prompt.length);

    const systemPrompt = `You are Miss Nova, an expert AI teacher who creates engaging video courses on any topic.
    
    Create a structured video course based on the user's topic. The course should include:
    1. A descriptive title and overview
    2. 5 video sections, each with:
       - A clear title that works well for video content
       - Detailed content that can be presented in video format
       - Key points that can be highlighted visually
       - A quiz question with 4 options, the correct answer, and an explanation
    
    Make the content engaging and suitable for video presentation. Focus on:
    - Visual storytelling elements
    - Step-by-step explanations that work well on screen
    - Key concepts that can be highlighted with graphics
    - Practical examples that can be demonstrated
    - Clear transitions between topics
    
    Make sure the content is educational, engaging, and appropriate for the topic.`;

    console.log(
      "🤖 [GENERATE-VIDEO-COURSE] Calling OpenAI with prompt:",
      `Create a video course about: ${prompt}`
    );
    console.log(
      "📋 [GENERATE-VIDEO-COURSE] Using schema:",
      JSON.stringify(videoCourseSchema.shape, null, 2)
    );

    // Fallback if API Key is missing or Demo Mode is forced
    const isMissingKey = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here';
    const isForcedDemo = process.env.DEMO_MODE === 'true';

    if (isMissingKey || isForcedDemo) {
      console.log(`⚠️ [GENERATE-VIDEO-COURSE] ${isForcedDemo ? 'Demo Mode forced' : 'API Key missing'}, using mock fallback`);
      const mockVideoCourse = {
        title: `${prompt} Video Masterclass`,
        description: `Visual walkthrough of the core ${prompt} principles.`,
        total_sections: 5,
        sections: Array.from({ length: 5 }).map((_, i) => ({
          section_number: i + 1,
          title: `Video Lesson ${i + 1}: ${prompt} Explained`,
          content: `In this video lesson, we visually demonstrate how ${prompt} works and show you real-world examples in action. Note: This is an AI-simulated placeholder.`,
          key_points: [
            "Visual overview of the topic",
            "Screen-recorded demonstration",
            "Summary of best practices"
          ],
          quiz: {
            question: `What was the main visual takeaway from this ${prompt} video?`,
            options: ["The colors used", "A diagram or demo", "The animation style", "The font choice"],
            correct_answer: "A diagram or demo",
            explanation: "Visual learning is all about the diagrams and demonstrations that make complex topics clear!"
          }
        }))
      };
      // Simulate network delay
      await new Promise(r => setTimeout(r, 2000));
      return NextResponse.json(mockVideoCourse);
    }

    const startTime = Date.now();
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: videoCourseSchema,
      prompt: `Create a video course about: ${prompt}`,
      system: systemPrompt,
      temperature: 0.7,
    });
    const endTime = Date.now();

    console.log(
      `⏱️ [GENERATE-VIDEO-COURSE] Generation took ${endTime - startTime}ms`
    );
    console.log(
      "📊 [GENERATE-VIDEO-COURSE] Generated object:",
      JSON.stringify(object, null, 2)
    );
    console.log(
      "✅ [GENERATE-VIDEO-COURSE] Successfully generated video course"
    );

    return NextResponse.json(object);
  } catch (error) {
    console.error(
      "❌ [GENERATE-VIDEO-COURSE] Video course generation error:",
      error
    );

    // Fallback if quota is exceeded or other AI service errors
    const errorString = JSON.stringify(error).toLowerCase() + (error instanceof Error ? error.message.toLowerCase() : "");
    const isQuotaError = errorString.includes("quota") || errorString.includes("billing") || errorString.includes("limit") || errorString.includes("insufficient");
    
    if (isQuotaError) {
      console.log("⚠️ [GENERATE-VIDEO-COURSE] AI Service Limit/Quota hit, using mock fallback");
      const mockVideoCourse = {
        title: `${prompt} Video Masterclass (Demo Mode)`,
        description: `Visual walkthrough of ${prompt} principles. (Demo Mode due to API limits)`,
        total_sections: 5,
        sections: Array.from({ length: 5 }).map((_, i) => ({
          section_number: i + 1,
          title: `Video Lesson ${i + 1}: ${prompt} Explained`,
          content: `In this video lesson, we visually demonstrate ${prompt}. Note: This is a demo placeholder.`,
          key_points: ["Visuals", "Demo", "Summary"],
          quiz: {
            question: `What is the key takeaway for ${prompt}?`,
            options: ["Visuals", "Knowledge", "Demo", "All"],
            correct_answer: "Knowledge",
            explanation: "Knowledge is the power!"
          }
        }))
      };
      return NextResponse.json(mockVideoCourse);
    }

    console.error(
      "❌ [GENERATE-VIDEO-COURSE] Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      { error: "Failed to generate video course" },
      { status: 500 }
    );
  }
}
