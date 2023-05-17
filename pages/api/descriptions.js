import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const game = req.body.game || "";
  const recommendedGames = req.body.recommendedGames || "";

  if (game.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Missing game",
      },
    });
    return;
  }

  if (!recommendedGames) {
    res.status(400).json({
      error: {
        message: "Missing recommended games",
      },
    });
    return;
  }

  try {
    const test = 0;

    if (test) {
      res.status(200).json({
        result:
          '{"games":[{"name": "Fallout 3", "description": "Paper Mario is a role-playing game similar to Mario RPG in that it follows the same general premise of Mario\'s adventures, but with a paper-based art style. Players have to explore levels and combat foes in order to progress. The game also has a variety of puzzles and mini-games to complete, just like in Mario RPG."}, {"name": "Mario & Luigi: Superstar Saga", "description": "Mario & Luigi: Superstar Saga is another role-playing game in the Mario franchise that follows a similar format to Mario RPG. Players control Mario and Luigi as they explore various worlds and battle enemies. The game also features puzzles, mini-games and a turn-based combat system similar to Mario RPG."}]}',
      });
      return;
    }

    const descriptionsCompletion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: getDescriptionsPrompt(game, recommendedGames),
      temperature: 0.3,
      max_tokens: 3000,
    });

    const descriptions = JSON.parse(descriptionsCompletion.data.choices[0].text)?.descriptions;
    console.log(descriptions);

    // add descriptions to games object
    // descriptions.forEach((description) => {
    //   const game = recommendedGames.games.find((game) => game.name === description.name);
    //   if (game) {
    //     game.description = description.description;
    //   }
    // });

    res.status(200).json(descriptions);
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function getDescriptionsPrompt(game, recommendedGames) {
  const prompt = `For each recommended game, give a separate description of how it is similar to ${game}. Give results in a javascript object like this: {"descriptions":[{"name": "[name of game]", "description":"[description]"}]}.

  Recommended games: ${recommendedGames}
  `;

  console.log(`prompt: ${prompt}`);
  return prompt;
}
