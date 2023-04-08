import axios from "axios";

// rawg api key
const API_KEY = process.env.RAWG_API_KEY;

export default async function randomGame(_req, res) {
  const random = await axios.get("https://api.rawg.io/api/games", {
    params: {
      key: API_KEY,
      page_size: 30,
    },
  });

  // pick a random game and return image/name
  const randomNumber = Math.floor(Math.random() * random.data.results.length);
  const randomItem = random.data.results[randomNumber];
  res.status(200).json({ image: randomItem.background_image, name: randomItem.name });
}
