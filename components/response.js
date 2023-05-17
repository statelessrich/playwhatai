import React, { useEffect, useRef } from "react";

export default function Response({ result }) {
  const resultRef = useRef();

  // scroll into view on load
  useEffect(() => {
    resultRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="mt-10 md:max-w-5xl md:mx-auto" ref={resultRef}>
      {/* list of games */}
      {result?.games?.map((game) => (
        <div className="p-10 mb-10 bg-white" key={game.name}>
          <div>
            {/* name */}
            <h2 className="font-bold text-3xl break-words">{game.name}</h2>

            {/* platform */}
            <p className="text-sm leading-3 font-bold pt-3">{game.platform}</p>

            {/* description */}
            <p className="pt-5 leading-10 text-2xl">{game.description}</p>
          </div>
        </div>
      ))}

      {/* other games */}
      {result?.other && (
        <div className="p-10 bg-white">
          <h2 className="font-bold text-3xl">Others</h2>

          {result.other.map((game) => (
            <p className="pt-3 text-2xl" key={game}>
              {game}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
