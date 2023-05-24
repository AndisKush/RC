import './MenuEspecial.css';

import React, { useEffect, useState } from 'react'; 
import Axios from 'axios';
import Botao from "../components/Botao";



const URI = 'http://localhost:5001';



function MenuEspecial(){
    const  [taxas, setTaxas] = useState([]);
    const  [dummy, setDummy] = useState(false);

    useEffect(getTaxas, []);

    async function getTaxas() {
        await Axios.get(`${URI}/taxas`).then(res => setTaxas(res.data));
    }

    const handleTaxaAlterada = (e,index) => {
        taxas[index].taxa = e.target.value
        setDummy(!dummy)
    }

    const handleDescontoAlterado = (e,index) => {
        taxas[index].desconto = e.target.value
        setDummy(!dummy)
    }

    const salvarTaxas = async () => {
       await taxas.map(async taxa => {
            await Axios.patch(`${URI}/taxas`, taxa).then(getTaxas)
        })
        window.alert("Salvo")
        
    }

    const calculaTotal = async () => {
        Axios.get(`${URI}/vendas`)
        .then(res => {
            res.data.map(venda => {
                let totalliquido = 0;
                totalliquido = (venda.subtotal - venda.desconto) - ((venda.subtotal - venda.desconto) * (venda.descontooperadora/100) )
                console.log(venda.id + " - " + totalliquido)
            })
        })  
        .catch(window.alert);
         
     }

  return(
    <div>
        <div className="MenuEspecial">
            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                <div>
                    <table className='tabela'>
                        <caption></caption>
                        <thead >
                            <tr >
                                <th>Descrição</th> 
                                <th>Taxa</th>  
                                <th>Desconto</th>                                                                
                            </tr>
                        </thead>
                    <tbody >
                        {taxas.map( (taxa,index) => (     
                                <tr key={taxa.id}>
                                    <td className='tdnome'>{taxa.descricao}</td>
                                    <td><input style={{width: '8vh', textAlign:'center'}} type="text" value={taxa.taxa} onChange={e => {handleTaxaAlterada(e,index)}} /></td>     
                                    <td><input style={{width: '8vh', textAlign:'center'}} type="text" value={taxa.desconto} onChange={e => {handleDescontoAlterado(e,index)}} /></td>                              
                                </tr> 
                        ))}
                    
                    </tbody>
                    </table>
                </div>
                <div>
                    <Botao props={"Salvar"} type={'confirm'} onClick={salvarTaxas}/>
                    <Botao props={"Teste"} type={'confirm'} onClick={calculaTotal}/>
                </div>
                
            </div>
            
        </div>

     
    </div>
    
  )
}

export default MenuEspecial;