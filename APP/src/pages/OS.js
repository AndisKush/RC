import './OS.css';
import 'react-calendar/dist/Calendar.css'

import React, { useEffect, useState } from 'react'; 
import Axios from 'axios';
import Botao from "../components/Botao";
import UIModal from '../components/Modal';
import DropDownClientes from '../components/Forms/DropDownClientes';
import DropDownVeiculos from '../components/Forms/DropDownVeiculos';
import DropDownCondpg from '../components/Forms/DropDownCondpg';
import DropDownParcelasReceber from '../components/Forms/DropDownParcelasReceber';
import Calendar from 'react-calendar';


const URI = 'http://localhost:5001';

function OS(){
    const  [vendas, setVendas] = useState([]);
    const  [addVendas, setAddVendas] = useState(null);
    const  [addProdutos, setAddProdutos] = useState(null);
    const  [addServicos, setAddServicos] = useState(null);
    const  [addQtdProdutos, setAddQtdProdutos] = useState(null);
    const  [addQtdServico, setAddQtdServico] = useState(null);
    const  [modalReceber, setModalReceber] = useState(null);
    const  [qtdProduto, setQtdProdutos] = useState(1);
    const  [listaProdutos, setListaProdutos] = useState([]);
    const  [listaProdutosCopia, setListaProdutosCopia] = useState([]);
    const  [listaServicos, setListaServicos] = useState([]);
    const  [subTotal, setSubTotal] = useState(0);
    const  [desconto, setDesconto] = useState(0);
    const  [valorTotal, setValorTotal] = useState(0);
    const  [produtos, setProdutos] = useState([]);
    const  [servicos, setServicos] = useState([]);
    const  [clienteSelecionado, setClienteSelecionado] = useState({id: 1, name:'consumidor', telefone: '34999999999'})
    const  [veiculoSelecionado, setVeiculoSelecionado] = useState({id: 1, placa:"ABC1234", modelo:"VEICULO CONSUMIDOR"})
    const  [condpgSelecionada , setCondpgSelecionada] = useState({})
    const  [parcelas, setParcelas] = useState([]);
    const  [qtdParcelas, setQtdParcelas] = useState(1);
    const  [dummy, setDummy] = useState(true);
    const  [obsVenda, setObsVenda] = useState();
    const  [novaVenda, setNovaVenda] = useState(null);
    const  [osAberta, setOsAberta]= useState(false);
    const  [copiaVendas, setCopiaVendas] = useState();
    const  [copiaProdutos, setCopiaProdutos] = useState();
    const  [copiaServicos, setCopiaServicos] = useState();
    const  [parcelaSelecionada, setParcelaSelecionada] = useState({});
    const  [taxaParcela, setTaxaParcela] = useState(0);
    const  [dataVenda, setDataVenda] = useState();
    const  [dataVendaFormatada, setDataVendaFormatada] = useState();
    const  [filtroVenda, setFiltroVenda] = useState(false);
    const  [dataInicial, setDataInicial] = useState();
    const  [dataFinal, setDataFinal] = useState();
    const  [dataInicialFormatada, setDataInicialFormatada] = useState();
    const  [dataFinalFormatada, setDataFinalFormatada] = useState();
    const  [adicionarDataInicial, setAdicionarDataInicial] = useState(false);
    const  [adicionarDataFinal, setAdicionarDataFinal] = useState(false);
    const  [modalNovoCliente, setModalNovoCliente] = useState(false);
    const  [clienteNovo, setClienteNovo] = useState({name: ''});
    const  [removeuItem, setRemoveuItem] = useState(false);
    const  [removeuServico, setRemoveuServico] = useState(false);
    const  [alterouValor, setAlterouValor] = useState(false);
    const  [alterarVencimento, setAlterarVencimento] = useState(false);
    const  [index, setIndex] = useState(0);
    const  [descontoOperadora, setDescontoOperadora] = useState(0);
    const  [valorTotalLiquido, setValorTotalLiquido] = useState(0);
    const  [maxIdVenda, setMaxIdVenda] = useState(0);
    const  [modalSimulacao, setModalSimulacao] = useState(false);


    let vendasConsulta = [];
    let vendasFiltradas = [];

    useEffect(getVendas, [clienteSelecionado]);
    useEffect(getProdutos, []);
    useEffect(getServicos, []);

    useEffect(calculaSubTotal, [listaProdutos,listaServicos]);
    useEffect(calculaTotal, [subTotal,desconto,taxaParcela]);
    useEffect(calculaTotalLiquido, [descontoOperadora])

    useEffect(dataAtual, []);
    


    



  function getProdutos (){
    Axios.get(`${URI}/produtos`)
    .then(res => {setProdutos(res.data); setCopiaProdutos(res.data)})  
    .catch(window.alert);
  }

  function getServicos (){
    Axios.get(`${URI}/servicos`)
    .then(res => {setServicos(res.data); setCopiaServicos(res.data)})  
    .catch(window.alert);
  }


    function getVendas (){
        const data = new Date();
        data.setHours(0,0,0,0);
        Axios.get(`${URI}/vendas?data=${data.toISOString()}`)
        .then(res => {setVendas(res.data); setCopiaVendas(res.data)})  
        .catch(window.alert);
    }

    function dataAtual() {
        const data = new Date();
        data.setHours(0,0,0,0);
        const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
        setDataVenda(data);
        setDataVendaFormatada(dataFormatada);
    }

    function dataCalendar(dataCalendar) {
        const data = new Date(dataCalendar);
        const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
        setDataVenda(data);
        setDataVendaFormatada(dataFormatada)
    }

    const handleCalendar = (e) => {

        dataCalendar(e);
    }

    const handleBuscaVenda = (e) => {
        let busca = e.target.value;
        var newarr = copiaVendas.filter(venda => venda.cliente.name.toLowerCase().includes(busca.toLowerCase()));
        setVendas(newarr);
        if(busca === ''){
            getVendas();
        }
    }



    const handleBuscaProduto = (e) => {
        let busca = e.target.value;
        var newarr = copiaProdutos.filter(produto => produto.descricao.toLowerCase().includes(busca.toLowerCase()));
        setProdutos(newarr);
        if(busca === ''){
            getProdutos();
        }
    }

    const handleBuscaServicos = (e) => {
        let busca = e.target.value;
        var newarr = copiaServicos.filter(servico => servico.descricao.toLowerCase().includes(busca.toLowerCase()));
        setServicos(newarr);
        if(busca === ''){
            getServicos();
        }
    }

    
    const alteravalorparcela = (event,index) => {
        let newParcelas = JSON.parse(JSON.stringify(parcelas));
        event.target.value = event.target.value.replace(/,/gi, '.')
        newParcelas[index].valor = event.target.value
        setParcelas(newParcelas)
    }

    const abrirNovaOs = () => {
        Axios.get(`${URI}/maxvenda`)
        .then(res => {setMaxIdVenda(res.data[0].max + 1);})  
        .catch(window.alert);
        setNovaVenda(true);
    }

    const abrirModalSimulacao = () => {
        setCondpgSelecionada({id: 0});
        setOsAberta({parcela_id: 0})
        setModalSimulacao(true);
    }

    const abrirFiltroVenda = () => {
        setFiltroVenda(true);
    }


    const abreEditarVenda = () => {
        setNovaVenda(false);
        setAddVendas(true);
    }

    

    const abrirModalProdutos = () => {
        setAddProdutos(true);
    }

    const abrirModalServicos = () => {
        setAddServicos(true);
    }

    const handleObsVenda = (e) =>{
        setObsVenda(e.target.value);
    }
    const handleInputChange = (e) => {
        e.preventDefault();
        buscaClienteSelecionado(e.target.options[e.target.options.selectedIndex].getAttribute('id'))
    }

    const handleClienteNoVo = (e) => {
        setClienteNovo({name: e.target.value})
    }


    const handleInputChange2 = (e) => {
        e.preventDefault();
        setVeiculoSelecionado({ id: e.target.options[e.target.options.selectedIndex].getAttribute('id'),
                                placa: e.target.options[e.target.options.selectedIndex].getAttribute('placa'),
                                modelo: e.target.options[e.target.options.selectedIndex].getAttribute('modelo')
                                });
    }

    const handleChangeCondpg = (e) => {
        e.preventDefault();
        setParcelas([]);
        setAlterouValor(false);
        setQtdParcelas(1);
        setTaxaParcela(0);
        setParcelaSelecionada({id: 1});
        osAberta.parcela_id = 1;

        const objParcelas = {
                                id: e.target.options[e.target.options.selectedIndex].getAttribute('id'),
                                descricao: e.target.options[e.target.options.selectedIndex].getAttribute('descricao'),
                                parcelado: parseInt(e.target.options[e.target.options.selectedIndex].getAttribute('parcelado')),
                                avista: e.target.options[e.target.options.selectedIndex].getAttribute('avista')
                            };
        setCondpgSelecionada(objParcelas);
        
        if(e.target.options[e.target.options.selectedIndex].getAttribute('id') === '3'){
            setDescontoOperadora(1.99);
        }else{
            if(e.target.options[e.target.options.selectedIndex].getAttribute('id') === '2'){
                setDescontoOperadora(4.74);
            }else{
                setDescontoOperadora(0);
            }
        }
        
        if (e.target.options[e.target.options.selectedIndex].getAttribute('parcelado') === '0'){
            parcelasAvista(objParcelas);
            setTaxaParcela(0);
        }else{
            setParcelaSelecionada({id: 1});
        }
        
    }

    

    const parcelasAvista = (objParcelas) => {
        setParcelas([ {
            parcela: 1,
            data: dataVenda,
            dataformatada: dataVendaFormatada,
            vencimento: dataVenda,
            vencimentoformatado: dataVendaFormatada,
            valor: subTotal - desconto,
            condpg: objParcelas,
            cliente: clienteSelecionado,
            baixado: 1,
            databaixa: dataVenda,
            databaixaformatada: dataVendaFormatada,
            vendaId: osAberta.id}])
    }

    const handleParcelas = (e) => {
        e.preventDefault();
        setQtdParcelas(e.target.options[e.target.options.selectedIndex].getAttribute('id'))
        setTaxaParcela(parseFloat(e.target.options[e.target.options.selectedIndex].getAttribute('taxa')));
        setParcelaSelecionada({id: e.target.options[e.target.options.selectedIndex].getAttribute('id')});
        
        if(condpgSelecionada.id === '2'){
            setDescontoOperadora(parseFloat(e.target.options[e.target.options.selectedIndex].getAttribute('descontooperadora')))
        }else{
            setDescontoOperadora(0);
        }
        //calculaTotal();
    }

    const gerarParcelas = () => {
        const valorparcel = valorTotal / qtdParcelas;
        const arrparcel = [];
        const vencimento = new Date(dataVenda);
        //setParcelaSelecionada({id: e.target.options[e.target.options.selectedIndex].getAttribute('id')})
        
        if(condpgSelecionada.avista === '1'){
            for (var i = 0; i < qtdParcelas; i++){
                const vencimentonew = new Date(vencimento.setMonth(vencimento.getMonth() + 1));
                const vencimentoFormatado = ((vencimento.getDate() )) + "/" + (vencimento.getMonth() + 1 < 10 ? ("0" + parseFloat(vencimento.getMonth() + 1)) : (vencimento.getMonth() + 1)) + "/" + vencimento.getFullYear();
                arrparcel[i] = {
                    parcela: i+1,
                    data: dataVenda,
                    dataformatada: dataVendaFormatada,
                    vencimento: vencimentonew,
                    vencimentoformatado: vencimentoFormatado,
                    valor: valorparcel,
                    condpg: condpgSelecionada,
                    cliente: clienteSelecionado,
                    baixado: 1,
                    databaixa: dataVenda,
                    databaixaformatada: dataVendaFormatada,
                    databaixajson: dataVenda,
                    vendaId: osAberta.id        
                }
            }
        }else{
            for (var i = 0; i < qtdParcelas; i++){
                const vencimentonew = new Date(vencimento.setMonth(vencimento.getMonth() + 1));
                const vencimentoFormatado = ((vencimento.getDate() )) + "/" + (vencimento.getMonth() + 1 < 10 ? ("0" + parseFloat(vencimento.getMonth() + 1)) : (vencimento.getMonth() + 1)) + "/" + vencimento.getFullYear();
                arrparcel[i] = {
                    parcela: i+1,
                    data: dataVenda,
                    dataformatada: dataVendaFormatada,
                    vencimento: vencimentonew,
                    vencimentoformatado: vencimentoFormatado,
                    valor: valorparcel,
                    condpg: condpgSelecionada,
                    cliente: clienteSelecionado,
                    baixado: 0,
                    databaixa: null,
                    databaixaformatada: null,
                    databaixajson: null,
                    vendaId: osAberta.id
                }
            }
        }
        setParcelas(arrparcel);
    }

    const buscaClienteSelecionado = (idCliente) => {
        Axios.get(`${URI}/clientes?id=${idCliente}`)
        .then(res => {setClienteSelecionado(res.data[0]);})  
        .catch(window.alert);

        Axios.get(`${URI}/veiculos?cliente_id=${idCliente}`)
        .then(res => {setVeiculoSelecionado(res.data[0])})  
        .catch(window.alert);
    }

    function handleAddQtdProduto(produto){
        setAddQtdProdutos(produto)
    }

    function handleAddQtdServico(servico){
        setAddQtdServico(servico)
    }

    const adicionaQtd = () => {
        setQtdProdutos(parseFloat(qtdProduto) + 1);
    }

    const removeQtd = () => {
        setQtdProdutos(parseFloat(qtdProduto) - 1);
    }

    const handleQtdProduto = (e) =>{
        setQtdProdutos(e.target.value)
    }

    const handleTaxa = (e) => {
        if(e.target.value > 0){
            setTaxaParcela(e.target.value)
        }else{
            setTaxaParcela('')
        }
        
    }

    const handleValorSimulacao = (e) => {
        if(e.target.value > 0){
            setSubTotal(e.target.value)
        }else{
            setSubTotal('')
        }
        
    }

    const handleDesconto = (e) =>{
        if(parseFloat(e.target.value) > 0){
            setDesconto(e.target.value)
        }else{
            setDesconto('')
        }
    }

    const handleVendaAlterado = (e,index) => {
        if(parseFloat(e.target.value) >= 0){
            listaProdutos[index].valorvenda = parseFloat(e.target.value)
            setDummy(!dummy);
        }else{
            listaProdutos[index].valorvenda = ''
            setDummy(!dummy);
        }
        calculaSubTotal()
    }

    const handleQuantidadeAlterada = (e,index) => {
        if(parseFloat(e.target.value) >= 0){
            listaProdutos[index].quantidade = parseFloat(e.target.value)
            setDummy(!dummy);
        }else{
            listaProdutos[index].quantidade = ''
            setDummy(!dummy);
        }
        calculaSubTotal()
    }

    const handleServicoAlterado = (e,index) => {
        if(parseFloat(e.target.value) >= 0){
            listaServicos[index].valorvenda = parseFloat(e.target.value)
            setDummy(!dummy);
        }else{
            listaServicos[index].valorvenda = ''
            setDummy(!dummy);
        }
        calculaSubTotal()
    }

    const handleQuantidadeServicoAlterada = (e,index) => {
        if(parseFloat(e.target.value) >= 0){
            listaServicos[index].quantidade = parseFloat(e.target.value)
            setDummy(!dummy);
        }else{
            listaServicos[index].quantidade = ''
            setDummy(!dummy);
        }
        calculaSubTotal()
    }

    const handleQtdParcelas = (e) => {

        if(parseFloat(e.target.value) >= 0){
            setQtdParcelas(parseFloat(e.target.value))
        }else{
            setQtdParcelas(e.target.value)
        }
        
    }
    const closeAddQtdProduto = () => {
        setAddQtdProdutos(null);
        setAddQtdServico(null);
        setQtdProdutos(1);
    }

    const closeModalReceber = () => {
        setModalSimulacao(false);
        if (osAberta.parcelas.length > 0){
            setModalReceber(null)
            setModalSimulacao(false);
        }else{
            setModalReceber(null)
            setParcelas([])
            setQtdParcelas(1)
            setTaxaParcela(0)
            setCondpgSelecionada({parcelado: '0'})
            setDescontoOperadora(0);
            setModalSimulacao(false);
        }
    }

    const closeModalSimulacao = () => {
        setModalReceber(null)
        setSubTotal(0);
        setParcelas([])
        setQtdParcelas(1)
        setTaxaParcela(0)
        setCondpgSelecionada({parcelado: '0'})
        setDescontoOperadora(0);
        setModalSimulacao(false);
        
    }

    const adicionaProdutoLista = () => {
        let produtoRepetido = false;
        listaProdutos.map(produto => {
            if(produto.id === addQtdProdutos.id) {
                produto.quantidade = parseFloat(produto.quantidade) + parseFloat(qtdProduto)
                produtoRepetido = true
                calculaSubTotal();
            }
        })
        if (!produtoRepetido){
            setListaProdutos([...listaProdutos ,{...addQtdProdutos, quantidade:qtdProduto}])
        };
        closeAddQtdProduto();
    }


    const adicionaProdutoLista3 = (produtosVinculados) => {
        
        var newArray = listaProdutos;
        produtosVinculados.map(produtoVincu => {
                let produtoRepetido = false;
                newArray.map(produto => {
                    if(produtoVincu.id === produto.id) {
                        produto.quantidade = parseFloat(produto.quantidade) + parseFloat(produtoVincu.quantidadevinculada)
                        produtoRepetido = true
                        calculaSubTotal();
                    }
                })
                if (!produtoRepetido){ 
                    newArray = [...newArray ,{...produtoVincu, quantidade: produtoVincu.quantidadevinculada}]
                    setListaProdutos(newArray);
                }
        })
        closeAddQtdProduto();
    }


    const adicionaServicoLista = async () => {
        let produtoRepetido = false;
        await listaServicos.map(servico => {
            if(servico.id === addQtdServico.id) {
                servico.quantidade = parseFloat(servico.quantidade) + parseFloat(qtdProduto)
                produtoRepetido = true
                calculaSubTotal();
            }
        })
        if (!produtoRepetido){
            setListaServicos([...listaServicos ,{...addQtdServico, quantidade:qtdProduto}])
        };

        await Axios.get(`${URI}/produtosvinculados?servico_id=${addQtdServico.id}`).then( async res => {addQtdServico.produtosVinculados = res.data})

        if(addQtdServico.produtosVinculados.length > 0){
            if(window.confirm("Deseja importar os produtos vinculados?")){
                adicionaProdutoLista3(addQtdServico.produtosVinculados);
            }
            //calculaSubTotal();
        }
        closeAddQtdProduto();
        //calculaSubTotal();
    }

  function calculaSubTotal() {
        let calc = 0;
        listaProdutos.map(produto => {
            calc = calc + produto.valorvenda * produto.quantidade
        })
        listaServicos.map(servico => {
            calc = calc + servico.valorvenda * servico.quantidade
        })
        
        
        setSubTotal(calc);
        calculaTotal();
    }

    function calculaTotalLiquido() {
        setValorTotalLiquido((subTotal - desconto)-((subTotal - desconto) * (descontoOperadora)/100))     
    }

    async function calculaTotal(){
            
        await setValorTotal((subTotal - desconto) + ((subTotal - desconto)*taxaParcela/100));
        calculaTotalLiquido();
    }
    

    

    const cadastraNovoClienteRapido = async () => {
        if (clienteNovo.name !== ''){
            await Axios.post(`${URI}/clientes`,{
                name: clienteNovo.name,
                ativo: 1,
                conheceu_id: 4, 
            })
            .catch(window.alert)
            window.alert("Cliente Cadastradado");
    
            await Axios.get(`${URI}/ultimocliente`)
            .then(res => {setClienteSelecionado(res.data[0])});
            setVeiculoSelecionado({id: 0});
            setClienteNovo(clienteNovo.name = '');
            setNovaVenda(false);
            setNovaVenda(true);
        } else {
            window.alert("Digite um nome");
        }
        
        
    }

    

    const closeAdicionarVenda = () => {
        setAddVendas(null)
        resetCampos();
    }

    const closeNovaOs = () => {
        setNovaVenda(false);
        resetCampos();
    }

    const closeNovoCliente = () => {
        setModalNovoCliente(false);
    }

    const closeFiltroVenda = () => {
        setFiltroVenda(false);
    }

    function handleCalendarVencimento(dataCalendar) {
        const data = new Date(dataCalendar);
        const dataFormatada = ((data.getDate() )) + "/" + (data.getMonth() + 1 < 10 ? ("0" + parseFloat(data.getMonth() + 1)) : (data.getMonth() + 1)) + "/" + data.getFullYear();
        parcelas[index].vencimento = data;
        parcelas[index].vencimentoformatado = dataFormatada;
        parcelas[index].vencimentojson = data;
        setIndex(0);
        setAlterarVencimento(false);
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


    const abrirOsBanco = async  () => {
        /*
        await Axios.post(`${URI}/vendas`,{
           cliente_id: clienteSelecionado.id,
           veiculo_id: !veiculoSelecionado ? 0 : veiculoSelecionado.id,
           data: dataVenda,
           dataformatada: dataVendaFormatada,
           datajson: dataVenda,
           subtotal: 0,
           desconto: 0,
           valortotal: 0,
           condpg_id: 0,
           taxa: 0,
           parcela_id: 0,
           obsvenda: obsVenda
       }).then(getVendas)
       .catch(window.alert);
       */
       buscaVendaeAbreTela();
   }

   const buscaVendaeAbreTela = () => {

        let venda = {
            cliente_id: clienteSelecionado.id,
            veiculo_id: !veiculoSelecionado ? 0 : veiculoSelecionado.id,
            data: dataVenda,
            dataformatada: dataVendaFormatada,
            datajson: dataVenda,
            subtotal: 0,
            desconto: 0,
            valortotal: 0,
            condpg_id: 0,
            taxa: 0,
            parcela_id: 0,
            obs: obsVenda,
            id: maxIdVenda
        }
        handleClickTable(venda);
        setNovaVenda(null);
   }

   const refazerFinanceiro = () => {
        if(condpgSelecionada.parcelado == 0){
            parcelasAvista();
        }else{
            gerarParcelas();
        }
        setAlterouValor(false);
   }

   const handleClickTable = async (venda) => {
        setClienteSelecionado({id: venda.cliente_id});
        setVeiculoSelecionado({id: venda.veiculo_id});
        setObsVenda(venda.obs);
        setSubTotal(venda.subtotal);
        setDesconto(venda.desconto);
        setValorTotal(venda.valortotal);
        await Axios.get(`${URI}/condpg?id=${venda.condpg_id}`).then(res => {res.data.length > 0 ? setCondpgSelecionada(res.data[0]) : setCondpgSelecionada({id:0})})
        await setOsAberta(venda);
        buscaProdutosVenda(venda);
        buscaServicosVenda(venda);
        buscaReceberVenda(venda);
        setParcelaSelecionada({id: venda.parcela_id})
        setTaxaParcela(venda.taxa);
        venda.parcela_id === 0 ? setQtdParcelas(1) : setQtdParcelas(venda.parcela_id)
        setAddVendas(true);
        dataCalendar(venda.data);
        setDescontoOperadora(venda.descontooperadora);
        setValorTotalLiquido(venda.valortotalliquido);
    }

    const abreModalVencimento = (e,index) => {
        setIndex(index)
        setAlterarVencimento(true)
    }

    const buscaProdutosVenda = async (venda) => {
        await Axios.get(`${URI}/vendasprodutos?venda_id=${venda.id}`).then(res => {setListaProdutos(res.data); setListaProdutosCopia(JSON.parse(JSON.stringify(res.data)))});
    }
    

    const buscaServicosVenda = async (venda) => {
        await Axios.get(`${URI}/vendasservicos?venda_id=${venda.id}`).then(res => setListaServicos(res.data));
    }

    const buscaReceberVenda = async (venda) => {
        await Axios.get(`${URI}/receber?venda_id=${venda.id}`).then(res => {setParcelas(res.data);});
    }

    
    const salvarVenda = async () => {
        
        

        let valorparcela = 0;
        if(parcelas.length > 0){
            parcelas.map(parcela => {
                valorparcela += parseFloat(parcela.valor)
            })
            if(valorparcela.toFixed(1) != valorTotal.toFixed(1)){
                window.alert("Valor do financeiro diferente do valor da venda");
                // setAlterouValor(true);
            } else {
                if(osAberta.parcelas.length > 0 && parcelas.length < osAberta.parcelas.length){
                    await Axios.delete(`${URI}/receber?venda_id=${osAberta.id}`)
                }
                
                await Axios.patch(`${URI}/vendasnew`,{
                    id: osAberta.id,
                    cliente_id: clienteSelecionado.id,
                    veiculo_id: veiculoSelecionado.id,
                    data: dataVenda,
                    dataformatada: dataVendaFormatada,
                    datajson: dataVenda,
                    subtotal: subTotal,
                    desconto: desconto,
                    valortotal: valorTotal,
                    condpg_id: condpgSelecionada.id,
                    taxa: parseFloat(taxaParcela) > 0 ? taxaParcela : 0,
                    parcela_id: parcelaSelecionada.id,
                    obsvenda: obsVenda,
                    valortotalliquido: valorTotalLiquido,
                    descontooperadora: descontoOperadora
                }).catch(window.alert)
                await salvarProdutosVenda();
                await salvarServicosVenda();
                await salvarReceber();
                await baixaEstoqueProduto();
                //.then(getVendas)
                setAddVendas(null);
                setModalReceber(null);
                getVendas();
                resetCampos();
            }
        }

        
    }

    const salvarProdutosVenda = async () => {
        if(removeuItem){
            listaProdutosCopia.map(produtoc =>{
                let encontrou = false
                listaProdutos.map(produto => {
                    if(produtoc.id == produto.id){
                        encontrou = true
                    }
                })
                if(!encontrou){
                    produtoc.estoque = produtoc.estoque + produtoc.quantidade
                    Axios.patch(`${URI}/produtos`, produtoc)
                }
            })
            await Axios.delete(`${URI}/vendasprodutos?venda_id=${osAberta.id}`)
        }

        await listaProdutos.map(async produto => {
            await Axios.post(`${URI}/vendasprodutos`,{
                venda_id: osAberta.id,
                produto_id: produto.id,
                quantidade: produto.quantidade,
                valorvenda: produto.valorvenda,
                totalprod: produto.quantidade * produto.valorvenda
            }).catch(window.alert)
        })
    }

    const salvarServicosVenda = async () => {
        if(removeuServico){
            await Axios.delete(`${URI}/vendasservicos?venda_id=${osAberta.id}`)
        }

        await listaServicos.map(async servico => {
            await Axios.post(`${URI}/vendasservicos`,{
                venda_id: osAberta.id,
                servico_id: servico.id,
                quantidade: servico.quantidade,
                valorvenda: servico.valorvenda,
                totalprod: servico.quantidade * servico.valorvenda
            }).catch(window.alert)
        })
    }

    const salvarReceber = async () => {
        await parcelas.map(async parcela => {
            await Axios.post(`${URI}/receber`,{
                venda_id: osAberta.id,
                cliente_id: clienteSelecionado.id,
                condpg_id: condpgSelecionada.id,
                data: parcela.data,
                dataformatada: parcela.dataformatada,
                datajson: parcela.data,
                vencimento: parcela.vencimento,
                vencimentoformatado: parcela.vencimentoformatado,
                vencimentojson: parcela.vencimento,
                parcela: parcela.parcela,
                valor: parcela.valor,
                baixado: parcela.baixado,
                databaixa: parcela.databaixa,
                databaixaformatada: parcela.databaixaformatada,
                databaixajson: parcela.databaixa
                
            })
        })
    }

    const baixaEstoqueProduto = async () => {
        await listaProdutos.map(async produto => {
            await listaProdutosCopia.map(produtoc => {
                if (produtoc.id == produto.id){
                    produto.quantidade = parseFloat(produto.quantidade) - parseFloat(produtoc.quantidade)
                }
            })
            produto.estoque = parseFloat(produto.estoque) - parseFloat(produto.quantidade)
            Axios.patch(`${URI}/produtos`, produto)
            .then(getProdutos)  
            .catch(window.alert);
        })
    }

    const abrirReceber = async () => {
        calculaSubTotal();
        osAberta.parcelas = parcelas;

        let valorparcela = 0;
        if(parcelas.length > 0){
            await parcelas.map(parcela => {
                valorparcela += parcela.valor
            })
            //window.alert(Math.trunc(valorparcela*100)/100);
            //window.alert(valorTotal.toFixed(2));
            if(valorparcela.toFixed(1) != valorTotal.toFixed(1)){
                window.alert("Alteração no valor da venda, é necessário refazer o financeiro");
                setAlterouValor(true);
            }
        }

        setModalReceber(true);
    }

    const resetCampos = () => {
        setListaProdutos([]);
        setListaServicos([]);
        setSubTotal(0);
        setDesconto(0);
        setValorTotal(0);
        setParcelas([]);
        setQtdParcelas(1);
        setCondpgSelecionada({parcelado: '0'});
        setTaxaParcela(0)
        setClienteSelecionado({id: 1, name:'consumidor', telefone: '34999999999'});
        setVeiculoSelecionado({id: 1, placa:"ABC1234", modelo:"VEICULO CONSUMIDOR"});
        setObsVenda(null);
        setOsAberta(false)
        setNovaVenda(null);
        dataAtual();
        setRemoveuItem(false);
        setRemoveuServico(false);
        getProdutos();
        setModalSimulacao(false);
    } 

    const removeItem = async (produtoid) => {
        setRemoveuItem(true);
        var newarr = listaProdutos;
        for( var i = 0; i < newarr.length; i++){
            if(newarr[i].id === produtoid){
                newarr.splice(i,1);
                setListaProdutos(newarr);       
            }
        }
        //await Axios.delete(`${URI}/vendasprodutos?venda_id=${osAberta.id}&produto_id=${produtoid}`);
        //buscaProdutosVenda(osAberta);
        setDummy(!dummy);
        calculaSubTotal();
    }

    const removeServico = (servicoid) => {
        setRemoveuServico(true);
        var newarr = listaServicos;
        for( var i = 0; i < newarr.length; i++){
            if(newarr[i].id === servicoid){
                newarr.splice(i,1);
                setListaServicos(newarr);
            }
        }
        setDummy(!dummy);
        calculaSubTotal();
    }

    const incrementaEstoqueProduto = async (venda) => {
        await Axios.get(`${URI}/vendasprodutos?venda_id=${venda.id}`)
        .then(res => {
            res.data.map(async produtovenda => {
                await Axios.get(`${URI}/produtos?id=${produtovenda.produto_id}`)
                .then(async res => {
                    let produto = res.data[0];
                    produto.estoque = parseFloat(produto.estoque) + parseFloat(produtovenda.quantidade);
                    await Axios.patch(`${URI}/produtos`, produto).then(getProdutos)
                })
            })
        })
        getProdutos();
    }

    const handleExcluirVenda = async (venda) => {
        if(window.confirm("Tem certeza que deseja excluir essa venda?")){
            await incrementaEstoqueProduto(venda); 
            await Axios.delete(`${URI}/vendas?id=${venda.id}`).then(getVendas).catch(window.alert)
        }
        getProdutos(); 
    }


    function abrirModalDataInicial(){
        setAdicionarDataInicial(true);
    }

    function abrirModalDataFinal(){
        setAdicionarDataFinal(true);
    }


    function closeModalData(){
        setAdicionarDataInicial(false);
        setAdicionarDataFinal(false);
    }

    function closeModalVencimento(){
        setAlterarVencimento(false);
    }

    function filtrarVendas(){
        Axios.get(`${URI}/vendas?_sort=data&_order=asc`)
        .then(res => (vendasConsulta = res.data))  
        .then(filtraVendas)
        .catch(window.alert);
    }

    function filtraVendas(){
        if(Boolean(dataInicial)){
           
            vendasConsulta.map(venda => {
                if(venda.data >= dataInicial.toISOString() && venda.data <= dataFinal.toISOString()){
                    vendasFiltradas = [...vendasFiltradas, venda];
                }
            })
            setVendas(vendasFiltradas)
        }else{
            setVendas(vendasConsulta)
        }

        closeFiltroVenda();
    }


  return(
    <div className="OS">
        <div>
            <div>
                <h2>Ordens de Serviço</h2>
            </div>
            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                <div style={{textAlign:'left'}}>
                    Busca: <input style={{width: "80%"}} onChange={e => handleBuscaVenda(e)}></input>
                </div>
                <div style={{textAlign:'right'}}>
                    
                </div>
            </div>
        </div>
        <br/>
        <div className='Conteudo'>
            <div className='esquerda'>
                <table className='tabela'>
                    <caption></caption>
                    <thead >
                        <tr >
                            <th>ID</th>
                            <th>Cliente</th> 
                            <th>Veículo</th> 
                            <th>OBS</th>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
                    <tbody >
                        {vendas.map(venda => (
                            <tr key={venda.id}  onDoubleClick={() => handleClickTable(venda)}>
                                <td>{venda.id}</td>
                                <td className='tdnome'>{venda.name}</td>
                                <td>{venda.modelo}</td>
                                <td style={{whiteSpace:'nowrap', maxWidth:'400px', textOverflow:'ellipsis', overflow:'hidden'}}>{venda.obs}</td>
                                <td>{venda.dataformatada}</td>
                                <td>{venda.valortotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td><Botao props={"-"} type={'Baixar'} onClick={() => handleExcluirVenda(venda)}/></td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

                      
            <div className='direita'>
                <Botao props={"Adicionar"} type={'confirm'} onClick={abrirNovaOs}/>
                <br/>
                <Botao props={"Simulação"} type={'confirm'} onClick={abrirModalSimulacao}/>
                <br/>
                <Botao props={"Filtro"} type={'confirm'} onClick={abrirFiltroVenda}/>
               
                
                <br/>

            </div>

            {/* Modal de Nova OS */}
            <UIModal isOpen={Boolean(novaVenda)} onClickClose={() => closeNovaOs()}>
                {Boolean(novaVenda) ?
                <div>
                    {/** Cabeçalho Modal */}
                    <div>
                    Abrir OS
                    <br/>
                    <br/>
                    </div>

                    {/* Meio Modal */}
                    <div style={{display:"grid", gridTemplateColumns: "repeat(3, 1fr)"}}>
                        <div style={{  backgroundColor:'black', width: '50vh'}}>
                            <DropDownClientes  onChange={handleInputChange} idcliente={clienteSelecionado.id} alteracao={true}/> 
                            <br/><br/>
                            {Boolean(clienteSelecionado) ?
                               Boolean(veiculoSelecionado) ? <DropDownVeiculos idcliente={clienteSelecionado.id} idveiculos={veiculoSelecionado.id} alteracao={true} onChange={handleInputChange2}/> : <DropDownVeiculos idcliente={clienteSelecionado.id} alteracao={true} onChange={handleInputChange2}/>
                            : null
                            }
                            <br/><br/>
                            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)"}}>
                                <div style={{width:'39vh'}}>
                                    <label style={{color: "white", fontSize: 9}}>Cadastro Rápido: </label>&nbsp;&nbsp;
                                    <input style={{width:'150px'}}type="text" value={clienteNovo.name} onChange={(e) => {handleClienteNoVo(e)}} />
                                </div>
                                <div style={{width:'5vh'}}>
                                    <Botao props={"+"} type={"add2"} onClick={() => cadastraNovoClienteRapido()}/>
                                </div>
                            </div>
                            
                            <br/>
                            <label style={{color: "white"}}>Telefone: </label>&nbsp;&nbsp;
                            <input style={{width:'195px'}}type="text" value={clienteSelecionado.telefone} onChange={() => {}} />
                            <br/><br/>
                            <label style={{color: "white"}}>Data: </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <input style={{width:'195px'}}type="text" value={dataVendaFormatada} onChange={() => {}} />
                            <br/><br/>
                            <Calendar value={dataVenda} onChange={(e) => handleCalendar(e)}/>
                            
                        </div>      
                        <div>
                            <label style={{color: "white", position:'absolute'}}>Descrição: </label>
                            <textarea id='obsVenda' style={{height:'200px', width:'195px', marginLeft:'80px'}} value={obsVenda} onChange={e => handleObsVenda(e)}/>
                        </div>
                        <div style={{textAlign:'right'}}>
                            <Botao props={"Abrir OS"} type={'confirm'} onClick={abrirOsBanco}/>
                            <br/>
                            <Botao props={"Cancelar"} type={'cancel'} onClick={closeNovaOs}/>
                        </div>
                    </div>
                </div>
                : null}
            </UIModal>

            {/* Modal de Novo Cliente */}
            <UIModal isOpen={Boolean(modalNovoCliente)} onClickClose={() => closeNovoCliente()}>
                {Boolean(modalNovoCliente) ?
                <div>

                </div>
                : null}
            </UIModal>


            {/* Modal de adição alteração de vendas */}
            <UIModal isOpen={Boolean(addVendas)} onClickClose={() => closeAdicionarVenda()} extendido={true}>
                {Boolean(addVendas) ?
                <div>
                    {/** Cabeçalho Modal */}
                    <div>
                    Nova OS
                    <br/>
                    <br/>
                    </div>

                    {/* Meio Modal */}
                    <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", justifyContent:'space-between'}}>
                        <div style={{  backgroundColor:'black', width: '20vw'}}>
                            <DropDownClientes  idcliente={clienteSelecionado.id} alteracao={true} onChange={handleInputChange}/>
                            <br/><br/>
                            {Boolean(clienteSelecionado) ?
                                <DropDownVeiculos idcliente={clienteSelecionado.id} idveiculos={veiculoSelecionado.id} alteracao={true} onChange={handleInputChange2}/>
                            : null
                            }
                            
                            <br/><br/>
                            <label style={{color: "white"}}>Telefone: </label>&nbsp;&nbsp;
                            <input style={{width:'195px'}}type="text" value={clienteSelecionado.telefone} onChange={() => {}} />
                            <br/><br/>
                            <label style={{color: "white", position:'absolute'}}>OBS.: </label>
                            <textarea id='obsVenda' style={{height:'200px', width:'195px', marginLeft:'80px'}} value={obsVenda} onChange={e => handleObsVenda(e)}/>
                        </div>

                        <div style={{width:'80vw', marginLeft:50, textAlign:'center', maxHeight:'400px', overflow:'auto'}}>
                            <div className='divTabelaProduto'>
                                <div style={{width:'60vW'}}>
                                    <table className='tabela'>
                                        <caption>Produtos</caption>
                                        <thead >
                                            <tr >
                                                <th>ID</th> 
                                                <th>Descrição</th> 
                                                <th>Valor</th>
                                                <th>Quantidade</th>
                                                <th>Total</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {listaProdutos.map( (produto,index) => (
                                                
                                                <tr key={produto.id}  onDoubleClick={() => {}}>
                                                    <td>{produto.id}</td>
                                                    <td className='tdnome'>{produto.descricao}</td>
                                                    {/*<td>{parseFloat(produto.valorvenda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>*/}
                                                    <td><input style={{width: '8vh', textAlign:'center'}} type="text" value={produto.valorvenda} onChange={e => {handleVendaAlterado(e,index)}} /></td>
                                                    <td><input style={{width: '5vh', textAlign:'center'}} type="text" value={produto.quantidade} onChange={e => {handleQuantidadeAlterada(e,index)}} /></td>
                                                    <td>{parseFloat(produto.valorvenda * produto.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                    <td><Botao props={"-"} type={'Baixar'} onClick={() => removeItem(produto.id)}/></td>    
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div style={{width:'10vh', marginTop:'27px'}}>
                                    <Botao props={"+"} type={'add'} onClick={abrirModalProdutos}/>
                                </div>
                                
                            </div>
                            
                            <br/>

                            <div className='divTabelaProduto'>
                                <div style={{width:'60vW'}}>
                                    <table className='tabela'>
                                        <caption>Serviços</caption>
                                        <thead >
                                            <tr >
                                                <th>ID</th> 
                                                <th>Descrição</th> 
                                                <th>Valor</th>
                                                <th>Quantidade</th>
                                                <th>Total</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {listaServicos.map((produto,index) => (
                                                
                                                <tr key={produto.id}  onDoubleClick={() => {}}>
                                                    <td>{produto.id}</td>
                                                    <td className='tdnome'>{produto.descricao}</td>
                                                    <td><input style={{width: '8vh', textAlign:'center'}} type="text" value={produto.valorvenda} onChange={e => {handleServicoAlterado(e,index)}} /></td>
                                                    <td><input style={{width: '5vh', textAlign:'center'}} type="text" value={produto.quantidade} onChange={e => {handleQuantidadeServicoAlterada(e,index)}} /></td>
                                                    <td>{parseFloat(produto.valorvenda * produto.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                    <td><Botao props={"-"} type={'Baixar'} onClick={() => removeServico(produto.id)}/></td>    
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div style={{width:'10vh', marginTop:'27px'}}>
                                    <Botao props={"+"} type={'add'} onClick={abrirModalServicos}/>
                                </div>
                                
                            </div>
                            
                        </div>

                        
                            
                    </div>
                    
                    {/* Rodapé Modal */}
                    <div className='rodape' >

                        <div className='rod1'>
                            <div>
                                <h2>SubTotal: {subTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                            </div>

                            <div className='desconto'>
                                <div>
                                    <h2>Desconto:</h2>
                                </div>
                                <div style={{marginTop:'25px', marginLeft:'20px'}}>
                                    <input type="text" value={desconto} onChange={(e) => {handleDesconto(e)}} />
                                </div>
                                
                            </div>

                            <div style={{marginLeft:''}}>
                            <h2>Total: {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                            </div>

                            
                            
                        </div>

                        <div className='rod2'>
                            {Boolean(veiculoSelecionado) ? 
                                <Botao props={"Confirmar"} type={'confirm'} onClick={() => abrirReceber()}/>
                            : null}
                        </div>
                        
                    </div>
                    
                </div>



                : null}
            </UIModal>


            {/** Modal adição de produtos */}
            <UIModal isOpen={Boolean(addProdutos)} onClickClose={() => setAddProdutos(null)}>
                {Boolean(addProdutos) ?
                <div>
                    
                    <div>
                        <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                            <div style={{textAlign:'left', marginTop: 20}}>
                            Busca: <input style={{width: "80%"}} onChange={e => handleBuscaProduto(e)}></input>
                            </div>
                            <div style={{textAlign:'right', marginBottom: 10, marginRight: 5}} >
                               
                            </div>
                        </div>
                    </div>
                    <div className='tabelacontainer'>
                        <table>
                            <caption></caption>
                            <thead >
                                <tr >
                                    <th>Descrição</th> 
                                    <th>Marca</th>
                                    <th>Grupo</th>  
                                    <th>Valor de Custo</th>
                                    <th>Valor de Venda</th>
                                    <th>Estoque Mínimo</th>
                                    <th>Estoque</th> 
                                    
                                </tr>
                            </thead>
                            <tbody >
                                {produtos.map(produto => (
                                    produto.estoque <= parseFloat(produto.estoqueminimo) ?  
                                    produto.estoque <= 0 ?
                                      <tr key={produto.id} onDoubleClick={() => handleAddQtdProduto(produto)}>
                                        <td className='tdnomenegativo'>{produto.descricao}</td>
                                        <td className='tdnegativo'>{produto.descricaomarca}</td>
                                        <td className='tdnegativo'>{produto.descricaogrupo}</td>
                                        <td className='tdnegativo'>{produto.valorcusto}</td>
                                        <td className='tdnegativo'>{produto.valorvenda}</td>
                                        <td className='tdnegativo'>{produto.estoqueminimo}</td>
                                        <td className='tdnegativo'>{produto.estoque}</td>
                                      </tr>
                                      :
                                      <tr key={produto.id} onDoubleClick={() => handleAddQtdProduto(produto)}>
                                        <td className='tdnomeestoqueminino'>{produto.descricao}</td>
                                        <td className='tdestoqueminino'>{produto.descricaomarca}</td>
                                        <td className='tdestoqueminino'>{produto.descricaogrupo}</td>
                                        <td className='tdestoqueminino'>{produto.valorcusto}</td>
                                        <td className='tdestoqueminino'>{produto.valorvenda}</td>
                                        <td className='tdestoqueminino'>{produto.estoqueminimo}</td>
                                        <td className='tdestoqueminino'>{produto.estoque}</td>
                                      </tr>
                                   : 
                                   <tr key={produto.id} onDoubleClick={() => handleAddQtdProduto(produto)}>
                                    <td className='tdnome'>{produto.descricao}</td>
                                    <td>{produto.descricaomarca}</td>
                                    <td>{produto.descricaogrupo}</td>
                                    <td>{produto.valorcusto}</td>
                                    <td>{produto.valorvenda}</td>
                                    <td>{produto.estoqueminimo}</td>
                                    <td>{produto.estoque}</td>
                                   </tr> 
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                </div>

                : null}
            </UIModal>

            {/** Modal adição de servicos */}
            <UIModal isOpen={Boolean(addServicos)} onClickClose={() => setAddServicos(null)}>
                {Boolean(addServicos) ?
                <div>
                    
                    <div>
                        <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                            <div style={{textAlign:'left', marginTop: 20}}>
                            Busca: <input style={{width: "80%"}} onChange={e => handleBuscaServicos(e)}></input>
                            </div>
                            <div style={{textAlign:'right', marginBottom: 10, marginRight: 5}} >
                               
                            </div>
                        </div>
                    </div>
                    <div className='tabelacontainer'>
                        <table>
                            <caption></caption>
                            <thead >
                                <tr >
                                    <th>Descrição</th> 
                                    <th>Valor de Venda</th>
                                </tr>
                            </thead>
                            <tbody >
                                {servicos.map(servico => (
                                   <tr key={servico.id} onDoubleClick={() => handleAddQtdServico(servico)}>
                                    <td className='tdnome'>{servico.descricao}</td>
                                    <td>{servico.valorvenda}</td>
                                   </tr> 
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                </div>

                : null}
            </UIModal>

            {/** Modal adição de quantidade de produtos */}
            <UIModal isOpen={Boolean(addQtdProdutos)} onClickClose={() => closeAddQtdProduto()}>
                {Boolean(addQtdProdutos) ?
                <div className='addqtdproduto'>

                    <div className='addqtdproduto1'>
                        <h3>{addQtdProdutos.descricao}</h3>
                    </div>

                    <div className='addqtdproduto2'>
                        <div style={{textAlign:'right', marginTop:'5px'}}>
                            <Botao props={"-"} type={'Remove'} onClick={() => removeQtd()}/>   
                        </div>

                        <div>
                            <input type="text" value={qtdProduto} onChange={(e) => {handleQtdProduto(e)}} style={{textAlign:'center', width: '40px', marginTop:'15px'}}/>
                        </div>

                        <div style={{textAlign:'left', marginTop:'5px'}}>
                            <Botao props={"+"} type={'add'}  onClick={() => adicionaQtd()}/>  
                        </div>
                        
                    </div>

                    <div style={{textAlign:'right', marginRight:'20px'}}>
                        <Botao props={"Adicionar"} type={'confirm'} onClick={() => adicionaProdutoLista()}/>   
                    </div>
                    
                </div>
                : null}
            </UIModal>

            {/** Modal adição de quantidade de Servicos */}
            <UIModal isOpen={Boolean(addQtdServico)} onClickClose={() => closeAddQtdProduto()}>
                {Boolean(addQtdServico) ?
                <div className='addqtdproduto'>

                    <div className='addqtdproduto1'>
                        <h3>{addQtdServico.descricao}</h3>
                    </div>

                    <div className='addqtdproduto2'>
                        <div style={{textAlign:'right', marginTop:'5px'}}>
                            <Botao props={"-"} type={'Remove'} onClick={() => removeQtd()}/>   
                        </div>

                        <div>
                            <input type="text" value={qtdProduto} onChange={(e) => {handleQtdProduto(e)}} style={{textAlign:'center', width: '40px', marginTop:'15px'}}/>
                        </div>

                        <div style={{textAlign:'left', marginTop:'5px'}}>
                            <Botao props={"+"} type={'add'}  onClick={() => adicionaQtd()}/>  
                        </div>
                        
                    </div>

                    <div style={{textAlign:'right', marginRight:'20px'}}>
                        <Botao props={"Adicionar"} type={'confirm'} onClick={() => adicionaServicoLista()}/>   
                    </div>
                    
                </div>
                : null}
            </UIModal>

            {/** Modal Receber */}
            <UIModal isOpen={Boolean(modalReceber)} onClickClose={() => closeModalReceber()}>
                {Boolean(modalReceber) ?
                    <div style={{maxHeight:'90vh', }}>
                        <h2>Forma de Pagamento</h2>
                        <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)"}}>
                            <div>
                                <div className='condpg'>
                                    <DropDownCondpg  onChange={handleChangeCondpg} alteracao={true} idcondpg={condpgSelecionada.id}/>
                                    <br/><br/>
                                </div>
                                { condpgSelecionada.parcelado === 1 ?
                                <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)"}}>
                                    <div style={{marginTop:'10px', marginLeft:'20px'}}>
                                        Parcelas: <DropDownParcelasReceber onChange={handleParcelas} alteracao={true} idparcela={osAberta.parcela_id}/>
                                        <br/>
                                        Taxa: <input style={{width:'50px', marginLeft:'28px'}} type="text" value={taxaParcela} onChange={(e) => {handleTaxa(e)}} />
                                    </div>
                                    <div style={{marginLeft:'20px'}}>
                                        <Botao props="Gerar" type={'confirm'} onClick={() => gerarParcelas()}/>
                                    </div>

                                </div>
                                : null }
                            </div>
                            
                            
                            <div className='parcelas'>
                                
                                <table className='tabelaFinanceiro'>
                                <caption>Parcelas</caption>
                                <thead >
                                    <tr >
                                        <th>Parcela</th> 
                                        <th>Data</th> 
                                        <th>Vencimento</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {parcelas.map((parcela, index) => (
                                        <tr key={parcela.parcela}  onDoubleClick={() => {}}>
                                            <td>{parcela.parcela}</td>
                                            <td>{parcela.dataformatada}</td>
                                            <td><input style={{width: '11vh', textAlign:'center'}} type="text" value={parcela.vencimentoformatado} onClick={e => {abreModalVencimento(e,index)}} /></td>
                                            <td>R$ <input style={{width: '11vh', textAlign:'center'}} type="text" value={parcela.valor} onChange={(e) => alteravalorparcela(e,index)}/></td>
                                            
                                            {/* <td>{(parcela.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td> */}   
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        
                        </div>

                        <div className='rodapeReceber' >
                            <div style={{marginLeft:''}}>
                                {taxaParcela > 0 ? 
                                <>
                                    <h4>SubTotal: {(subTotal - desconto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h4>
                                    <h4>Taxa.......: {(((subTotal - desconto)*taxaParcela/100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h4>
                                </>                                  
                                : null}
                                <h2>Total.: {(valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                            </div>
                            
                            <div className='totalliquido'>
                                {descontoOperadora > 0 ? 
                                <>
                                    <h4>SubTotal....................: {(subTotal - desconto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h4>
                                    <h4>Desconto Operadora: {descontoOperadora}%</h4>
                                </>                                  
                                : null}
                                <h2>Total Líquido.: {(valorTotalLiquido).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                            </div>

                            <div className='rod3'>

                               {alterouValor ? <Botao props={"Refazer"} type={'cancel'} onClick={() => refazerFinanceiro()}/> :
                               parcelas.length > 0 ? <Botao props={"Salvar"} type={'confirm'} onClick={() => salvarVenda()}/> : null} 
                            </div>
                        </div>

                    </div>

                : null}
            </UIModal>
            
            {/** Modal Simulação */}
            <UIModal isOpen={Boolean(modalSimulacao)} onClickClose={() => closeModalSimulacao()}>
                {Boolean(modalSimulacao) ?
                    <div>
                        Valor Simulação: <input style={{width:'50px', marginLeft:'28px'}} type="text" value={subTotal} onChange={(e) => {handleValorSimulacao(e)}} />
                        <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)"}}>
                            <div>
                                <div className='condpg'>
                                    <DropDownCondpg  onChange={handleChangeCondpg} alteracao={true} idcondpg={condpgSelecionada.id}/>
                                    <br/><br/>
                                </div>
                                { condpgSelecionada.parcelado === 1 ?
                                <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)"}}>
                                    <div style={{marginTop:'10px', marginLeft:'20px'}}>
                                        Parcelas: <DropDownParcelasReceber onChange={handleParcelas} alteracao={true} idparcela={osAberta.parcela_id}/>
                                        Taxa: <input style={{width:'50px', marginLeft:'28px'}} type="text" value={taxaParcela} onChange={(e) => {handleTaxa(e)}} />
                                    </div>
                                    <div style={{marginLeft:'20px'}}>
                                        <Botao props="Gerar" type={'confirm'} onClick={() => gerarParcelas()}/>
                                    </div>

                                </div>
                                : null }
                            </div>
                            
                            
                            <div className='parcelas'>
                                
                                <table className='tabelaFinanceiro'>
                                <caption>Parcelas</caption>
                                <thead >
                                    <tr >
                                        <th>Parcela</th> 
                                        <th>Data</th> 
                                        <th>Vencimento</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {parcelas.map((parcela, index) => (
                                        <tr key={parcela.parcela}  onDoubleClick={() => {}}>
                                            <td>{parcela.parcela}</td>
                                            <td>{parcela.dataformatada}</td>
                                            <td><input style={{width: '11vh', textAlign:'center'}} type="text" value={parcela.vencimentoformatado} onClick={e => {abreModalVencimento(e,index)}} /></td>
                                            <td>{(parcela.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>    
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        
                        </div>

                        <div className='rodapeReceber' >
                            <div style={{marginLeft:''}}>
                                {taxaParcela > 0 ? 
                                <>
                                    <h4>SubTotal: {(subTotal - desconto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h4>
                                    <h4>Taxa.......: {(((subTotal - desconto)*taxaParcela/100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h4>
                                </>                                  
                                : null}
                                <h2>Total.: {(valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                            </div>
                            
                            <div className='totalliquido'>
                                {descontoOperadora > 0 ? 
                                <>
                                    <h4>SubTotal....................: {(subTotal - desconto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h4>
                                    <h4>Desconto Operadora: {descontoOperadora}%</h4>
                                </>                                  
                                : null}
                                <h2>Total Líquido.: {(valorTotalLiquido).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                            </div>

                            <div className='rod3'>

                              
                            </div>
                        </div>

                    </div>

                : null}
            </UIModal>

            {/* Modal de Fitro Venda Filtra */}
            <UIModal isOpen={Boolean(filtroVenda)} onClickClose={() => closeFiltroVenda()}>
                {Boolean(filtroVenda) ?
                <div>
                   Vendas de: <input value={dataInicialFormatada} style={{width: "15%"}} onClick={abrirModalDataInicial}></input> até: <input value={dataFinalFormatada} style={{width: "15%"}} onClick={abrirModalDataFinal}></input>
                   &nbsp;&nbsp;&nbsp;&nbsp;<button style={{width: "10%", backgroundColor:'lightgreen', color:'black', cursor:'pointer'}} onClick={filtrarVendas}>Filtrar</button>
                </div>
                : null}
            </UIModal>


            { /* *********************  Modais de Data *********************************** */}

            {/* *********************  Alterar Data Vencimento *********************************** */}

            <UIModal isOpen={Boolean(alterarVencimento)} onClickClose={() => closeModalVencimento()} extendido={false} data={true}>
                {Boolean(alterarVencimento) ?
                    <div>
                        <Calendar value={new Date(parcelas[index].vencimento)} onChange={(e) => handleCalendarVencimento(e)}/>
                    </div>
                : null}
            </UIModal>

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

    </div>
  )
}

export default OS;