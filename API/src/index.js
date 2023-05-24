import express from "express";
import cors from "cors";
import { executeQuery } from "./config/database.js";
//import firebird from "node-firebird";


const app = express();

//Middleware JSON
app.use(express.json());

//Middleware CORS
app.use(cors());

//Rotas------

//----------------------- Users -----------------------

//----------------------- Get Users
app.get("/users", function(req, res){
    let filtro = [];
    let ssql = 'SELECT * FROM USERS WHERE 1=1 ';
    if(req.query.id){
        ssql += 'and id = ?';
        filtro.push(req.query.id); 
    }
    if(req.query.name){
        //ssql += 'and name like ?';
        //filtro.push('%' + req.query.name + '%'); 
        ssql += 'and name = ?';
        filtro.push(req.query.name); 
    }
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});

//----------------------- Insert Users
app.post("/users", function(req, res){  
    let ssql = 'INSERT INTO USERS(NAME,PASSWORD) VALUES (?,?) RETURNING ID';
    let filtro = [req.body.name, req.body.password];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
        } else{
            res.status(201).json({id_user: result.ID})
        }
    });
});

//----------------------- Conheceu -------------------

//-----------------------Get Conheceu
app.get("/conheceu", function(req, res){
    let filtro = [];
    let ssql = 'SELECT * FROM CONHECEU ';
    if(req.query.id){
        ssql += 'and id = ?';
        filtro.push(req.query.id); 
    }
    if(req.query.name){
        //ssql += 'and name like ?';
        //filtro.push('%' + req.query.name + '%'); 
        ssql += 'and name = ?';
        filtro.push(req.query.name); 
    }
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});

//----------------------- Clientes -------------------

//-----------------------Get Clientes
app.get("/clientes", function(req, res){
    let filtro = [];
    let ssql = 'SELECT * FROM CLIENTES WHERE ATIVO=1 ';
    let clientes = [];

    if(req.query.id){
        ssql += 'and id = ?';
        filtro.push(req.query.id); 
    }

    ssql += ' ORDER BY NAME ';

    executeQuery(ssql, filtro, async function(err, result){
        if(err){
            res.status(500).json(err);
        } else{
            res.status(200).json(result);
        }
    })
});

//-----------------------Get Max Clientes
app.get("/maxclientes", function(req, res){
    let filtro = [];
    let ssql = 'SELECT MAX(ID) FROM CLIENTES';

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
        } else{
            res.status(200).json(result);
        }
    })
});

//-----------------------Get Ultimo Cliente
app.get("/ultimocliente", function(req, res){
    let filtro = [];
    let ssql = 'SELECT * FROM CLIENTES WHERE ID = (SELECT MAX(ID) FROM CLIENTES)';

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
        } else{
            res.status(200).json(result);
        }
    })
});


//-----------------------Insert Clientes
app.post("/clientes", function(req, res){

    if(req.body.id){
        let ssql = 'INSERT INTO CLIENTES(ID,NAME,TELEFONE,ATIVO,CONHECEU_ID,OUTROSCONHECEU) VALUES (?,?,?,?,?,?) RETURNING ID';
        let filtro = [req.body.id, req.body.name, req.body.telefone, req.body.ativo, req.body.conheceu_id, req.body.outrosconheceu];
        
        executeQuery(ssql, filtro, function(err, result){
            if(err){
                res.status(500).send(err + '');
                console.log(err);
            } else{
                res.status(201).json({id_user: result.ID})
            }
        });
    } else {
        let ssql = 'INSERT INTO CLIENTES(NAME,TELEFONE,ATIVO,CONHECEU_ID,OUTROSCONHECEU) VALUES (?,?,?,?,?) RETURNING ID';
        let filtro = [req.body.name, req.body.telefone, req.body.ativo, req.body.conheceu_id, req.body.outrosconheceu];
        
        executeQuery(ssql, filtro, function(err, result){
            if(err){
                res.status(500).send(err + '');
                console.log(err);
            } else{
                res.status(201).json({id_user: result.ID})
            }
        });
    }
    
});

//-----------------------Update Clientes
app.patch("/clientes", function(req, res){

    let ssql = 'UPDATE CLIENTES SET NAME = ?, TELEFONE = ?, ATIVO = ?, CONHECEU_ID = ?, OUTROSCONHECEU = ? WHERE ID = ?';
    let filtro = [req.body.name, req.body.telefone, req.body.ativo, req.body.conheceu_id, req.body.outrosconheceu, req.body.id];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});

//----------------------- Veiculos -------------------

//-----------------------Get Veiculos
app.get("/veiculos", function(req, res){
    let filtro = [];
    let ssql = 'SELECT * FROM VEICULOS WHERE 1=1';

    if(req.query.id){
        ssql += 'and id = ?';
        filtro.push(req.query.id); 
    }

    if(req.query.cliente_id){
        ssql += 'and cliente_id = ?';
        filtro.push(req.query.cliente_id); 
    }

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//-----------------------Insert Veiculos
app.post("/veiculos", function(req, res){

    let ssql = 'UPDATE OR INSERT INTO VEICULOS(PLACA,MODELO,CLIENTE_ID) VALUES (?,?,?) MATCHING (PLACA)';
    let filtro = [req.body.placa, req.body.modelo, parseInt(req.body.cliente_id)];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});


//----------------------- Produtos -------------------

//-----------------------Get Produtos
app.get("/produtos", function(req, res){
    let filtro = [];
    let ssql = 'SELECT  P.* '
    +',   PT.descricao AS DESCRICAOTIPO '
    +',   PM.descricao AS DESCRICAOMARCA '
    +',   PG.descricao AS DESCRICAOGRUPO '
    +' FROM PRODUTOS P '
    +' LEFT JOIN PRODUTOS_TIPO PT ON PT.ID = P.tipo_id '
    +' LEFT JOIN PRODUTOS_MARCA PM ON PM.id = P.marca_id '
    +' LEFT JOIN PRODUTOS_GRUPO PG ON PG.id = P.grupo_id '
    +' WHERE P.ATIVO = 1 '

    if(req.query.id){
        ssql += 'and p.id = ?';
        filtro.push(req.query.id); 
    }

    ssql += ' ORDER BY P.DESCRICAO'

    executeQuery(ssql, filtro, async function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//-----------------------Insert Produtos
app.post("/produtos", function(req, res){

    let ssql = 'INSERT INTO PRODUTOS(DESCRICAO,ATIVO,MARCA_ID,TIPO_ID,GRUPO_ID,VALORVENDA,VALORCUSTO,ESTOQUE,ESTOQUEMINIMO) VALUES (?,?,?,?,?,?,?,?,?) RETURNING ID';
    let filtro = [req.body.descricao, req.body.ativo, parseInt(req.body.marca_id), parseInt(req.body.tipo_id), parseInt(req.body.grupo_id), parseFloat(req.body.valorvenda), parseFloat(req.body.valorcusto), parseFloat(req.body.estoque), parseFloat(req.body.estoqueminimo)];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
        } else{
            res.status(201).json({id_user: result.ID})
        }
    });
});

//-----------------------Insert Produtos
app.post("/produtosnew", function(req, res){

    let ssql = 'INSERT INTO PRODUTOS(ID,DESCRICAO,ATIVO,MARCA_ID,TIPO_ID,GRUPO_ID,VALORVENDA,VALORCUSTO,ESTOQUE,ESTOQUEMINIMO) VALUES (?,?,?,?,?,?,?,?,?,?) RETURNING ID';
    let filtro = [parseInt(req.body.id), req.body.descricao, req.body.ativo, parseInt(req.body.marca_id), parseInt(req.body.tipo_id), parseInt(req.body.grupo_id), parseFloat(req.body.valorvenda), parseFloat(req.body.valorcusto), parseFloat(req.body.estoque), parseFloat(req.body.estoqueminimo)];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
        } else{
            res.status(201).json({id_user: result.ID})
        }
    });
});

