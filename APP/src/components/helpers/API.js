import Axios from 'axios';

const URI = 'http://localhost:5001';


export const fetchCondpg = () => {
    return Axios.get(`${URI}/condpg`)
    .then(res => res.data)  
    //.then(res => console.log(res.data))
    .catch(window.alert);
   // return fetch(url).then(response => response.json)
}


export const fetchTaxas = () => {
    return Axios.get(`${URI}/taxas`)
    .then(res => res.data)  
    //.then(res => console.log(res.data))
    .catch(window.alert);
   // return fetch(url).then(response => response.json)
}

export const fetchProdutos = () => {
    return Axios.get(`${URI}/produtos?ativo=1`)
    .then(res => res.data)  
    //.then(res => console.log(res.data))
    .catch(window.alert);
   // return fetch(url).then(response => response.json)
}

export const fetchMarcas = () => {
    return Axios.get(`${URI}/marcas`)
    .then(res => res.data)  
    //.then(res => console.log(res.data))
    .catch(window.alert);
   // return fetch(url).then(response => response.json)
}

export const fetchTipoProduto = () => {
    return Axios.get(`${URI}/tipoproduto`)
    .then(res => res.data)  
    //.then(res => console.log(res.data))
    .catch(window.alert);
   // return fetch(url).then(response => response.json)
}

export const fetchGrupos = () => {
    return Axios.get(`${URI}/grupos`)
    .then(res => res.data)  
    //.then(res => console.log(res.data))
    .catch(window.alert);
   // return fetch(url).then(response => response.json)
}





export const fetchClientes = () => {
    return Axios.get(`${URI}/clientes?ativo=1&_sort=name&_order=asc`)
    .then(res => res.data)  
    //.then(res => console.log(res.data))
    .catch(window.alert);
   // return fetch(url).then(response => response.json)
}

export const fetchVeiculosClientes = (idCliente) => {
    return Axios.get(`${URI}/veiculos?cliente_id=${idCliente}`)
    .then(res => res.data)  
    //.then(res => console.log(res.data))
    .catch(window.alert);
   // return fetch(url).then(response => response.json)
}

export const fetchConheceus = () => {
    return Axios.get(`${URI}/conheceu`)
    .then(res => res.data)  
    //.then(res => console.log(res.data))
    .catch(window.alert);
   // return fetch(url).then(response => response.json)
}


export const fetchTipoPagar = () => {
    return Axios.get(`${URI}/pagartipo`)
    .then(res => res.data)  
    //.then(res => console.log(res.data))
    .catch(window.alert);
   // return fetch(url).then(response => response.json)
}
