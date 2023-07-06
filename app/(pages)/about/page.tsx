import React from "react";

// about page component
function About() {
  return (
    <main className="main w-full flex flex-col items-center pb-20 bg-[#F5F5F5]">
      <div className="flex flex-col items-center mt-5">
        <h1 className="text-4xl">About</h1>

        <div className="md:max-w-xl md:mt-10 bg-white w-full px-5 mt-5">
          <p className="text-xl mb-4 mt-5 ">
            <b>playwhat</b> uses the{" "}
            <a
              href="https://openai.com/blog/openai-api/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              OpenAI API
            </a>{" "}
            to generate video game recommendations based on a game you like.
          </p>
          <p className="text-xl mb-4">
            Because I don't wanna pay the $20 or whatever Vercel asks, the API calls can take a bit of time to
            finish or occasionally result in a timeout error ¯\_(ツ)_/¯
          </p>
        </div>
      </div>
    </main>
  );
}

export default About;