//-----------------------Update Produtos
app.patch("/produtos", function(req, res){

    let ssql = 'UPDATE PRODUTOS SET DESCRICAO = ?,ATIVO  = ?,MARCA_ID = ?,TIPO_ID = ?,GRUPO_ID = ?,VALORVENDA = ?,VALORCUSTO = ?,ESTOQUE = ?,ESTOQUEMINIMO = ? WHERE ID = ?';
    let filtro = [req.body.descricao, req.body.ativo, parseInt(req.body.marca_id), parseInt(req.body.tipo_id), parseInt(req.body.grupo_id), parseFloat(req.body.valorvenda), parseFloat(req.body.valorcusto), parseFloat(req.body.estoque), parseFloat(req.body.estoqueminimo), req.body.id];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});

//-----------------------Get Servicos
app.get("/servicos", function(req, res){
    let filtro = [];
    let ssql = 'SELECT  * '
    +' FROM SERVICOS '
    +' WHERE ATIVO=1 '

    if(req.query.id){
        ssql += 'and id = ?';
        filtro.push(req.query.id); 
    }

    ssql += ' ORDER BY DESCRICAO'

    executeQuery(ssql, filtro, async function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//-----------------------Get Max Servicos
app.get("/maxservicos", function(req, res){
    let filtro = [];
    let ssql = 'SELECT MAX(ID) FROM SERVICOS'

    executeQuery(ssql, filtro, async function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//-----------------------Insert Servicos
app.post("/servicos", function(req, res){

    let ssql = 'INSERT INTO SERVICOS(DESCRICAO,VALORVENDA,ATIVO) VALUES (?,?,?) RETURNING ID';
    let filtro = [req.body.descricao, parseFloat(req.body.valorvenda),  req.body.ativo];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
        } else{
            res.status(201).json({id_user: result.ID})
        }
    });
});

//-----------------------Insert Servicos
app.post("/servicosnew", function(req, res){

    let ssql = 'INSERT INTO SERVICOS(ID,DESCRICAO,VALORVENDA,ATIVO) VALUES (?,?,?,?) RETURNING ID';
    let filtro = [parseInt(req.body.id),req.body.descricao, parseFloat(req.body.valorvenda),  req.body.ativo];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
        } else{
            res.status(201).json({id_user: result.ID})
        }
    });
});

//-----------------------Update Servicos
app.patch("/servicos", function(req, res){

    let ssql = 'UPDATE SERVICOS SET DESCRICAO = ?, VALORVENDA = ?, ATIVO  = ? WHERE ID = ?';
    let filtro = [req.body.descricao, parseFloat(req.body.valorvenda), req.body.ativo, req.body.id];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});

//-----------------------Get Servicos_ProdutosVinculados
app.get("/produtosvinculados", function(req, res){
    let ssql = 'SELECT P.ID, P.VALORVENDA, P.DESCRICAO, SP.QUANTIDADEVINCULADA, SP.SERVICO_ID FROM SERVICOS_PRODUTOSVINCULADOS SP LEFT JOIN PRODUTOS P ON SP.PRODUTO_ID = P.ID WHERE SP.SERVICO_ID = '+ req.query.servico_id
    let filtro = [];
    
    executeQuery(ssql, filtro, async function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//-----------------------Insert Servicos_ProdutosVinculados
app.post("/produtosvinculados", function(req, res){

    let ssql = 'INSERT INTO SERVICOS_PRODUTOSVINCULADOS(SERVICO_ID,PRODUTO_ID,QUANTIDADEVINCULADA) VALUES (?,?,?)';
    let filtro = [parseInt(req.body.servico_id), parseInt(req.body.produto_id), parseFloat(req.body.quantidadevinculada)];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json(result)
        }
    });
});

//-----------------------Insert Servicos_ProdutosVinculados
app.post("/produtosvinculadosnew", function(req, res){

    let ssql = 'INSERT INTO SERVICOS_PRODUTOSVINCULADOS(SERVICO_ID,PRODUTO_ID,QUANTIDADEVINCULADA) VALUES (?,?,?)';
    let filtro = [parseInt(req.body.servico_id), parseInt(req.body.produto_id), parseFloat(req.body.quantidadevinculada)];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json(result)
        }
    });
});

//-----------------------Delete Servicos_ProdutosVinculados
app.delete("/produtosvinculados", function(req, res){

    let ssql = 'DELETE FROM SERVICOS_PRODUTOSVINCULADOS WHERE SERVICO_ID = ?';
    let filtro = [parseInt(req.query.servico_id)];

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json(result)
        }
    });
});


