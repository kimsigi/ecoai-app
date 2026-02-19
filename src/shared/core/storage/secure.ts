import EncryptedStorage from "react-native-encrypted-storage";

/* ==================================================
 * 내부 키 (외부 공개 금지)
 * ================================================== */
const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "REFRESH_TOKEN";

/* ==================================================
 * 타입
 * ================================================== */

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

/* ==================================================
 * 저장
 * ================================================== */

/**
 * 토큰 저장
 */
export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await EncryptedStorage.setItem(
    ACCESS_TOKEN_KEY,
    tokens.accessToken
  );

  await EncryptedStorage.setItem(
    REFRESH_TOKEN_KEY,
    tokens.refreshToken
  );
}

/* ==================================================
 * 조회
 * ================================================== */

/**
 * Access Token 조회
 */
export async function getAccessToken(): Promise<string | null> {
  return EncryptedStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Refresh Token 조회
 */
export async function getRefreshToken(): Promise<string | null> {
  return EncryptedStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * 두 토큰 모두 조회
 */
export async function getTokens(): Promise<AuthTokens | null> {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
}

/* ==================================================
 * 삭제 (로그아웃)
 * ================================================== */

/**
 * 토큰 삭제
 */
export async function clearTokens(): Promise<void> {
  await EncryptedStorage.removeItem(ACCESS_TOKEN_KEY);
  await EncryptedStorage.removeItem(REFRESH_TOKEN_KEY);
}
