import OpenAI from "openai";
import { knexapp } from "../index";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const getPlaceSummary = async (placeName: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful tour guide. you know everything about all the places in the world",
      },
      {
        role: "user",
        content: `Give me a brief summary of following place (in 1 sentence): ${placeName}`,
      },
    ],
    store: true,
  });

  return completion.choices[0].message;
};

const getSummaryAPI = async (req: any, res: any) => {
  const { placeName } = req.query as { placeName: string };

  const trip = await knexapp("location_summaries")
    .where({ location_name: placeName.toLocaleLowerCase() })
    .first();

  if (trip) {
    return res.status(200).json({
      summary: trip.location_summary,
    });
  } else {
    const message = await getPlaceSummary(placeName);
    await knexapp("location_summaries").insert({
      location_name: placeName.toLocaleLowerCase(),
      location_summary: message["content"],
    });
    return res.status(200).json({
      summary: message["content"],
    });
  }
};

export { getSummaryAPI };