//-----------------------Get PRODUTOS MARCA
app.get("/marcas", function(req, res){
    let filtro = [];
    let ssql = 'SELECT  * '
    +' FROM PRODUTOS_MARCA '

    if(req.query.id){
        ssql += 'and id = ?';
        filtro.push(req.query.id); 
    }

    ssql += ' ORDER BY ID'

    executeQuery(ssql, filtro, async function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//----------------------- Insert Produtos Marca
app.post("/marcas", function(req, res){  
    let ssql = 'INSERT INTO PRODUTOS_MARCA(DESCRICAO) VALUES (?)';
    let filtro = [req.body.descricao];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});

//-----------------------Get PRODUTOS TIPO
app.get("/tipoproduto", function(req, res){
    let filtro = [];
    let ssql = 'SELECT  * '
    +' FROM PRODUTOS_TIPO '

    if(req.query.id){
        ssql += 'and id = ?';
        filtro.push(req.query.id); 
    }

    ssql += ' ORDER BY ID'

    executeQuery(ssql, filtro, async function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//----------------------- Insert Produtos Tipo
app.post("/tipoproduto", function(req, res){  
    let ssql = 'INSERT INTO PRODUTOS_TIPO(DESCRICAO) VALUES (?)';
    let filtro = [req.body.descricao];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});

//-----------------------Get PRODUTOS_GRUPO
app.get("/grupos", function(req, res){
    let filtro = [];
    let ssql = 'SELECT  * '
    +' FROM PRODUTOS_GRUPO '

    if(req.query.id){
        ssql += 'and id = ?';
        filtro.push(req.query.id); 
    }

    ssql += ' ORDER BY ID'

    executeQuery(ssql, filtro, async function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//----------------------- Insert Produtos Grupo
app.post("/grupos", function(req, res){  
    let ssql = 'INSERT INTO PRODUTOS_GRUPO(DESCRICAO) VALUES (?)';
    let filtro = [req.body.descricao];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});



//----------------------- Vendas -------------------

//-----------------------Get Vendas
app.get("/vendas", function(req, res){
    let filtro = [];
    let ssql = 'SELECT V.*, CAST(V.OBSVENDA AS VARCHAR(240)) AS OBS, C.NAME, VE.PLACA, VE.MODELO FROM VENDAS V JOIN CLIENTES C ON C.ID = V.CLIENTE_ID LEFT JOIN VEICULOS VE ON VE.ID = V.VEICULO_ID WHERE 1=1 ';
    if(req.query.id){
        ssql += 'and id = ?';
        filtro.push(req.query.id);
    }
    if(req.query.data){
        //ssql += 'and name like ?';
        //filtro.push('%' + req.query.name + '%'); 
        ssql += 'and datajson = ?';
        filtro.push(req.query.data); 
    }

    ssql += ' ORDER BY V.ID '
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});


//-----------------------Get Ultima Venda
app.get("/ultimavenda", function(req, res){
    let filtro = [];
    let ssql = 'SELECT V.*, CAST(V.OBSVENDA AS VARCHAR(240)) AS OBS, C.NAME, VE.PLACA, VE.MODELO FROM VENDAS V JOIN CLIENTES C ON C.ID = V.CLIENTE_ID LEFT JOIN VEICULOS VE ON VE.ID = V.VEICULO_ID WHERE V.ID = (SELECT MAX(ID) FROM VENDAS)';

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//-----------------------Get Max Venda
app.get("/maxvenda", function(req, res){
    let filtro = [];
    let ssql = 'SELECT MAX(V.ID) FROM VENDAS V';

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//-----------------------Insert Vendas
app.post("/vendas", function(req, res){

    let ssql = 'INSERT INTO VENDAS(CLIENTE_ID,VEICULO_ID,DATA,DATAFORMATADA,DATAJSON,SUBTOTAL,DESCONTO,VALORTOTAL,CONDPG_ID,TAXA,PARCELA_ID,OBSVENDA) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) RETURNING ID';
    let filtro = [parseInt(req.body.cliente_id), parseInt(req.body.veiculo_id), req.body.data, req.body.dataformatada, req.body.datajson, parseFloat(req.body.subtotal), parseFloat(req.body.desconto), parseFloat(req.body.valortotal), parseInt(req.body.condpg_id), parseFloat(req.body.taxa), parseInt(req.body.parcela_id), req.body.obsvenda ];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({id_user: result.ID})
        }
    });
});

//-----------------------Insert Vendas
app.patch("/vendasnew", function(req, res){

    let ssql = 'UPDATE OR INSERT INTO VENDAS(ID,CLIENTE_ID,VEICULO_ID,DATA,DATAFORMATADA,DATAJSON,SUBTOTAL,DESCONTO,VALORTOTAL,CONDPG_ID,TAXA,PARCELA_ID,OBSVENDA, VALORTOTALLIQUIDO, DESCONTOOPERADORA) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) MATCHING (ID)';
    let filtro = [parseInt(req.body.id), parseInt(req.body.cliente_id), parseInt(req.body.veiculo_id), req.body.data, req.body.dataformatada, req.body.datajson, parseFloat(req.body.subtotal), parseFloat(req.body.desconto), parseFloat(req.body.valortotal), parseInt(req.body.condpg_id), parseFloat(req.body.taxa), parseInt(req.body.parcela_id), req.body.obsvenda, parseFloat(req.body.valortotalliquido), parseFloat(req.body.descontooperadora)];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({id_user: result})
        }
    });
});

//-----------------------Update Vendas
app.patch("/vendas", function(req, res){

    let ssql = 'UPDATE VENDAS SET CLIENTE_ID = ?, VEICULO_ID = ?, DATA = ?, DATAFORMATADA = ?, DATAJSON = ?, SUBTOTAL = ?, DESCONTO = ?, VALORTOTAL = ?, CONDPG_ID = ?, TAXA = ?, PARCELA_ID = ?, OBSVENDA = ?, VALORTOTALLIQUIDO = ?, DESCONTOOPERADORA = ? WHERE ID = ?';
    let filtro = [parseInt(req.body.cliente_id), parseInt(req.body.veiculo_id), req.body.data, req.body.dataformatada, req.body.datajson, parseFloat(req.body.subtotal), parseFloat(req.body.desconto), parseFloat(req.body.valortotal), parseInt(req.body.condpg_id), parseFloat(req.body.taxa), parseInt(req.body.parcela_id), req.body.obsvenda, parseFloat(req.body.valortotalliquido), parseFloat(req.body.descontooperadora), req.body.id];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});


//-----------------------Delete Vendas 
app.delete("/vendas", function(req, res){
    let ssql = 'DELETE FROM VENDAS WHERE 1=1 ';
    let filtro = [];

    if(req.query.id){
        ssql += ' and id = ? ';
        filtro.push(parseInt(req.query.id)); 
    }

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json(result)
        }
    });
});


//-----------------------Get Vendas Produtos
app.get("/vendasprodutos", function(req, res){
    let filtro = [];
    let ssql = 'SELECT VP.*, P.* FROM VENDAS_PRODUTOS VP JOIN PRODUTOS P ON P.ID = VP.PRODUTO_ID WHERE 1=1 ';
    if(req.query.venda_id){
        ssql += 'and venda_id = ?';
        filtro.push(req.query.venda_id); 
    }
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});

//-----------------------Insert Vendas Produtos
app.post("/vendasprodutos", function(req, res){

    let ssql = 'UPDATE OR INSERT INTO VENDAS_PRODUTOS(VENDA_ID, PRODUTO_ID, QUANTIDADE, VALORVENDA, TOTALPROD) VALUES (?,?,?,?,?) MATCHING (VENDA_ID, PRODUTO_ID)';
    let filtro = [parseInt(req.body.venda_id), parseInt(req.body.produto_id), parseFloat(req.body.quantidade), parseFloat(req.body.valorvenda), parseFloat(req.body.totalprod) ];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});

//-----------------------Delete Vendas Produtos
app.delete("/vendasprodutos", function(req, res){
    let ssql = 'DELETE FROM VENDAS_PRODUTOS WHERE 1=1 ';
    let filtro = [];

    if(req.query.venda_id){
        ssql += ' and venda_id = ? ';
        filtro.push(parseInt(req.query.venda_id)); 
    }

    if(req.query.produto_id){
        ssql += ' AND PRODUTO_ID = ? ';
        filtro.push(req.query.produto_id); 
    }

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json(result)
        }
    });
});

//-----------------------Get Vendas Servicos
app.get("/vendasservicos", function(req, res){
    let filtro = [];
    let ssql = 'SELECT VS.*, S.DESCRICAO, S.ID FROM VENDAS_SERVICOS VS JOIN SERVICOS S ON S.ID = VS.SERVICO_ID WHERE 1=1 ';
    if(req.query.venda_id){
        ssql += 'and venda_id = ?';
        filtro.push(req.query.venda_id); 
    }
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});

//-----------------------Insert Vendas Servicos
app.post("/vendasservicos", function(req, res){

    let ssql = 'UPDATE OR INSERT INTO VENDAS_SERVICOS(VENDA_ID, SERVICO_ID, QUANTIDADE, VALORVENDA, TOTALPROD) VALUES (?,?,?,?,?) MATCHING (VENDA_ID, SERVICO_ID)';
    let filtro = [parseInt(req.body.venda_id), parseInt(req.body.servico_id), parseFloat(req.body.quantidade), parseFloat(req.body.valorvenda), parseFloat(req.body.totalprod) ];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});

//-----------------------Delete Vendas Servicos
app.delete("/vendasservicos", function(req, res){
    let ssql = 'DELETE FROM VENDAS_SERVICOS WHERE 1=1 ';
    let filtro = [];

    if(req.query.venda_id){
        ssql += ' and venda_id = ? ';
        filtro.push(parseInt(req.query.venda_id)); 
    }

    if(req.query.servico_id){
        ssql += ' AND SERVICO_ID = ? ';
        filtro.push(req.query.servico_id); 
    }

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json(result)
        }
    });
});





