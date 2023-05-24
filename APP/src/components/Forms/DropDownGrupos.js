import { useEffect, useState } from "react";
import { fetchGrupos } from "../helpers/API";

const DropDownGrupos = ({alteracao=false, idgrupo, onChange = () => {}}) => {
    const  [grupos, setGrupos] = useState([]);
    useEffect(()=> {
        fetchGrupos().then((grupos) =>{
            setGrupos(grupos);
        })
    },[])

    return (
        Boolean(!alteracao) ? 
        <select id="grupos" descricao="descricao" onChange={onChange} style={{width:'280px'}}>
            {grupos.map((grupo2) => {
                const {id,descricao} = grupo2;
                return (<option value = {descricao} key={id} id={id}>{descricao}</option>)
            })
                
            }
        </select>
        :
        <select id="grupos" descricao="descricao" onChange={onChange} style={{width:'280px'}}>

            {grupos.map((grupo2) => {
                const {id,descricao} = grupo2;
                if(id == idgrupo){
                    return (<option selected value = {descricao} key={id} id={id}>{descricao}</option>)
                }
                else {
                    return (<option value = {descricao} key={id} id={id}>{descricao}</option>)
                }
            })
                
            }
        </select>
    )
}

export default DropDownGrupos;