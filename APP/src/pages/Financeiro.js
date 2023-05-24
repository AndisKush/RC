import './Financeiro.css';

import React, { useEffect, useState } from 'react'; 
import Axios from 'axios';
import Botao from "../components/Botao";
import DropDownClientes from '../components/Forms/DropDownClientes';
import Calendar from 'react-calendar';
import UIModal from '../components/Modal';
import DropDownTipoPagar from '../components/Forms/DropDownTipoPagar';
import DropDownCondpg from '../components/Forms/DropDownCondpg';


const URI = 'http://localhost:5001';

function Financeiro(){
    const [clientes, setClientes] = useState([]);

    const [receber, setReceber] = useState([]);
    const [abertos, setAbertos] = useState([]);
    const [fechados, setFechados] = useState([]);
    const [pagar, setPagar] =useState([]);
    const [abertosPagar, setAbertosPagar] = useState([]);
    const [fechadosPagar, setFechadosPagar] = useState([]);
    const [btEntrada, setBtEntrada] = useState(true);
    const [btSaida, setBtSaida] = useState(false);
    const [btReceber, setBtReceber] = useState(true);
    const [btRecebidas, setBtRecebidas] = useState(false);
    const [btPagar, setBtPagar] = useState(false);
    const [btPagas, setBtPagas] = useState(false);
    const [adicionarPagar, setAdicionarPagar] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState({id: 1, name:'consumidor', telefone: '34999999999'})
    const [dataVenda, setDataVenda] = useState();
    const [dataVendaFormatada, setDataVendaFormatada] = useState();
    const [obsVenda, setObsVenda] = useState();
    const [tipoPagarSelecionado, setTipoPagarSelecionado] = useState();
    const [condpgSelecionada , setCondpgSelecionada] = useState()
    const [valorPagar, setValorPagar] = useState(0);
    const [parcelas, setParcelas] = useState([]);
    const [novoTipoPagar, setNovoTipoPagar] = useState(false);
    const [descNovoTipoPagar, setDescNovoTipoPagar] = useState('');
    const [proxIdPagar , setProxIdPagar] = useState();
    const [ultIdPagar, setUltIdPagar] = useState();
    const [modalParcial, setModalParcial] = useState(false);
    const [valorBaixaParcial, setValorBaixaParcial] = useState(0);
    const [parcelaParcial, setParcelaParcial] = useState();
    const [baixaPagar, setBaixaPagar] = useState(false);
    const [dataVencimento, setDataVencimento] = useState();
    const [dataVencimentoFormatada, setDataVencimentoFormatada] = useState();
    const [parcelaPg, setParcelaPg] = useState();
    const [countReceber, setCountReceber] = useState(0);
    const [countPagar, setCountPagar] = useState(0);
    const [objPagar, setObjPagar] = useState()
    const [modalFiltroPagas, setModalFiltroPagas] = useState(false)
    const [modalFiltroPagar, setModalFiltroPagar] = useState(false)
    const [modalFiltroReceber, setModalFiltroReceber] = useState(false)
    const [modalFiltroRecebidas, setModalFiltroRecebidas] = useState(false)
    const [filtrosPagas, setFiltrosPagas] = useState({})
    const [modaisDatas, setModaisDatas] = useState({})

    useEffect(getClientes, []);
    useEffect(getCountReceber, []);
    useEffect(getCountReceber, [receber]);
    useEffect(getCountPagar, []);
    useEffect(getCountPagar, [pagar]);
    useEffect(getReceber, []);
    useEffect(getPagar, []);
    useEffect(emAberto, [receber]);
    useEffect(emFechados, [receber]);
    useEffect(emAbertoPagar, [pagar]);
    useEffect(emFechadosPagar, [pagar]);
    useEffect(dataAtual, []);

    let pagarid = 0;

    
    function getClientes (){
            Axios.get(`${URI}/clientes`)
            .then(res => setClientes(res.data))  
            //.then(res => console.log(res.data))
            .catch(window.alert);
    }

    function getReceber(){
        Axios.get(`${URI}/receber`)
            .then(res => {
               setReceber(res.data);
               emAberto();
               
            })
            //.then(res => console.log(res.data))
            .catch(window.alert);
    }

    function getCountReceber(){
        Axios.get(`${URI}/countreceber`)
            .then(res => {
               setCountReceber(res.data[0].count);
            })
            //.then(res => console.log(res.data))
            .catch(window.alert);
    }

    function getCountPagar(){
        Axios.get(`${URI}/countpagar`)
            .then(res => {
               setCountPagar(res.data[0].count);
            })
            //.then(res => console.log(res.data))
            .catch(window.alert);
    }
    
    function getPagar(){
        Axios.get(`${URI}/pagar`)
            .then(res => {
               setPagar(res.data);
               emAbertoPagar();
            })
            //.then(res => console.log(res.data))
            .catch(window.alert);
    }
    
    function emAberto(){
        let aber = []
        receber.map(rec => {
            rec.baixado === 0 ? aber = [...aber, rec] : aber = aber
        })
        setAbertos(aber);
    }

    function emAbertoPagar(){
        let aber = []
        pagar.map(rec => {
            if(rec.baixado === 0){
                rec.pagarId = rec.id;
                aber = [...aber, rec]
            }
        })
        setAbertosPagar(aber);
    }

   

    function emFechados(){
        let fech = []
        receber.map(rec => {
            rec.baixado === 1 ? (fech = [...fech, rec]) : fech = fech
        })
        setFechados(fech);
    }

    function emFechadosPagar(){
        let fech = []
        pagar.map(rec => {
            rec.baixado === 1 ? (fech = [...fech, rec   ]) : fech = fech
        })
        setFechadosPagar(fech);
    }



    const handleBtEntrada = () => {
        setBtEntrada(true);
        setBtSaida(false);
        setBtReceber(true);
        setBtRecebidas(false);
        setBtPagar(false);
        setBtPagas(false);
    }

    const handleBtSaida = () => {
        setBtEntrada(false);
        setBtSaida(true);
        setBtReceber(false);
        setBtRecebidas(false);
        setBtPagar(true);
        setBtPagas(false);
    }

    const handleBtReceber = () => {
        setBtEntrada(true);
        setBtSaida(false);
        setBtReceber(true);
        setBtRecebidas(false);
        setBtPagar(false);
        setBtPagas(false);
    }

    const handleBtRecebidas = () => {
        setBtEntrada(true);
        setBtSaida(false);
        setBtReceber(false);
        setBtRecebidas(true);
        setBtPagar(false);
        setBtPagas(false);
    }

    const handleBtPagar = () => {
        setBtEntrada(false);
        setBtSaida(true);
        setBtReceber(false);
        setBtRecebidas(false);
        setBtPagar(true);
        setBtPagas(false);
    }

    const handleBtPagas = () => {
        setBtEntrada(false);
        setBtSaida(true);
        setBtReceber(false);
        setBtRecebidas(false);
        setBtPagar(false);
        setBtPagas(true);
    }

    const baixarParcela = (parcela) => {
        const data = new Date();
        data.setHours(0,0,0,0);
        const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
        parcela.baixado = 1;
        parcela.databaixa = data;
        parcela.databaixaformatada = dataFormatada;
        parcela.databaixajson = data;
        Axios.patch(`${URI}/receber`, parcela).then(getReceber)
    }

    const baixarParcelaPagar = (e) => {
        setBaixaPagar(true);
        setParcelaPg(e);
    }

    const baixarParcelaPagar2 = (parcela) => {
            parcela = parcelaPg;
            const data = new Date();
            data.setHours(0,0,0,0);
            parcela.baixado = 1;
            parcela.databaixa = dataVencimento;
            parcela.databaixaformatada = dataVencimentoFormatada;
            parcela.databaixajson = dataVencimento;
            Axios.patch(`${URI}/pagar`, parcela)
            .then(getPagar)
            .catch(window.alert);
            closeNovaOs();
    }

    const abreModalParcial = (parcela) => {
        setModalParcial(true);
        setParcelaParcial(parcela);
    }

    const baixarParcelaPagarParcial = async () => {
        const data = new Date();
        data.setHours(0,0,0,0);
        const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
        
        let novaParcela = parcelaParcial;

        if(btReceber){
            parcelaParcial.valor -= parseFloat(valorBaixaParcial);
            await Axios.patch(`${URI}/receber`, parcelaParcial).then(getPagar);

            novaParcela.valor = parseFloat(valorBaixaParcial);

            await Axios.post(`${URI}/receberparcial`, {
                venda_id: novaParcela.venda_id,
                cliente_id: novaParcela.cliente_id,
                condpg_id: novaParcela.condpg_id,
                data: novaParcela.data,
                dataformatada: novaParcela.dataformatada,
                datajson: novaParcela.datajson,
                vencimento: novaParcela.vencimento,
                vencimentoformatado: novaParcela.vencimentoformatado,
                vencimentojson: novaParcela.vencimentojson,
                parcela: novaParcela.parcela,
                valor: novaParcela.valor,
                baixado: 1,
                databaixa: dataVencimento,
                databaixaformatada: dataVencimentoFormatada,
                databaixajson: dataVencimento,
                obs: novaParcela.obs
            })
            .then(getReceber)
            .catch(window.alert);
            


            setModalParcial(false);
            setValorBaixaParcial(0);


        }else{
            parcelaParcial.valor -= parseFloat(valorBaixaParcial);
            await Axios.patch(`${URI}/pagar`, parcelaParcial).then(getPagar);

            novaParcela.valor = parseFloat(valorBaixaParcial);

        
            await Axios.post(`${URI}/pagarparcial`, {
                compra_id: novaParcela.compra_id,
                cliente_id: novaParcela.cliente_id,
                condpg_id: novaParcela.condpg_id,
                data: novaParcela.data,
                dataformatada: novaParcela.dataformatada,
                datajson: novaParcela.datajson,
                vencimento: novaParcela.vencimento,
                vencimentoformatado: novaParcela.vencimentoformatado,
                vencimentojson: novaParcela.vencimentojson,
                parcela: novaParcela.parcela,
                valor: novaParcela.valor,
                baixado: 1,
                databaixa: dataVencimento,
                databaixaformatada: dataVencimentoFormatada,
                databaixajson: dataVencimento,
                pagar_tipo_id: novaParcela.pagar_tipo_id,
                obs: novaParcela.obs
            })
            .then(getPagar)
            .catch(window.alert);
            


            setModalParcial(false);
            setValorBaixaParcial(0);
        }
        
    
    }

    const handleExcluirParcelaPagar = async (e) => {
        if(window.confirm("Tem certeza que deseja excluir essa parcela?")){
            await Axios.delete(`${URI}/pagar?id=${e.id}`)
            .then(getPagar)
            .catch(window.alert)
        }
    }

    



    const closeNovaOs = () => {
        setAdicionarPagar(false);
        setClienteSelecionado({id: 1, name:'consumidor', telefone: '34999999999'});
        dataAtual();
        setTipoPagarSelecionado(null);
        setCondpgSelecionada(null);
        setBaixaPagar(false);
        setObsVenda(null);
        setValorPagar(null);
        setObjPagar(null)
        setValorPagar('')
    }

    const closeModalParcial = () => {
        setModalParcial(false)
    }

    const closeBaixaPagar = () => {
        setBaixaPagar(false)
    }


    

    const handleInputChange = (e) => {
        e.preventDefault();
        buscaClienteSelecionado(e.target.options[e.target.options.selectedIndex].getAttribute('id'))
        objPagar && setObjPagar({...objPagar, cliente_id: e.target.options[e.target.options.selectedIndex].getAttribute('id')})
    }

    

    const handleInputChange2 = (e) => {
        e.preventDefault();
        setTipoPagarSelecionado({ 
                                id: e.target.options[e.target.options.selectedIndex].getAttribute('id'),
                                descricao: e.target.options[e.target.options.selectedIndex].getAttribute('descricao')
                                
                            });
        objPagar && setObjPagar({...objPagar, pagar_tipo_id: e.target.options[e.target.options.selectedIndex].getAttribute('id')})
    }

    const buscaClienteSelecionado = (idCliente) => {
        Axios.get(`${URI}/clientes?id=${idCliente}`)
        .then(res => {setClienteSelecionado(res.data[0])})  
        .catch(window.alert);
    }

    function dataAtual() {
        const data = new Date();
        data.setHours(0,0,0,0);
        const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
        setDataVenda(data);
        
        setDataVendaFormatada(dataFormatada);
        setDataVencimento(data);
        setDataVencimentoFormatada(dataFormatada);
    }

    function dataCalendar(dataCalendar) {
        const data = new Date(dataCalendar);
        const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
        setDataVenda(data);
        setDataVendaFormatada(dataFormatada)
        objPagar && setObjPagar({...objPagar, vencimento: data, vencimentoformatado: dataFormatada, vencimentojson:data})
    }

    function dataCalendarVencimento(dataCalendar) {
        const data = new Date(dataCalendar);
        const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
        setDataVencimento(data);
        setDataVencimentoFormatada(dataFormatada)
        
    }


    const handleObsVenda = (e) =>{
        setObsVenda(e.target.value);
        objPagar && setObjPagar({...objPagar, obs: e.target.value})
    }
    
    const handleChangeCondpg = (e) => {
        e.preventDefault();
        const objParcelas = {
                                id: e.target.options[e.target.options.selectedIndex].getAttribute('id'),
                                descricao: e.target.options[e.target.options.selectedIndex].getAttribute('descricao'),
                                parcelado: e.target.options[e.target.options.selectedIndex].getAttribute('parcelado'),
                                avista: e.target.options[e.target.options.selectedIndex].getAttribute('avista')
                            };
        setCondpgSelecionada(objParcelas);
        objPagar && setObjPagar({...objPagar, condpg_id: e.target.options[e.target.options.selectedIndex].getAttribute('id')})
    }

    const handleValorPagar = (e) => {
        if(parseFloat(e.target.value) > 0){
            setValorPagar(e.target.value)
            objPagar && setObjPagar({...objPagar, valor:e.target.value})
        }else{
            setValorPagar('')
        }
    }

    const salvarPagar = () => {
        const data = new Date();
        data.setHours(0,0,0,0);
        const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();

        Axios.post(`${URI}/pagarnew`,{
            compra_id: 0,
            cliente_id: clienteSelecionado.id,
            condpg_id: condpgSelecionada.id,
            data: data,
            dataformatada: dataFormatada,
            datajson: data,
            vencimento: dataVenda,
            vencimentoformatado: dataVendaFormatada,
            vencimentojson: dataVencimento,
            parcela: 1,
            valor: valorPagar,
            baixado: 0,
            databaixa: null,
            databaixaformatada: null,
            databaixajson: null,
            pagar_tipo_id: tipoPagarSelecionado.id,
            obs: obsVenda
        })
        .then(getPagar)
        .catch(window.alert);
        closeNovaOs();        
    }

    const alterarPagar = () => {
        Axios.patch(`${URI}/pagar`,objPagar)
        .then(getPagar)
        .catch(window.alert);
        closeNovaOs();        
    }


    function addTipoPagar()  { 
        setNovoTipoPagar(true);
    }

    const handleNovoTipoPagar = (e) => {
        setDescNovoTipoPagar(e.target.value)
    }

    const handleValorBaixaParcial = (e) => {
        setValorBaixaParcial(e.target.value)
    }

    function salvarNovoTipoPagar()  { 
        Axios.post(`${URI}/pagartipo`,{descricao: descNovoTipoPagar}).then(recarregaDropDowns1).then(recarregaDropDowns2).catch(window.alert);
        setDescNovoTipoPagar('');
        setNovoTipoPagar(false);
    
    }

    function recarregaDropDowns1(){
        setAdicionarPagar(false);
    }
    
      function recarregaDropDowns2(){
        setAdicionarPagar(true);
    }

    function abreModalAdicionarPagar(){
        setAdicionarPagar(true);
    }

    function abreAlterarPagar(parcela){
        setObjPagar(parcela)
        setAdicionarPagar(true)
    }

    const abreFiltroPagas = () => {
        setModalFiltroPagas(true);     
    }

    const abreFiltroPagar = () => {
        setModalFiltroPagar(true);     
    }

    const abreFiltroReceber = () => {
        setModalFiltroReceber(true);     
    }

    const abreFiltroRecebidas = () => {
        setModalFiltroRecebidas(true);     
    }

    const closeModalFiltroPagas = () => {
        setModalFiltroPagas(false);   
        setModalFiltroPagar(false);  
        setModalFiltroReceber(false)
        setModalFiltroRecebidas(false)
        setFiltrosPagas({})  
        setModaisDatas({})
    }

    const handleInputChangeFiltro = (e,filtro) => {
        if(filtro === 'dataini'){
            const data = new Date(e);
            const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
            setFiltrosPagas({...filtrosPagas, dataini: data, datainiformatada: dataFormatada})
        }

        if(filtro === 'datafim'){
            const data = new Date(e);
            const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
            setFiltrosPagas({...filtrosPagas, datafim: data, datafimformatada: dataFormatada})
        }

        if(filtro === 'vencimentoini'){
            const data = new Date(e);
            const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
            setFiltrosPagas({...filtrosPagas, vencimentoini: data, vencimentoiniformatada: dataFormatada})
        }

        if(filtro === 'vencimentofim'){
            const data = new Date(e);
            const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
            setFiltrosPagas({...filtrosPagas, vencimentofim: data, vencimentofimformatada: dataFormatada})
        }

        
        if(filtro === 'baixaini'){
            const data = new Date(e);
            const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
            setFiltrosPagas({...filtrosPagas, baixaini: data, baixainiformatada: dataFormatada})
        }

        if(filtro === 'baixafim'){
            const data = new Date(e);
            const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
            setFiltrosPagas({...filtrosPagas, baixafim: data, baixafimformatada: dataFormatada})
        }
        
        if(filtro === 'cliente' || filtro === 'tipopagar') {
            e.preventDefault();
            setFiltrosPagas({...filtrosPagas, [filtro]: e.target.options[e.target.options.selectedIndex].getAttribute('id')})
        }

        setModaisDatas({})

    }

    const onClickDataFiltro = (modal) => {
        setModaisDatas({[modal]: true})
    }

    const closeModalDatas = () => {
        setModaisDatas({})
    }
    
    const filtrarPagas = () => {
        
        Axios.post(`${URI}/filtropagas`, filtrosPagas)
        .then(res => setFechadosPagar(res.data))
        .then(closeModalFiltroPagas)
    }

    const filtrarPagar = () => {
        
        Axios.post(`${URI}/filtropagar`, filtrosPagas)
        .then(res => setAbertosPagar(res.data))
        .then(closeModalFiltroPagas)
    }

    const filtrarReceber = () => {
        
        Axios.post(`${URI}/filtroreceber`, filtrosPagas)
        .then(res => setAbertos(res.data))
        .then(closeModalFiltroPagas)
    }

    const filtrarRecebidas = () => {
        
        Axios.post(`${URI}/filtrorecebidas`, filtrosPagas)
        .then(res => setFechados(res.data))
        .then(closeModalFiltroPagas)
    }

    
    
  return(
    <div className="Financeiro">
        <div>
            <div>
                <div className='Menu'>
                    <div className='Links'>
                        <div className='tooltip'>
                            <div id="iconsNavBar">
                                <div style={{marginRight:'10px'}}>
                                    {btEntrada ? <div> <Botao props={"Entrada"} type={'MenuFinanceiroSelecionado'} onClick={handleBtEntrada} count={countReceber}/> </div>  : <Botao props={"Entrada"} type={'MenuFinanceiro'} onClick={handleBtEntrada} count={countReceber}/>}
                                </div>
                                
                            </div>
                        </div>
                        <div className='tooltip'>
                            <div id="iconsNavBar">
                                <div style={{marginLeft:'10px'}}>
                                    {btSaida ? <Botao props={"Saida"} type={'MenuFinanceiroSelecionado'} onClick={handleBtSaida} count={countPagar}/> : <Botao props={"Saida"} type={'MenuFinanceiro'} onClick={handleBtSaida} count={countPagar}/>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {
                Boolean(btEntrada) ?
                <div>
                    <div className='Menu'>
                        <div className='Links'>
                            <div className='tooltip'>
                                <div id="iconsNavBar">
                                    <div style={{marginRight:'10px'}}>
                                        {btReceber ? <Botao props={"Receber"} type={'MenuFinanceiroSelecionado'} onClick={handleBtReceber}/> : <Botao props={"Receber"} type={'MenuFinanceiro'} onClick={handleBtReceber}/>}
                                    </div>
                                    
                                </div>
                            </div>
                            <div className='tooltip'>
                                <div id="iconsNavBar">
                                    <div style={{marginLeft:'10px'}}>
                                        {btRecebidas ? <Botao props={"Recebidas"} type={'MenuFinanceiroSelecionado'} onClick={handleBtRecebidas}/> : <Botao props={"Recebidas"} type={'MenuFinanceiro'} onClick={handleBtRecebidas}/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                : null
            }

            {
                Boolean(btSaida) ?
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
                                        {btPagas ? <Botao props={"Paguei"} type={'MenuFinanceiroSelecionado'} onClick={handleBtPagas}/> : <Botao props={"Paguei"} type={'MenuFinanceiro'} onClick={handleBtPagas}/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                : null
            }
            

            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                <div style={{textAlign:'left'}}>
                    Busca: <input style={{width: "80%"}}></input>
                </div>
                <div style={{textAlign:'right'}}>
                    
                </div>
            </div>

        </div>



        <br/>
        { /* *********************  Conteudo Tabelas *********************************** */}
        { /* *********************  Receber *********************************** */}
        {
            Boolean(btReceber) ? 
                <div>
                    <div className='Conteudo'>
                        <div className='esquerda'>
                            <table>
                                <caption></caption>
                                <thead >
                                    <tr >
                                        <th>Cliente</th>
                                        <th>Data</th> 
                                        <th>Vencimento</th> 
                                        <th>Parcela</th> 
                                        <th>Valor</th>
                                        <th></th>
                                        <th></th>
                                       
                                    </tr>
                                </thead>
                                <tbody >
                                    
                                    {abertos.map(parcela => (
                                        
                                        dataVenda.toISOString() < parcela.vencimento ?
                                            <tr key={parcela.id}  onDoubleClick={() => {}}>
                                                <td>{parcela.name}</td>
                                                <td>{parcela.dataformatada}</td>
                                                <td>{parcela.vencimentoformatado}</td>
                                                <td>{parcela.parcela}</td>
                                                <td>{parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                <td><Botao props={"Baixar"} type={'Baixar'} onClick={() => baixarParcela(parcela)}/></td>
                                                <td><Botao props={"Parcial"} type={'Baixar'} onClick={() => abreModalParcial(parcela)}/></td>
                                            </tr>
                                        :
                                            parcela.vencimento == dataVenda.toISOString() ?
                                                <tr key={parcela.id}  onDoubleClick={() => {}}>
                                                    <td className='tdnomeestoqueminino'>{parcela.name}</td>
                                                    <td className='tdestoqueminino'>{parcela.dataformatada}</td>
                                                    <td className='tdestoqueminino'>{parcela.vencimentoformatado}</td>
                                                    <td className='tdestoqueminino'>{parcela.parcela}</td>
                                                    <td className='tdestoqueminino'>{parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                    <td className='tdestoqueminino'><Botao props={"Baixar"} type={'Baixar'} onClick={() => baixarParcela(parcela)}/></td>
                                                    <td className='tdestoqueminino'><Botao props={"Parcial"} type={'Baixar'} onClick={() => abreModalParcial(parcela)}/></td>
                                                </tr>
                                            :
                                                <tr key={parcela.id}  onDoubleClick={() => {}}>
                                                    <td className='tdnomenegativo'>{parcela.name}</td>
                                                    <td className='tdnegativo'>{parcela.dataformatada}</td>
                                                    <td className='tdnegativo'>{parcela.vencimentoformatado}</td>
                                                    <td className='tdnegativo'>{parcela.parcela}</td>
                                                    <td className='tdnegativo'>{parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                    <td className='tdnegativo'><Botao props={"Baixar"} type={'Baixar'} onClick={() => baixarParcela(parcela)}/></td>
                                                    <td className='tdnegativo'><Botao props={"Parcial"} type={'Baixar'} onClick={() => abreModalParcial(parcela)}/></td>
                                                </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                                
                        <div className='direita'>
                           
                            <br/>
                            <Botao props={"Filtro"} type={'confirm'} onClick={abreFiltroReceber}/>
                        
                            
                            <br/>

                        </div>
                    </div>
                </div>
            : null
        }

        { /* *********************  Recebidas *********************************** */}
        {
            Boolean(btRecebidas) ? 
                <div>
                    <div className='Conteudo'>
                        <div className='esquerda'>
                            <table>
                                <caption></caption>
                                <thead >
                                    <tr >
                                        <th>Cliente</th>
                                        <th>Tipo</th>
                                        <th>Data</th> 
                                        <th>Vencimento</th> 
                                        <th>Parcela</th> 
                                        <th>Baixa</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {fechados.map(parcela => (
                                        <tr key={parcela.id}  onDoubleClick={() => {}}>
                                            <td>{parcela.name}</td>
                                            <td>{parcela.descricao}</td>
                                            <td>{parcela.dataformatada}</td>
                                            <td>{parcela.vencimentoformatado}</td>
                                            <td>{parcela.parcela}</td>
                                            <td>{parcela.databaixaformatada}</td>
                                            <td>{parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                                
                        <div className='direita'>
                            <Botao props={"Filtro"} type={'confirm'} onClick={abreFiltroRecebidas}/>
                    
                            <br/>

                        </div>
                    </div>
                </div>
            : null
        }
        
        { /* *********************  Pagar *********************************** */}
        {
            Boolean(btPagar) ? 
                <div>
                    <div className='Conteudo'>
                        <div className='esquerda'>
                            <table>
                                <caption></caption>
                                <thead >
                                    <tr >
                                        <th>Parceiro</th>
                                        <th>Tipo</th>
                                        <th>Descrição</th>
                                        <th>Data</th> 
                                        <th>Vencimento</th> 
                                        <th>Parcela</th> 
                                        <th>Valor</th>
                                        <th>Baixar</th>
                                        <th>Parcial</th>
                                        <th>Excluir</th>
                                       
                                    </tr>
                                </thead>
                                <tbody >
                                    {abertosPagar.map(parcela => (
                                        dataVenda.toISOString() < parcela.vencimento ?
                                            <tr key={parcela.id}  onDoubleClick={() => abreAlterarPagar(parcela)}>
                                                <td>{parcela.name}</td>
                                                <td>{parcela.descricao}</td>
                                                <td style={{whiteSpace:'nowrap', maxWidth:'400px', textOverflow:'ellipsis', overflow:'hidden'}}>{parcela.obs}</td>
                                                <td>{parcela.dataformatada}</td>
                                                <td>{parcela.vencimentoformatado}</td>
                                                <td>{parcela.parcela}</td>
                                                <td>{parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                <td><Botao props={"Baixar"} type={'Baixar'} onClick={() => baixarParcelaPagar(parcela)}/></td>
                                                <td><Botao props={"Parcial"} type={'Baixar'} onClick={() => abreModalParcial(parcela)}/></td>
                                                <td><Botao props={"-"} type={'Baixar'} onClick={() => handleExcluirParcelaPagar(parcela)}/></td>
                                            </tr> 
                                        :
                                        dataVenda.toISOString() == parcela.vencimento ?
                                            <tr key={parcela.id}  onDoubleClick={() => abreAlterarPagar(parcela)}>
                                                <td className='tdnomeestoqueminino'>{parcela.name}</td>
                                                <td className='tdestoqueminino'>{parcela.descricao}</td>
                                                <td className='tdestoqueminino' style={{whiteSpace:'nowrap', maxWidth:'400px', textOverflow:'ellipsis', overflow:'hidden'}}>{parcela.obs}</td>
                                                <td className='tdestoqueminino'>{parcela.dataformatada}</td>
                                                <td className='tdestoqueminino'>{parcela.vencimentoformatado}</td>
                                                <td className='tdestoqueminino'>{parcela.parcela}</td>
                                                <td className='tdestoqueminino'>{parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                <td className='tdestoqueminino'><Botao props={"Baixar"} type={'Baixar'} onClick={() => baixarParcelaPagar(parcela)}/></td>
                                                <td className='tdestoqueminino'><Botao props={"Parcial"} type={'Baixar'} onClick={() => abreModalParcial(parcela)}/></td>
                                                <td className='tdestoqueminino'><Botao props={"-"} type={'Baixar'} onClick={() => handleExcluirParcelaPagar(parcela)}/></td>
                                            </tr> 
                                            :
                                            <tr key={parcela.id}  onDoubleClick={() => abreAlterarPagar(parcela)}>
                                                <td className='tdnomenegativo'>{parcela.name}</td>
                                                <td className='tdnegativo'>{parcela.descricao}</td>
                                                <td className='tdnegativo' style={{whiteSpace:'nowrap', maxWidth:'400px', textOverflow:'ellipsis', overflow:'hidden'}}>{parcela.obs}</td>
                                                <td className='tdnegativo'>{parcela.dataformatada}</td>
                                                <td className='tdnegativo'>{parcela.vencimentoformatado}</td>
                                                <td className='tdnegativo'>{parcela.parcela}</td>
                                                <td className='tdnegativo'>{parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                <td className='tdnegativo'><Botao props={"Baixar"} type={'Baixar'} onClick={() => baixarParcelaPagar(parcela)}/></td>
                                                <td className='tdnegativo'><Botao props={"Parcial"} type={'Baixar'} onClick={() => abreModalParcial(parcela)}/></td>
                                                <td className='tdnegativo'><Botao props={"-"} type={'Baixar'} onClick={() => handleExcluirParcelaPagar(parcela)}/></td>
                                            </tr> 
                                    
                                    ))}
                                </tbody>
                            </table>
                        </div>

                                
                        <div className='direita'>
                            <Botao props={"Adicionar"} type={'confirm'} onClick={abreModalAdicionarPagar}/>
                            <br/>
                            <Botao props={"Filtro"} type={'confirm'} onClick={abreFiltroPagar}/>
                        
                            
                            <br/>

                        </div>
                    </div>
                </div>
            : null
        }

        {/* *********************  Adicionar Pagar *********************************** */}

        <UIModal isOpen={Boolean(adicionarPagar)} onClickClose={() => closeNovaOs()}>
            {Boolean(adicionarPagar) ?
                <div>
                    {/** Cabeçalho Modal */}
                    <div>
                    Adicionar Contas a Pagar
                    <br/>
                    <br/>
                    </div>

                    {
                        objPagar ?
                        <>
                           <div style={{display:"grid", gridTemplateColumns: "repeat(3, 1fr)"}}>
                                <div style={{  backgroundColor:'black', width: '50vh'}}>
                                    <DropDownClientes alteracao={true} idcliente={objPagar.cliente_id}  onChange={handleInputChange}/>
                                    <br/><br/>
                                <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)"}}>
                                    <div style={{ marginTop:'3px'}}>
                                        <DropDownTipoPagar alteracao={true} idtipopagar={objPagar.pagar_tipo_id} onChange={handleInputChange2}/>
                                    </div>
                                    <div style={{marginLeft: '5px'}}>
                                        <Botao props={"+"} type={"add2"} onClick={addTipoPagar}/>
                                    </div>
                                </div>
                                { /* *********************  Adicionar Novo Tipo Pagar *********************************** */}
                                <div>
                                        {novoTipoPagar ? 
                                            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                                                <div>
                                                <input type="text" value={descNovoTipoPagar} onChange={(e) => {handleNovoTipoPagar(e)}} />
                                                </div>

                                                <div>
                                                <Botao props={"Add"} type={"add2"} onClick={salvarNovoTipoPagar}/>
                                                </div>
                                            </div>  
                                        : null}
                                    </div>
                                    <br/>
                                    <DropDownCondpg idcondpg={objPagar.condpg_id}  onChange={handleChangeCondpg} alteracao={true}/>
                                    <br/><br/>
                                    <label style={{color: "white"}}>Valor: </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <input style={{width:'178px'}}type="text" value={objPagar.valor} onChange={(e) => handleValorPagar(e)} />
                                    <br/><br/>
                                    <label style={{color: "white"}}>Vencimento: </label>
                                    <input style={{width:'178px'}}type="text" value={objPagar.vencimentoformatado} onChange={() => {}} />
                                    <br/><br/>
                                    <Calendar value={new Date(objPagar.vencimento)} onChange={(e) => dataCalendar(e)}/>
                                
                                </div>      
                                <div>
                                    <label style={{color: "white", position:'absolute'}}>Descrição: </label>
                                    <textarea id='obsVenda' style={{height:'200px', width:'195px', marginLeft:'80px'}} value={objPagar.obs} onChange={e => handleObsVenda(e)}/>
                                </div>
                                <div style={{textAlign:'right'}}>
                                     <Botao props={"Salvar"} type={'confirm'} onClick={alterarPagar}/> 
                                    <br/>
                                    <Botao props={"Cancelar"} type={'cancel'} onClick={closeNovaOs}/>
                                </div>
                            </div> 
                        </>
                        :
                        // --- se nao tive objpagar
                        <>
                            <div style={{display:"grid", gridTemplateColumns: "repeat(3, 1fr)"}}>
                                <div style={{  backgroundColor:'black', width: '50vh'}}>
                                    <DropDownClientes  onChange={handleInputChange}/>
                                    <br/><br/>
                                <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)"}}>
                                    <div style={{ marginTop:'3px'}}>
                                        <DropDownTipoPagar  onChange={handleInputChange2}/>
                                    </div>
                                    <div style={{marginLeft: '5px'}}>
                                        <Botao props={"+"} type={"add2"} onClick={addTipoPagar}/>
                                    </div>
                                </div>
                                { /* *********************  Adicionar Novo Tipo Pagar *********************************** */}
                                <div>
                                        {novoTipoPagar ? 
                                            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                                                <div>
                                                <input type="text" value={descNovoTipoPagar} onChange={(e) => {handleNovoTipoPagar(e)}} />
                                                </div>

                                                <div>
                                                <Botao props={"Add"} type={"add2"} onClick={salvarNovoTipoPagar}/>
                                                </div>
                                            </div>  
                                        : null}
                                    </div>
                                    <br/>
                                    <DropDownCondpg  onChange={handleChangeCondpg} alteracao={true}/>
                                    <br/><br/>
                                    <label style={{color: "white"}}>Valor: </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <input style={{width:'178px'}}type="text" value={valorPagar} onChange={(e) => handleValorPagar(e)} />
                                    <br/><br/>
                                    <label style={{color: "white"}}>Vencimento: </label>
                                    <input style={{width:'178px'}}type="text" value={dataVendaFormatada} onChange={() => {}} />
                                    <br/><br/>
                                    <Calendar value={dataVenda} onChange={(e) => dataCalendar(e)}/>
                                
                                </div>      
                                <div>
                                    <label style={{color: "white", position:'absolute'}}>Descrição: </label>
                                    <textarea id='obsVenda' style={{height:'200px', width:'195px', marginLeft:'80px'}} value={obsVenda} onChange={e => handleObsVenda(e)}/>
                                </div>
                                <div style={{textAlign:'right'}}>
                                    {condpgSelecionada != null && tipoPagarSelecionado != null ? <Botao props={"Salvar"} type={'confirm'} onClick={salvarPagar}/> : null}
                                    <br/>
                                    <Botao props={"Cancelar"} type={'cancel'} onClick={closeNovaOs}/>
                                </div>
                            </div>
                        </>
                    }
                    {/* Meio Modal */}
                    
                </div>
            : null}
        </UIModal>

        {/* *********************  Baixa Pagar *********************************** */}

        <UIModal isOpen={Boolean(baixaPagar)} onClickClose={() => closeBaixaPagar()} >
            {Boolean(baixaPagar) ?
                <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)"}}>
                    <div>
                        <label style={{color: "white"}}>Data da Baixa: </label>
                        <input style={{width:'178px'}}type="text" value={dataVencimentoFormatada} onChange={() => {}} />
                        <br/><br/>
                        <Calendar value={dataVencimento} onChange={(e) => dataCalendarVencimento(e)}/>
                    </div>
                    

                    <div style={{textAlign:'right'}}>
                        <br/><br/>
                        <Botao props={"Baixar"} type={'confirm'} onClick={baixarParcelaPagar2}/>
                        <br/>
                        <Botao props={"Cancelar"} type={'cancel'} onClick={closeNovaOs}/>
                    </div>
                </div>
            : null}
        </UIModal>


        {/* *********************  Pagar Parcial *********************************** */}

        <UIModal isOpen={Boolean(modalParcial)} onClickClose={() => closeModalParcial()} >
            {Boolean(modalParcial) ?
                <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)"}}>
                    <div>
                        Valor Restante: {parcelaParcial.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        <br/>
                        <br/>
                        Baixar (R$): &nbsp;&nbsp;&nbsp;&nbsp;<input type="text" value={valorBaixaParcial} onChange={(e) => {handleValorBaixaParcial(e)}} />
                        <br/>
                        <br/>
                        <label style={{color: "white"}}>Data da Baixa: </label>
                        <input style={{width:'178px'}}type="text" value={dataVencimentoFormatada} onChange={() => {}} />
                        <br/><br/>
                        <Calendar value={dataVencimento} onChange={(e) => dataCalendarVencimento(e)}/>
                    </div>

                    <div style={{textAlign:'right'}}>
                        <br/><br/>
                        {valorBaixaParcial != 0 ? <Botao props={"Baixar"} type={"confirm"} onClick={baixarParcelaPagarParcial}/> : null }
                        <br/>
                        <Botao props={"Cancelar"} type={'cancel'} onClick={closeNovaOs}/>
                    </div>
                </div>
                
            : null}
        </UIModal>
                
        
        
        { /* *********************  Pagas *********************************** */}
        {
            Boolean(btPagas) ? 
                <div>
                    <div className='Conteudo'>
                        <div className='esquerda'>
                            <table>
                                <caption></caption>
                                <thead >
                                    <tr >
                                        <th>Parceiro</th>
                                        <th>Tipo</th>
                                        <th>Descrição</th>
                                        <th>Data</th> 
                                        <th>Vencimento</th> 
                                        <th>Parcela</th> 
                                        <th>Baixa</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {fechadosPagar.map(parcela => (
                                        <tr key={parcela.id}  onDoubleClick={() => {}}>
                                            <td>{parcela.name}</td>
                                            <td>{parcela.descricao}</td>
                                            <td style={{whiteSpace:'nowrap', maxWidth:'400px', textOverflow:'ellipsis', overflow:'hidden'}}>{parcela.obs}</td>
                                            <td>{parcela.dataformatada}</td>
                                            <td>{parcela.vencimentoformatado}</td>
                                            <td>{parcela.parcela}</td>
                                            <td>{parcela.databaixaformatada}</td>
                                            <td>{parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                                
                        <div className='direita'>
                            <Botao props={"Filtro"} type={'confirm'} onClick={abreFiltroPagas}/>
                        
                            
                            <br/>

                        </div>
                    </div>
                </div>
            : null
        }

        { /* *********************  Filtro Pagas *********************************** */}
        {
            <UIModal isOpen={Boolean(modalFiltroPagas)} onClickClose={() => closeModalFiltroPagas()} >
                {Boolean(modalFiltroPagas) ?
                    <div>
                        <DropDownClientes onChange={(e) => handleInputChangeFiltro(e,'cliente')}/>
                        <br/>
                        <br/>
                        <DropDownTipoPagar onChange={(e) => handleInputChangeFiltro(e,'tipopagar')}/>
                        <br/><br/>
                        Data...........: <input type="text" value={filtrosPagas.datainiformatada} onClick={() => onClickDataFiltro('dataini')} /> até <input type="text" value={filtrosPagas.datafimformatada} onClick={() => onClickDataFiltro('datafim')} />
                        {
                            modaisDatas.dataini && 
                            <UIModal isOpen={Boolean(modaisDatas.dataini)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.dataini) ?
                                    <Calendar value={filtrosPagas.dataini} onChange={(e) => handleInputChangeFiltro(e,'dataini')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        {
                            modaisDatas.datafim && 
                            <UIModal isOpen={Boolean(modaisDatas.datafim)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.datafim) ?
                                    <Calendar value={filtrosPagas.datafim} onChange={(e) => handleInputChangeFiltro(e,'datafim')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        <br/><br/>
                        Vencimento: <input type="text" value={filtrosPagas.vencimentoiniformatada} onClick={() => onClickDataFiltro('vencimentoini')} /> até <input type="text" value={filtrosPagas.vencimentofimformatada} onClick={() => onClickDataFiltro('vencimentofim')} />
                        {
                            modaisDatas.vencimentoini && 
                            <UIModal isOpen={Boolean(modaisDatas.vencimentoini)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.vencimentoini) ?
                                    <Calendar value={filtrosPagas.vencimentoini} onChange={(e) => handleInputChangeFiltro(e,'vencimentoini')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        {
                            modaisDatas.vencimentofim && 
                            <UIModal isOpen={Boolean(modaisDatas.vencimentofim)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.vencimentofim) ?
                                    <Calendar value={filtrosPagas.vencimentofim} onChange={(e) => handleInputChangeFiltro(e,'vencimentofim')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        <br/><br/>
                        Baixa..........: <input type="text" value={filtrosPagas.baixainiformatada} onClick={() => onClickDataFiltro('baixaini')} /> até <input type="text" value={filtrosPagas.baixafimformatada} onClick={() => onClickDataFiltro('baixafim')} />
                        {
                            modaisDatas.baixaini && 
                            <UIModal isOpen={Boolean(modaisDatas.baixaini)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.baixaini) ?
                                    <Calendar value={filtrosPagas.baixaini} onChange={(e) => handleInputChangeFiltro(e,'baixaini')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        {
                            modaisDatas.baixafim && 
                            <UIModal isOpen={Boolean(modaisDatas.baixafim)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.baixafim) ?
                                    <Calendar value={filtrosPagas.vencimentofim} onChange={(e) => handleInputChangeFiltro(e,'baixafim')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        <br/><br/>
                        <Botao props={"Filtrar"} type={'confirm'} onClick={filtrarPagas}/>
                    </div>
                    
                : null}
            </UIModal>
        }

        { /* *********************  Filtro Pagar *********************************** */}
        {
            <UIModal isOpen={Boolean(modalFiltroPagar)} onClickClose={() => closeModalFiltroPagas()} >
                {Boolean(modalFiltroPagar) ?
                    <div>
                        <DropDownClientes onChange={(e) => handleInputChangeFiltro(e,'cliente')}/>
                        <br/>
                        <br/>
                        <DropDownTipoPagar onChange={(e) => handleInputChangeFiltro(e,'tipopagar')}/>
                        <br/><br/>
                        Data...........: <input type="text" value={filtrosPagas.datainiformatada} onClick={() => onClickDataFiltro('dataini')} /> até <input type="text" value={filtrosPagas.datafimformatada} onClick={() => onClickDataFiltro('datafim')} />
                        {
                            modaisDatas.dataini && 
                            <UIModal isOpen={Boolean(modaisDatas.dataini)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.dataini) ?
                                    <Calendar value={filtrosPagas.dataini} onChange={(e) => handleInputChangeFiltro(e,'dataini')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        {
                            modaisDatas.datafim && 
                            <UIModal isOpen={Boolean(modaisDatas.datafim)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.datafim) ?
                                    <Calendar value={filtrosPagas.datafim} onChange={(e) => handleInputChangeFiltro(e,'datafim')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        <br/><br/>
                        Vencimento: <input type="text" value={filtrosPagas.vencimentoiniformatada} onClick={() => onClickDataFiltro('vencimentoini')} /> até <input type="text" value={filtrosPagas.vencimentofimformatada} onClick={() => onClickDataFiltro('vencimentofim')} />
                        {
                            modaisDatas.vencimentoini && 
                            <UIModal isOpen={Boolean(modaisDatas.vencimentoini)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.vencimentoini) ?
                                    <Calendar value={filtrosPagas.vencimentoini} onChange={(e) => handleInputChangeFiltro(e,'vencimentoini')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        {
                            modaisDatas.vencimentofim && 
                            <UIModal isOpen={Boolean(modaisDatas.vencimentofim)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.vencimentofim) ?
                                    <Calendar value={filtrosPagas.vencimentofim} onChange={(e) => handleInputChangeFiltro(e,'vencimentofim')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        <br/><br/>
                        <Botao props={"Filtrar"} type={'confirm'} onClick={filtrarPagar}/>
                    </div>
                    
                : null}
            </UIModal>
        }

        { /* *********************  Filtro Receber *********************************** */}
        {
            <UIModal isOpen={Boolean(modalFiltroReceber)} onClickClose={() => closeModalFiltroPagas()} >
                {Boolean(modalFiltroReceber) ?
                    <div>
                        <DropDownClientes onChange={(e) => handleInputChangeFiltro(e,'cliente')}/>
                        <br/>
                        <br/>
                        Data...........: <input type="text" value={filtrosPagas.datainiformatada} onClick={() => onClickDataFiltro('dataini')} /> até <input type="text" value={filtrosPagas.datafimformatada} onClick={() => onClickDataFiltro('datafim')} />
                        {
                            modaisDatas.dataini && 
                            <UIModal isOpen={Boolean(modaisDatas.dataini)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.dataini) ?
                                    <Calendar value={filtrosPagas.dataini} onChange={(e) => handleInputChangeFiltro(e,'dataini')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        {
                            modaisDatas.datafim && 
                            <UIModal isOpen={Boolean(modaisDatas.datafim)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.datafim) ?
                                    <Calendar value={filtrosPagas.datafim} onChange={(e) => handleInputChangeFiltro(e,'datafim')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        <br/><br/>
                        Vencimento: <input type="text" value={filtrosPagas.vencimentoiniformatada} onClick={() => onClickDataFiltro('vencimentoini')} /> até <input type="text" value={filtrosPagas.vencimentofimformatada} onClick={() => onClickDataFiltro('vencimentofim')} />
                        {
                            modaisDatas.vencimentoini && 
                            <UIModal isOpen={Boolean(modaisDatas.vencimentoini)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.vencimentoini) ?
                                    <Calendar value={filtrosPagas.vencimentoini} onChange={(e) => handleInputChangeFiltro(e,'vencimentoini')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        {
                            modaisDatas.vencimentofim && 
                            <UIModal isOpen={Boolean(modaisDatas.vencimentofim)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.vencimentofim) ?
                                    <Calendar value={filtrosPagas.vencimentofim} onChange={(e) => handleInputChangeFiltro(e,'vencimentofim')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        <br/><br/>
                        <Botao props={"Filtrar"} type={'confirm'} onClick={filtrarReceber}/>
                    </div>
                    
                : null}
            </UIModal>
        }

        { /* *********************  Filtro Recebidas *********************************** */}
        {
            <UIModal isOpen={Boolean(modalFiltroRecebidas)} onClickClose={() => closeModalFiltroPagas()} >
                {Boolean(modalFiltroRecebidas) ?
                    <div>
                        <DropDownClientes onChange={(e) => handleInputChangeFiltro(e,'cliente')}/>
                        <br/>
                        <br/>
                        Data...........: <input type="text" value={filtrosPagas.datainiformatada} onClick={() => onClickDataFiltro('dataini')} /> até <input type="text" value={filtrosPagas.datafimformatada} onClick={() => onClickDataFiltro('datafim')} />
                        {
                            modaisDatas.dataini && 
                            <UIModal isOpen={Boolean(modaisDatas.dataini)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.dataini) ?
                                    <Calendar value={filtrosPagas.dataini} onChange={(e) => handleInputChangeFiltro(e,'dataini')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        {
                            modaisDatas.datafim && 
                            <UIModal isOpen={Boolean(modaisDatas.datafim)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.datafim) ?
                                    <Calendar value={filtrosPagas.datafim} onChange={(e) => handleInputChangeFiltro(e,'datafim')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        <br/><br/>
                        Vencimento: <input type="text" value={filtrosPagas.vencimentoiniformatada} onClick={() => onClickDataFiltro('vencimentoini')} /> até <input type="text" value={filtrosPagas.vencimentofimformatada} onClick={() => onClickDataFiltro('vencimentofim')} />
                        {
                            modaisDatas.vencimentoini && 
                            <UIModal isOpen={Boolean(modaisDatas.vencimentoini)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.vencimentoini) ?
                                    <Calendar value={filtrosPagas.vencimentoini} onChange={(e) => handleInputChangeFiltro(e,'vencimentoini')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        {
                            modaisDatas.vencimentofim && 
                            <UIModal isOpen={Boolean(modaisDatas.vencimentofim)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.vencimentofim) ?
                                    <Calendar value={filtrosPagas.vencimentofim} onChange={(e) => handleInputChangeFiltro(e,'vencimentofim')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        <br/><br/>
                        Baixa..........: <input type="text" value={filtrosPagas.baixainiformatada} onClick={() => onClickDataFiltro('baixaini')} /> até <input type="text" value={filtrosPagas.baixafimformatada} onClick={() => onClickDataFiltro('baixafim')} />
                        {
                            modaisDatas.baixaini && 
                            <UIModal isOpen={Boolean(modaisDatas.baixaini)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.baixaini) ?
                                    <Calendar value={filtrosPagas.baixaini} onChange={(e) => handleInputChangeFiltro(e,'baixaini')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        {
                            modaisDatas.baixafim && 
                            <UIModal isOpen={Boolean(modaisDatas.baixafim)} onClickClose={() => closeModalDatas()} >
                                {Boolean(modaisDatas.baixafim) ?
                                    <Calendar value={filtrosPagas.vencimentofim} onChange={(e) => handleInputChangeFiltro(e,'baixafim')}/>
                                : null
                                }
                            </UIModal>
                            
                        }
                        <br/><br/>
                        <Botao props={"Filtrar"} type={'confirm'} onClick={filtrarRecebidas}/>
                    </div>
                    
                : null}
            </UIModal>
        }

        

    </div>
  )
}

export default Financeiro;