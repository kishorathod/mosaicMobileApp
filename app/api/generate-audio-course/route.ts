import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// Define the Zod schema for type-safe audio course generation
const audioCourseSchema = z.object({
  title: z.string().describe("The audio course title"),
  description: z.string().describe("Brief audio course description"),
  total_sections: z
    .number()
    .describe("Total number of audio sections (should be 5)"),
  sections: z.array(
    z.object({
      section_number: z.number().describe("The section number"),
      title: z.string().describe("The section title"),
      content: z
        .string()
        .describe(
          "Detailed content for the audio section with examples and explanations"
        ),
      script: z
        .string()
        .describe(
          "Podcast-style script for this section optimized for ElevenLabs text-to-speech"
        ),
      key_points: z
        .array(z.string())
        .describe("Key points to highlight in the audio"),
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
  console.log("🎧 [GENERATE-AUDIO-COURSE] API called");

  try {
    const body = await req.json();
    console.log(
      "📥 [GENERATE-AUDIO-COURSE] Request body:",
      JSON.stringify(body, null, 2)
    );

    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      console.log("❌ [GENERATE-AUDIO-COURSE] Invalid prompt:", prompt);
      return NextResponse.json(
        { error: "Valid prompt is required" },
        { status: 400 }
      );
    }

    console.log("✅ [GENERATE-AUDIO-COURSE] Valid prompt received:", prompt);
    console.log("🔍 [GENERATE-AUDIO-COURSE] Prompt type:", typeof prompt);
    console.log("🔍 [GENERATE-AUDIO-COURSE] Prompt length:", prompt.length);

    const systemPrompt = `You are Miss Nova, an expert AI teacher who creates engaging audio courses on any topic.
    
    Create a structured audio course based on the user's topic. The course should include:
    1. A descriptive title and overview
    2. 5 audio sections, each with:
       - A clear title that works well for audio content
       - Detailed content that can be presented in audio format
       - A podcast-style script optimized for ElevenLabs text-to-speech
       - Key points that can be highlighted verbally
       - A quiz question with 4 options, the correct answer, and an explanation
    
    For the script generation:
    - Create engaging, natural conversations between 2-3 speakers
    - Use "Speaker 1:", "Speaker 2:", "Speaker 3:" format
    - Keep scripts under 2800 characters total
    - Include emotional audio tags: [excited], [curious], [laughs], [sighs]
    - Add vocal delivery tags: [dramatically], [sarcastically]
    - Make it conversational and educational
    - Each speaker should have 2-3 lines maximum
    - Keep individual lines concise but engaging (150-200 characters each)
    
    Make the content engaging and suitable for audio presentation. Focus on:
    - Clear, conversational language that works well when spoken
    - Step-by-step explanations that are easy to follow by ear
    - Key concepts that can be emphasized through tone and pacing
    - Practical examples that can be described verbally
    - Smooth transitions between topics
    - Engaging storytelling elements
    
    Make sure the content is educational, engaging, and appropriate for the topic.`;

    console.log(
      "🤖 [GENERATE-AUDIO-COURSE] Calling OpenAI with prompt:",
      `Create an audio course about: ${prompt}`
    );
    console.log(
      "📋 [GENERATE-AUDIO-COURSE] Using schema:",
      JSON.stringify(audioCourseSchema.shape, null, 2)
    );

    // Fallback if API Key is missing or Demo Mode is forced
    const isMissingKey = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here';
    const isForcedDemo = process.env.DEMO_MODE === 'true';

    if (isMissingKey || isForcedDemo) {
      console.log(`⚠️ [GENERATE-AUDIO-COURSE] ${isForcedDemo ? 'Demo Mode forced' : 'API Key missing'}, using mock fallback`);
      const mockAudioCourse = {
        title: `${prompt} Audio Series`,
        description: `An immersive audio journey through ${prompt} basics.`,
        total_sections: 5,
        sections: Array.from({ length: 5 }).map((_, i) => ({
          section_number: i + 1,
          title: `Audio Section ${i + 1}: ${prompt} Fundamentals`,
          content: `In this audio section, we'll explore ${prompt} and its practical applications. This is a placeholder for the rich content usually generated by Miss Nova's AI.`,
          script: `Speaker 1: Welcome back to Miss Nova's audio series on ${prompt}. Today we're looking at section ${i + 1}.\nSpeaker 2: [excited] I'm really looking forward to this one, Mark!\nSpeaker 1: Great, let's dive right into the core concepts for today.`,
          key_points: [
            "Introduction to the topic",
            "Key takeaway for today",
            "The importance of practice"
          ],
          quiz: {
            question: `What was the highlight of this ${prompt} audio section?`,
            options: ["Sound quality", "A specific fact", "AI generation", "The teacher's voice"],
            correct_answer: "A specific fact",
            explanation: "While all are great, the core value is always in the facts you learn!"
          },
          audioUrl: null // No audio generation without ElevenLabs either
        }))
      };
      // Simulate network delay
      await new Promise(r => setTimeout(r, 2000));
      return NextResponse.json(mockAudioCourse);
    }

    const startTime = Date.now();
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: audioCourseSchema,
      prompt: `Create an audio course about: ${prompt}`,
      system: systemPrompt,
      temperature: 0.7,
    });
    const endTime = Date.now();

    console.log(
      `⏱️ [GENERATE-AUDIO-COURSE] Generation took ${endTime - startTime}ms`
    );
    console.log(
      "📊 [GENERATE-AUDIO-COURSE] Generated object:",
      JSON.stringify(object, null, 2)
    );
    console.log(
      "✅ [GENERATE-AUDIO-COURSE] Successfully generated audio course"
    );

    // Generate audio for each section
    console.log(
      "🎧 [GENERATE-AUDIO-COURSE] Starting audio generation for sections"
    );

    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    if (!elevenLabsApiKey) {
      console.log(
        "⚠️ [GENERATE-AUDIO-COURSE] ElevenLabs API key not configured, returning course without audio"
      );
      return NextResponse.json(object);
    }

    const client = new ElevenLabsClient({ apiKey: elevenLabsApiKey });
    const voiceIds = [
      "UgBBYS2sOqTuMpoF3BR0", // Mark - Natural Conversations (male, american)
      "NFG5qt843uXKj4pFvR7C", // Adam Stone - late night radio (male, british)
      "cgSgspJ2msm6clMCkdW9", // Hope - upbeat and clear (female, american)
    ];

    // Process each section to generate audio
    const sectionsWithAudio = await Promise.all(
      object.sections.map(async (section, index) => {
        try {
          console.log(
            `🎧 [GENERATE-AUDIO-COURSE] Generating audio for section ${
              index + 1
            }: ${section.title}`
          );

          // Parse the script to extract speaker lines
          const lines = section.script
            .split("\n")
            .filter((line: string) => line.trim());
          const inputs = [];

          for (const line of lines) {
            const match = line.match(/^Speaker (\d+):\s*(.+)$/);
            if (match) {
              const speakerNumber = Number.parseInt(match[1]) - 1;
              const text = match[2].trim();
              const voiceId = voiceIds[speakerNumber % voiceIds.length];
              inputs.push({ text, voiceId });
            }
          }

          if (inputs.length === 0) {
            console.log(
              `⚠️ [GENERATE-AUDIO-COURSE] No valid speaker lines found for section ${
                index + 1
              }`
            );
            return { ...section, audioUrl: null };
          }

          // Generate audio stream
          const audioStream = await client.textToDialogue.stream({ inputs });

          // Convert stream to base64 data URL
          const chunks: Uint8Array[] = [];
          const reader = audioStream.getReader();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
          }

          const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");
          const audioUrl = `data:audio/mpeg;base64,${base64}`;

          console.log(
            `✅ [GENERATE-AUDIO-COURSE] Generated audio for section ${
              index + 1
            }`
          );

          return { ...section, audioUrl };
        } catch (error) {
          console.error(
            `❌ [GENERATE-AUDIO-COURSE] Error generating audio for section ${
              index + 1
            }:`,
            error
          );
          return { ...section, audioUrl: null };
        }
      })
    );

    const courseWithAudio = {
      ...object,
      sections: sectionsWithAudio,
    };

    console.log(
      "✅ [GENERATE-AUDIO-COURSE] Successfully generated course with audio"
    );

    return NextResponse.json(courseWithAudio);
  } catch (error) {
    console.error(
      "❌ [GENERATE-AUDIO-COURSE] Audio course generation error:",
      error
    );

    // Fallback if quota is exceeded or other AI service errors
    const errorString = JSON.stringify(error).toLowerCase() + (error instanceof Error ? error.message.toLowerCase() : "");
    const isQuotaError = errorString.includes("quota") || errorString.includes("billing") || errorString.includes("limit") || errorString.includes("insufficient");
    
    if (isQuotaError) {
      console.log("⚠️ [GENERATE-AUDIO-COURSE] AI Service Limit/Quota hit, using mock fallback");
      const mockAudioCourse = {
        title: `${prompt} Audio Series (Demo Mode)`,
        description: `An immersive audio journey through ${prompt} basics. (Demo Mode due to API limits)`,
        total_sections: 5,
        sections: Array.from({ length: 5 }).map((_, i) => ({
          section_number: i + 1,
          title: `Audio Section ${i + 1}: ${prompt} Fundamentals`,
          content: `In this audio section, we'll explore ${prompt}. Note: This is a demo placeholder.`,
          script: `Speaker 1: Welcome to the ${prompt} audio series. Today we're on section ${i + 1}.\nSpeaker 2: [excited] Ready to learn!\nSpeaker 1: Let's get started.`,
          key_points: ["Intro", "Key Info", "Summary"],
          quiz: {
            question: `What is the focus of this ${prompt} audio section?`,
            options: ["Option A", "Option B", "Learning", "None"],
            correct_answer: "Learning",
            explanation: "Learning is always the goal!"
          },
          audioUrl: null
        }))
      };
      return NextResponse.json(mockAudioCourse);
    }

    console.error(
      "❌ [GENERATE-AUDIO-COURSE] Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      { error: "Failed to generate audio course" },
      { status: 500 }
    );
  }
}
