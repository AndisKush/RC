import { useEffect, useState } from "react";
import { fetchTipoPagar } from "../helpers/API";

const DropDownTipoPagar = ({alteracao=false, idtipopagar, onChange = () => {}}) => {
    const  [tipos, setTipos] = useState([]);
    useEffect(()=> {
        fetchTipoPagar().then((tipos) =>{
            setTipos(tipos);
        })
    },[])

    return (
        Boolean(!alteracao) ? 
        <select id="tipopagar" name="tipopagar" onChange={onChange} style={{width:'280px'}}>
            <option value="">Selecione um Tipo...</option>
            {tipos.map((tipo) => {
                const {id,descricao} = tipo;
                return (<option value = {descricao} key={id} id={id} descricao={descricao}>{descricao}</option>)
            })
                
            }
        </select>
        :
        <select id="tipopagar" name="tipopagar" onChange={onChange} style={{width:'280px'}}>

            {tipos.map((tipo) => {
                const {id,descricao} = tipo;
                if(id == idtipopagar){
                    return (<option selected value = {descricao} key={id} id={id} descricao={descricao}>{descricao}</option>)
                }
                else {
                    return (<option value = {descricao} key={id} id={id} descricao={descricao}>{descricao}</option>)
                }
            })
                
            }
        </select>
    )
}

export default DropDownTipoPagar;