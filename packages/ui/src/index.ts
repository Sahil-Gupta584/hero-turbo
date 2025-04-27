import dotenv from "dotenv";
import path from "path";

import { dirname } from "path";
const __dirname = dirname(require.resolve("./"));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export { default as Header } from "./header.tsx";
export { default as ImportButton } from "./importButton.tsx";
export { default as Tag } from "./tag.tsx";
export { default as ThemeSwitch } from "./themeSwitch.tsx";
export { default as VideoCard } from "./videoCard.tsx";
export { default as VideoComponent } from "./videoComponent.tsx";
export { default as VideoDropdown } from "./videoDropdown.tsx";
