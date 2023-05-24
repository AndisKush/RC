import { useEffect, useState } from "react";
import { fetchConheceus } from "../helpers/API";
import Select from 'react-select';

const DropDownConheceu = ({alteracao, idconheceu, onChange = () => {}}) => {
    const [conheceus, setConheceus] = useState([]);
    useEffect(()=> {
        fetchConheceus().then((conheceus) =>{
            setConheceus(conheceus);
        })
    },[])

    return (
        Boolean(!alteracao) ? 
        <select id="conheceu" name="conheceu" onChange={onChange} style={{width:'250px'}}>
            <option value="">Onde nos Conheceu?</option>
            {conheceus.map((conheceu) => {
                const {id,descricao} = conheceu;
                return (<option value = {descricao} key={id} id={id}>{descricao}</option>)
            })
                
            }
        </select>
        : 
        <select id="conheceu" name="conheceu" onChange={onChange} style={{width:'280px'}}>
            
            {conheceus.map((conheceu) => {
                
                const {id,descricao} = conheceu;
 
                if(id == idconheceu){
                    
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




export default DropDownConheceu;