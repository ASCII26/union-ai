import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import "./styles.css";
import { UnionAI } from "@unionai/core";

export const unai = new UnionAI({
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
  },
  claude: {
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY as string,
  },
});

const app = createApp(App);

app.use(Antd).mount("#app");
