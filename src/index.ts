import "./index.pcss";
import { MyModule } from './components/js-umd-lib-boilerplate';

export const Init = () => {
  return new MyModule().Init();
}