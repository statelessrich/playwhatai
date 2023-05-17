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
  const age = req.body.age || "";

  if (game.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid game",
      },
    });
    return;
  }

  try {
    const test = 0;

    if (test) {
      res.status(200).json({
        result:
          '\n\n{"games":[{"name": "Fallout 3", "platform":"Super Nintendo Entertainment System (SNES)", "description": "Paper Mario is a role-playing game similar to Mario RPG in that it follows the same general premise of Mario\'s adventures, but with a paper-based art style. Players have to explore levels and combat foes in order to progress. The game also has a variety of puzzles and mini-games to complete, just like in Mario RPG."}, \n{"name": "Mario & Luigi: Superstar Saga", "platform":"DS", "description": "Mario & Luigi: Superstar Saga is another role-playing game in the Mario franchise that follows a similar format to Mario RPG. Players control Mario and Luigi as they explore various worlds and battle enemies. The game also features puzzles, mini-games and a turn-based combat system similar to Mario RPG."}], "other": ["Chrono Trigger","Earthbound","Dragon Quest"]\n}',
      });
      return;
    }

    const gamesCompletion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: getGamesPrompt(game, age),
      temperature: 0.3,
      max_tokens: 3000,
    });

    const recommendedGames = JSON.parse(gamesCompletion.data.choices[0].text);
    console.log(recommendedGames);

    const descriptionsCompletion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: getDescriptionsPrompt(game, recommendedGames),
      temperature: 0.3,
      max_tokens: 3000,
    });

    const descriptions = JSON.parse(descriptionsCompletion.data.choices[0].text)?.descriptions;
    console.log(descriptions);

    // add descriptions to games object
    descriptions.forEach((description) => {
      const game = recommendedGames.games.find((game) => game.name === description.name);
      if (game) {
        game.description = description.description;
      }
    });

    res.status(200).json(recommendedGames);
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

function getGamesPrompt(game, age) {
  // optionally get list of 3 other game recommendations
  const withOther = 0;

  const prompt = `Suggest 2 video games, that are most similar to ${game} that is a ${age} game. A classic game is one released before 2006, a modern game is one released after 2005. Give results in a javascript object like this: {"games":[{"name": "[name of game]", "platform":"[platform game is available on]"}]}.
  
  example response:{"games":[{"name": "<name>","platform":"<platform>"}]}
`;

  console.log(`prompt: ${prompt}`);
  return prompt;
}

function getDescriptionsPrompt(game, recommendedGames) {
  // optionally get list of 3 other game recommendations
  const withOther = 0;

  const gameNames = recommendedGames.games.map((game) => game.name);

  const prompt = `For each recommended game, give a separate description of how it is similar to ${game}. Give results in a javascript object like this: {"descriptions":[{"name": "[name of game]", "description":"[description]"}]}.

  Recommended games: ${gameNames}
  `;

  // example response:{[{"name": "<name>","platform":"<platform>"}]}

  console.log(`prompt: ${prompt}`);
  return prompt;
}

//  and for each provide the platform and a paragraph explaining why it's similar
// ${
//     withOther ? "Then suggest a list of the 3 next most similar games." : ""
//   }
//  "description": "[description of how game is similar to ${game}]"
// ${
//     withOther ? ', "other": [array of 3 other similar games]' : ""
//   }
// , "description": "<description>"
// ${withOther ? ',"other":["<other1>","<other2>","<other3>"]`:""}

// Game: Grand Theft Auto III
// Similar games:
// {games: [{name:"Grand Theft Auto: Vice City",description:"another game in the series"}, {name:"Grand Theft Auto IV",description:"another game in the series"}, {name:"Saint's Row",description:"a game directly inspired by GTA"}]}
// Game: Super Mario Bros.
// Similar Games:
// {games: [{name:"Super Mario World",description:"another game in the series"}, {name:"Wario Land",description:"another game in the series"}, {name:"Donkey Kong Country",description:"another game in the series"}]}
// Game: ${game}
// Similar Games:;
