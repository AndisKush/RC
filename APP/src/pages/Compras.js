import './OS.css';

import React, { useEffect, useState } from 'react'; 
import Axios from 'axios';
import Botao from "../components/Botao";
import UIModal from '../components/Modal';
import DropDownClientes from '../components/Forms/DropDownClientes';
import DropDownCondpg from '../components/Forms/DropDownCondpg';
import DropDownParcelasReceber from '../components/Forms/DropDownParcelasReceber';
import Calendar from 'react-calendar';


const URI = 'http://localhost:5001';

function Compras(){
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
    const  [ultimaCompra, setUltimaCompra] = useState();
    const  [removeuItem, setRemoveuItem] = useState(false);
    const  [alterouValor, setAlterouValor] = useState(false);
    const  [alterarVencimento, setAlterarVencimento] = useState(false);
    const  [index, setIndex] = useState(0);

    let vendasConsulta = [];
    let vendasFiltradas = [];

    useEffect(getVendas, [clienteSelecionado]);
    useEffect(getProdutos, []);
    useEffect(getServicos, []);

    useEffect(calculaSubTotal, [listaProdutos,listaServicos]);
    useEffect(calculaTotal, [subTotal,desconto,taxaParcela]);

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
        Axios.get(`${URI}/compras?data=${data.toISOString()}`)
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

    const abrirFiltroVenda = () => {
        setFiltroVenda(true);
    }

    const abrirNovaOs = () => {
        setNovaVenda(true);
        //getUltimaCompra();
    }

    const getUltimaCompra = () => {
        Axios.get(`${URI}/generators`).then(res => setUltimaCompra(res.data[2].valor))
    }


    const abrirOsBanco = async () => {
        await Axios.post(`${URI}/compras`,{
            cliente_id: clienteSelecionado.id,
            data: dataVenda,
            dataformatada: dataVendaFormatada,
            datajson: dataVenda,
            subtotal: 0,
            desconto: 0,
            valortotal: 0,
            condpg_id: 0,
            taxa: 0,
            parcela_id: 0,
            obscompra: obsVenda
        })
        .catch(window.alert);
        getVendas();
        buscaVendaeAbreTela();
    }

    const buscaVendaeAbreTela = () => {
        Axios.get(`${URI}/ultimacompra`).then(res => {
            handleClickTable(res.data[0])
        })
        setNovaVenda(null);
    }

    const handleClickTable = async (venda) => {
        setClienteSelecionado({id: venda.cliente_id});
        setObsVenda(venda.obs);
        setSubTotal(venda.subtotal);
        setDesconto(venda.desconto);
        setValorTotal(venda.valortotal);
        await Axios.get(`${URI}/condpg?id=${venda.condpg_id}`).then(res => {res.data.length > 0 ? setCondpgSelecionada(res.data[0]) : setCondpgSelecionada({id:0})})
        await setOsAberta(venda);
        buscaProdutosVenda(venda);
        buscaReceberVenda(venda);
        setParcelaSelecionada({id: venda.parcela_id})
        setTaxaParcela(venda.taxa);
        venda.parcela_id === 0 ? setQtdParcelas(1) : setQtdParcelas(venda.parcela_id)

        setAddVendas(true);
        dataCalendar(venda.data);
    }

    const buscaProdutosVenda = async (venda) => {
        await Axios.get(`${URI}/comprasprodutos?compra_id=${venda.id}`).then(res => {setListaProdutos(res.data); setListaProdutosCopia(JSON.parse(JSON.stringify(res.data)))});
    }

    const buscaReceberVenda = async (venda) => {
        await Axios.get(`${URI}/pagar?compra_id=${venda.id}`).then(res => {setParcelas(res.data);});
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
        setTaxaParcela(0);
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
                    vendaId: osAberta.id
                }
            }
        }
        setParcelas(arrparcel);
    }

    const buscaClienteSelecionado = (idCliente) => {
        Axios.get(`${URI}/clientes?id=${idCliente}`)
        .then(res => {setClienteSelecionado(res.data[0])})  
        //.then(res => console.log(res.data))
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

    const handleDesconto = (e) =>{
        if(parseFloat(e.target.value) > 0){
            setDesconto(e.target.value)
        }else{
            setDesconto('')
        }
    }

    const handleVendaAlterado = (e,index) => {
        listaProdutos[index].valorcusto = e.target.value
        setDummy(!dummy);
        
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

    const closeAddQtdProduto = () => {
        setAddQtdProdutos(null);
        setAddQtdServico(null);
        setQtdProdutos(1);
    }

    const closeModalReceber = () => {
        if(Boolean(osAberta) === false) {
            setModalReceber(null)
            setParcelas([])
            setQtdParcelas(1)
            setTaxaParcela(0)
            setCondpgSelecionada({parcelado: '0'})
        }else{
            setModalReceber(null)
        }
        
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
            Axios.get(`${URI}/produtos/${produtoVincu.id}`).then(res =>{
                newArray.map(produto => {
                    if(res.data.id === produto.id) {
                        produto.quantidade = parseFloat(produto.quantidade) + parseFloat(produtoVincu.quantidadeVinculada)
                        produtoRepetido = true
                        calculaSubTotal();
                    }
                })
                if (!produtoRepetido){ 
                    newArray = [...newArray ,{...res.data, quantidade:produtoVincu.quantidadeVinculada}]
                    setListaProdutos(newArray);
                }
            })
        })

        closeAddQtdProduto();
        
    }


    const adicionaServicoLista = () => {
        let produtoRepetido = false;

        listaServicos.map(servico => {
            if(servico.id === addQtdServico.id) {
                servico.quantidade = parseFloat(servico.quantidade) + parseFloat(qtdProduto)
                produtoRepetido = true
                calculaSubTotal();
            }
            
        })
        if (!produtoRepetido){
            setListaServicos([...listaServicos ,{...addQtdServico, quantidade:qtdProduto}])
        };
        calculaSubTotal();
        if(addQtdServico.produtosVinculados.length > 0){
            if(window.confirm("Deseja importar os produtos vinculados?")){
                adicionaProdutoLista3(addQtdServico.produtosVinculados);
            }
            calculaSubTotal();
        }
       
        closeAddQtdProduto();
    }

  function calculaSubTotal() {
        let calc = 0;
        listaProdutos.map(produto => {
            calc = calc + produto.valorcusto * produto.quantidade
        })
        listaServicos.map(servico => {
            calc = calc + servico.valorvenda * servico.quantidade
        })
        
        
        setSubTotal(calc);
        calculaTotal();
    }

    function calculaTotal(){
        /*
        if(taxaParcela > 0){
            setValorTotal((subTotal - desconto) + ((subTotal - desconto)*taxaParcela/100));
        }else{
            setValorTotal(subTotal - desconto );
        }
       */
        setValorTotal((subTotal - desconto) + ((subTotal - desconto)*taxaParcela/100));
    }
    

    

    

    const abrirReceber = async () => {
        calculaSubTotal();
        osAberta.parcelas = parcelas;

        let valorparcela = 0;
        if(parcelas.length > 0){
            await parcelas.map(parcela => {
                valorparcela += parcela.valor
            })
            if(valorparcela.toFixed(2) != valorTotal.toFixed(2)){
                window.alert("Alteração no valor da venda, é necessário refazer o financeiro");
                setAlterouValor(true);
            }
        }

        setModalReceber(true)
    }

    const closeAdicionarVenda = () => {
        setAddVendas(null)
        resetCampos();
    }

    const closeNovaOs = () => {
        setNovaVenda(false);
        resetCampos();
    }

    const closeFiltroVenda = () => {
        setFiltroVenda(false);
    }

    const salvarVenda = async () => {
        if(osAberta.parcelas.length > 0 && parcelas.length < osAberta.parcelas.length){
            await Axios.delete(`${URI}/pagar?compra_id=${osAberta.id}`)
        }
        
        await Axios.patch(`${URI}/compras`,{
            cliente_id: clienteSelecionado.id,
            data: dataVenda,
            dataformatada: dataVendaFormatada,
            datajson: dataVenda,
            subtotal: subTotal,
            desconto: desconto,
            valortotal: valorTotal,
            condpg_id: condpgSelecionada.id,
            taxa: taxaParcela,
            parcela_id: parcelaSelecionada.id,
            obscompra: obsVenda,
            id: osAberta.id
        }).catch(window.alert)
        await salvarProdutosVenda();
        await salvarReceber();
        await baixaEstoqueProduto();
        setAddVendas(null);
        setModalReceber(null);
        getVendas();
        resetCampos();
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
                    produtoc.estoque = produtoc.estoque - produtoc.quantidade
                    Axios.patch(`${URI}/produtos`, produtoc)
                }
            })
            await Axios.delete(`${URI}/comprasprodutos?compra_id=${osAberta.id}`)
        }

        await listaProdutos.map(async produto => {
            await Axios.post(`${URI}/comprasprodutos`,{
                compra_id: osAberta.id,
                produto_id: produto.id,
                quantidade: produto.quantidade,
                valorcusto: produto.valorcusto,
                totalprod: produto.quantidade * produto.valorvenda
            }).catch(window.alert)
        })
    }

    const refazerFinanceiro = () => {
        if(condpgSelecionada.parcelado == 0){
            parcelasAvista();
        }else{
            gerarParcelas();
        }
        setAlterouValor(false);
   }

    const salvarReceber = async () => {
        await parcelas.map(async parcela => {
            await Axios.post(`${URI}/pagar`,{
                compra_id: osAberta.id,
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
                databaixajson: parcela.databaixa,
                pagar_tipo_id: 1
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
            produto.estoque = parseFloat(produto.estoque) + parseFloat(produto.quantidade)
            Axios.patch(`${URI}/produtos`, produto)
            .then(getProdutos)  
            .catch(window.alert);
        })
    }

    const handleExcluirVenda = (venda) => {
        if(window.confirm("Tem certeza que deseja excluir essa compra?")){
            incrementaEstoqueProduto(venda); 
            Axios.delete(`${URI}/compras?id=${venda.id}`).then(getVendas).catch(window.alert)
        } 
    }
    
    const incrementaEstoqueProduto = async (venda) => {
        await Axios.get(`${URI}/comprasprodutos?compra_id=${venda.id}`)
        .then(res => {
            res.data.map(async produtovenda => {
                await Axios.get(`${URI}/produtos?id=${produtovenda.produto_id}`)
                .then(async res => {
                    let produto = res.data[0];
                    produto.estoque = parseFloat(produto.estoque) - parseFloat(produtovenda.quantidade);
                    await Axios.patch(`${URI}/produtos`, produto)
                })
            })
        })
        getProdutos();
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
        setObsVenda(null);
        setOsAberta(false)
        setNovaVenda(null);
        dataAtual();
        dataAtual();
        setRemoveuItem(false);
        getProdutos();
    } 

    const removeItem = (produtoid) => {
        setRemoveuItem(true);
        var newarr = listaProdutos;
        for( var i = 0; i < newarr.length; i++){
            if(newarr[i].id === produtoid){
                newarr.splice(i,1);
                setListaProdutos(newarr);
            }
        }
        setDummy(!dummy);
        calculaSubTotal();
    }


    

    const abreModalVencimento = (e,index) => {
        setIndex(index)
        setAlterarVencimento(true)
    }

    function closeModalVencimento(){
        setAlterarVencimento(false);
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

    function filtrarVendas(){
        Axios.get(`${URI}/compras?_sort=data&_order=asc`)
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
                <h2>Compras</h2>
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
                            <th>Fornecedor</th>  
                            <th>OBS</th>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
                    <tbody >
                        {vendas.map(venda => (
                            <tr key={venda.id}  onDoubleClick={() => handleClickTable(venda)}>
                                <td className='tdnome'>{venda.name}</td>
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
                <Botao props={"Filtro"} type={'confirm'} onClick={abrirFiltroVenda}/>
               
                
                <br/>

            </div>

            {/* Modal de Nova OS */}
            <UIModal isOpen={Boolean(novaVenda)} onClickClose={() => closeNovaOs()}>
                {Boolean(novaVenda) ?
                <div>
                    {/** Cabeçalho Modal */}
                    <div>
                    Nova Compra
                    <br/>
                    <br/>
                    </div>

                    {/* Meio Modal */}
                    <div style={{display:"grid", gridTemplateColumns: "repeat(3, 1fr)"}}>
                        <div style={{  backgroundColor:'black', width: '50vh'}}>
                            <DropDownClientes  onChange={handleInputChange}/>
                            
                            
                            <br/><br/>
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
                            <Botao props={"Produtos"} type={'confirm'} onClick={abrirOsBanco}/>
                            <br/>
                            <Botao props={"Cancelar"} type={'cancel'}/>
                        </div>
                    </div>
                </div>
                : null}
            </UIModal>


            {/* Modal de adição alteração de vendas */}
            <UIModal isOpen={Boolean(addVendas)} onClickClose={() => closeAdicionarVenda()} extendido={true}>
                {Boolean(addVendas) ?
                <div>
                    {/** Cabeçalho Modal */}
                    <div>
                    Nova Compra
                    <br/>
                    <br/>
                    </div>

                    {/* Meio Modal */}
                    <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)"}}>
                        <div style={{  backgroundColor:'black', width: '50vh'}}>
                            <DropDownClientes  idcliente={clienteSelecionado.id} alteracao={true} onChange={handleInputChange}/>
                            
                            
                            <br/><br/>
                            <label style={{color: "white"}}>Telefone: </label>&nbsp;&nbsp;
                            <input style={{width:'195px'}}type="text" value={clienteSelecionado.telefone} onChange={() => {}} />
                            <br/><br/>
                            <label style={{color: "white", position:'absolute'}}>OBS.: </label>
                            <textarea id='obsVenda' style={{height:'200px', width:'195px', marginLeft:'80px'}} value={obsVenda} onChange={e => handleObsVenda(e)}/>
                        </div>

                        <div style={{width:'134vh', textAlign:'center', maxHeight:'400px', overflow:'auto'}}>
                            <div className='divTabelaProduto'>
                                <div style={{width:'120vh'}}>
                                    <table className='tabela'>
                                        <caption>Produtos</caption>
                                        <thead >
                                            <tr >
                                                <th>ID</th> 
                                                <th>Descrição</th> 
                                                <th>Custo</th>
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
                                                    <td><input style={{width: '8vh', textAlign:'center'}} type="text" value={produto.valorcusto} onChange={e => {handleVendaAlterado(e,index)}} /></td>
                                                    <td><input style={{width: '5vh', textAlign:'center'}} type="text" value={produto.quantidade} onChange={e => {handleQuantidadeAlterada(e,index)}} /></td>
                                                    <td>{parseFloat(produto.valorcusto * produto.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
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
                            {/**
                             <div className='divTabelaProduto'>
                                <div style={{width:'120vh'}}>
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

                             */}
                            
                            
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
                            {Boolean(clienteSelecionado) ? 
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
                    <div>
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
                                        Parcelas: <DropDownParcelasReceber onChange={handleParcelas} alteracao={true} idparcela={osAberta.idparcela}/>
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
                                    {parcelas.map((parcela,index) => (
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

                        <div className='rodape' >
                            <div style={{marginLeft:''}}>
                                {taxaParcela > 0 ? 
                                <>
                                    <h4>SubTotal: {(subTotal - desconto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h4>
                                    <h4>Taxa.......: {(((subTotal - desconto)*taxaParcela/100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h4>
                                </>                                  
                                : null}
                                <h2>Total.: {(valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h2>
                            </div>

                            <div className='rod2'>

                            {alterouValor ? <Botao props={"Refazer"} type={'cancel'} onClick={() => refazerFinanceiro()}/> :
                               parcelas.length > 0 ? <Botao props={"Salvar"} type={'confirm'} onClick={() => salvarVenda()}/> : null} 
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

export default Compras;