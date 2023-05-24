import './Main.css';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { Chart } from 'react-google-charts';

const URI = 'http://localhost:5001';
//const URI2 = 'http://localhost:5001';

function Main(){

  const [valorVendasTotal, setValorVendasTotal] = useState(0);
  const [vendas, setVendas] = useState([]);
  const [vendasDia, setVendasDia] = useState([]);
  const [produtosVendasDia, setProdutosVendasDia] = useState([]);

  const [valorComprasTotal, setValorComprasTotal] = useState(0);
  const [compras, setCompras] = useState([]);
  const [comprasDia, setComprasDia] = useState([]);
  const [produtosComprasDia, setProdutosComprasDia] = useState([]);

  const [receber, setReceber] = useState([]);
  const [valorTotalReceber, setValorTotalReceber] = useState(0);
  const [valorTotalRecebidas, setValorTotalRecebidas] = useState(0);
  
  const [pagar, setPagar] = useState([]);
  const [valorTotalPagar, setValorTotalPagar] = useState(0);
  const [valorTotalPagas, setValorTotalPagas] = useState(0);

  let arrprod = [];
  let arrprodCompras = [];

  useEffect(getVendas, [])
  useEffect(buscaVenda, [vendas]);
  useEffect(preencheProdutosDia,[vendas]);

  useEffect(getCompras, [])
  useEffect(buscaCompra, [compras]);
  useEffect(preencheProdutosDiaCompra,[compras]);

  useEffect(getReceber, [])
  //useEffect(buscaReceber, [receber]);

  useEffect(getPagar, [])
  //useEffect(buscaPagar, [pagar]);
  
  //useEffect(ordenaListaProduto, [produtosDia])


  //------------------Vendas
  function getVendas (){
    const data = new Date();
    data.setHours(0,0,0,0);
    Axios.get(`${URI}/vendasdodia?data=${data}`)
    .then(res => {setVendas(res.data)})
    .catch(window.alert)
  }

  function buscaVenda() {
    var vendastotal = 0;
    vendas.map(venda => {
        vendastotal = vendastotal + venda.valortotal
    })
    setValorVendasTotal(vendastotal);
  }

  function preencheProdutosDia(){
    const data = new Date();
    data.setHours(0,0,0,0);
    Axios.get(`${URI}/produtosdodia?data=${data}`)
    .then(res => {setProdutosVendasDia(res.data)})
    .catch(window.alert)
  }

  //------------------compras
  function getCompras (){
    const data = new Date();
    data.setHours(0,0,0,0);
    Axios.get(`${URI}/comprasdodia?&data=${data}`)
    .then(res => {setCompras(res.data)})
    .catch(window.alert);
  }

  function buscaCompra() {
    var comprastotal = 0;
    compras.map(compra => {
        comprastotal = comprastotal + compra.valortotal
    })
    setValorComprasTotal(comprastotal);

  }

  function preencheProdutosDiaCompra(){
    const data = new Date();
    data.setHours(0,0,0,0);
    Axios.get(`${URI}/produtosdodiacompras?data=${data}`)
    .then(res => {setProdutosComprasDia(res.data)})
    .catch(window.alert)
  }

 const adicionaProdutoListaCompra = (prodcompra) => {

  let produtoRepetido = false;
  arrprodCompras.map(produto => {
      if(produto.id === prodcompra.id) {
          produto.quantidade = produto.quantidade + prodcompra.quantidade
          produtoRepetido = true
      }
  })
  if (!produtoRepetido){
    arrprodCompras= [...arrprodCompras , prodcompra]
  };
}


//------------------ Receber
function getReceber (){
  const data = new Date();
  let mes = data.getMonth()+1;
            
  Axios.get(`${URI}/recebermensalportipo?mes=${mes}`)
  .then(res => {
    let data = [['Descricao', 'Valor']]
    res.data.map(valor => {
      data.push([valor.descricao, valor.valor])
    })
    setReceber(data)
  })
  .catch(window.alert);
}


//------------------ Pagar
function getPagar (){
  const data = new Date();
  let mes = data.getMonth()+1;
            
  Axios.get(`${URI}/pagarmensalportipo?mes=${mes}`)
  .then(res => {
    let data = [['Descricao', 'Valor']]
    res.data.map(valor => {
      data.push([valor.descricao, valor.valor])
    })
    setPagar(data)
  })
  .catch(window.alert);
}

function buscaPagar (){
  const data = new Date();
  data.setHours(0,0,0,0);
  var pagartotal = 0
  var pagastotal = 0
  pagar.map(pagar => {
    if(Boolean(pagar.financeiro)){
      pagar.financeiro.map(parcela =>{
        if(parcela.vencimento === data.toISOString() && parcela.dataBaixa === null){
          pagartotal = pagartotal + parcela.valor
        }
        if(parcela.dataBaixa === data.toISOString()){
          pagastotal = pagastotal + parcela.valor
        }
      })
    }
  })
  setValorTotalPagar(pagartotal);
  setValorTotalPagas(pagastotal);
}


  return(
    <div className="Main">
      <div className='content'>


        {/* ------------------------ Vendas ----------------------------- */}
        <div className='vendas'>
          {/*
          <h2>Vendas</h2>
          <br/>
          <Botao props={"Teste"} type={'confirm'} onClick={buscaVenda}/>
          <br/>
          Valor: {valorVendasTotal.toFixed(2)}}
          Vendas do dia: {valorVendasTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          */}
            <div className='divTabelaVendas'>
              <div style={{width:'100vh'}}>
                  <table className='tabela'>
                      <caption><h3>Vendas</h3></caption>
                      <thead >
                          <tr >
                              <th></th> 
                              <th></th> 
                          </tr>
                      </thead>
                      <tbody >
                         <tr onDoubleClick={() => {}}>
                            <td>Vendas do dia</td>
                            <td>{valorVendasTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          </tr>

                          <tr onDoubleClick={() => {}}>
                            <td>Última Venda</td>
                            {
                              vendas.length > 0 ? 
                                <td>{(vendas[0].valortotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))}</td>
                              : <td>0</td>
                            } 
                          </tr>
                          
                          <tr onDoubleClick={() => {}}>
                            <td>Produtos mais vendidos:</td>
                            <td></td>
                          </tr>
                            
                          {
                            produtosVendasDia.length > 0 ?
                            produtosVendasDia.slice(0,4).map(produto => (
                               
                                  <tr key={produto.id}  onDoubleClick={() => {}}>
                                    <td className='tdesqtabl'>{produto.descricao}</td>
                                    <td>{produto.quantidade.toFixed(2)}</td>
                                  </tr>
                            
                                
                              ))
                            :null
                        
                          }
                          
                         

                      </tbody>
                  </table>
              </div>
            </div>
          </div>
        

        {/* ------------------------ Compras ----------------------------- */}
        <div className='compras'>
          <div className='divTabelaVendas'>
              <div style={{width:'100vh'}}>
                  <table className='tabela'>
                      <caption><h3>Compras</h3></caption>
                      <thead >
                          <tr >
                              <th></th> 
                              <th></th> 
                          </tr>
                      </thead>
                      <tbody >
                         <tr onDoubleClick={() => {}}>
                            <td>Compras do dia</td>
                            <td>{valorComprasTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          </tr>

                          <tr onDoubleClick={() => {}}>
                            <td>Última Compra</td>
                            {
                              compras.length > 0 ? 
                                <td>{(compras[0].valortotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                              : <td>0</td>
                            } 
                          </tr>
                          
                          <tr onDoubleClick={() => {}}>
                            <td>Produtos mais comprados:</td>
                            <td></td>
                          </tr>
                            
                          {
                            produtosComprasDia.length > 0 ?
                            produtosComprasDia.slice(0,4).map(produto => (
                                  <tr key={produto.id}  onDoubleClick={() => {}}>
                                    <td className='tdesqtabl'>{produto.descricao}</td>
                                    <td>{produto.quantidade.toFixed(2)}</td>
                                  </tr>
                              ))
                            :null
                          }
                          
                         

                      </tbody>
                  </table>
              </div>
          </div>
          
        </div>
        

        {/* ------------------------ Receber ----------------------------- */}
        <div className='receber'>
          <div style={{width:'100vh'}}>
              <Chart
                chartType="PieChart"
                data={receber}
                options={{title:'Recebimento do Mês', backgroundColor: 'transparent'}}
                width='100%'
                height="290px"
                legendToggle
              /> 
          </div>
        </div>
        

        {/* ------------------------ Pagar ----------------------------- */}
        <div className='pagar'>
          <div style={{width:'100vh'}}>
              <Chart
                chartType="PieChart"
                data={pagar}
                options={{title:'Pagamentos do Mês', backgroundColor: 'transparent'}}
                width='100%'
                height="290px"
                legendToggle
              />
          </div>  
        </div>

      </div>
      
    </div>
  )
}

export default Main;