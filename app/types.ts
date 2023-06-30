export interface Game {
  name: string;
  platform: string;
  description: string;
  image?: string;
}

 export interface Recommendations {
   games: Game[];
   other: string[];
 }