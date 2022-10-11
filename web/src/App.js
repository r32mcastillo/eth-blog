import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useTruncatedAddress from './hooks/useTruncatedAddress';
import { toast } from 'react-toastify';
import './App.css';
import { connector } from './config/web3';
import { abi, address } from './config/artifacts/smartContratArtifact';
const aPrevent = (e) => {
    e.preventDefault();
    toast.error('Demo', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}
function App() {
    const { active, activate, deactivate, account, error, library, chainId } = useWeb3React();
    const isUnsupportedChain = error instanceof UnsupportedChainIdError;
    const truncatedAddress = useTruncatedAddress(account);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(account);
    const [newMessage, setNewMessage] = useState("");
    const [nickName, setNickName] = useState("");
    

    const connect = useCallback(
        (e) => {
            e?.preventDefault();
            activate(connector);
            localStorage.setItem("previouslyConnected", "true");
        }, [activate]
    );
    const disconect = (e) => {
        e?.preventDefault();
        deactivate();
        localStorage.removeItem("previouslyConnected");
    }
    /** get Contract */
    const contract = useMemo(
        () => {
            if (active) return new library.eth.Contract(abi, address[chainId]);
        }, [activate, chainId, library?.eth?.Contract]
    );
    const getAllItems = useCallback(
        async () => {
            if (contract) {
                const allItems = await contract.methods.getAllItems().call();
                console.log('allItems------------');
                console.log(allItems);
                setMessages(allItems);
            }
        }, [contract, account]
    );
    const getItemsByAddress = useCallback(
        async (address = null) => {
            if (contract) {
                if (library.utils.isAddress(address)) {
                    let items = await contract.methods.getByAddress(address).call();
                    console.log('====getByAddress');
                    console.log(items);
                    setMessages(items);
                    console.log('====================================');
                }
            }
        }, [contract, account]
    );
    const getAllUsers = useCallback(
        async () => {
            if (contract) {
                const u = await contract.methods.getAllUsers().call();
                console.log('usuarios');
                console.log(u);
                console.log('====================================');
                setUsers(u);
                setNickName(getAutor(account));
            }
        }, [contract, account]
    )
    const addLikeContract = (id) => {
        contract.methods.addLike(id)
            .send({ from: account })
            .on("transactionHash", (txHash) => {
                console.log("Transacción enviada");
                toast.info('Transacción enviada', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .on("receipt", () => {
                console.log("Transacción confirmada");
                getAllItems();
                toast.success('Transacción confirmada', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .on("error", (error) => {
                console.error("Transacción fallida");
                toast.error('Transacción fallida', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });

    }
    const updateNickName = (nick) => {
        contract.methods.updateNickName(nick)
            .send({ from: account })
            .on("transactionHash", (txHash) => {
                console.log("Transacción enviada");
                toast.info('Transacción enviada', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .on("receipt", () => {
                console.log("Transacción confirmada");
                getAllUsers();
                toast.success('Transacción confirmada', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .on("error", (error) => {
                console.error("Transacción fallida");
                toast.error('Transacción fallida', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });

    }
    const saveMessage = (msg) => {
        contract.methods.addItem(msg)
            .send({ from: account })
            .on("transactionHash", (txHash) => {
                console.log("Transacción enviada");
                toast.info('Transacción enviada', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .on("receipt", () => {
                console.log("Transacción confirmada");
                getItemsByAddress(account);
                getAllUsers();
                toast.success('Transacción confirmada', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .on("error", (error) => {
                console.error("Transacción fallida");
                toast.error('Transacción fallida', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    }
    const seeMessageUser = (event, address) => {
        event.preventDefault();
        setUser(address);
        getItemsByAddress(address);
    }
    useEffect(
        () => {
            if (localStorage.getItem("previouslyConnected") === "true") {
                connect();
                getAllItems();
                getAllUsers();
                getItemsByAddress(user);
            }
        }, [connect]
    );

    const handleChangeMessage = (event) => {
        setNewMessage(event.target.value);
    }
    const sendMessage = (event) => {
        event.preventDefault();
        if (newMessage.length > 0) {
            saveMessage(newMessage);
        } else {

        }
    }

    const handleChangeChangeName = (event) => {
        setNickName(event.target.value);
    }
    const changeName = (event) => {
        event.preventDefault();
        if (nickName.length > 0) {
            updateNickName(nickName);
        } else {

        }
    }
    const getAutor = (address) => {
        return users.find((e) => e.owner == address)?.name;
    }
    const addLike = (id) => {
        addLikeContract(id)
    }
    return (
        <>
            <div className="contenedor">
                <header className="main-header">
                    <nav className="navbar__content">
                        <div className="navbar-left">
                            <img className="logo" src="https://raw.githubusercontent.com/r32mcastillo/reactpractico/main/src/assets/logos/log.png" alt="logo" />
                            <ul>
                                <li><a href="/" onClick={aPrevent}>principal</a></li>
                                <li><a href="/" onClick={aPrevent}>fotos</a></li>
                                <li><a href="/" onClick={(event) => { event.preventDefault(); getAllUsers() }}>Usuarios</a></li>
                                <li><a href="/" onClick={(event) => { event.preventDefault(); getAllItems() }}>Mesajes</a></li>
                            </ul>
                        </div>
                        <div className="navbar-right">
                            {
                                isUnsupportedChain ?
                                    <ul>
                                        <li>Red No Soportada , Cambiar a la tesnet Goerli</li>
                                    </ul>
                                    :
                                    <ul>
                                        {
                                            !active && <li><a href="/" onClick={connect}>Conectar</a></li>
                                        }
                                        {
                                            active &&
                                            <>
                                                <li><a href="/">{truncatedAddress}</a></li>
                                                <li><a href="/" onClick={disconect}>Desconectar</a></li>
                                            </>
                                        }
                                    </ul>
                            }
                        </div>
                    </nav>
                </header>
                {!active ?
                <section className="main-container" style={{"grid-template-columns":"100%"}}>
                    <div>
                    <h1>Blog</h1>
                    <h3>
                        Conecta con tu metamask a la tesnet de Goerli y deja algunos mensajes =)
                    </h3>
                    <img className='imgdemo' src='https://raw.githubusercontent.com/r32mcastillo/eth-blog/master/web/src/demo.png' />

                    </div>
                </section>
                :
                <section className="main-container">
                    <div className="users">
                        <h2>Usuarios</h2>
                        <ul>
                            {
                                users.map(({ name, owner }) => (
                                    <li>
                                        <a href='' onClick={(e) => { seeMessageUser(e, owner) }}>{name}</a>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="messages">
                        <form onSubmit={changeName}>
                            <label>
                                Cambiar Nombre de Usuario:
                                <input type="text" value={nickName} onChange={handleChangeChangeName} />
                            </label>
                            <input type="submit" value="Enviar" />
                        </form>
                            <br/>
                        <form onSubmit={sendMessage}>
                            <label>
                                Que estas pensando :
                                <input type="text" onChange={handleChangeMessage} />
                            </label>
                            <input type="submit" value="Enviar" />
                        </form>
                            <br/>
                            <br/>

                        {messages.map(e => (e)).reverse().map(
                            ({ message, likes, owner, id, date }) => (
                                <div className='message'>
                                    <p>{`${new Date(+date)}`}</p>
                                    <p>{`${message}`}</p>
                                    <div className='message-footer'>
                                        <span>Autor: {getAutor(owner)}</span>
                                        <span onClick={() => { addLike(id) }}>&#128077; {likes>0 && likes}</span>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* <div className="ProductList">
                        <div className="ProductItem">
                            <img src="" alt="" />
                            <div className="product-info">hola</div>
                        </div>
                        <div className="ProductItem">
                            <img src="" alt="" />
                            <div className="product-info">hola</div>
                        </div>
                        <div className="ProductItem">
                            <img src="" alt="" />
                            <div className="product-info">hola</div>
                        </div>
                        <div className="ProductItem">
                            <img src="" alt="" />
                            <div className="product-info">hola</div>
                        </div>
                    </div> */}
                </section>
                }
                <footer className="main-footer">
                    <p className="algorr">Desarrollado por: Miguel Castillo</p>
                    <ul>
                        <li>
                            <a href="https://r32mcastillo.github.io/">
                                <svg style={{ fill: 'white', width: '26px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c.2 35.5-28.5 64.3-64 64.3H128.1c-35.3 0-64-28.7-64-64V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24zM352 224c0-35.3-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64zm-96 96c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80H256z" /></svg>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/in/miguel-castillo-cortes/">
                                <svg style={{ fill: 'white', width: '22px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" /></svg>
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/r32mcastillo">
                                <svg style={{ fill: 'white', width: '30px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" /></svg>
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/r32mcastillo/eth-blog">
                                <svg style={{ fill: 'white', width: '30px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M64 96c0-35.3 28.7-64 64-64H512c35.3 0 64 28.7 64 64V352H512V96H128V352H64V96zM0 403.2C0 392.6 8.6 384 19.2 384H620.8c10.6 0 19.2 8.6 19.2 19.2c0 42.4-34.4 76.8-76.8 76.8H76.8C34.4 480 0 445.6 0 403.2zM281 209l-31 31 31 31c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-48-48c-9.4-9.4-9.4-24.6 0-33.9l48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9zM393 175l48 48c9.4 9.4 9.4 24.6 0 33.9l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l31-31-31-31c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z" /></svg>
                            </a>
                        </li>
                    </ul>
                </footer>
            </div>

            <section className="loader">
                <div></div>
                <div></div>
                <div></div>
            </section>
        </>
    );
}

export default App;
