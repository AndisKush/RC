import "./Botao.css";

const Botao = ({props, type, onClick = () => {}, count}) => {


    return (
        
            <div>
                { String(type) === 'confirm' ?
                    <div className='button' >
                        <div className='buttonConfirm' onClick={onClick}>
                                {props}
                        </div>
                    </div>
                 :
                 null
                 }


                { String(type) === 'cancel' ?
                    <div className='button' >
                        <div className='buttonCancel' onClick={onClick}>
                                {props}
                        </div>
                    </div>
                 :
                 null
                 }


                { String(type) === 'MenuFinanceiro' ?
                    <div className='button' >
                        <div className='buttonMenuFinanceiro' onClick={onClick}>
                                {props}
                                <div className="notification">
                                    {parseFloat(count) > 0 ? " " + count + " " : null}
                                </div>
                        </div>
                    </div>
                 :
                 null
                 }

                { String(type) === 'MenuFinanceiroSelecionado' ?
                    <div className='button' >
                        <div className='buttonMenuFinanceiroSelecionado' onClick={onClick}>
                                {props}
                                <div className="notification">
                                    {parseFloat(count) > 0 ? " " + count + " " : null}
                                </div>
                        </div>
                    </div>
                 :
                 null
                 }


                { String(type) === 'Baixar' ?
                    <div className='button' >
                        <div className='buttonBaixar' onClick={onClick}>
                                {props}
                        </div>
                    </div>
                 :
                 null
                 }

                { String(type) === 'add' ?
                    <div className='button' >
                        <div className='buttonAdd' onClick={onClick}>
                                {props}
                        </div>
                    </div>
                 :
                 null
                }

                { String(type) === 'add2' ?
                    <div className='button' >
                        <div className='buttonAdd2' onClick={onClick}>
                                {props}
                        </div>
                    </div>
                 :
                 null
                }

                { String(type) === 'Remove' ?
                    <div className='button' >
                        <div className='buttonRemove' onClick={onClick}>
                                {props}
                        </div>
                    </div>
                 :
                 null
                 }  


                { String(type) === 'buttonRelatorios' ?
                    <div className='button' >
                        <div className='buttonRelatorios' onClick={onClick}>
                                {props}
                        </div>
                    </div>
                 :
                 null
                 }

                { String(type) === 'buttonRelatoriosSelecionado' ?
                    <div className='button' >
                        <div className='buttonRelatoriosSelecionado' onClick={onClick}>
                                {props}
                        </div>
                    </div>
                 :
                 null
                 }
            </div>
       
    )
}

export default Botao;