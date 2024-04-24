import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const navigate = useNavigate();
const [cookies, removeCookie] = useCookies(['presence']);

export async function verify_login(){ // slightly modified version of verify_presence
    
    if (cookies.presence === undefined){
        return;
    }

    const url = 'http://localhost:5000/verify_presence';

    const headers = {
        "Content-type": "application/json",
        "Authorization": "Bearer" + cookies.presence
    };

    const options = {
        headers: headers,
        withCredentials: true
    };

    try {
        const response = await axios.get(url, options);
        console.log(response.data);

        if (response.data['msg'] === true){
            navigate('/')
        } else{
            navigate('/login')
        }
    } catch (error) {
        console.error("Error: ", error); // will remove log
    }
}

