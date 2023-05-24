import { useEffect, useState } from "react";
import { fetchVeiculosClientes } from "../helpers/API";


const DropDownVeiculos = ({alteracao, idcliente, idveiculos, onChange = () => {}}) => {
    const [veiculos, setVeiculos] = useState([]);
    useEffect(()=> {
        fetchVeiculosClientes(idcliente).then((veiculos) =>{
            setVeiculos(veiculos); 
        })
    },[idcliente])

    return (
        Boolean(!alteracao) ? 
        <select id="veiculos" name="veiculo" onChange={onChange}  style={{width:'280px'}}>
            
            {veiculos.length > 0 ? veiculos.map((veiculo) => {
                const {id,placa, modelo} = veiculo;
                return (<option value = {placa} key={id} id={id} modelo={modelo} placa={placa}>{placa}   {modelo}</option>)
            })
                
            : null} 
        </select>
        : 
        <select id="veiculos" name="veiculo" onChange={onChange} style={{width:'280px'}}>
            
            {veiculos.length > 0 ? veiculos.map((veiculo) => {
                
                const {id,placa, modelo} = veiculo;
 
                if(id == idveiculos){
                    
                    return (<option selected value = {placa} key={id} id={id} modelo={modelo} placa={placa}>{placa} : {modelo}</option>)
                }
                else{

                    return (<option value = {placa} key={id} id={id} modelo={modelo} placa={placa}>{placa} : {modelo}</option>)
                }
                
            })
                
            : null}
        </select>
    )
}




export default DropDownVeiculos;