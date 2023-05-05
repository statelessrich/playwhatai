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

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(game, age),
      temperature: 0.3,
      max_tokens: 3000,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
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

function generatePrompt(game, age) {
  return `Suggest 2 video games, in order, that are most similar to ${game} that is a ${age} game and for each provide the platform and a paragraph explaining why it's similar. A classic game is one released before 2006, a modern game is one released after 2005. Then suggest a list of the 3 next most similar games. Give results in a javascript object like this: {"games":[{"name": "[name of game]", "platform":"[platform game is available on] "description": "[description of how game is similar to ${game}]"}], "other": [array of 3 other similar games]}.

example response:{"games":[{"name": "<name>","platform":"<platform>", "description": "<description>",
}],"other":["<other1>","<other2>","<other3>"]}`;
}

// Game: Grand Theft Auto III
// Similar games:
// {games: [{name:"Grand Theft Auto: Vice City",description:"another game in the series"}, {name:"Grand Theft Auto IV",description:"another game in the series"}, {name:"Saint's Row",description:"a game directly inspired by GTA"}]}
// Game: Super Mario Bros.
// Similar Games:
// {games: [{name:"Super Mario World",description:"another game in the series"}, {name:"Wario Land",description:"another game in the series"}, {name:"Donkey Kong Country",description:"another game in the series"}]}
// Game: ${game}
// Similar Games:;
