import axios from "axios";

// rawg api key
const API_KEY = process.env.RAWG_API_KEY;

export default async function randomGame() {
  try {
    const random = await axios.get("https://api.rawg.io/api/games", {
      params: {
        key: API_KEY,
        page_size: 30,
      },
    });

    // handle error from api
    if (random.status !== 200) {
      return null;
    }

    // pick a random game and return image/name
    const randomNumber = Math.floor(Math.random() * random.data.results.length);
    const randomItem = random.data.results[randomNumber];
    return { image: randomItem.background_image, name: randomItem.name };
  } catch {
    // handle bad api call
    console.log("error: bad api call");
    return null;
  }
}
