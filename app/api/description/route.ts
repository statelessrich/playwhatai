import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  if (!configuration.apiKey) {
    return new Response(
      JSON.stringify({
        error: {
          message: "An error occurred during your request.",
        },
      }),
      { status: 500 },
    );
  }

  const { game, recommendedGame } = await request.json();

  // validate input
  if (!game || game.trim().length === 0) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Missing game",
        },
      }),
      { status: 400 },
    );
  }

  if (!recommendedGame || recommendedGame?.trim().length === 0) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Missing recommended game",
        },
      }),
      { status: 400 },
    );
  }

  try {
    const test = 0;

    if (test) {
      // return new Response(
      //   JSON.stringify({
      //     error: {
      //       message: "An error occurred during your request.",
      //     },
      //   }),
      //   { status: 500 },
      // );
      // return;

      return new Response(JSON.stringify("desc"));
    }

    // get game description from openai
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: getDescriptionsPrompt(game, recommendedGame),
      temperature: 0.3,
      max_tokens: 3000,
    });

    const description = completion.data.choices[0].text;
    return new Response(JSON.stringify(description));
  } catch (error: any) {
    if (error.response) {
      return new Response(JSON.stringify({ error: error.response.data }), { status: error.response.status });
    } else {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
}

function getDescriptionsPrompt(game: string, recommendedGame: string) {
  const prompt = `Explain how ${recommendedGame} is similar to ${game} in a short paragraph.`;

  return prompt;
}
