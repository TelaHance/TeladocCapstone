import unfetch from "isomorphic-unfetch";

export async function fetchWithToken(url, token, options) {
    const response = await unfetch(url, {
        ...options,
        headers: {
            ...options?.headers,
            "x-api-key": token,
        },
    });
    if (response.status >= 400 && response.status < 600) {
        throw new Error(response.error_description);
    }
    if (options?.noJSON) {
        return response;
    }
    return response.json();
}
