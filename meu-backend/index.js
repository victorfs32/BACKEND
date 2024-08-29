import React, { useState } from "react";

const TestConnection = () => {
  const [response, setResponse] = useState("");
  const [postData, setPostData] = useState({
    userName: "",
    score: "",
    timeTaken: "",
  });
  const [deleteData, setDeleteData] = useState("");

  const testGet = () => {
    fetch("https://backend-eosin-chi-12.vercel.app/")
      .then((response) => response.text())
      .then(() => {
        setResponse("GET request funcionando!");
      })
      .catch(() => {
        setResponse("Erro no GET request");
      });
  };

  const testPost = () => {
    fetch("https://backend-eosin-chi-12.vercel.app/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then(() => {
        setResponse("POST request funcionando!");
      })
      .catch(() => {
        setResponse("Erro no POST request");
      });
  };

  const testDelete = () => {
    fetch(`https://backend-eosin-chi-12.vercel.app/scores/${deleteData}`, {
      method: "DELETE",
    })
      .then(() => {
        setResponse("DELETE request funcionando!");
      })
      .catch(() => {
        setResponse("Erro no DELETE request");
      });
  };

  return (
    <div>
      <h1>Teste de Conexão</h1>

      <div>
        <button onClick={testGet}>Teste GET</button>
      </div>

      <div>
        <h2>Teste POST</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            testPost();
          }}
        >
          <input
            type="text"
            placeholder="Nome do Usuário"
            value={postData.userName}
            onChange={(e) => setPostData({ ...postData, userName: e.target.value })}
          />
          <input
            type="number"
            placeholder="Pontuação"
            value={postData.score}
            onChange={(e) => setPostData({ ...postData, score: e.target.value })}
          />
          <input
            type="number"
            placeholder="Tempo"
            value={postData.timeTaken}
            onChange={(e) => setPostData({ ...postData, timeTaken: e.target.value })}
          />
          <button type="submit">Enviar POST</button>
        </form>
      </div>

      <div>
        <h2>Teste DELETE</h2>
        <input
          type="text"
          placeholder="ID para deletar"
          value={deleteData}
          onChange={(e) => setDeleteData(e.target.value)}
        />
        <button onClick={testDelete}>Deletar</button>
      </div>

      <p>{response}</p>
    </div>
  );
};

export default TestConnection;
