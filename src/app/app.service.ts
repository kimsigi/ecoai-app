import { INIT_STATE } from "./app.constants";
import { InitState } from "./app.type";

// TODO:. 개발진행시 반드시 지워야함.
const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

async function initApp(): Promise<InitState> {
  /*
  const ota = {forceUpdate: null};//await checkOtaAndVersion();
  if (ota.forceUpdate) return INIT_STATE.FORCE_UPDATE;
  */
  const network = true;//await checkNetwork();
  if (!network) return INIT_STATE.NETWORK_ERROR;

  const hasPermission = true;//await hasRequiredPermissions();
  if (!hasPermission) return INIT_STATE.PERMISSION_REQUIRED;

  const token = true; //await getKeycloakToken();
  if (!token) return INIT_STATE.AUTH_ERROR;
  
  // TODO:. 개발진행시 반드시 지워야함.
  await sleep(2000);

  return INIT_STATE.READY;
}

export {
    initApp
}