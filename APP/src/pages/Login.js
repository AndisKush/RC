import React, { useEffect, useReducer, useState } from 'react'; 
import Axios from 'axios';
import Logo from '../images/logo.jpeg'
import { useHistory } from "react-router-dom"
import './Login.css'
import Botao from "../components/Botao";
//const URI = 'http://localhost:5000';
const URI = 'http://localhost:5001';


function Login(){

    const  [user, setUser] = useState('')
    const  [password, setPassword] = useState('')
    const  [users, setUsers]= useState([])
    let history = useHistory();

    useEffect(validaLogin, [users])

    const handleUser = (e) => {
        setUser(e.target.value)
    }

    const handlePassword =  (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        await getUsers();
        //validaLogin();
    }



    const getUsers = async () => {
       await Axios.get(`${URI}/users?name=${user}`).then(res => setUsers(res.data))
    }

    function validaLogin () {
        if(users !== []){
            users.map(t => password === t.password ? history.push('/main') : window.alert("Senha Incorreta"))
        } 
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            getUsers();
        }
      }
    

    

    

    return(
        <div className="Login">
            <img src={Logo} style={{width: 400, height: 400}}/>
            <div>
                <label style={{color: "white"}}>Usuário: </label><br/>
                <input type="text" value={user} required onChange={(e) => {handleUser(e)}} /><br/><br/>
                <label style={{color: "white"}}>Senha: </label><br/>
                <input type="password" value={password} required onChange={(e) => {handlePassword(e)}} onKeyPress={handleKeyPress}/><br/>
                <br/><Botao props={"Entrar"} type={'MenuFinanceiroSelecionado'} onClick={handleSubmit} onP/>
            </div>
        </div>
    )

}
export default Login;