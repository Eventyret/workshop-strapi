import "dotenv/config";
import fs from "fs";
import path from "path";
import { createJsonTranslator, createLanguageModel } from "typechat";

import { createTypeScriptJsonValidator } from "typechat/ts";
import { fileURLToPath } from "url";

import type { LLMResponse } from "./response-schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const systemPrompt = `
You will create a Strapi Content Type Schema.


You will also be challenging the schema and ask for more information about
the domain to improve it.

Do not summarize the fields you are creating on the schema on the text action
if not asked by the user.

The text action is mandatory.

Example:
I want to create a restaurant, which fields should I be creating?

Valid Response:
  {
    "actions": [
      {
        "type": "text",
        "content": "Here are some proposals"
      },
      {
        "type": "content-type",
        "content": {
          "attributes": {
            "name": {
              "type": "text"
            },
            "position": {
              "type": "coordinates"
            }
          }
      }
    ]

  }
`;

const main = async () => {
  // Create a model.
  const model = createLanguageModel({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: "gpt-3.5-turbo",
    OPENAI_ENDPOINT: "https://api.openai.com/v1/chat/completions",
  });

  // Create a validator.
  const schema = fs.readFileSync(
    path.join(__dirname, "response-schema.ts"),
    "utf8"
  );
  const validator = createTypeScriptJsonValidator<LLMResponse>(
    schema,
    "LLMResponse"
  );

  // Create a translator.
  const translator = createJsonTranslator(model, validator);

  // Process requests interactively or from the input file specified on the command line
  const response = await translator.translate(
    "I want to create a country content type, could you help me create it?",
    systemPrompt
  );

  console.log(JSON.stringify(response.data, null, 2));
};

main();
