import { Claude } from "@/models/Claude/index";
import { OpenAI } from "@/models/OpenAI/index";
import { Llama } from "@/models/Llama/index";
import { Gemini } from "@/models/Gemini/index";

export const unionAI = { OpenAI, Claude, Gemini, Llama };