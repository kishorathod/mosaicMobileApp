import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define the Zod schema for type-safe course generation
const courseSchema = z.object({
  title: z.string().describe("The course title"),
  description: z.string().describe("Brief course description"),
  total_slides: z.number().describe("Total number of slides (should be 5)"),
  slides: z.array(
    z.object({
      slide_number: z.number().describe("The slide number"),
      title: z.string().describe("The slide title"),
      content: z
        .string()
        .describe("Detailed markdown content with examples and explanations"),
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
  console.log("🚀 [GENERATE-COURSE] API called");

  try {
    const body = await req.json();
    console.log(
      "📥 [GENERATE-COURSE] Request body:",
      JSON.stringify(body, null, 2)
    );

    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      console.log("❌ [GENERATE-COURSE] Invalid prompt:", prompt);
      return NextResponse.json(
        { error: "Valid prompt is required" },
        { status: 400 }
      );
    }

    console.log("✅ [GENERATE-COURSE] Valid prompt received:", prompt);
    console.log("🔍 [GENERATE-COURSE] Prompt type:", typeof prompt);
    console.log("🔍 [GENERATE-COURSE] Prompt length:", prompt.length);

    const systemPrompt = `You are Miss Nova, an expert AI teacher who creates comprehensive, engaging courses on any topic.
    
    Create a structured course based on the user's topic. The course should include:
    1. A descriptive title and overview
    2. 5 slides, each with:
       - A clear title
       - Detailed markdown content with examples and explanations
       - A quiz question with 4 options, the correct answer, and an explanation
    
    Make sure the content is educational, engaging, and appropriate for the topic.`;

    console.log(
      "🤖 [GENERATE-COURSE] Calling OpenAI with prompt:",
      `Create a course about: ${prompt}`
    );
    console.log(
      "📋 [GENERATE-COURSE] Using schema:",
      JSON.stringify(courseSchema.shape, null, 2)
    );

    // Fallback if API Key is missing or Demo Mode is forced
    const isMissingKey = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here';
    const isForcedDemo = process.env.DEMO_MODE === 'true';

    if (isMissingKey || isForcedDemo) {
      console.log(`⚠️ [GENERATE-COURSE] ${isForcedDemo ? 'Demo Mode forced' : 'API Key missing'}, using mock fallback`);
      const mockCourse = {
        title: `${prompt} Essentials`,
        description: `A comprehensive guide to ${prompt} concepts and best practices.`,
        total_slides: 5,
        slides: Array.from({ length: 5 }).map((_, i) => ({
          slide_number: i + 1,
          title: `Exploring ${prompt} - Part ${i + 1}`,
          content: `## ${prompt} Deep Dive\n\nThis is a placeholder for ${prompt} content on slide ${i + 1}. In a real scenario, this would be AI-generated detailed markdown content.\n\n### Key Learnings:\n- fundamental concept A\n- advanced technique B\n- practical application C\n\nStay tuned for more Miss Nova magic!`,
          quiz: {
            question: `What is a core concept of ${prompt} discussed in part ${i + 1}?`,
            options: ["The first option", "The second option", "The correct answer", "None of the above"],
            correct_answer: "The correct answer",
            explanation: `The correct answer is confirmed because it's the fundamental building block of ${prompt} at this stage.`
          }
        }))
      };
      // Simulate network delay
      await new Promise(r => setTimeout(r, 2000));
      return NextResponse.json(mockCourse);
    }

    const startTime = Date.now();
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: courseSchema,
      prompt: `Create a course about: ${prompt}`,
      system: systemPrompt,
      temperature: 0.7,
    });
    const endTime = Date.now();

    console.log(
      `⏱️ [GENERATE-COURSE] Generation took ${endTime - startTime}ms`
    );
    console.log(
      "📊 [GENERATE-COURSE] Generated object:",
      JSON.stringify(object, null, 2)
    );
    console.log("✅ [GENERATE-COURSE] Successfully generated course");

    return NextResponse.json(object);
  } catch (error) {
    console.error("❌ [GENERATE-COURSE] Course generation error:", error);
    
    // Fallback if quota is exceeded or other AI service errors
    const errorString = JSON.stringify(error).toLowerCase() + (error instanceof Error ? error.message.toLowerCase() : "");
    const isQuotaError = errorString.includes("quota") || errorString.includes("billing") || errorString.includes("limit") || errorString.includes("insufficient");
    
    if (isQuotaError) {
      console.log("⚠️ [GENERATE-COURSE] AI Service Limit/Quota hit, using mock fallback");
      const mockCourse = {
        title: `${prompt} Essentials (Demo Mode)`,
        description: `A comprehensive guide to ${prompt} concepts. (This is a demo course due to API quota limits)`,
        total_slides: 5,
        slides: Array.from({ length: 5 }).map((_, i) => ({
          slide_number: i + 1,
          title: `Exploring ${prompt} - Part ${i + 1}`,
          content: `## ${prompt} Deep Dive\n\nThis is a placeholder for ${prompt} content on slide ${i + 1}. In a real scenario, this would be AI-generated detailed markdown content.\n\n### Key Learnings:\n- fundamental concept A\n- advanced technique B\n- practical application C\n\nStay tuned for more Miss Nova magic!`,
          quiz: {
            question: `What is a core concept of ${prompt} discussed in part ${i + 1}?`,
            options: ["The first option", "The second option", "The correct answer", "None of the above"],
            correct_answer: "The correct answer",
            explanation: `The correct answer is confirmed because it's the fundamental building block of ${prompt} at this stage.`
          }
        }))
      };
      return NextResponse.json(mockCourse);
    }

    console.error(
      "❌ [GENERATE-COURSE] Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      { error: "Failed to generate course" },
      { status: 500 }
    );
  }
}
