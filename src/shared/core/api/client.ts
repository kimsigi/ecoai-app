import { API } from '../config';
import { authHttp, http, kakaoHttp } from './http';

/**
 * GET
 */
export async function get<T>(
    url: string,
    params?: Record<string, unknown>,
): Promise<T> {
    const { data } = await http.get<T>(url, { params });
    return data;
}

/**
 * POST
 */
export async function post<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await http.post<T>(url, body);
    return data;
}

/**
 * PUT
 */
export async function put<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await http.put<T>(url, body);
    return data;
}

/**
 * DELETE
 */
export async function del<T>(url: string): Promise<T> {
    const { data } = await http.delete<T>(url);
    return data;
}

/**
 * AUTH GET
 */
export async function authGet<T>(
    url: string,
    params?: Record<string, unknown>,
): Promise<T> {
    const { data } = await authHttp.get<T>(url, { params });
    return data;
}

/**
 * AUTH POST
 */
export async function authPost<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await authHttp.post<T>(url, body);
    return data;
}

/**
 * KAKAO GET
 */
export async function kakaoGet<T>(
    url: string,
    params?: Record<string, unknown>,
): Promise<T> {
    const { data } = await kakaoHttp.get<T>(url, { params });
    return data;
}
