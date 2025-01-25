import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { plan, language } = await req.json();

    const prompt = `
    Generate a detailed and optimized daily schedule based on the following plan: ${plan}. 
    The schedule should be well-organized and balanced, considering the following key aspects for an overall fulfilling day:
    1. Daily Responsibilities: Identify and prioritize the essential tasks for the day, including household duties, errands, personal projects, or anything that needs to be accomplished. Ensure time for focused activity or tasks that require attention.
    2. Breaks and Relaxation: Plan for regular breaks throughout the day to maintain energy and focus. These breaks can be short and simple, like stretching, walking, or taking a moment to relax. A good balance of work and relaxation helps prevent burnout and keeps the day productive.
    3. Meals and Hydration: Make sure to allocate time for balanced meals (breakfast, lunch, and dinner) and stay hydrated. Eating at regular intervals and drinking water throughout the day keeps you energized and focused.
    4. Leisure and Personal Time: Reserve time for hobbies, fun activities, or relaxation to unwind and recharge. Whether it's reading, watching a show, exercising, or spending time with loved ones, personal time contributes to emotional and mental well-being.
    5. Physical Activity: Include some form of light physical activity, whether it’s a walk, yoga, or stretching. Regular movement keeps your body healthy and can improve mood and focus.
    6. Sleep and Rest: Ensure at least 7-8 hours of sleep each night to recharge and maintain optimal energy levels. Try to follow a regular sleep schedule for better rest and recovery.
    7. Flexibility: Allow some flexibility in the schedule for unplanned events or delays. This ensures that the day remains manageable and doesn’t feel too rigid.
    8. Self-care and Mindfulness: Include moments for self-care, such as meditation, journaling, or any activity that helps you relax and stay grounded. Taking care of your mental health is just as important as physical well-being.
    9. Healthy Habits: Incorporate habits that contribute to your physical and mental health, like drinking water, stretching, and spending time outdoors. Small habits throughout the day can lead to long-term benefits.

    The schedule should be in chronological order, with clear and easy-to-follow time slots for each activity. It should strike a balance between productivity, relaxation, and well-being, ensuring that the day is fulfilling and sustainable.

    This content is written in the language: ${language}.
`;


    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const schedule = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Something went wrong while generating your schedule. We're working on it! Please try again soon.";

    return NextResponse.json({ schedule });
  } catch {
    return NextResponse.json({ error: "Something went wrong while generating your schedule. We're working on it! Please try again soon." }, { status: 500 });
  }
}
