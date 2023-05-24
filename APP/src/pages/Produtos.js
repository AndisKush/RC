import './Produtos.css';

import React, { useEffect, useState } from 'react'; 
import Axios from 'axios';
import Botao from '../components/Botao';
import UIModal from '../components/Modal';
import DropDownMarcas from '../components/Forms/DropDownMarcas';
import DropDownGrupos from '../components/Forms/DropDownGrupos';
import DropDownTipoProduto from '../components/Forms/DropDownTipoProduto';
import DropDownProdutos from '../components/Forms/DropDownProdutos';

const URI = 'http://localhost:5001';

function Produtos(){
    
  const  [produtos, setProdutos] = useState([]);
  const  [servicos, setServicos] = useState([]);
  const  [produtoClicado, setProdutoClicado] = useState(null);
  const  [servicoClicado, setServicoClicado] = useState(null);
  const  [descricao, setDescricao] = useState('');
  const  [marca, setMarca] = useState({});
  const  [grupo, setGrupo] = useState({});
  const  [valorvenda, setValorVenda] = useState(0);
  const  [valorcusto, setValorCusto] = useState(0);
  const  [estoqueminimo, setEstoqueMinimo] = useState(0);
  const  [estoque, setEstoque] = useState(0);
  const  [adicionar, setAdicionar] = useState(false);
  const  [adicionarServ, setAdicionarServ] = useState(false);
  const  [formValues, setFormValues] = useState({idmarca: 0, marca: "Sem Marca", idgrupo: 0, grupo: "Sem Grupo", idtipoproduto: 0, tipoproduto: "Sem Tipo"});
  const  [novoTipoProduto, setNovoTipoProduto] = useState(false);
  const  [novaMarca, setNovaMarca] = useState(false);
  const  [novoGrupo, setNovoGrupo] = useState(false);
  const  [descNovaMarca, setDescNovaMarca] = useState('');
  const  [descNovoTipoProduto, setDescNovoTipoProduto] = useState('');
  const  [descNovoGrupo, setDescNovoGrupo]  = useState('');
  const  [novoProduto, setNovoProduto] = useState(true);
  const  [novoServico, setNovoServico] = useState(false);
  const  [listaProdutosVinculados, setListaProdutosVinculados] = useState([]);
  const  [qtdProdutoVinculado, setQtdProdutoVinculado] = useState(0);
  const  [dummy, setDummy] = useState(true);
  const  [copiaProdutos, setCopiaProdutos] = useState();
  const  [copiaServicos, setCopiaServicos] = useState();
  const  [altlistapv, setAltlistapv] = useState(false);
  useEffect(getProdutos, []);
  useEffect(getServicos, []);
  

  function getProdutos (){
    Axios.get(`${URI}/produtos`)
    .then(res => {setProdutos(res.data); setCopiaProdutos(res.data)})  
    //.then(res => console.log(res.data))
    .catch(window.alert);
    //setClientes(clientes2);
  }

  function getServicos (){
    Axios.get(`${URI}/servicos`)
    .then(res => {setServicos(res.data); setCopiaServicos(res.data)})  
    //.then(res => console.log(res.data))
    .catch(window.alert);
    //setClientes(clientes2);
  }

  const handleBuscaProduto = (e) => {
    if(novoProduto){
      let busca = e.target.value;
      var newarr = copiaProdutos.filter(produto => produto.descricao.toLowerCase().includes(busca.toLowerCase()));
      setProdutos(newarr);
      if(busca === ''){
        getProdutos();
      }
    }else{
      let busca = e.target.value;
      var newarr = copiaServicos.filter(servico => servico.descricao.toLowerCase().includes(busca.toLowerCase()));
      setServicos(newarr);
      if(busca === ''){
        getServicos();
      }
    }
    
  }


  const handleDescricao = (e) => {
    setDescricao(e.target.value);
  }

  const handleValorVenda = (e) => {
    
    parseFloat(e.target.value) >= 0 ? setValorVenda(e.target.value) : setValorVenda(0)
  }

  const handleValorCusto = (e) => {
    setValorCusto(e.target.value);
  }

  const handleEstoqueMinimo = (e) => {
    setEstoqueMinimo(e.target.value);
  }

  const handleEstoque = (e) => {
    setEstoque(e.target.value);
  }

  const handleQtdProdutoVinculado = (e) => {
    setQtdProdutoVinculado(parseFloat(e.target.value));
  }

 

  const doubleClickTable = (produto) => {
    setProdutoClicado(produto);
    setDescricao(produto.descricao);
    setMarca(produto.marca);
    setGrupo(produto.grupo);
    setValorCusto(produto.valorcusto)
    setValorVenda(produto.valorvenda);
    setEstoqueMinimo(produto.estoqueminimo);
    setEstoque(produto.estoque);
    setFormValues({idmarca:produto.marca_id, marca: produto.descricaomarca, idgrupo:produto.grupo_id, grupo:produto.descricaogrupo, idtipoproduto: produto.tipo_id, tipoproduto: produto.descricaotipo})
  }

  const doubleClickTableServico = async (servico) => {
    await Axios.get(`${URI}/produtosvinculados?servico_id=${servico.id}`)
    .then(res => {
      setListaProdutosVinculados(res.data);
    })
    setDescricao(servico.descricao);
    setValorVenda(servico.valorvenda);

   
    setServicoClicado(servico);
  }


  const handleSalvar = () => {
    
      Axios.patch(`${URI}/produtos`, {
        descricao: descricao,
        ativo: 1,
        marca_id: formValues.idmarca,
        tipo_id: formValues.idtipoproduto,
        grupo_id: formValues.idgrupo, 
        valorvenda: valorvenda,
        valorcusto: valorcusto,
        estoque: estoque,
        estoqueminimo: estoqueminimo,
        id: produtoClicado.id
      })
        .then(getProdutos)  
        .catch(window.alert);
        window.alert('Produto Atualizado');
        handleCancelar();
  }

  const handleAlterarServico = async () => {
    await Axios.patch(`${URI}/servicos`,{
      descricao: descricao,
      valorvenda: valorvenda,
      ativo: 1,
      id: servicoClicado.id
    }).then(getServicos).then(handleCancelar).catch(window.alert);

    
    if(altlistapv){
      await Axios.delete(`${URI}/produtosvinculados?servico_id=${servicoClicado.id}`,)
      listaProdutosVinculados.map(async produto => {
        await Axios.post(`${URI}/produtosvinculados`,{
            servico_id: servicoClicado.id,
            produto_id: produto.id,
            quantidadevinculada: produto.quantidadevinculada
          })
        })
        setAltlistapv(false);
    }

    window.alert('Serviço Atualizado');
  }

  const handleAdicionarProd = () => {
    setAdicionar(true)
  }

  const handleAdicionarServ = () => {
    setAdicionarServ(true)
  }

  const handleAdicionarProduto = () => {
    console.log(formValues)
    Axios.post(`${URI}/produtos`,{
      descricao: descricao,
      ativo: 1,
      marca_id: formValues.idmarca,
      tipo_id: formValues.idtipoproduto,
      grupo_id: formValues.idgrupo,
      valorvenda: valorvenda,
      valorcusto: valorcusto,
      estoque: estoque,
      estoqueminimo: estoqueminimo
     

  }).then(getProdutos)
  .then(handleCancelar)
  .catch(window.alert);
  window.alert('Adicionado');
  }

  const salvaProdutosVinculados = () => {
    if (listaProdutosVinculados.length > 0){
      Axios.get(`${URI}/maxservicos`)
      .then(res => {
        
      })
    }
  }
  const handleAdicionarServico = async () => {
    await Axios.post(`${URI}/servicos`,{
      descricao: descricao,
      valorvenda: valorvenda,
      ativo: 1
    }).then(getServicos)
    .then(handleCancelar)
    .catch(window.alert);

    if (listaProdutosVinculados.length > 0){
      Axios.get(`${URI}/maxservicos`)
      .then(res => {
        listaProdutosVinculados.map(async produto => {
        await Axios.post(`${URI}/produtosvinculados`,{
            servico_id: res.data[0].max,
            produto_id: produto.id,
            quantidadevinculada: produto.quantidadevinculada
          })
        })
      })
    }

    window.alert('Adicionado');
  }

  const handleCancelar = () => {
    setProdutoClicado(false);
    setServicoClicado(false);
    setAdicionar(false);
    setAdicionarServ(false);
    setDescricao(null);
    setMarca(null);
    setGrupo(null);
    setValorCusto(0);
    setValorVenda(0);
    setEstoqueMinimo(0);
    setEstoque(0);
    setNovoTipoProduto(false);
    setNovaMarca(false);
    setNovoGrupo(false);
    setDescNovaMarca(null);
    setDescNovoGrupo(null);
    setDescNovoTipoProduto(null);
    setQtdProdutoVinculado(0);
    setListaProdutosVinculados([])
    setFormValues({idmarca: 0, marca: "Sem Marca", idgrupo: 0, grupo: "Sem Grupo", idtipoproduto: 0, tipoproduto: "Sem Tipo"});
  }

  const handleInputChange = (e) => {
    //console.log(e.target.options[e.target.options.selectedIndex].getAttribute('id'));
    e.preventDefault();
    const {value, name} = e.target;
    setFormValues({...formValues, [name]:value, 'idmarca':e.target.options[e.target.options.selectedIndex].getAttribute('id')});
 
  }
  const handleInputChange2 = (e) => {
   
    e.preventDefault();
    const {value, name} = e.target;
    setFormValues({...formValues, [name]:value, 'idgrupo':e.target.options[e.target.options.selectedIndex].getAttribute('id')});
    
  }

  const handleInputChange3 = (e) => {
   
    e.preventDefault();
    const {value, name} = e.target;
    setFormValues({...formValues, [name]:value, 'idtipoproduto':e.target.options[e.target.options.selectedIndex].getAttribute('id')});
    
  }

  const handleInputChange4 = (e) => {
    e.preventDefault();
    const {value, name} = e.target;
    setFormValues({...formValues, [name]:value, 'idproduto':e.target.options[e.target.options.selectedIndex].getAttribute('id')});
    
  }

  const handleNovoTipoProduto = (e) => {
    setDescNovoTipoProduto(e.target.value)
  }

  const handleNovaMarca = (e) => {
    setDescNovaMarca(e.target.value)
  }

  const handleNovoGrupo = (e) => {
    setDescNovoGrupo(e.target.value)
  }





  function handleInativar(produto)  { 
    if(window.confirm("Tem certeza que deseja excluir esse produto?")){
        produto.ativo = 0
        Axios.patch(`${URI}/produtos`, produto)
        .then(getProdutos)
        .catch(window.alert)
    } 
  }

  function handleInativarServico(servico){
    servico.ativo = 0
    if(window.confirm("Tem certeza que deseja excluir esse serviço?")){
      Axios.patch(`${URI}/servicos`, servico)
      .then(getServicos)
      .catch(window.alert)
    } 
  }

  function removeProdutoVinculado(servicoid){
    setAltlistapv(true);
    if(window.confirm("Tem certeza que deseja remover esse produto?")){
      var newarr = listaProdutosVinculados;
      for( var i = 0; i < newarr.length; i++){
          if(newarr[i].id === servicoid){
              newarr.splice(i,1);
              setListaProdutosVinculados(newarr);
          }
      }
    }
    setDummy(!dummy);
  }

  function recarregaServicos(){
    setAdicionarServ(false);
    setAdicionarServ(true);
  }


  function addMarca()  { 
    setNovaMarca(true);
  }

  function addGrupo()  { 
    setNovoGrupo(true);
  }

  function addTipoProduto()  { 
    setNovoTipoProduto(true);
  }

  function salvarNovoTipoProduto()  { 
    Axios.post(`${URI}/tipoproduto`,{descricao: descNovoTipoProduto}).then(recarregaDropDowns1).then(recarregaDropDowns2).catch(window.alert);
    setDescNovoTipoProduto('');
    setNovoTipoProduto(false);

  }

  function salvarNovaMarca()  { 
    Axios.post(`${URI}/marcas`,{descricao: descNovaMarca}).then(recarregaDropDowns1).then(recarregaDropDowns2).catch(window.alert);
    setDescNovaMarca('');
    setNovaMarca(false);

  }

  function salvarNovoGrupo()  { 
    Axios.post(`${URI}/grupos`,{descricao: descNovoGrupo}).then(recarregaDropDowns1).then(recarregaDropDowns2).catch(window.alert);
    setDescNovoGrupo('');
    setNovoGrupo(false);

  }

  function recarregaDropDowns1(){
    setAdicionar(false);
  }

  function recarregaDropDowns2(){
    setAdicionar(true);
  }

  function TabelaNovoProduto(){
    setNovoProduto(true);
    setNovoServico(false);
  }

  function TabelaNovoServico(){
    setNovoProduto(false);
    setNovoServico(true);
  }

  const addProdutoListaProdutosVinculados = () => {
    setAltlistapv(true);
    setListaProdutosVinculados([...listaProdutosVinculados ,{id: formValues.idproduto, descricao: formValues.produtos, quantidadevinculada: qtdProdutoVinculado}])
  }

  
  return(
    <div className="Produtos">
      <div>
        <div>
          <div className='BotoesAdd'>
            {
              novoProduto ? <Botao props={"Produto"} type={'cancel'} onClick={() => TabelaNovoProduto()}/> : <Botao props={"Produto"} type={'confirm'} onClick={() => TabelaNovoProduto()}/>
            }
            
            {
              novoServico ? <Botao props={"Serviço"} type={'cancel'} onClick={() => TabelaNovoServico()}/> : <Botao props={"Serviço"} type={'confirm'} onClick={() => TabelaNovoServico()}/>
            }
          </div>
        </div>
        <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
            <div style={{textAlign:'left', marginTop: 20}}>
              Busca: <input style={{width: "80%"}} onChange={e => handleBuscaProduto(e)}></input>
            </div>
            <div style={{ textAlign:'right', marginBottom:'10px', marginRight:'5px'}}>
              { novoProduto ? <Botao props={"Adicionar"} type={'confirm'} onClick={() => handleAdicionarProd()}/> : <Botao props={"Adicionar"} type={'confirm'} onClick={() => handleAdicionarServ()}/>}
            </div>
        </div>
      </div>

        {/*  ********* Tabela Produto ************** - */}

        {
          novoProduto ? 
            <div className='divTabela'>
            <table className='tabela'>
              <caption></caption>
              <thead >
                  <tr >
                      <th>Descrição</th> 
                      <th>Tipo</th> 
                      <th>Marca</th>
                      <th>Grupo</th>  
                      <th>Valor de Custo</th>
                      <th>Valor de Venda</th>
                      <th>Estoque Mínimo</th>
                      <th>Estoque</th> 
                      <th>Excluir</th> 
                      
                  </tr>
              </thead>
              <tbody >
                  {produtos.map(produto => (     
                          produto.estoque <= parseFloat(produto.estoqueminimo) ?  
                            produto.estoque <= 0 ?
                              <tr key={produto.id} onDoubleClick={() => doubleClickTable(produto)}>
                                <td className='tdnomenegativo'>{produto.descricao}</td>
                                <td className='tdnegativo'>{produto.descricaotipo}</td>
                                <td className='tdnegativo'>{produto.descricaomarca}</td>
                                <td className='tdnegativo'>{produto.descricaogrupo}</td>
                                <td className='tdnegativo'>{parseFloat(produto.valorcusto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td className='tdnegativo'>{parseFloat(produto.valorvenda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td className='tdnegativo'>{produto.estoqueminimo}</td>
                                <td className='tdnegativo'>{produto.estoque}</td>
                                <td className='tdnegativo'><Botao props={"-"} type={'Baixar'} onClick={() => handleInativar(produto)}/></td>
                                
                              </tr>
                              :
                              <tr key={produto.id} onDoubleClick={() => doubleClickTable(produto)}>
                                <td className='tdnomeestoqueminino'>{produto.descricao}</td>
                                <td className='tdestoqueminino'>{produto.descricaotipo}</td>
                                <td className='tdestoqueminino'>{produto.descricaomarca}</td>
                                <td className='tdestoqueminino'>{produto.descricaogrupo}</td>
                                <td className='tdestoqueminino'>{parseFloat(produto.valorcusto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td className='tdestoqueminino'>{parseFloat(produto.valorvenda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td className='tdestoqueminino'>{produto.estoqueminimo}</td>
                                <td className='tdestoqueminino'>{produto.estoque}</td>
                                <td className='tdestoqueminino'><Botao props={"-"} type={'Baixar'} onClick={() => handleInativar(produto)}/></td>
                                
                              </tr>
                          : 
                          <tr key={produto.id} onDoubleClick={() => doubleClickTable(produto)}>
                            <td className='tdnome'>{produto.descricao}</td>
                            <td>{produto.descricaotipo}</td>
                            <td>{produto.descricaomarca}</td>
                            <td>{produto.descricaogrupo}</td>
                            <td>{parseFloat(produto.valorcusto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td>{parseFloat(produto.valorvenda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td>{produto.estoqueminimo}</td>
                            <td>{produto.estoque}</td>
                            <td><Botao props={"-"} type={'Baixar'} onClick={() => handleInativar(produto)}/></td>
                          </tr> 

                  ))}
              </tbody>
              </table>
            </div>
          : null
        }
        
        {/*  ********* Tabela Serviço ************** - */}

        {
          novoServico ? 
            <div className='divTabela'>
              <table className='tabela'>
                <caption></caption>
                <thead >
                    <tr >
                        <th>Descrição</th> 
                        <th>Valor</th>
                        <th>Excluir</th> 
                        
                    </tr>
                </thead>
                <tbody >
                    {servicos.map(servico => (     
                            <tr key={servico.id} onDoubleClick={() => doubleClickTableServico(servico)}>
                              <td className='tdnome'>{servico.descricao}</td>
                              <td>{servico.valorvenda}</td>
                              <td><Botao props={"-"} type={'Baixar'} onClick={() => handleInativarServico(servico)}/></td>
                            </tr> 
                    ))}
                  
                </tbody>
              </table>
            </div>
          : null
        }
   

                {/*  ********* MODAL DE ALTERAÇÃO Produto ************** - */}

      <UIModal isOpen={Boolean(produtoClicado)} onClickClose={() => handleCancelar()}>
        {Boolean(produtoClicado) ? 
        
        <div style={{color: '#fff'}}> 
          <h2>{produtoClicado.descricao}</h2>
          <br/><br/>
            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
              <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                <div>
                  <label style={{color: "white"}}>Descrição: </label>
                </div>
                <div style={{textAlign:'left'}}>
                  <input type="text" value={descricao} style={{width:'280px'}} required onChange={(e) => {handleDescricao(e)}} />
                </div>
                
              </div>

              <div>
              
              </div>
            </div>
            
            <br/>

           

            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
              <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                <div>
                  <label style={{color: "white"}}>Tipo: </label>
                </div>
                <div style={{textAlign:'left'}}>
                  <DropDownTipoProduto alteracao = {true} idtipoproduto={produtoClicado.tipo_id} onChange={handleInputChange3}/>
                </div>
                
              </div>

              <div>
              
              </div>
            </div>

            <br/>

            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
              <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                <div>
                  <label style={{color: "white"}}>Marca: </label>
                </div>
                <div style={{textAlign:'left'}}>
                  <DropDownMarcas alteracao = {true} idmarca={produtoClicado.marca_id} onChange={handleInputChange}/>
                </div>
                
              </div>

              <div>
              
              </div>
            </div>

            <br/>

            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
              <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                <div>
                  <label style={{color: "white"}}>Grupo: </label>
                </div>
                <div style={{textAlign:'left'}}>
                  <DropDownGrupos alteracao = {true} idgrupo = {produtoClicado.grupo_id} onChange={handleInputChange2}/>
                </div>
                
              </div>

              <div>
              
              </div>
            </div>
          
            <br/>

            <div style={{display:"grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: 20}}>
              <div>
                <label style={{color: "white"}}>Valor Custo: </label>
                <input type="text" value={valorcusto} onChange={(e) => {handleValorCusto(e)}} />
              </div>

              <div>
                <label style={{color: "white"}}>Valor Venda: </label>
                <input type="text" value={valorvenda} onChange={(e) => {handleValorVenda(e)}} />
              </div>

              <div>
                <label style={{color: "white"}}>Estoque Mínimo: </label>
                <input type="text" value={estoqueminimo} onChange={(e) => {handleEstoqueMinimo(e)}} />
              </div>

              <div>
                <label style={{color: "white"}}>Estoque: </label>
                <input type="text" value={estoque} onChange={(e) => {handleEstoque(e)}} />
              </div>
            </div>
            
            <br/>            
            <br/>
            <br/>
            <div style={{display:"grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20}}>
              <div>
                
                <div style={{textAlign:'left', marginBottom: 10, marginRight: 5}} onClick={() => handleCancelar()}>
                    <Botao props={"Cancelar"} type={"cancel"}/>
                </div>
              </div>
              <div style={{width: '10vh'}}>
                <br/>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{textAlign:'right', marginBottom: 10, marginRight: 0}} onClick={() => handleSalvar()}>
                    <Botao props={"Salvar"} type={"confirm"} />
                </div>
              </div>
            </div>
           
            
        </div>
        
        : null}
      </UIModal>

                      {/*  ********* MODAL DE ADICIONAR Produto ************** - */}

        <UIModal isOpen={Boolean(adicionar)} onClickClose={() => handleCancelar()}>
        {Boolean(adicionar) ? 
        
        <div style={{color: '#fff'}}> 
          <h2>Adicionar</h2>
          <br/><br/>
            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
              <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                <div>
                  <label style={{color: "white"}}>Descrição: </label>
                </div>
                <div style={{textAlign:'left'}}>
                  <input type="text" value={descricao} style={{width:'680px'}} required onChange={(e) => {handleDescricao(e)}} />
                </div>
                
              </div>

              <div>
              
              </div>
            </div>
            
            <br/>

            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}> 
              <div style={{display:"grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20}}>
                <div style={{ marginTop:'2px'}}>
                  <label style={{color: "white"}}>Tipo: </label>
                </div>
                
                <div style={{textAlign:'left', marginLeft:'45px', marginTop:'2px'}}>
                  <DropDownTipoProduto alteracao = {false}  onChange={handleInputChange3}/>
                </div>
                  
                <div>
                  <div>
                    <Botao props={"+"} type={"add2"} onClick={addTipoProduto}/>
                  </div>
                </div>
              </div>

              <div>
                {novoTipoProduto ? 
                      <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                        <div>
                          <input type="text" value={descNovoTipoProduto} onChange={(e) => {handleNovoTipoProduto(e)}} />
                        </div>

                        <div>
                          <Botao props={"Add"} type={"add2"} onClick={salvarNovoTipoProduto}/>
                        </div>
                      </div>  
                : null}
              </div>
            </div>

            <br/>

            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
              <div style={{display:"grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20}}>
                <div style={{ marginTop:'2px'}}>
                  <label style={{color: "white"}}>Marca: </label>
                </div>
                
                <div style={{textAlign:'left', marginLeft:'32px', marginTop:'2px'}}>
                  <DropDownMarcas alteracao = {false}  onChange={handleInputChange}/>
                </div>
                <div>
                  <Botao props={"+"} type={"add2"} onClick={addMarca}/>
                </div>
                
              </div>

              <div>
                {novaMarca ? 
                        <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                          <div>
                            <input type="text" value={descNovaMarca} onChange={(e) => {handleNovaMarca(e)}} />
                          </div>

                          <div>
                            <Botao props={"Add"} type={"add2"} onClick={salvarNovaMarca}/>
                          </div>
                        </div>  
                  : null}
              </div>
            </div>

            <br/>

            <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
              <div style={{display:"grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20}}>
                <div style={{ marginTop:'2px'}}>
                  <label style={{color: "white"}}>Grupo: </label>
                </div>
                <div style={{textAlign:'left', marginLeft:'32px' , marginTop:'2px'}}>
                    <DropDownGrupos alteracao={false} onChange={handleInputChange2}/>
                </div>
                <div>
                  <Botao props={"+"} type={"add2"} onClick={addGrupo}/>
                </div>
                
              </div>

              <div>
                {novoGrupo ? 
                        <div style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap: 20}}>
                          <div>
                            <input type="text" value={descNovoGrupo} onChange={(e) => {handleNovoGrupo(e)}} />
                          </div>

                          <div>
                            <Botao props={"Add"} type={"add2"} onClick={salvarNovoGrupo}/>
                          </div>
                        </div>  
                  : null}
              </div>
            </div>
          
            <br/>

            <div style={{display:"grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: 20}}>
              <div>
                <label style={{color: "white"}}>Valor Custo: </label>
                <input type="text" value={valorcusto} onChange={(e) => {handleValorCusto(e)}} />
              </div>

              <div>
                <label style={{color: "white"}}>Valor Venda: </label>
                <input type="text" value={valorvenda} onChange={(e) => {handleValorVenda(e)}} />
              </div>

              <div>
                <label style={{color: "white"}}>Estoque Mínimo: </label>
                <input type="text" value={estoqueminimo} onChange={(e) => {handleEstoqueMinimo(e)}} />
              </div>

              <div>
                <label style={{color: "white"}}>Estoque: </label>
                <input type="text" value={estoque} onChange={(e) => {handleEstoque(e)}} />
              </div>
            </div>
            
            <br/>            
            <br/>
            <br/>
            <div style={{display:"grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20}}>
              <div>
                
                <div style={{textAlign:'left', marginBottom: 10, marginRight: 5}} onClick={() => handleCancelar()}>
                    <Botao props={"Cancelar"} type={"cancel"}/>
                </div>
              </div>
              <div style={{width: "10vh"}}>
                <br/>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{textAlign:'right', marginBottom: 10, marginRight: 0}} onClick={() => handleAdicionarProduto()}>
                    <Botao props={"Salvar"} type={"confirm"} />
                </div>
              </div>
            </div>
           
            
        </div>
        
        : null}
      </UIModal>

                    {/*  ********* MODAL DE ADICIONAR Servico ************** - */}

      <UIModal isOpen={Boolean(adicionarServ)} onClickClose={() => handleCancelar()}>
        {Boolean(adicionarServ) ? 
          <div style={{color: '#fff'}}> 
            <h2>Adicionar</h2>
            <br/>
            <div className='headerAddServ'>
              <label style={{color: "white"}}>Descrição: </label>
              <input type="text" value={descricao} style={{width:'480px',marginRight:'40px', marginLeft:'10px'}} required onChange={(e) => {handleDescricao(e)}} />
              <label style={{color: "white"}}>Valor: </label>
              <input style={{marginLeft:'10px', width:'80px'}} type="text" value={valorvenda} onChange={(e) => {handleValorVenda(e)}} />
            </div>       

            <br/>

            <div className='DivAddProdutoVinculado'>
              <label style={{color: "white"}}>Produto: </label>
              <DropDownProdutos alteracao = {false}  onChange={handleInputChange4}/>
              <label style={{color: "white", marginRight:'10px', textAlign:'right'}}>Quantidade: </label>
              <input type="text" value={qtdProdutoVinculado} style={{ width:'40px',marginRight:'110px', marginLeft:'0px'}} required onChange={(e) => {handleQtdProdutoVinculado(e)}} />
              <div style={{textAlign:'right', marginRight:'7px'}}>
                <Botao props={"Add"} type={'Baixar'} onClick={addProdutoListaProdutosVinculados}/>
              </div>
              
            </div>
            <br/>
            <div className='divTabelaProdutosVinculados'>
              <table className='tabelaProdutosVinculados'>
                <caption>Produtos Vinculados</caption>
                <thead >
                    <tr >
                        <th>Descrição</th> 
                        <th>Quantidade</th>
                        <th>Excluir</th> 
                        
                    </tr>
                </thead>
                <tbody>
                    {listaProdutosVinculados.map(produto => (     
                            <tr key={produto.id} onDoubleClick={() => {}}>
                              <td className='tdnome'>{produto.descricao}</td>
                              <td>{produto.quantidadevinculada}</td>
                              <td><Botao props={"-"} type={'Baixar'} onClick={() => removeProdutoVinculado(produto.id)}/></td>
                            </tr> 
                    ))}
                  
                </tbody>
              </table>
            </div>
            
            
            <br/>
            <div style={{display:"grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20}}>
              <div>
                <div style={{textAlign:'left', marginBottom: 10, marginRight: 5}} >
                    <Botao props={"Cancelar"} type={"cancel"} onClick={() => handleCancelar()}/>
                </div>
              </div>
              <div style={{width: "10vh"}}>
                <br/>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{textAlign:'right', marginBottom: 10, marginRight: 0}} >
                    <Botao props={"Salvar"} type={"confirm"} onClick={() => handleAdicionarServico()}/>
                </div>
              </div>
            </div>
          </div>        
        : null}
      </UIModal>

                    {/*  ********* MODAL DE Alterar Servico ************** - */}
      <UIModal isOpen={Boolean(servicoClicado)} onClickClose={() => handleCancelar()}>
        {Boolean(servicoClicado) ? 
          <div style={{color: '#fff'}}> 
            <h2>{servicoClicado.descricao}</h2>
            <br/>
            <div className='headerAddServ'>
              <label style={{color: "white"}}>Descrição: </label>
              <input type="text" value={descricao} style={{width:'480px',marginRight:'40px', marginLeft:'10px'}} required onChange={(e) => {handleDescricao(e)}} />
              <label style={{color: "white"}}>Valor: </label>
              <input style={{marginLeft:'10px', width:'80px'}} type="text" value={valorvenda} onChange={(e) => {handleValorVenda(e)}} />
            </div>       

            <br/>

            <div className='DivAddProdutoVinculado'>
              <label style={{color: "white"}}>Produto: </label>
              <DropDownProdutos alteracao = {false}  onChange={handleInputChange4}/>
              <label style={{color: "white", marginRight:'10px', textAlign:'right'}}>Quantidade: </label>
              <input type="text" value={qtdProdutoVinculado} style={{ width:'40px',marginRight:'110px', marginLeft:'0px'}} required onChange={(e) => {handleQtdProdutoVinculado(e)}} />
              <div style={{textAlign:'right', marginRight:'7px'}}>
                <Botao props={"Add"} type={'Baixar'} onClick={addProdutoListaProdutosVinculados}/>
              </div>
              
            </div>
            <br/>
            <div className='divTabelaProdutosVinculados'>
              <table className='tabelaProdutosVinculados'>
                <caption>Produtos Vinculados</caption>
                <thead >
                    <tr >
                        <th>Descrição</th> 
                        <th>Quantidade</th>
                        <th>Excluir</th> 
                        
                    </tr>
                </thead>
                <tbody>
                    {listaProdutosVinculados.map(produto => (     
                            <tr key={produto.id} onDoubleClick={() => {}}>
                              <td className='tdnome'>{produto.descricao}</td>
                              <td>{produto.quantidadevinculada}</td>
                              <td><Botao props={"-"} type={'Baixar'} onClick={() => removeProdutoVinculado(produto.id)}/></td>
                            </tr> 
                    ))}
                  
                </tbody>
              </table>
            </div>
            
            
            <br/>
            <div style={{display:"grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 20}}>
              <div>
                <div style={{textAlign:'left', marginBottom: 10, marginRight: 5}} >
                    <Botao props={"Cancelar"} type={"cancel"} onClick={() => handleCancelar()}/>
                </div>
              </div>
              <div style={{width: "10vh"}}>
                <br/>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{textAlign:'right', marginBottom: 10, marginRight: 0}} >
                    <Botao props={"Salvar"} type={"confirm"} onClick={() => handleAlterarServico()}/>
                </div>
              </div>
            </div>
          </div>        
        : null}
      </UIModal>
    </div>
    
  )
}

export default Produtos;