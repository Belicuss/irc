import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";
import { getDisplayName } from "next/dist/next-server/lib/utils";
const events = require("../event.json");

export default function Blah() {
    const [messages, setMessages] = useState([]);
    const [chat, setChat] = useState([]);
    const [users, setUsers] = useState([]);
    const [nickname, setNickname] = useState('');
    const [showForm, setShowForm] = useState(true);
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on(events.user.new, getUsers => {
                console.log(getUsers);
                setUsers(getUsers);
            });
            socket.on(events.message.new, message => {
                setMessages(messages => [...messages, { nickname: message.nickname, chat: message.chat, id: message.id }])
            })
        }
    }, [socket]);

    function submit(e) {
        e.preventDefault();
        socket && socket.emit(events.user.new, {
            id: new Date().getTime(),
            value: nickname
        });
        setShowForm(false);
    }
    /*     function insereMessage(pseudo, message) {
            $('#zone_chat').prepend('<p><strong>' + pseudo + '</strong> ' + message + '</p>');
        } */
    function submitchat(e) {
        e.preventDefault();
        socket && socket.emit(events.message.new, {
            chat
        })
        console.log(chat);
    }
    // console.log(messages);
    /* console.log(nickname); */
    return (
        <div>
            {showForm === true && (
                <div>
                    <div className="flex-container-acceuil">
                        <label>Choose your new pseudo </label>
                    </div>
                    <hr className="hr" />

                    <form onSubmit={submit}>
                        <input
                            className="field"
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                        />
                        <button className="button">submit</button>
                    </form>
                </div>


            )
            }
            {
                showForm === false && (
                    <div className="flex-container">
                        <div id="channels">
                            Channels
                        <hr />
                        </div>

                        <div id="message">
                            Le channel actuel
                        <hr />
                            {messages.map(message => (
                                <p key={message.id}>{message.nickname}: {message.chat}</p>
                            ))}
                            <div className="form-message">
                                <form className="form-message" onSubmit={submitchat}>
                                    <input
                                        value={chat}
                                        onChange={e => setChat(e.target.value)}
                                    />
                                    <button id="button">submit</button>
                                </form>
                            </div>
                        </div>
                        <div id="user">
                            Membres
                        {users.map(usr => (
                            <p key={usr.id}>{usr.nickname}</p>
                        ))}
                            <hr />
                        </div>
                    </div>
                )
            }
            <style jsx> {`
             body {
                margin: 0;
                padding: 0;
                font-size: 18px;
                font-weight: 400;
                line-height: 1.8;
                color: #333;
                font-family: sans-serif;
            }

            .button {
                background-color: #393e46; 
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
              }
            .field {

                margin-top: 1%;
                margin-left: 42%;
                width: 15%;
                height: 56px;
                border-radius: 4px;
                position: relative;
                background-color: #eeeeee;
                transition: 0.3s all;
            }
            .field:hover {
                background-color: rgba(255, 255, 255, 0.45);
                box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);
            }
            .flex-container-acceuil{
                    display: flex;
                    font-size: 130px;
                    justify-content: space-around;
                    margin-top: 10%;
                }
                .hr {
                    width: 13%;
                    margin: auto;
                    padding-bottom: 0.3%;
                    background-color: black;
                }
                
                .flex-container {
                        display: flex;
                        justify-content: space-around;
                }
                .flex-container > div {
                      width: 100%;
                      margin: 10px 0 0 0;
                      text-align: center;
                      border-left : solid 1px grey;
                  }
            `}
            </style>
            <style jsx global>{`
        * {
          padding: 0;
          margin: 0;
          box-sizing: border-box;
        }
      `}</style>
        </div >
    );
}

