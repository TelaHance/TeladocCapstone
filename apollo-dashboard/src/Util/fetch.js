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
    if (options?.noJSON || response.status === 204) {
        return response;
    }
    return response.json();
}

export async function fetchWithUser(url, token, method, uid) {
    const response = await unfetch(url, {
        method: method,
        headers: {
            "x-api-key": `${token}`,
        },
        body: JSON.stringify({"user_id": uid})
    });
    if (response.status >= 400 && response.status < 600) {
        throw new Error(response.error_description);
    }
    return response.json();
}
