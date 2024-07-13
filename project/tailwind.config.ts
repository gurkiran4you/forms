import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'wheat': "url('/images/wheat.jpg')",
      },
    }
  }
} satisfies Config;
