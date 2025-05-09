import type { APIResponse } from "@/types";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
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
		const completion = await openai.responses.create({
			model: "gpt-3.5-turbo",
			input: getDescriptionsPrompt(game, recommendedGame),
			instructions:
				"You are a helpful assistant that provides game descriptions.",
		});

		const description = completion.output_text;
		return new Response(JSON.stringify(description));
	} catch (error: unknown) {
		const response = (error as APIResponse).response;

		if (response) {
			return new Response(JSON.stringify({ error: response.data }), {
				status: response.status,
			});
		}

		return new Response(
			JSON.stringify({
				error:
					error instanceof Error ? error.message : "An unknown error occurred",
			}),
			{ status: 500 },
		);
	}
}

function getDescriptionsPrompt(game: string, recommendedGame: string) {
	const prompt = `Explain how ${recommendedGame} is similar to ${game} in a short paragraph.`;

	return prompt;
}
