import Anthropic from '@anthropic-ai/sdk';
import { getCatalogPrompt } from '@/lib/ai-catalog';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt, context } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return Response.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Build the system prompt with catalog
    const systemPrompt = getCatalogPrompt();

    // Build context string
    let contextString = '';
    if (context) {
      if (context.timeOfDay) {
        contextString += `Current time of day: ${context.timeOfDay}. `;
      }
      if (context.sessionCount !== undefined) {
        contextString += `User has completed ${context.sessionCount} sessions. `;
      }
      if (context.favoritePattern) {
        contextString += `User's favorite pattern: ${context.favoritePattern}. `;
      }
    }

    const userMessage = contextString
      ? `Context: ${contextString}\n\nUser request: ${prompt}`
      : prompt;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    // Extract the text content
    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return Response.json(
        { error: 'No text response from AI' },
        { status: 500 }
      );
    }

    // Parse the JSON from the response
    const responseText = textContent.text;

    // Try to extract JSON from the response (it might be wrapped in markdown code blocks)
    let jsonString = responseText;

    // Remove markdown code block if present
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1].trim();
    }

    try {
      const components = JSON.parse(jsonString);
      return Response.json({ components });
    } catch {
      // If JSON parsing fails, return the raw text for debugging
      return Response.json(
        {
          error: 'Failed to parse AI response as JSON',
          rawResponse: responseText
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('AI generation error:', error);

    if (error instanceof Anthropic.APIError) {
      return Response.json(
        { error: `Anthropic API error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