//-----------------------Get condpg
app.get("/condpg", function(req, res){
    let filtro = [];
    let ssql = 'SELECT  * '
    +' FROM CONDPG WHERE 1=1 '

    if(req.query.id){
        ssql += 'and id = ?';
        filtro.push(req.query.id); 
    }

    ssql += ' ORDER BY ID'

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//-----------------------Get TAXAS
app.get("/taxas", function(req, res){
    let filtro = [];
    let ssql = 'SELECT  * '
    +' FROM TAXAS '

    if(req.query.id){
        ssql += 'and id = ?';
        filtro.push(req.query.id); 
    }

    ssql += ' ORDER BY ID'

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});


//-----------------------Update Taxas
app.patch("/taxas", function(req, res){

    let ssql = 'UPDATE TAXAS SET TAXA = ?, DESCONTO = ? WHERE ID = ?';
    let filtro = [parseFloat(req.body.taxa), parseFloat(req.body.desconto), req.body.id];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});


//-----------------------Get Receber
app.get("/receber", function(req, res){
    let filtro = [];
    let ssql = 'SELECT  R.*, C.NAME, CP.ID as CONDPG_ID, CP.DESCRICAO '
    +' FROM RECEBER R JOIN CLIENTES C ON C.ID = R.CLIENTE_ID JOIN CONDPG CP ON CP.ID = R.CONDPG_ID WHERE 1=1 '

    if(req.query.venda_id){
        ssql += ' and R.venda_id = ? ';
        filtro.push(req.query.venda_id); 
    }

    ssql += ' ORDER BY R.VENCIMENTO, R.PARCELA '

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//-----------------------Get Count Receber
app.get("/countreceber", function(req, res){
    let filtro = [];
    let ssql = 'SELECT COUNT(R.ID) FROM RECEBER R WHERE R.BAIXADO = 0 AND R.VENCIMENTO <= CURRENT_DATE'

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});


//-----------------------Insert Receber
app.post("/receber", function(req, res){

    let ssql = 'UPDATE OR INSERT INTO RECEBER(VENDA_ID, CLIENTE_ID, CONDPG_ID, DATA, DATAFORMATADA, DATAJSON, VENCIMENTO, VENCIMENTOFORMATADO, VENCIMENTOJSON, PARCELA, VALOR, BAIXADO, DATABAIXA, DATABAIXAFORMATADA, DATABAIXAJSON) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) MATCHING (VENDA_ID, PARCELA)';
    let filtro = [parseInt(req.body.venda_id), parseInt(req.body.cliente_id), parseInt(req.body.condpg_id), req.body.data, req.body.dataformatada, req.body.datajson, req.body.vencimento, req.body.vencimentoformatado, req.body.vencimentojson, parseInt(req.body.parcela), parseFloat(req.body.valor), parseInt(req.body.baixado), req.body.databaixa, req.body.databaixaformatada, req.body.databaixajson];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});

//-----------------------Update Receber
app.patch("/receber", function(req, res){

    let ssql = 'UPDATE RECEBER SET VENDA_ID = ?, CLIENTE_ID = ?, CONDPG_ID = ?, DATA = ?, DATAFORMATADA = ?, DATAJSON = ?, VENCIMENTO = ?, VENCIMENTOFORMATADO = ?, VENCIMENTOJSON = ?, PARCELA = ?, VALOR = ?, BAIXADO = ?, DATABAIXA = ?, DATABAIXAFORMATADA = ?, DATABAIXAJSON = ? WHERE ID = ?';
    let filtro = [parseInt(req.body.venda_id), parseInt(req.body.cliente_id), parseInt(req.body.condpg_id), req.body.data, req.body.dataformatada, req.body.datajson, req.body.vencimento, req.body.vencimentoformatado, req.body.vencimentojson, req.body.parcela, parseFloat(req.body.valor), parseInt(req.body.baixado), req.body.databaixa, req.body.databaixaformatada, req.body.databaixajson, parseInt(req.body.id)];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});


//-----------------------Delete Receber
app.delete("/receber", function(req, res){
    let ssql = 'DELETE FROM RECEBER WHERE 1=1 ';
    let filtro = [];

    if(req.query.venda_id){
        ssql += ' and venda_id = ? ';
        filtro.push(parseInt(req.query.venda_id)); 
    }

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json(result)
        }
    });
});

//-----------------------Get Compras
app.get("/compras", function(req, res){
    let filtro = [];
    let ssql = 'SELECT CO.*, CAST(CO.OBSCOMPRA AS VARCHAR(240)) AS OBS, C.NAME FROM COMPRAS CO JOIN CLIENTES C ON C.ID = CO.CLIENTE_ID WHERE 1=1';
    if(req.query.id){
        ssql += 'and id = ?';
        filtro.push(req.query.id); 
    }
    if(req.query.data){
        //ssql += 'and name like ?';
        //filtro.push('%' + req.query.name + '%'); 
        ssql += 'and datajson = ?';
        filtro.push(req.query.data); 
    }

    ssql += ' ORDER BY CO.ID '
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});


//-----------------------Get Ultima Compra
app.get("/ultimacompra", function(req, res){
    let filtro = [];
    let ssql = 'SELECT CO.*, CAST(CO.OBSCOMPRA AS VARCHAR(240)) AS OBS, C.NAME FROM COMPRAS CO JOIN CLIENTES C ON C.ID = CO.CLIENTE_ID WHERE CO.ID = (SELECT MAX(ID) FROM COMPRAS)';

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//-----------------------Insert Compras
app.post("/compras", function(req, res){

    let ssql = 'INSERT INTO COMPRAS(CLIENTE_ID, DATA,DATAFORMATADA,DATAJSON,SUBTOTAL,DESCONTO,VALORTOTAL,CONDPG_ID,TAXA,PARCELA_ID, OBSCOMPRA) VALUES (?,?,?,?,?,?,?,?,?,?,?) RETURNING ID';
    let filtro = [parseInt(req.body.cliente_id), req.body.data, req.body.dataformatada, req.body.datajson, parseFloat(req.body.subtotal), parseFloat(req.body.desconto), parseFloat(req.body.valortotal), parseInt(req.body.condpg_id), parseFloat(req.body.taxa), parseInt(req.body.parcela_id), req.body.obscompra];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({id_user: result.ID})
        }
    });
});

