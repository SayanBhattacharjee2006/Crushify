import axios from "axios"

const api = axios.create({
    baseURL:"/api/v1", //adds the base url as prefix in every request
    withCredentials:true, // allows to send the cookies and jwt
})

// intercepertor allows us to run a login before a request is send or after a response is received

// request interceptor , runs before request leaves browser
api.interceptors.request.use(
    (config) => {
        // Let browser set multipart boundary for FormData requests.
        if (config.data instanceof FormData) {
            if (typeof config.headers?.set === "function") {
                config.headers.set("Content-Type", undefined);
            } else if (config.headers) {
                delete config.headers["Content-Type"];
                delete config.headers["content-type"];
            }
        }

        const token = localStorage.getItem("token")
        if(token){
            config.headers.Authorization = `Bearer ${token}` //if user authorized then send the jwt token as header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// response interceptors runs after the reponce received
api.interceptors.response.use(
    (config) => {
        return config;
    },
    (error) => {
        if(error?.response?.status === 401){
            localStorage.removeItem("token") // if the response says unauthorized request made then remove any token if present
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

export default api;
