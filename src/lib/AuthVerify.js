import { useEffect } from "react";
import { useLocation } from "react-router-dom";


const parseJWT = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch(e) {
        return null;
    }
};

const AuthVerify = (props) => {
    let location = useLocation();

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            const decodedJWT = parseJWT(user.accessToken);
            if (decodedJWT.exp * 1000 < Date.now()) {
                props.logOut();
            }
        };

        return () => user = null

    }, [location, props]);

    return;
};

export default AuthVerify;