//-----------------------Insert Compras
app.post("/comprasnew", function(req, res){

    let ssql = 'INSERT INTO COMPRAS(ID,CLIENTE_ID, DATA,DATAFORMATADA,DATAJSON,SUBTOTAL,DESCONTO,VALORTOTAL,CONDPG_ID,TAXA,PARCELA_ID, OBSCOMPRA) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) RETURNING ID';
    let filtro = [parseInt(req.body.id), parseInt(req.body.cliente_id), req.body.data, req.body.dataformatada, req.body.datajson, parseFloat(req.body.subtotal), parseFloat(req.body.desconto), parseFloat(req.body.valortotal), parseInt(req.body.condpg_id), parseFloat(req.body.taxa), parseInt(req.body.parcela_id), req.body.obscompra];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({id_user: result.ID})
        }
    });
});


//-----------------------Update Compras
app.patch("/compras", function(req, res){

    let ssql = 'UPDATE COMPRAS SET CLIENTE_ID = ?, DATA = ?, DATAFORMATADA = ?, DATAJSON = ?, SUBTOTAL = ?, DESCONTO = ?, VALORTOTAL = ?, CONDPG_ID = ?, TAXA = ?, PARCELA_ID = ?, OBSCOMPRA = ? WHERE ID = ?';
    let filtro = [parseInt(req.body.cliente_id), req.body.data, req.body.dataformatada, req.body.datajson, parseFloat(req.body.subtotal), parseFloat(req.body.desconto), parseFloat(req.body.valortotal), parseInt(req.body.condpg_id), parseFloat(req.body.taxa), parseInt(req.body.parcela_id), req.body.obscompra, req.body.id];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});


//-----------------------Delete Compras 
app.delete("/compras", function(req, res){
    let ssql = 'DELETE FROM COMPRAS WHERE 1=1 ';
    let filtro = [];

    if(req.query.id){
        ssql += ' and id = ? ';
        filtro.push(parseInt(req.query.id)); 
    }

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json(result)
        }
    });
});

//-----------------------Get Compras Produtos
app.get("/comprasprodutos", function(req, res){
    let filtro = [];
    let ssql = 'SELECT CP.*, P.* FROM COMPRAS_PRODUTOS CP JOIN PRODUTOS P ON P.ID = CP.PRODUTO_ID WHERE 1=1 ';
    if(req.query.compra_id){
        ssql += 'and compra_id = ?';
        filtro.push(req.query.compra_id); 
    }
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});

