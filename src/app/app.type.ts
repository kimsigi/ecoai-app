import { INIT_STATE } from "./app.constant";
import { MAIN_ROUTES } from "./app.route";

export type InitState =
  (typeof INIT_STATE)[keyof typeof INIT_STATE];

export type StackParamList = {
  [MAIN_ROUTES.SHOWCASE]: undefined;
  [MAIN_ROUTES.PERMISSION]: undefined;
  [MAIN_ROUTES.LOCATION_PICKER]: undefined;
  [MAIN_ROUTES.AI_CHAT]: undefined;
};