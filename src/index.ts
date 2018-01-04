import "./index.pcss";
import { MyModule } from "./components/my-module";

export const Init = () => {
  return new MyModule().Init();
};
