import { useEffect, useState } from "react";
import { fetchTipoProduto } from "../helpers/API";

const DropDownTipoProduto = ({alteracao, idtipoproduto, onChange = () => {}}) => {
    const [tipos, setTipos] = useState([]);
    useEffect(()=> {
        fetchTipoProduto().then((tipos) =>{
            setTipos(tipos);
        })
    },[])

    return (
        Boolean(!alteracao) ? 
        <select id="tipoproduto" name="tipoproduto" onChange={onChange} style={{width:'280px'}}>
            {tipos.map((tipo) => {
                const {id,descricao} = tipo;
                return (<option value = {descricao} key={id} id={id}>{descricao}</option>)
            })
                
            }
        </select>
        : 
        <select id="tipoproduto" name="tipoproduto" onChange={onChange} style={{width:'280px'}}>
            
            {tipos.map((tipo) => {
                
                const {id,descricao} = tipo;
 
                if(id == idtipoproduto){
                    
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




export default DropDownTipoProduto;