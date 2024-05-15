import { intro, outro, confirm, text, spinner } from "@clack/prompts";
import "dotenv/config";
import { openai } from "./lib/openapi";
import OpenAI from "openai";

const s = spinner();
async function main() {
  // Ask user for input
  intro("Welcome to the Strapi Content CLI!");

  const userInput = await text({
    message: "What would you like to ask OpenAI?",
  });

  // Confirmation
  const confirmInput = await confirm({
    message: `You asked: "${userInput as string}". Proceed?`,
  });

  if (!confirmInput) {
    console.log("Operation cancelled.");
    return;
  }

  const s = spinner();
  try {
    s.start("Fetching response from OpenAI...");

    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [{ role: "user", content: userInput as string }],
      model: "gpt-3.5-turbo",
    };

    const chatCompletion = await openai.chat.completions.create(params);

    s.stop();
    console.log("Response from OpenAI:");
    console.log(chatCompletion.choices[0].message?.content);
  } catch (error) {
    s.stop("An error occurred while fetching response from OpenAI");
    console.error(error);
  }
}

main();
