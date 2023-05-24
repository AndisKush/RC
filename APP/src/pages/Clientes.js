import './Clientes.css';

import React, { useEffect, useState } from 'react'; 
import Axios from 'axios';
import Botao from "../components/Botao";
import DropDownConheceu from '../components/Forms/DropDownConheceu';



const URI = 'http://localhost:5001';



function Clientes2(){
    const  [clientes, setClientes] = useState([]);
    const  [nome, setName] = useState('');
    const  [tel, setTelefone] = useState('');
    const  [conheceu, setConheceu] = useState({});
    const  [placa, setPlaca] = useState('');
    const  [modelo, setModelo] = useState('');
    const  [TesteCli, setTesteCli] = useState({});
    const  [clicado, setClicado] = useState(false);
    const  [formValues, setFormValues] = useState({});
    const  [outrosConheceu, setOutrosConheceu] = useState('');
    const  [buscaNome, setBuscaNome] = useState();
    const  [copiaClientes, setCopiaClientes] = useState();
    

    let ultimoIdVeiculo = 0;
   
    useEffect(getClientes, []);


    const handleBuscaNome = (e) => {
        let busca = e.target.value;
        var newarr = copiaClientes.filter(cliente => cliente.name.toLowerCase().includes(busca.toLowerCase()));
        setClientes(newarr);
        if(busca === ''){
            getClientes();
        }
    }
    
    
    function getClientes (){
        Axios.get(`${URI}/clientes`)
        //.then( res => {setClientes(res.data); setCopiaClientes(res.data)})
        .then(async res => {
            let clientes2 = res.data;
            for await (const [idx,cliente] of clientes2.entries()){
                Axios.get(`${URI}/veiculos?cliente_id=${cliente.id}`)
                .then(res => {cliente.veiculos = res.data})
            }
            setClientes(clientes2);
            setCopiaClientes(clientes2);
        })
        //.then(res => console.log(res.data))
        .catch(window.alert);
    }

   

    const handleName = (e) => {
        setName(e.target.value);
    }

    const handleTelefone = (e) => {
        setTelefone(e.target.value);
    }

    const handlePlaca = (e) => {
        setPlaca(e.target.value);
    }

    const handleModelo = (e) => {
        setModelo(e.target.value);
    }

    const handleOutrosConheceu = (e) => {
        setOutrosConheceu(e.target.value);
    }

    async function teste (){

    }

    const handleSubmit = async (e) => {
        await Axios.post(`${URI}/clientes`,{
            name: nome,
            telefone: tel,
            ativo: 1,
            conheceu_id: formValues.idconheceu, 
            outrosconheceu: outrosConheceu
        })
        .catch(window.alert)

        if(placa.length > 0){
            Axios.get(`${URI}/maxclientes`)
            .then(res => {
                Axios.post(`${URI}/veiculos`,{
                    placa: placa,
                    modelo: modelo,
                    cliente_id: res.data[0].max
                }).then(getClientes).then(handleLimpar)
                .catch(window.alert)
            })
        } else {
            getClientes();
            handleLimpar();
        }
    }

    const handleSubmit2 = (e) => {
        TesteCli.name = nome;
        TesteCli.telefone = tel;
        TesteCli.conheceu_id = formValues.idconheceu;
        TesteCli.outrosconheceu = outrosConheceu;

        Axios.patch(`${URI}/clientes`, TesteCli)
        
        TesteCli.veiculos.map(veiculo => {
            Axios.post(`${URI}/veiculos`,{
                placa: veiculo.placa,
                modelo: veiculo.modelo,
                cliente_id: TesteCli.id
            }).then(getClientes).then(handleCancelar)  
            .catch(window.alert);
        })
        window.alert('Cliente Atualizado');
    }


    const handleLimpar = () => {
        setName('');
        setTelefone('');
        setPlaca('');
        setModelo('');
        setOutrosConheceu('');
    }

    function handleClickTable(e){
        setTesteCli(e);
        setClicado(true);
        setName(e.name);
        setTelefone(e.telefone);
        setConheceu(e.conheceu);
        setOutrosConheceu(e.outrosconheceu);
        setFormValues({idconheceu: e.conheceu_id})
    }

    const handleCancelar = () => {
        handleLimpar();
        setClicado(false);
    }

    function handleInativar(cliente)  {
        cliente.ativo = 0;
        if(window.confirm("Tem certeza que deseja excluir esse cliente?")){
            Axios.patch(`${URI}/clientes`, cliente)
            .then(getClientes)
            .catch(window.alert)
        } 
       
    }


    function handleAdicionar (){
        TesteCli.veiculos.length > 0 ? 
            TesteCli.veiculos.map(veic => 
                veic.id >= ultimoIdVeiculo ? ultimoIdVeiculo = veic.id + 1 : ultimoIdVeiculo = ultimoIdVeiculo
        ) : ultimoIdVeiculo = 1;
        setPlaca(null);
        setModelo(null);
        setTesteCli({...TesteCli, veiculos:[...TesteCli.veiculos, {id: ultimoIdVeiculo, placa: placa, modelo: modelo}]})
        ultimoIdVeiculo = 0;
        
        
        //window.confirm('Adicionar') ? (window.alert("Adicionado")) : (window.alert("Nao Adicionado"))
    }



    const handleInputChange = (e) => {
        //console.log(e.target.options[e.target.options.selectedIndex].getAttribute('id'));
        e.preventDefault();
        const {value, name} = e.target;
        setFormValues({...formValues, [name]:value, 'idconheceu':e.target.options[e.target.options.selectedIndex].getAttribute('id')});
     
      }




  return(
    <div className="Clientes">
        <div>
            <div>
                <h2>Parceiros</h2>
            </div>
            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                <div style={{textAlign:'left'}}>
                    Busca: <input style={{width: "80%"}} value={buscaNome} onChange={(e) => {handleBuscaNome(e)}}></input>
                </div>
                <div style={{textAlign:'left'}}>
                    
                </div>
            </div>
        </div>
        <br/>
        <div className='Conteudo'>
            <div className='Direita'>
                <div className='divTabela'>
                    <table className='tabela'>
                        <caption></caption>
                        <thead >
                            <tr >
                                <th>Nome</th> 
                                <th>Telefone</th>
                                <th>Excluir</th>
                            </tr>
                        </thead>
                        <tbody >
                            {clientes.map(cliente => (
                                <tr key={cliente.id}  onDoubleClick={() => handleClickTable(cliente)}>
                                    <td className='tdnome'>{cliente.name}</td>
                                    <td>{cliente.telefone}</td>
                                    <td><Botao props={"-"} type={'Baixar'} onClick={() => handleInativar(cliente)}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
            </div>
        
            { !clicado ?                 
                <div className='Esquerda'>
                    <div className='formulario'>
                        

                            <label style={{color: "white"}}>Nome: </label>&nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="text" value={nome} required onChange={(e) => {handleName(e)}} /><br/><br/>
                            
                            <label style={{color: "white"}}>Telefone: </label>
                            <input type="text" value={tel} onChange={(e) => {handleTelefone(e)}} /><br/><br/>
                           
                            <label style={{color: "white"}}>Placa: </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="text" value={placa} onChange={(e) => {handlePlaca(e)}} /><br/><br/>    

                            <label style={{color: "white"}}>Modelo: </label>&nbsp;&nbsp;
                            <input type="text" value={modelo} onChange={(e) => {handleModelo(e)}} />
                            <br/><br/>
                            <DropDownConheceu alteracao = {false}  onChange={handleInputChange}/>
                            <br/>
                            {formValues.idconheceu === '4' ? 
                                
                                <input style={{marginTop:'10px', width:'240px'}} type="text" value={outrosConheceu} onChange={(e) => {handleOutrosConheceu(e)}} />
                            :  null}
                            
                            <br/><br/><br/>

                            <div style={{display:"grid", gridTemplateColumns: "repeat(5, 1fr)", gridGap: 20}}>
                                <div>
                                    <Botao props={"Limpar"} type={'cancel'} onClick={handleLimpar}/>
                                </div>  
                                <div>
                                    <Botao props={"Salvar"} type={'confirm'} onClick={handleSubmit}/>
                                </div>
                            </div>
                            
                            <br/>
                        

                        
                    </div>
                </div>
            : null
            }

            { clicado ?                 
                <div className='Esquerda'>
                    <div className='formulario'>
                        <form onSubmit={(e) => {handleSubmit2(e)}} onReset={() => {handleCancelar()}}>

                            <label style={{color: "white"}}>Nome: </label>&nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="text" style={{width:'72%'}} value={nome} required onChange={(e) => {handleName(e)}} /><br/><br/>
                            
                            <label style={{color: "white"}}>Telefone: </label>
                            <input type="text" style={{width:'72%'}} value={tel} onChange={(e) => {handleTelefone(e)}} /><br/><br/>
                            
                            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                                <div>
                                    <DropDownConheceu alteracao = {true} idconheceu={TesteCli.conheceu_id}  onChange={handleInputChange}/>
                                </div>

                                <div>
                                    {parseFloat(formValues.idconheceu) === 4 ?                              
                                        <input style={{width:'195px'}} type="text" value={outrosConheceu} onChange={(e) => {handleOutrosConheceu(e)}} />
                                    :  null}
                                </div>
                            </div>
                            
                            
                            
                            <div style={{display:"grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20, marginTop:'20px'}}>
                                <div>
                                    <label style={{color: "white"}}>Placa: </label>
                                    <input type="text" value={placa} onChange={(e) => {handlePlaca(e)}} />   
                                </div>
                                <div>
                                    <label style={{color: "white"}}>Modelo: </label>&nbsp;&nbsp;
                                    <input type="text" value={modelo} onChange={(e) => {handleModelo(e)}} />
                                </div >

                                <div onClick={(e) => {handleAdicionar()}} style={{marginRight:'90px'}}>
                                    <Botao  props={'Adicionar'} type={'confirm'}/>
                                </div>
                                
                                

                                
                            </div>
                            <br/>
                            

                            
                            {/* Tabela de Veiculos*/}

                            <table style={{width: '85%'}}>
                                <caption></caption>
                                <thead >
                                    <tr >
                                        <th>Placa</th> 
                                        <th>Modelo</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    
                                    {TesteCli.veiculos.map(veiculo => (
                                        <tr key={veiculo.id} >
                                            <td>{veiculo.placa}</td>
                                            <td style={{textAlign: 'center'}}>{veiculo.modelo}</td>
                                        </tr>
                                    ))} 
                                </tbody>
                            </table>

                            {/* Botoes */}
                            
                            <br/>
                            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 200}}>
                                <div>
                                    <Botao  props={'Cancelar'} type={'cancel'} onClick={handleCancelar}/>
                                </div>
                                    <Botao  props={'Salvar'} type={'confirm'} onClick={handleSubmit2}/>
                                <div>

                                </div>
                            </div>
                            
                        </form>  
                    </div>
                </div>
            : null
            }   
        </div>

    </div>
  )
}

export default Clientes2;