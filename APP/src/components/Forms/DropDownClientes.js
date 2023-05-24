import { useEffect, useState } from "react";
import { fetchClientes } from "../helpers/API";


const DropDownClientes = ({alteracao, idcliente, onChange = () => {}}) => {
    const [clientes, setClientes] = useState([]);
    useEffect(()=> {
        fetchClientes().then((clientes) =>{
            setClientes(clientes);
        })
    },[])

    return (

        Boolean(!alteracao) ? 
        <select id="clientes" name="cliente" onChange={onChange}  style={{width:'280px'}}>
            <option>Selecione um Parceiro...</option>
            {clientes.map((cliente) => {
                const {id,name} = cliente;
                return (<option value = {name} key={id} id={id} cliente={cliente}>{name}</option>)
            })
                
            }
        </select>

        :
        
        <select id="clientes" name="cliente" onChange={onChange}  style={{width:'280px'}}>
            
            {clientes.map((cliente) => {
                const {id,name} = cliente;
                if(id == idcliente){
                    
                    return (<option selected value = {name} key={id} id={id} cliente={cliente}>{name}</option>)
                }
                else{

                    return (<option value = {name} key={id} id={id} cliente={cliente}>{name}</option>)
                }
            })
                
            }
        </select>
        
        
    )
}




export default DropDownClientes;