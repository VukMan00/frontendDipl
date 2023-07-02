import axios  from "../api/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
    const{setAuth} = useAuth();

    const refresh = async()=>{
        console.log("ACCESS TOKEN JE ISTEKAO, REFRESHUJ GA")
        const response = await axios.post("/auth/refreshToken",{
            withCredentials:true
        });
        console.log(response);
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return {...prev, accessToken:response.data.accessToken}
        });
        console.log("NOVI TOKEN: " + response.data.accessToken);
        window.localStorage.setItem("accessToken",response.data.accessToken);
        return response.data.accessToken;
    }
  return refresh;
}

export default useRefreshToken
