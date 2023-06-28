import axios from "axios";

// RAWG api key
const API_KEY = process.env.RAWG_API_KEY;

export async function GET() {
  try {
    // get list of games from RAWG api
    const random = await axios.get("https://api.rawg.io/api/games", {
      params: {
        key: API_KEY,
        page_size: 30,
      },
    });

    // ignore api error; instead we'll hardcode a game
    if (random.status !== 200) {
      return null;
    }

    // pick a random game and return image and name
    const randomNumber = Math.floor(Math.random() * random.data.results.length);
    const randomItem = random.data.results[randomNumber];
    return new Response(JSON.stringify({ image: randomItem.background_image, name: randomItem.name }));
  } catch {
    // ignore api error; instead we'll hardcode a game
    return new Response(null, { status: 500 });
  }
}