//-----------------------Insert Compras Produtos
app.post("/comprasprodutos", function(req, res){

    let ssql = 'UPDATE OR INSERT INTO COMPRAS_PRODUTOS(COMPRA_ID, PRODUTO_ID, QUANTIDADE, VALORCUSTO, TOTALPROD) VALUES (?,?,?,?,?) MATCHING (COMPRA_ID, PRODUTO_ID)';
    let filtro = [parseInt(req.body.compra_id), parseInt(req.body.produto_id), parseFloat(req.body.quantidade), parseFloat(req.body.valorcusto), parseFloat(req.body.totalprod) ];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});

//-----------------------Delete Compras Produtos
app.delete("/comprasprodutos", function(req, res){
    let ssql = 'DELETE FROM COMPRAS_PRODUTOS WHERE 1=1 ';
    let filtro = [];

    if(req.query.compra_id){
        ssql += ' and compra_id = ? ';
        filtro.push(parseInt(req.query.compra_id)); 
    }

    if(req.query.produto_id){
        ssql += ' AND PRODUTO_ID = ? ';
        filtro.push(req.query.produto_id); 
    }

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json(result)
        }
    });
});

//-----------------------Get Pagar
app.get("/pagar", function(req, res){
    let filtro = [];
    let ssql = 'SELECT  P.*, cast(p.obs as varchar(50))as obs, C.NAME, PT.DESCRICAO '
    +' FROM PAGAR P JOIN CLIENTES C ON C.ID = P.CLIENTE_ID JOIN CONDPG CP ON CP.ID = P.CONDPG_ID JOIN PAGAR_TIPO PT ON PT.ID = P.PAGAR_TIPO_ID WHERE 1=1 '

    if(req.query.compra_id){
        ssql += ' and P.compra_id = ? ';
        filtro.push(req.query.compra_id); 
    }

    ssql += ' ORDER BY P.VENCIMENTO, P.DATABAIXA '

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});



//-----------------------Get Filtro Pagas
app.post("/filtropagas", function(req, res){
    let filtro = [];
    let ssql = 'SELECT  P.*, cast(p.obs as varchar(50))as obs, C.NAME, PT.DESCRICAO '
    +' FROM PAGAR P JOIN CLIENTES C ON C.ID = P.CLIENTE_ID JOIN CONDPG CP ON CP.ID = P.CONDPG_ID JOIN PAGAR_TIPO PT ON PT.ID = P.PAGAR_TIPO_ID WHERE 1=1 '

    if(req.body.cliente){
        ssql += ' and P.cliente_id = ? ';
        filtro.push(parseInt(req.body.cliente)); 
    }

    if(req.body.tipopagar){
        ssql += ' and P.pagar_tipo_id = ? ';
        filtro.push(parseInt(req.body.tipopagar)); 
    }

    if(req.body.dataini){
        ssql += ' and P.data between ? and ?  ';
        filtro.push(req.body.dataini); 
        filtro.push(req.body.datafim); 
    }

    if(req.body.vencimentoini){
        ssql += ' and P.vencimento between ? and ?  ';
        filtro.push(req.body.vencimentoini); 
        filtro.push(req.body.vencimentofim); 
    }

    if(req.body.baixaini){
        ssql += ' and P.databaixa between ? and ?  ';
        filtro.push(req.body.baixaini); 
        filtro.push(req.body.baixafim); 
    }

    ssql += ' AND BAIXADO = 1 '

    ssql += ' ORDER BY P.VENCIMENTO, P.DATABAIXA '

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//-----------------------Get Filtro Pagar
app.post("/filtropagar", function(req, res){
    let filtro = [];
    let ssql = 'SELECT  P.*, cast(p.obs as varchar(50))as obs, C.NAME, PT.DESCRICAO '
    +' FROM PAGAR P JOIN CLIENTES C ON C.ID = P.CLIENTE_ID JOIN CONDPG CP ON CP.ID = P.CONDPG_ID JOIN PAGAR_TIPO PT ON PT.ID = P.PAGAR_TIPO_ID WHERE 1=1 '

    if(req.body.cliente){
        ssql += ' and P.cliente_id = ? ';
        filtro.push(parseInt(req.body.cliente)); 
    }

    if(req.body.tipopagar){
        ssql += ' and P.pagar_tipo_id = ? ';
        filtro.push(parseInt(req.body.tipopagar)); 
    }

    if(req.body.dataini){
        ssql += ' and P.data between ? and ?  ';
        filtro.push(req.body.dataini); 
        filtro.push(req.body.datafim); 
    }

    if(req.body.vencimentoini){
        ssql += ' and P.vencimento between ? and ?  ';
        filtro.push(req.body.vencimentoini); 
        filtro.push(req.body.vencimentofim); 
    }

    ssql += ' AND BAIXADO = 0 '

    ssql += ' ORDER BY P.VENCIMENTO, P.DATABAIXA '

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//----------------------- Get Filtro Receber
app.post("/filtroreceber", function(req, res){
    let filtro = [];
    let ssql = 'SELECT  R.*, C.NAME, CP.ID as CONDPG_ID, CP.DESCRICAO '
    +' FROM RECEBER R JOIN CLIENTES C ON C.ID = R.CLIENTE_ID JOIN CONDPG CP ON CP.ID = R.CONDPG_ID WHERE 1=1 '

    if(req.body.cliente){
        ssql += ' and R.cliente_id = ? ';
        filtro.push(parseInt(req.body.cliente)); 
    }

    if(req.body.dataini){
        ssql += ' and R.data between ? and ?  ';
        filtro.push(req.body.dataini); 
        filtro.push(req.body.datafim); 
    }

    if(req.body.vencimentoini){
        ssql += ' and R.vencimento between ? and ?  ';
        filtro.push(req.body.vencimentoini); 
        filtro.push(req.body.vencimentofim); 
    }

    ssql += ' AND BAIXADO = 0 '

    ssql += ' ORDER BY R.VENCIMENTO, R.PARCELA '

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//----------------------- Get Filtro Recebidas
app.post("/filtrorecebidas", function(req, res){
    let filtro = [];
    let ssql = 'SELECT  R.*, C.NAME, CP.ID as CONDPG_ID, CP.DESCRICAO '
    +' FROM RECEBER R JOIN CLIENTES C ON C.ID = R.CLIENTE_ID JOIN CONDPG CP ON CP.ID = R.CONDPG_ID WHERE 1=1 '

    if(req.body.cliente){
        ssql += ' and R.cliente_id = ? ';
        filtro.push(parseInt(req.body.cliente)); 
    }

    if(req.body.dataini){
        ssql += ' and R.data between ? and ?  ';
        filtro.push(req.body.dataini); 
        filtro.push(req.body.datafim); 
    }

    if(req.body.vencimentoini){
        ssql += ' and R.vencimento between ? and ?  ';
        filtro.push(req.body.vencimentoini); 
        filtro.push(req.body.vencimentofim); 
    }

    if(req.body.baixaini){
        ssql += ' and R.databaixa between ? and ?  ';
        filtro.push(req.body.baixaini); 
        filtro.push(req.body.baixafim); 
    }

    ssql += ' AND BAIXADO = 1 '

    ssql += ' ORDER BY R.VENCIMENTO, R.PARCELA '

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});

//-----------------------Get Count Pagar
app.get("/countpagar", function(req, res){
    let filtro = [];
    let ssql = 'SELECT COUNT(P.ID) FROM PAGAR P WHERE P.BAIXADO = 0 AND P.VENCIMENTO <= CURRENT_DATE'

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err)
        } else{
            res.status(200).json(result);
        }
    })
});


//-----------------------Insert Pagar
app.post("/pagar", function(req, res){

    let ssql = 'UPDATE OR INSERT INTO PAGAR(COMPRA_ID, CLIENTE_ID, CONDPG_ID, DATA, DATAFORMATADA, DATAJSON, VENCIMENTO, VENCIMENTOFORMATADO, VENCIMENTOJSON, PARCELA, VALOR, BAIXADO, DATABAIXA, DATABAIXAFORMATADA, DATABAIXAJSON, PAGAR_TIPO_ID, OBS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) MATCHING (COMPRA_ID, PARCELA)';
    let filtro = [parseInt(req.body.compra_id), parseInt(req.body.cliente_id), parseInt(req.body.condpg_id), req.body.data, req.body.dataformatada, req.body.datajson, req.body.vencimento, req.body.vencimentoformatado, req.body.vencimentojson, parseInt(req.body.parcela), parseFloat(req.body.valor), parseInt(req.body.baixado), req.body.databaixa, req.body.databaixaformatada, req.body.databaixajson, parseInt(req.body.pagar_tipo_id), req.body.obs] ;
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result});
        }
    });
});

