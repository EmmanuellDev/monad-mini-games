/**
 * Groq AI Analysis API Route (Server-side)
 * Keeps API key secure on the server
 */

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Check if API key is configured
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const isConfigured = GROQ_API_KEY && GROQ_API_KEY !== "your_groq_api_key_here";

// Initialize Groq client on the server (secure)
const groq = isConfigured
  ? new OpenAI({
      apiKey: GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    })
  : null;

// Mock analysis function for development when API key is not set
function generateMockAnalysis(jsonData: any) {
  const dataString = JSON.stringify(jsonData);
  const records = Array.isArray(jsonData) ? jsonData.length : 1;
  const fields =
    Array.isArray(jsonData) && jsonData.length > 0
      ? Object.keys(jsonData[0]).length
      : Object.keys(jsonData).length;

  return {
    qualityScore: 85,
    diversity: 78,
    accuracy: 92,
    completeness: 88,
    consistency: 90,
    bias: "low" as const,
    insights: [
      `Dataset contains ${records} records with ${fields} fields`,
      "Data structure appears well-organized and consistent",
      "Good representation across different data points",
      "Note: This is a mock analysis. Configure GROQ_API_KEY for real AI analysis",
    ],
    recommendations: [
      "Configure GROQ_API_KEY in .env.local for AI-powered analysis",
      "Visit https://console.groq.com/keys to get a free API key",
      "Consider adding more diverse data samples",
      "Ensure all required fields are populated",
    ],
    statistics: {
      totalRecords: records,
      totalFields: fields,
      missingDataPercentage: 2.5,
      dataTypes: ["string", "number", "boolean"],
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON data from request
    const { jsonData } = await request.json();

    if (!jsonData) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // If API key is not configured, use mock analysis
    if (!isConfigured) {
      console.log("⚠️  GROQ_API_KEY not configured - using mock analysis");
      console.log("📝 To enable AI analysis:");
      console.log("   1. Visit https://console.groq.com/keys");
      console.log("   2. Get your free API key");
      console.log("   3. Add GROQ_API_KEY to .env.local");
      console.log("   4. Restart the dev server");

      const mockAnalysis = generateMockAnalysis(jsonData);
      return NextResponse.json({
        success: true,
        analysis: mockAnalysis,
        isMock: true,
      });
    }

    console.log("🤖 Starting Groq AI analysis (server-side)...");

    // Convert JSON data to string for analysis (truncate if too large)
    const dataString = JSON.stringify(jsonData, null, 2);
    const truncatedData =
      dataString.length > 10000
        ? dataString.substring(0, 10000) + "\n... (truncated for analysis)"
        : dataString;

    // Create the analysis prompt
    const prompt = `You are a data quality expert. Analyze this JSON dataset and provide a comprehensive quality assessment.

Dataset Sample:
${truncatedData}

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "qualityScore": <number 0-100>,
  "diversity": <number 0-100>,
  "accuracy": <number 0-100>,
  "completeness": <number 0-100>,
  "consistency": <number 0-100>,
  "bias": "<low|medium|high>",
  "insights": [
    "<insight 1>",
    "<insight 2>",
    "<insight 3>"
  ],
  "recommendations": [
    "<recommendation 1>",
    "<recommendation 2>"
  ],
  "statistics": {
    "totalRecords": <number>,
    "totalFields": <number>,
    "missingDataPercentage": <number>,
    "dataTypes": ["<type1>", "<type2>"]
  }
}

Scoring Guidelines:
- qualityScore: Overall data quality (structure, completeness, consistency)
- diversity: Variety and distribution of data values
- accuracy: Data validity and correctness
- completeness: Percentage of non-missing data
- consistency: Uniformity of data formats and values
- bias: Assess representation bias (low/medium/high)

Provide actionable insights and recommendations based on the data.`;

    console.log("📤 Sending request to Groq...");

    // Call Groq API using llama-3.3-70b-versatile (free, fast, and powerful)
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Free Groq model (replaces deprecated mixtral-8x7b-32768)
      messages: [
        {
          role: "system",
          content:
            "You are a data quality expert. Analyze datasets and respond ONLY with valid JSON format, no markdown or explanations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent analysis
      max_tokens: 2000,
    });

    console.log("📨 Received response from Groq");

    // Extract the response content
    const content = response.choices[0]?.message?.content || "";

    // Parse the JSON response
    try {
      // Remove any markdown code blocks if present
      const cleanedContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const analysis = JSON.parse(cleanedContent);
      console.log("✅ Analysis completed successfully");
      console.log("📊 Quality Score:", analysis.qualityScore);

      return NextResponse.json({ success: true, analysis });
    } catch (parseError) {
      console.error("❌ Failed to parse AI response:", parseError);
      console.log("Raw response:", content);

      return NextResponse.json(
        { error: "Failed to parse AI analysis response", rawResponse: content },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Groq AI analysis failed:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key") || error.message.includes("401")) {
        console.log("⚠️  Invalid or missing GROQ_API_KEY");
        console.log("📝 To fix:");
        console.log("   1. Visit https://console.groq.com/keys");
        console.log("   2. Sign up for a free account");
        console.log("   3. Generate a new API key");
        console.log("   4. Add GROQ_API_KEY=your_key to .env.local");
        console.log("   5. Restart the dev server");

        return NextResponse.json(
          {
            error:
              "Invalid or missing GROQ_API_KEY. Visit https://console.groq.com/keys to get a free API key, then add it to .env.local",
            hint: "Create .env.local file with: GROQ_API_KEY=your_actual_key_here",
          },
          { status: 401 }
        );
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
