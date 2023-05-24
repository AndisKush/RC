import { useEffect, useState } from "react";
import { fetchMarcas } from "../helpers/API";
import Select from 'react-select';

const DropDownMarcas = ({alteracao, idmarca, onChange = () => {}}) => {
    const [marcas, setMarcas] = useState([]);
    useEffect(()=> {
        fetchMarcas().then((marcas) =>{
            setMarcas(marcas);
        })
    },[])

    return (
        Boolean(!alteracao) ? 
        <select id="marcas" descricao="descricao" onChange={onChange} style={{width:'280px'}}>
            {marcas.map((marca2) => {
                const {id,descricao} = marca2;
                return (<option value = {descricao} key={id} id={id}>{descricao}</option>)
            })
                
            }
        </select>
        : 
        <select id="marcas" descricao="descricao" onChange={onChange} style={{width:'280px'}}>
            
            {marcas.map((marca2) => {
                
                const {id,descricao} = marca2;
 
                if(id == idmarca){
                    
                    return (<option selected value = {descricao} key={id} id={id}>{descricao}</option>)
                }
                else{

                    return (<option value = {descricao} key={id} id={id}>{descricao}</option>)
                }
                
            })
                
            }
        </select>
    )
}




export default DropDownMarcas;