//-----------------------Insert Pagar
app.post("/pagarnew", function(req, res){

    let ssql = ' INSERT INTO PAGAR(COMPRA_ID, CLIENTE_ID, CONDPG_ID, DATA, DATAFORMATADA, DATAJSON, VENCIMENTO, VENCIMENTOFORMATADO, VENCIMENTOJSON, PARCELA, VALOR, BAIXADO, DATABAIXA, DATABAIXAFORMATADA, DATABAIXAJSON, PAGAR_TIPO_ID, OBS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
    let filtro = [parseInt(req.body.compra_id), parseInt(req.body.cliente_id), parseInt(req.body.condpg_id), req.body.data, req.body.dataformatada, req.body.datajson, req.body.vencimento, req.body.vencimentoformatado, req.body.vencimentojson, parseInt(req.body.parcela), parseFloat(req.body.valor), parseInt(req.body.baixado), req.body.databaixa, req.body.databaixaformatada, req.body.databaixajson, parseInt(req.body.pagar_tipo_id), req.body.obs] ;
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result});
        }
    });
});

//-----------------------Insert Pagar Parcial
app.post("/pagarparcial", function(req, res){

    let ssql = 'INSERT INTO PAGAR(COMPRA_ID, CLIENTE_ID, CONDPG_ID, DATA, DATAFORMATADA, DATAJSON, VENCIMENTO, VENCIMENTOFORMATADO, VENCIMENTOJSON, PARCELA, VALOR, BAIXADO, DATABAIXA, DATABAIXAFORMATADA, DATABAIXAJSON, PAGAR_TIPO_ID, OBS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    let filtro = [parseInt(req.body.compra_id), parseInt(req.body.cliente_id), parseInt(req.body.condpg_id), req.body.data, req.body.dataformatada, req.body.datajson, req.body.vencimento, req.body.vencimentoformatado, req.body.vencimentojson, parseInt(req.body.parcela), parseFloat(req.body.valor), parseInt(req.body.baixado), req.body.databaixa, req.body.databaixaformatada, req.body.databaixajson, parseInt(req.body.pagar_tipo_id), req.body.obs] ;
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});

//-----------------------Insert Receber Parcial
app.post("/receberparcial", function(req, res){

    let ssql = 'INSERT INTO RECEBER(VENDA_ID, CLIENTE_ID, CONDPG_ID, DATA, DATAFORMATADA, DATAJSON, VENCIMENTO, VENCIMENTOFORMATADO, VENCIMENTOJSON, PARCELA, VALOR, BAIXADO, DATABAIXA, DATABAIXAFORMATADA, DATABAIXAJSON) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    let filtro = [parseInt(req.body.venda_id), parseInt(req.body.cliente_id), parseInt(req.body.condpg_id), req.body.data, req.body.dataformatada, req.body.datajson, req.body.vencimento, req.body.vencimentoformatado, req.body.vencimentojson, parseInt(req.body.parcela), parseFloat(req.body.valor), parseInt(req.body.baixado), req.body.databaixa, req.body.databaixaformatada, req.body.databaixajson];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});

//-----------------------Update Pagar
app.patch("/pagar", function(req, res){

    let ssql = 'UPDATE PAGAR SET COMPRA_ID = ?, CLIENTE_ID = ?, CONDPG_ID = ?, DATA = ?, DATAFORMATADA = ?, DATAJSON = ?, VENCIMENTO = ?, VENCIMENTOFORMATADO = ?, VENCIMENTOJSON = ?, PARCELA = ?, VALOR = ?, BAIXADO = ?, DATABAIXA = ?, DATABAIXAFORMATADA = ?, DATABAIXAJSON = ?,  PAGAR_TIPO_ID = ?, OBS = ? WHERE ID = ?';
    let filtro = [parseInt(req.body.compra_id), parseInt(req.body.cliente_id), parseInt(req.body.condpg_id), req.body.data, req.body.dataformatada, req.body.datajson, req.body.vencimento, req.body.vencimentoformatado, req.body.vencimentojson, req.body.parcela, parseFloat(req.body.valor), parseInt(req.body.baixado), req.body.databaixa, req.body.databaixaformatada, req.body.databaixajson, parseInt(req.body.pagar_tipo_id), req.body.obs, parseInt(req.body.id)];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});

//-----------------------Delete Pagar
app.delete("/pagar", function(req, res){
    let ssql = 'DELETE FROM PAGAR WHERE 1=1 ';
    let filtro = [];

    if(req.query.id){
        ssql += ' and id = ? ';
        filtro.push(parseInt(req.query.id)); 
    }

    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json(result)
        }
    });
});

