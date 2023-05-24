import './Relatorios.css';

import React, { useEffect, useState } from 'react'; 
import Axios from 'axios';
import Botao from "../components/Botao";
import Calendar from 'react-calendar';
import UIModal from '../components/Modal';



const URI = 'http://localhost:5001';

function Relatorios(){
    const [btVendas, setBtVendas] = useState(true);
    const [btCompras, setBtCompras] = useState(false);
    const [btVendasRel1, setBtVendasRel1] = useState(true);
    const [btVendasRel2, setBtVendasRel2] = useState(false);
    const [btVendasRel3, setBtVendasRel3] = useState(false);
    const [btVendasRel4, setBtVendasRel4] = useState(false);
    const [btPagar, setBtPagar] = useState(false);
    const [btPagas, setBtPagas] = useState(false);
    const [adicionarDataInicial, setAdicionarDataInicial] = useState(false);
    const [adicionarDataFinal, setAdicionarDataFinal] = useState(false);
    const [dataInicial, setDataInicial] = useState();
    const [dataFinal, setDataFinal] = useState();
    const [dataInicialFormatada, setDataInicialFormatada] = useState();
    const [dataFinalFormatada, setDataFinalFormatada] = useState();
    const [vendas, setVendas] = useState([]);
    const [valorTotalVendas, setValorTotalVendas] = useState(0);
    const [valorTotalLiquido, setValorTotalLiquido] = useState(0);
    const [vendasProdutos, setVendasProdutos] = useState([]);
    const [quantidadeTotalProdutos, setQuantidadeTotalProdutos] = useState(0);
    const [condspg, setCondsPg] = useState([]);
    const [totaisCondPg, setTotaisCondPg] = useState([]);
    const [resultadoResumo, setResultadoResumo] = useState(0);
    const [PagarPorTipo, setPagarPorTipo] = useState([]);
    const [dummy, setDummy] = useState(false);
    

    let vendasConsulta = [];
    let pagarConsulta = [];
    let vendasFiltradas = [];
    let pagarFiltrados = [];
    let arrprod = [];
    let qtdtotal = 0;
    let totalvendas = 0;
    let totalpagar = 0;
    let fixocondspg = [];
    let arrpagar = [];
   
    useEffect(dataAtual, [])
    //useEffect(filtraVendas, [vendas])

    function dataAtual() {
        const data = new Date();
        data.setHours(0,0,0,0);
        const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
        setDataInicial(data);
        setDataInicialFormatada(dataFormatada);
        setDataFinal(data);
        setDataFinalFormatada(dataFormatada);
    }
    

    const handleBtVendas = () => {
        setBtVendas(true);
        setBtCompras(false);
        setBtVendasRel1(true);
        setBtVendasRel2(false);
        setBtVendasRel3(false);
        setBtPagar(false);
        setBtPagas(false);
    }

    const handleBtCompras = () => {
        setBtVendas(false);
        setBtCompras(true);
        setBtVendasRel1(false);
        setBtVendasRel2(false);
        setBtPagar(true);
        setBtPagas(false);
    }

    const handleBtVendasRel1 = () => {
        setBtVendas(true);
        setBtCompras(false);
        setBtVendasRel1(true);
        setBtVendasRel2(false);
        setBtVendasRel3(false);
        setBtVendasRel4(false);
        setBtPagar(false);
        setBtPagas(false);
    }

    const handleBtVendasRel2 = () => {
        setBtVendas(true);
        setBtCompras(false);
        setBtVendasRel1(false);
        setBtVendasRel2(true);
        setBtVendasRel3(false);
        setBtVendasRel4(false);
        setBtPagar(false);
        setBtPagas(false);
        gerarRelatoriosVendasProduto();
    }

    const handleBtVendasRel3 = () => {
        setBtVendas(true);
        setBtCompras(false);
        setBtVendasRel1(false);
        setBtVendasRel2(false);
        setBtVendasRel3(true);
        setBtVendasRel4(false);
        setBtPagar(false);
        setBtPagas(false);
        setVendas([]);
        setTotaisCondPg([]);
        setCondsPg([]);
        gerarRelatoriosVendasCondicaoPagamento();
    }

    const handleBtVendasRel4 = () => {
        setBtVendas(true);
        setBtCompras(false);
        setBtVendasRel1(false);
        setBtVendasRel2(false);
        setBtVendasRel3(false);
        setBtVendasRel4(true);
        setBtPagar(false);
        setBtPagas(false);
        setVendas([]);
        setTotaisCondPg([]);
        setCondsPg([]);
        gerarRelatoriosResumoGeral();
    }

    const handleBtPagar = () => {
        setBtVendas(false);
        setBtCompras(true);
        setBtVendasRel1(false);
        setBtVendasRel2(false);
        setBtPagar(true);
        setBtPagas(false);
    }

    const handleBtPagas = () => {
        setBtVendas(false);
        setBtCompras(true);
        setBtVendasRel1(false);
        setBtVendasRel2(false);
        setBtPagar(false);
        setBtPagas(true);
    }

    function abrirModalDataInicial(){
        setAdicionarDataInicial(true);
    }

    function abrirModalDataFinal(){
        setAdicionarDataFinal(true);
    }


    function closeModalData(){
        setAdicionarDataInicial(false);
        setAdicionarDataFinal(false)
    }

    function handleCalendarInicial(dataCalendar) {
        const data = new Date(dataCalendar);
        const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
        setDataInicial(data);
        setDataInicialFormatada(dataFormatada)
        setAdicionarDataInicial(false)
    }

    function handleCalendarFinal(dataCalendar) {
        const data = new Date(dataCalendar);
        const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
        setDataFinal(data);
        setDataFinalFormatada(dataFormatada)
        setAdicionarDataFinal(false)
    }

    function gerarRelatorioVendas(){
        getVendas();
    }

    async function getVendas(){
       await Axios.get(`${URI}/vendasrel?dataini=${dataInicial}&datafim=${dataFinal}`)
        .then(res => setVendas(res.data))  
        //.then(filtraVendas)
        //.catch(window.alert);
    }


    function gerarRelatoriosVendasProduto(){
        getVendasProdutos();
    }

    function getVendasProdutos(){
        Axios.get(`${URI}/vendasprodutosrel?dataini=${dataInicial}&datafim=${dataFinal}`)
        .then(res => setVendasProdutos(res.data))  
        //.then(filtraVendasProdutos)
        .catch(window.alert);
    }

    function gerarRelatoriosVendasCondicaoPagamento(){
        Axios.get(`${URI}/condpg`)
        .then(res => (setCondsPg(res.data), fixocondspg = res.data))  
        .then(getVendasCondicaoPagamento)
        .catch(window.alert);
    }

    function getVendasCondicaoPagamento(){
        Axios.get(`${URI}/vendasrel?dataini=${dataInicial}&datafim=${dataFinal}`)
        .then(res => (vendasConsulta = res.data))  
        .then(filtraVendasCondPg)
        .then(calculaTotaisCondPg)
        
        .catch(window.alert);
    }

    function filtraVendasCondPg(){
        let total = 0;
        if(Boolean(dataInicial)){
           
            vendasConsulta.map(venda => {
                if(venda.data >= dataInicial.toISOString() && venda.data <= dataFinal.toISOString()){
                    vendasFiltradas = [...vendasFiltradas, venda];
                    total = total + parseFloat(venda.valorTotal);
                }
            })
            setVendas(vendasFiltradas)
            setValorTotalVendas(total)
        }else{

            vendasConsulta.map(venda => {
                    vendasFiltradas = [...vendasFiltradas, venda];
                    total = total + parseFloat(venda.valorTotal);
            })

            setVendas(vendasFiltradas)
            setValorTotalVendas(total)
        }
    }
    
    function calculaTotaisCondPg(){
        let teste = [];
        fixocondspg.map(condpg => {
            vendasFiltradas.map(venda => {
                if(venda.condpg_id === condpg.id) {
                    let repetido = false
                    teste.map(te => {
                        if(te.id === venda.condpg_id){
                            te.total = te.total + parseFloat(venda.valortotal)
                            repetido = true;
                        }
                    })
                    if(!repetido){
                        teste = [...teste, {id: condpg.id, total: parseFloat(venda.valortotal)}]
                    } 
                    
                }
            })
        })
        setTotaisCondPg(teste);
    }

  
    async function gerarRelatoriosResumoGeral(){
        await Axios.get(`${URI}/vendasrel?dataini=${dataInicial}&datafim=${dataFinal}`)
        .then(res => {setVendas(res.data); filtraVendas(res.data)})  
        //.then(filtraVendas)
        .then(consultaPagar)
        .catch(window.alert);
    }

    async function filtraVendas(vendas){
        let total = 0;      
        await vendas.map(venda => {
            total = total + parseFloat(venda.valortotalliquido);
        })

        totalvendas = total;
        //setValorTotalVendas(total);
        
    }

    function consultaPagar(){
        Axios.get(`${URI}/pagarrel?dataini=${dataInicial}&datafim=${dataFinal}`)
        .then(res => (pagarConsulta = res.data))
        .then(filtraPagar)  
        //.then(teste)
        .catch(window.alert)
    }

    function filtraPagar(){
        let total = 0;
        pagarConsulta.map(pagar => {
            let pagarRepetido = false;
            arrpagar.map(pg => {
                if(pg.id === pagar.pagar_tipo_id) {
                    pg.valorsomado = pg.valorsomado + parseFloat(pagar.valor)
                    pagarRepetido = true;
                }
                })
                if (!pagarRepetido){
                    arrpagar = [...arrpagar , {id: pagar.pagar_tipo_id, descricao: pagar.descricao, valorsomado: parseFloat(pagar.valor)}]
                };
            total = total + parseFloat(pagar.valor);
        })
        totalpagar = total;
        teste();
    }

    function teste(){
        let resultado = 0;
        //window.alert(valorTotalVendas);
        resultado = totalvendas - totalpagar;
        setValorTotalLiquido(totalvendas);
        setResultadoResumo(resultado);
        setPagarPorTipo(arrpagar);
    }

  return(
    <div className="Financeiro">
        <div>
            {/*
            <div>
                <div className='Menu'>
                    <div className='Links'>
                        <div className='tooltip'>
                            <div id="iconsNavBar">
                                <div style={{marginRight:'10px'}}>
                                    {btVendas ? <Botao props={"Vendas"} type={'buttonRelatoriosSelecionado'} onClick={handleBtVendas}/> : <Botao props={"Vendas"} type={'buttonRelatorios'} onClick={handleBtVendas}/>}
                                </div>
                                
                            </div>
                        </div>
                        <div className='tooltip'>
                            <div id="iconsNavBar">
                                <div style={{marginLeft:'10px'}}>
                                    {btCompras ? <Botao props={"Compras"} type={'buttonRelatoriosSelecionado'} onClick={handleBtCompras}/> : <Botao props={"Compras"} type={'buttonRelatorios'} onClick={handleBtCompras}/>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

               
            </div>
            */} 

            {
                Boolean(btVendas) ?
                <div>
                    <div className='Menu'>
                        <div className='Links'>
                            <div className='tooltip'>
                                <div id="iconsNavBar">
                                    <div style={{marginRight:'10px'}}>
                                        {btVendasRel1 ? <Botao props={"Vendas"} type={'buttonRelatoriosSelecionado'} onClick={handleBtVendasRel1}/> : <Botao props={"Vendas"} type={'buttonRelatorios'} onClick={handleBtVendasRel1}/>}
                                    </div>
                                    
                                </div>
                            </div>
                            <div className='tooltip'>
                                <div id="iconsNavBar">
                                    <div style={{marginLeft:'10px'}}>
                                        {btVendasRel2 ? <Botao props={"Produtos Mais Vendidos"} type={'buttonRelatoriosSelecionado'} onClick={handleBtVendasRel2}/> : <Botao props={"Produtos Mais Vendidos"} type={'buttonRelatorios'} onClick={handleBtVendasRel2}/>}
                                    </div>
                                </div>
                            </div>
                            <div className='tooltip'>
                                <div id="iconsNavBar">
                                    <div style={{marginLeft:'10px'}}>
                                        {btVendasRel3 ? <Botao props={"Condição de Pagamento"} type={'buttonRelatoriosSelecionado'} onClick={handleBtVendasRel3}/> : <Botao props={"Condição de Pagamento"} type={'buttonRelatorios'} onClick={handleBtVendasRel3}/>}
                                    </div>
                                </div>
                            </div>
                            <div className='tooltip'>
                                <div id="iconsNavBar">
                                    <div style={{marginLeft:'10px'}}>
                                        {btVendasRel4 ? <Botao props={"Resumo Geral"} type={'buttonRelatoriosSelecionado'} onClick={handleBtVendasRel4}/> : <Botao props={"Resumo Geral"} type={'buttonRelatorios'} onClick={handleBtVendasRel4}/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                : null
            }

            {
                Boolean(btCompras) ?
                <div>
                    <div className='Menu'>
                        <div className='Links'>
                            <div className='tooltip'>
                                <div id="iconsNavBar">
                                    <div style={{marginRight:'10px'}}>
                                        {btPagar ? <Botao props={"Pagar"} type={'MenuFinanceiroSelecionado'} onClick={handleBtPagar}/> : <Botao props={"Pagar"} type={'MenuFinanceiro'} onClick={handleBtPagar}/>}
                                    </div>
                                    
                                </div>
                            </div>
                            <div className='tooltip'>
                                <div id="iconsNavBar">
                                    <div style={{marginLeft:'10px'}}>
                                        {btPagas ? <Botao props={"Pagas"} type={'MenuFinanceiroSelecionado'} onClick={handleBtPagas}/> : <Botao props={"Pagas"} type={'MenuFinanceiro'} onClick={handleBtPagas}/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                : null
            }
            

        </div>



        <br/>
        { /* *********************  Relatorios  *********************************** */}
        { /* *********************  Vendas *********************************** */}
        {
            Boolean(btVendasRel1) ? 
                <div>
                    { /****  Data ***** */}
                    <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 0}}>
                        <div style={{textAlign:'left'}}>
                            Data Inicial: <input value={dataInicialFormatada} style={{width: "15%"}} onClick={abrirModalDataInicial}></input>
                             &nbsp;&nbsp;&nbsp;
                            Data Final: <input value={dataFinalFormatada} style={{width: "15%"}} onClick={abrirModalDataFinal}></input>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button style={{width: "10%", backgroundColor:'lightgreen', color:'black', cursor:'pointer'}} onClick={gerarRelatorioVendas}>Gerar</button>
                        </div>
                         <div style={{textAlign:'left'}}>
                        </div>
                    </div>
                    { /****  Tabela ***** */}
                    <div className='Vendas'>
                        <table className='tabela'>
                            <caption></caption>
                             <thead >
                                <tr >
                                    <th>Cliente</th> 
                                    <th>Veículo</th> 
                                    <th>OBS</th>
                                    <th>Data</th>
                                    <th>Valor</th>
                                   
                                </tr>
                            </thead>
                            <tbody >
                                {vendas.map(venda => (
                                    <tr key={venda.id}  onDoubleClick={() => {}}>
                                        <td className='tdnome'>{venda.name}</td>
                                        <td>{venda.placa}</td>
                                        <td style={{whiteSpace:'nowrap', maxWidth:'400px', textOverflow:'ellipsis', overflow:'hidden'}}>{venda.obs}</td>
                                        <td>{venda.dataformatada}</td>
                                        <td>{venda.valortotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        
                                        
                                    </tr>
                                ))}
                                <tr>
                                    <td>Total</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{valorTotalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>  
                </div>
            : null
        }

        { /* *********************  Produtos Mais Vendidos *********************************** */}
        {
            Boolean(btVendasRel2) ? 
                <div>
                    { /****  Data ***** */}
                    <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 0}}>
                        <div style={{textAlign:'left'}}>
                            Data Inicial: <input value={dataInicialFormatada} style={{width: "15%"}} onClick={abrirModalDataInicial}></input>
                             &nbsp;&nbsp;&nbsp;
                            Data Final: <input value={dataFinalFormatada} style={{width: "15%"}} onClick={abrirModalDataFinal}></input>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button style={{width: "10%", backgroundColor:'lightgreen', color:'black', cursor:'pointer'}} onClick={gerarRelatoriosVendasProduto}>Gerar</button>
                        </div>
                         <div style={{textAlign:'left'}}>
                        </div>
                    </div>

                    { /****  Tabela ***** */}
                    <div className='Vendas'>
                        <table className='tabela'>
                            <caption></caption>
                             <thead >
                                <tr >
                                    <th>ID</th> 
                                    <th>Descricao</th> 
                                    <th>Quantidade</th>
                                   
                                </tr>
                            </thead>
                            <tbody >
                                {vendasProdutos.map(produto => (
                                    <tr key={produto.id}  onDoubleClick={() => {}}>
                                        <td className='tdnome'>{produto.id}</td>
                                        <td>{produto.descricao}</td>
                                        <td>{produto.quantidade}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>Total</td>
                                    <td></td>
                                    <td>{quantidadeTotalProdutos}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>  
                </div>
            : null
        }
        
        { /* *********************  Condição de Pagamento *********************************** */}
        {
            Boolean(btVendasRel3) ? 
                <div>
                    { /****  Data ***** */}
                    <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 0}}>
                        <div style={{textAlign:'left'}}>
                            Data Inicial: <input value={dataInicialFormatada} style={{width: "15%"}} onClick={abrirModalDataInicial}></input>
                             &nbsp;&nbsp;&nbsp;
                            Data Final: <input value={dataFinalFormatada} style={{width: "15%"}} onClick={abrirModalDataFinal}></input>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button style={{width: "10%", backgroundColor:'lightgreen', color:'black', cursor:'pointer'}} onClick={gerarRelatoriosVendasCondicaoPagamento}>Gerar</button>
                        </div>
                         <div style={{textAlign:'left'}}>
                        </div>
                    </div>

                    { /****  Tabela ***** */}
                    <div className='Vendas'>
                        {condspg.map(condpg => (
                            
                            <table className='tabelaCondPg'>
                            <caption className='tableCaption'>{condpg.descricao}</caption>
                             <thead >
                                <tr >
                                    <th>Cliente</th> 
                                    <th>Veículo</th> 
                                    <th>OBS</th>
                                    <th>Data</th>
                                    <th>Valor</th>
                                   
                                </tr>
                            </thead>
                            <tbody >
                          
                                {vendas.map(venda => (
                                    venda.condpg_id === condpg.id ? 
                                        <tr key={venda.id}  onDoubleClick={() => {}}>
                                            <td className='tdnome'>{venda.name}</td>
                                            <td>{venda.placa}</td>
                                            <td style={{whiteSpace:'nowrap', maxWidth:'400px', textOverflow:'ellipsis', overflow:'hidden'}}>{venda.obs}</td>
                                            <td>{venda.dataformatada}</td>
                                            <td>{venda.valortotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        </tr>
                                        
                                    : null
                                ))}
                                <tr>
                                    <td  className='tdnome'>Total</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{totaisCondPg.map(total => (total.id === condpg.id ? parseFloat(total.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null))}</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        ))
                                  
                        }
                        
                    </div>  
                </div>
            : null
        }

        { /* *********************  Resumo Geral *********************************** */}
        {
            Boolean(btVendasRel4) ? 
                <div>
                    { /****  Data ***** */}
                    <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 0}}>
                        <div style={{textAlign:'left'}}>
                            Data Inicial: <input value={dataInicialFormatada} style={{width: "15%"}} onClick={abrirModalDataInicial}></input>
                             &nbsp;&nbsp;&nbsp;
                            Data Final: <input value={dataFinalFormatada} style={{width: "15%"}} onClick={abrirModalDataFinal}></input>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button style={{width: "10%", backgroundColor:'lightgreen', color:'black', cursor:'pointer'}} onClick={gerarRelatoriosResumoGeral}>Gerar</button>
                        </div>
                         <div style={{textAlign:'left'}}>
                        </div>
                    </div>
                    { /****  Tabela ***** */}
                    <div className='Vendas'>
                        <table className='tabela'>
                            <caption></caption>
                             <thead >
                                <tr >
                                    <th></th> 
                                    <th></th> 
                                </tr>
                            </thead>
                            <tbody >
                                <tr>
                                    <td className='tdnome'>(+) Vendas</td>
                                    <td>{valorTotalLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                </tr>
                                {   
                                    
                                        PagarPorTipo.map(pagar =>(
                                            <tr>
                                                <td className='tdnome'>(-) {pagar.descricao}</td>
                                                <td>{pagar.valorsomado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                            </tr>
                                        ))
                              
                                }
                                <tr>
                                    <td  className='tdnome'> (=) Resultado</td>
                                    <td>{resultadoResumo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>  
                </div>
            : null
        }

        { /* *********************  Modais de Data *********************************** */}
        {/* *********************  Adicionar Data Inicial *********************************** */}

        <UIModal isOpen={Boolean(adicionarDataInicial)} onClickClose={() => closeModalData()} extendido={false} data={true}>
            {Boolean(adicionarDataInicial) ?
                <div>
                    <Calendar value={dataInicial} onChange={(e) => handleCalendarInicial(e)}/>
                </div>
            : null}
        </UIModal>

        {/* *********************  Adicionar Data Final *********************************** */}

        <UIModal isOpen={Boolean(adicionarDataFinal)} onClickClose={() => closeModalData()} extendido={false} data={true}>
            {Boolean(adicionarDataFinal) ?
                <div>
                    <Calendar value={dataFinal} onChange={(e) => handleCalendarFinal(e)}/>
                </div>
            : null}
        </UIModal>

    </div>
  )
}

export default Relatorios;