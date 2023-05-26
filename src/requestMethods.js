import axios from 'axios';
import { TOKEN } from './constants';
import jwt_decode from "jwt-decode";

export const BASE_URL = 'https://dark-tan-yak-garb.cyclic.app/api';

export const publicRequest = axios.create({
    baseURL: BASE_URL
});

export const userRequest = axios.create({
    baseURL: BASE_URL,
});

export const updateRefreshToken = (refreshToken, refreshTokenId) => {
    localStorage.setItem(TOKEN, JSON.stringify({
        refreshToken,
        refreshTokenId
    }))
};

export const getRefreshToken = () => JSON.parse(localStorage.getItem(TOKEN) || '{}');

export const existRefreshToken = () => !!getRefreshToken().refreshToken;

export const clearRefreshToken = () => localStorage.removeItem(TOKEN);

userRequest.interceptors.request.use(async (config) => {
    let existingAccessToken = !!config.headers.token;
    if (existingAccessToken) {
        const accessToken = config.headers.token?.substring(7);
        let currentDate = new Date();
        const decodedToken = accessToken && jwt_decode(accessToken);
        existingAccessToken = decodedToken && decodedToken.exp * 1000 < currentDate.getTime();
    }
    if (!existingAccessToken) {
        const { refreshToken, refreshTokenId } = getRefreshToken();
        try {
            const res = await publicRequest.put("/auth/refresh_token", { refreshToken, refreshTokenId });
            updateRefreshToken(res.data.refreshToken, refreshTokenId);
            config.headers["token"] = "Bearer " + res.data.newAccessToken;
        } catch (err) {
            console.error(err)
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error)
});
