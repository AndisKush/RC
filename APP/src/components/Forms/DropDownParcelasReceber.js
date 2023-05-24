import { useEffect, useState } from "react";
import { fetchTaxas } from "../helpers/API";

const DropDownParcelasReceber = ({alteracao, idparcela, onChange = () => {}}) => {

    const [parcelas, setParcelas] = useState([]);
    useEffect(()=> {
        fetchTaxas().then((taxas) =>{
            setParcelas(taxas);
        })
    },[])

    return (
        Boolean(!alteracao) ? 
        <select id="parcelas" name="parcelas" onChange={onChange} style={{width:'60px'}}>
            {parcelas.map((parcela) => {
                const {id,descricao,taxa} = parcela;
                return (<option value = {descricao} key={id} id={id} taxa={taxa}>{descricao} </option>)
            })
                
            }
        </select>
        : 
        <select id="parcelas" name="parcelas" onChange={onChange} style={{width:'60px'}}>
            
            {parcelas.map((parcela) => {
                
                const {id,descricao, taxa, desconto} = parcela;
 
                if(id == idparcela){
                    
                    return (<option selected value = {descricao} key={id} id={id} taxa={taxa} descontooperadora={desconto}>{descricao}</option>)
                }
                else{

                    return (<option value = {descricao} key={id} id={id} taxa={taxa} descontooperadora={desconto}>{descricao}</option>)
                }
                
            })
                
            }
        </select>
    )
}




export default DropDownParcelasReceber;