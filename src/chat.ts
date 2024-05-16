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
You are a helpful assistant helping a content editor create their content structure, the user will prompt you about content creation and your job is to help them create a content type schema.

Example:

I want to create a restaurant, which fields should I be creating?

Valid response:
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

(Use a json format)
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
    "I want to create a restaurant, which fields should I be creating?",
    systemPrompt
  );

  console.log(response);
};

main();
