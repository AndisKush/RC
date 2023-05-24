import { useEffect, useState } from "react";
import { fetchCondpg } from "../helpers/API";


const DropDownCondpg = ({alteracao, idcondpg, onChange = () => {}}) => {
    const [condpg, setCondpg] = useState([]);
    useEffect(()=> {
        fetchCondpg().then((cond) =>{
            setCondpg(cond);
        })
    },[])

    return (
        Boolean(!alteracao) ? 
        <select id="condpg" name="condpg" onChange={onChange} style={{width:'280px'}}>
            <option value="">Selecione uma Forma de Pagamento...</option>
            {condpg.map((cond) => {
                const {id,descricao, parcelado,avista} = cond;
                return (<option value = {descricao} key={id} id={id} descricao={descricao} parcelado={parcelado} avista={avista} condpg={cond}>{descricao}</option>)
            })
                
            }
        </select>
        : 
        <select id="condpg" name="condpg" onChange={onChange} style={{width:'280px'}}>
            <option value="">Selecione uma Forma de Pagamento...</option>
            {condpg.map((cond) => {
                
                const {id,descricao, parcelado, avista} = cond;
 
                if(id == idcondpg){
                    
                    return (<option selected value = {descricao} key={id} id={id} descricao={descricao} parcelado={parcelado} avista={avista} condpg={cond}>{descricao}</option>)
                }
                else{

                    return (<option value = {descricao} key={id} id={id} descricao={descricao} parcelado={parcelado} avista={avista} condpg={cond}>{descricao}</option>)
                }
                
            })
                
            }
        </select>
    )
}




export default DropDownCondpg;