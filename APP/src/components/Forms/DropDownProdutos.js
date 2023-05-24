import { useEffect, useState } from "react";
import { fetchProdutos } from "../helpers/API";


const DropDownProdutos = ({alteracao, idproduto, onChange = () => {}}) => {
    const [produtos, setProdutos] = useState([]);
    useEffect(()=> {
        fetchProdutos().then((produtos) =>{
            setProdutos(produtos);
        })
    },[])

    return (
        <select id="produtos" name="produtos" onChange={onChange}  style={{width:'280px'}}>
            <option value = "">Selecione um Produto para Vincular</option>
            {produtos.map((produto) => {
                const {id,descricao} = produto;
                return (<option value = {descricao} key={id} id={id} produto={produto}>{descricao}</option>)
                })
            }
        </select>
        
    )
}




export default DropDownProdutos;