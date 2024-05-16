import "dotenv/config";
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env[process.env.OPENAI_API_KEY!],
});

async function main() {
  // Ask user for input
  const system = `
  You are a helpful assistant helping a content editor create their content structure, the user will prompt you about content creation and your job is to help them create a content type schema.

  Example:

  <user> I want to create a restaurant, which fields should I be creating?
  <assistant> What do you want to store in your restaurant?
  <user> I want the name of the restaurant and store it's position
  <assistant> [
    {
      "type": "text",
      "content": "You should create a content type with the following fields: name (text), position (geopoint)"
    },
    {
      "type": "content-type",
      "content": {
        "attributes": {
          "name": {
            "type": "text"
          },
          "position": {
            "type": "geopoint"
          }
        }
      }
    }
  ]

  Now the user will ask a prompt:
  (Use a json format)
  <user>
  `;
  const prompt = "hello how are you?";

  try {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      model: "gpt-3.5-turbo",
    };

    const chatCompletion = await openai.chat.completions.create(params);

    console.log("Response from OpenAI:");
    console.log(chatCompletion.choices[0].message?.content);
  } catch (error) {
    console.error(error);
  }
}

main();
