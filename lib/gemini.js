// import { GoogleGenAI } from '@google/genai';

// if (!process.env.GEMINI_API_KEY) {
//   throw new Error('GEMINI_API_KEY is not set in environment variables');
// }

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateTravelPlan(prompt, destination, duration) {
  try {
    // if (!process.env.GEMINI_API_KEY) {
    //   throw new Error('GEMINI_API_KEY is not set in environment variables');
    // }

    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }

    const enhancedPrompt = `You are an expert travel planner. Create a detailed ${duration}-day travel plan for ${destination} based on the following user request:

"${prompt}"

You MUST respond with a valid JSON object with the following exact structure:

{
  "title": "A catchy title for the destination (e.g., 'Paris: The Ultimate City of Lights')",
  "description": "An engaging 2-3 sentence description about the destination and what makes this trip special (minimum 100 characters)",
  "highlights": [
    {
      "type": "attraction",
      "title": "Attraction name",
      "description": "Detailed description with practical information",
      "rating": "4.8 ★",
      "icon": "tower-control",
      "color": "emerald"
    },
    {
      "type": "food",
      "title": "Food/Gastronomy experience",
      "description": "Description of local cuisine",
      "rating": null,
      "icon": "croissant",
      "color": "purple"
    },
    {
      "type": "tips",
      "title": "Travel Tips",
      "description": "Practical travel tips",
      "rating": null,
      "icon": "lightbulb",
      "color": "yellow"
    },
    {
      "type": "budget",
      "title": "Budget Estimate",
      "description": "Cost breakdown",
      "rating": null,
      "icon": "wallet",
      "color": "rose"
    }
  ],
  "itinerary": [
    {
      "dayNumber": 1,
      "title": "Day 01: Descriptive title",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Activity name",
          "description": "Activity description with tips"
        }
      ]
    }
  ],
  "budget": "€500 - €800 per person"
}

Requirements:
1. Provide 4-6 highlights (2-3 attractions, 1 food, 1 tips, optionally 1 budget)
2. Create exactly ${duration} days in the itinerary
3. Each day should have 3-5 activities with specific times
4. Use appropriate icons: tower-control/frame/crown for attractions, croissant for food, lightbulb for tips, wallet for budget
5. Use appropriate colors: emerald/orange/blue for attractions, purple for food, yellow for tips, rose for budget
6. Make the plan practical, engaging, and full of insider tips

Respond ONLY with the JSON object, no additional text.`;

    // const response = await ai.models.generateContent({
    //   model: 'gemini-2.0-flash',
    //   contents: enhancedPrompt,
    //   config: {
    //     responseMimeType: 'application/json',
    //   },
    // });

    // let responseText = '';
    // if (typeof response.text === 'function') {
    //   responseText = response.text();
    // } else if (typeof response.text === 'string') {
    //   responseText = response.text;
    // } else if (response.response?.text) {
    //   if (typeof response.response.text === 'function') {
    //     responseText = response.response.text();
    //   } else {
    //     responseText = response.response.text;
    //   }
    // } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
    //   responseText = response.candidates[0].content.parts[0].text;
    // }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: enhancedPrompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '';

    if (!responseText) {
      throw new Error('Empty response from API - could not extract text');
    }

    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedText);

      if (typeof parsedResponse === 'string') {
        parsedResponse = JSON.parse(parsedResponse);
      }
    } catch (parseError) {
      console.error(
        'Failed to parse JSON response:',
        cleanedText.substring(0, 500)
      );
      throw new Error(`Invalid JSON response from AI: ${parseError.message}`);
    }

    if (Array.isArray(parsedResponse)) {
      if (parsedResponse.length === 0) {
        throw new Error('Empty response array from AI');
      }
      parsedResponse = parsedResponse[0];
    }

    if (!parsedResponse || typeof parsedResponse !== 'object') {
      throw new Error('AI returned invalid response structure');
    }

    if (
      !parsedResponse.title ||
      !parsedResponse.description ||
      !parsedResponse.highlights ||
      !parsedResponse.itinerary
    ) {
      throw new Error(
        'AI response missing required fields (title, description, highlights, or itinerary)'
      );
    }

    return parsedResponse;
  } catch (error) {
    console.error('Error generating travel plan with Groq:', error);
    throw error;
  }
}
