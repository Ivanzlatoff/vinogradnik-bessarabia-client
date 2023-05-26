import { clearRefreshToken, publicRequest, updateRefreshToken, userRequest } from "../requestMethods";
import { 
    loginFailure, 
    loginStart, 
    loginSuccess,
    logoutStart, 
    logoutSuccess, 
    logoutFailure 
} from "./userRedux"
import { toast } from 'react-hot-toast';


export const login = async (dispatch, user) => {
    dispatch(loginStart());
    try {
        const res = await publicRequest.post("/auth/login", user);
        const { accessToken, refreshToken, refreshTokenId, ...others } = res.data;
        dispatch(loginSuccess(others));
        updateRefreshToken(refreshToken, refreshTokenId);
    } catch(err) {
        console.log(err)
        dispatch(loginFailure());
        toast.error(err.response.data.error);
    }
};

export const logout = async (dispatch, refreshTokenId) => {
    dispatch(logoutStart());
    try {
        await userRequest.post("/auth/logout_post", refreshTokenId)
        dispatch(logoutSuccess());
        clearRefreshToken();
        delete userRequest.defaults.headers.common["token"];
    } catch(err) {
        dispatch(logoutFailure());
        console.log(err);
    }
};