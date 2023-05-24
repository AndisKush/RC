import "./NavBar.css";
import { useHistory } from "react-router-dom";

import Home from '../images/icons/home.png';
import Cliente from '../images/icons/cliente.png';
import Produto from '../images/icons/produto.png';
import OS from '../images/icons/os.png';
import Financeiro from '../images/icons/financeiro.png';
import Compras from '../images/icons/compras.png'
import Relatorios from '../images/icons/relatorios.png'
import Config from '../images/icons/config.png'
import { useEffect, useState } from "react";
import Axios from 'axios';

const NavBar = () => {
    let history = useHistory();
    const [count, setCount] = useState(0);
    const URI = 'http://localhost:5001';


    useEffect(getCount, [])

    function goToPage(page){
        getCount();
        history.push(page);
    }

    async function getCount(){
        let result = 0;
        await Axios.get(`${URI}/countreceber`)
            .then(res => {
                result += res.data[0].count
            }).catch(window.alert);
        
        await Axios.get(`${URI}/countpagar`)
            .then(res => {
                result += res.data[0].count
            }).catch(window.alert);
        setCount(result);
    }
        


    return(
        <nav className="NavBar">
            <div className="Links">
                <div className="tooltip">
                    <img src={Home} onClick={() => goToPage("/main")} id="iconsNavBar"/>
                    <span className="tooltiptext">Home</span>
                </div>

                <div className="tooltip">
                    <img src={Cliente} onClick={() => goToPage("/clientes")} id="iconsNavBar"/>
                    <span className="tooltiptext">Parceiros</span>
                </div>


                <div className="tooltip">
                    <img src={Produto} onClick={() => goToPage("/produtos")} id="iconsNavBar"/>
                    <span className="tooltiptext">Produtos</span>
                </div>

                <div className="tooltip">
                    <img src={OS} onClick={() => goToPage("/os")} id="iconsNavBar"/>
                    <span className="tooltiptext">OS</span>
                </div>

                <div className="tooltip">
                    <img src={Compras} onClick={() => goToPage("/compras")} id="iconsNavBar"/>
                    <span className="tooltiptext">Compras</span>
                </div>

                <div className="tooltip">
                   
                    <img src={Financeiro} onClick={() => goToPage("/financeiro")} id="iconsNavBar"/>
                    <span className="tooltiptext">Financeiro</span>
                    <div className="notificationnavbar">
                        {parseFloat(count) > 0 ? " " + count + " " : null}
                    </div>  
                    
                </div>

                <div className="tooltip">
                    <img src={Relatorios} onClick={() => goToPage("/relatorios")} id="iconsNavBar"/>
                    <span className="tooltiptext">Relatórios</span>
                </div>

                <div className="tooltip">
                    <img src={Config} onClick={() => goToPage("/menuespecial")} id="iconsNavBar"/>
                    <span className="tooltiptext">Configurações</span>
                </div>

                
                
            </div>
        </nav>
    )
}

export default NavBar;