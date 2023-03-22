import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  // format: json,
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
  const genre = req.body.genre || "";
  const platform = req.body.platform || "";
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
    // res.status(200).json({
    //   result:
    //     '\n\n{"games":[{"name": "Paper Mario", "description": "Paper Mario is a role-playing game similar to Mario RPG in that it follows the same general premise of Mario\'s adventures, but with a paper-based art style. Players have to explore levels and combat foes in order to progress. The game also has a variety of puzzles and mini-games to complete, just like in Mario RPG."}, \n{"name": "Mario & Luigi: Superstar Saga", "description": "Mario & Luigi: Superstar Saga is another role-playing game in the Mario franchise that follows a similar format to Mario RPG. Players control Mario and Luigi as they explore various worlds and battle enemies. The game also features puzzles, mini-games and a turn-based combat system similar to Mario RPG."}, \n{"name": "Super Mario RPG: Legend of the Seven Stars", "description": "Super Mario RPG: Legend of the Seven Stars is the game that started it all, and is the original Mario RPG. The game follows the same basic premise as Mario RPG, with players exploring levels, solving puzzles and fighting enemies in turn-based combat. The game also features a unique art style and a variety of characters to interact with, just like in Mario RPG."}]\n}',
    // });
    // return;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(game, genre, platform, age),
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

function generatePrompt(game, genre, platform, age) {
  return `Suggest 3 video games that are most similar to ${game} in the ${genre} genre (optional) for the ${platform} platform (optional) that is a ${age} game (optional) and for each provide a paragraph explaining why it's similar. Give results in a javascript object like this: {"games":[{"name": "[name of game]", "description": "[description of how game is similar to ${game}]"}.

  game: Super Mario RPG, genre: RPG, age: classic.
  response:{"games":[{"name": "<name>","description": "<description>"}]}`;
}

// Game: Grand Theft Auto III
// Similar games:
// {games: [{name:"Grand Theft Auto: Vice City",description:"another game in the series"}, {name:"Grand Theft Auto IV",description:"another game in the series"}, {name:"Saint's Row",description:"a game directly inspired by GTA"}]}
// Game: Super Mario Bros.
// Similar Games:
// {games: [{name:"Super Mario World",description:"another game in the series"}, {name:"Wario Land",description:"another game in the series"}, {name:"Donkey Kong Country",description:"another game in the series"}]}
// Game: ${game}
// Similar Games:;