//----------------------- Get Pagar Tipo
app.get("/pagartipo", function(req, res){
    let filtro = [];
    let ssql = 'SELECT * FROM PAGAR_TIPO WHERE 1=1 ';
    if(req.query.id){
        ssql += 'and id = ?';
        filtro.push(req.query.id); 
    }
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});

//----------------------- Insert Pagar Tipo
app.post("/pagartipo", function(req, res){  
    let ssql = 'INSERT INTO PAGAR_TIPO(DESCRICAO) VALUES (?)';
    let filtro = [req.body.descricao];
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).send(err + '');
            console.log(err);
        } else{
            res.status(201).json({result})
        }
    });
});


//------------------- Relatorios ------------------

//----------------------- Get Vendas do Dia
app.get("/vendasdodia", function(req, res){
    let filtro = [];
    let ssql = ' select * from vendas v where v.data = ? order by id desc ';

    filtro.push(req.query.data); 
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});

//----------------------- Get Produtos Vendas do Dia
app.get("/produtosdodia", function(req, res){
    let filtro = [];
    let ssql = ' select first 4 p.id, p.descricao, sum(vp.quantidade) as quantidade from vendas v join vendas_produtos vp on vp.venda_id = v.id join produtos p on p.id = vp.produto_id where v.data = ? group by 1,2 order by 3 desc ';

    filtro.push(req.query.data); 
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});


//----------------------- Get Compras do Dia
app.get("/comprasdodia", function(req, res){
    let filtro = [];
    let ssql = ' select * from compras c where c.data = ? order by id desc ';

    filtro.push(req.query.data); 
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});

//----------------------- Get Produtos Compras do Dia
app.get("/produtosdodiacompras", function(req, res){
    let filtro = [];
    let ssql = ' select first 4 p.id, p.descricao, sum(cp.quantidade) as quantidade from compras c join compras_produtos cp on cp.compra_id = c.id join produtos p on p.id = cp.produto_id where c.data = ? group by 1,2 order by 3 desc ';

    filtro.push(req.query.data); 
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});


//----------------------- Get Pagar Mensal por Tipo
app.get("/pagarmensalportipo", function(req, res){
    let filtro = [];
    let ssql = ' select pt.descricao, sum(p.valor) as valor from pagar p join pagar_tipo pt on pt.id = p.pagar_tipo_id where extract(month from p.databaixa) = ? group by 1 ';

    filtro.push(req.query.mes); 
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});

//----------------------- Get Receber Mensal por CondPG
app.get("/recebermensalportipo", function(req, res){
    let filtro = [];
    let ssql = ' select c.descricao, sum(r.valor) as valor from receber r join condpg c on c.id = r.condpg_id where extract(month from r.databaixa) = ? group by 1 ';

    filtro.push(req.query.mes); 
    
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});


//-----------------------Get Vendas Rel
app.get("/vendasrel", function(req, res){
    let filtro = [];
    let ssql = 'SELECT V.*, CAST(V.OBSVENDA AS VARCHAR(240)) AS OBS, C.NAME, VE.PLACA, VE.MODELO FROM VENDAS V JOIN CLIENTES C ON C.ID = V.CLIENTE_ID LEFT JOIN VEICULOS VE ON VE.ID = V.VEICULO_ID WHERE 1=1 ';
   
    if(req.query.dataini && req.query.datafim){
        //ssql += 'and name like ?';
        //filtro.push('%' + req.query.name + '%'); 
        ssql += ' and data between ? and ? ';
        filtro.push(req.query.dataini,req.query.datafim);
    }

    ssql += ' ORDER BY V.DATA '
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});

//-----------------------Get Vendas Produtos Rel
app.get("/vendasprodutosrel", function(req, res){
    let filtro = [];
    let ssql = 'select  p.id, p.descricao, sum(vp.quantidade) as quantidade from vendas v join vendas_produtos vp on vp.venda_id = v.id join produtos p on p.id = vp.produto_id where 1=1  ';
   
    if(req.query.dataini && req.query.datafim){
        //ssql += 'and name like ?';
        //filtro.push('%' + req.query.name + '%'); 
        ssql += ' and v.data between ? and ? ';
        filtro.push(req.query.dataini,req.query.datafim); 
    }

    ssql += ' group by 1,2 order by 3 desc '
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});

//-----------------------Get Pagar Rel
app.get("/pagarrel", function(req, res){
    let filtro = [];
    let ssql = 'SELECT  P.*, cast(p.obs as varchar(50))as obs, C.NAME, PT.DESCRICAO '
    +' FROM PAGAR P JOIN CLIENTES C ON C.ID = P.CLIENTE_ID JOIN CONDPG CP ON CP.ID = P.CONDPG_ID JOIN PAGAR_TIPO PT ON PT.ID = P.PAGAR_TIPO_ID WHERE 1=1 '

    if(req.query.dataini && req.query.datafim){
        //ssql += 'and name like ?';
        //filtro.push('%' + req.query.name + '%'); 
        ssql += ' and p.databaixa between ? and ? ';
        filtro.push(req.query.dataini,req.query.datafim); 
    }

    //ssql += ' group by 1,2 order by 3 desc '
    executeQuery(ssql, filtro, function(err, result){
        if(err){
            res.status(500).json(err);
            console.log(err);
        } else{
            res.status(200).json(result)
        }
    }); 
});

//----------------------- FIM Listen -----------------
app.listen(5001, function(){
    console.log('Banco de Dados no Ar Porta 5001');
})