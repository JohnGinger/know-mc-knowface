import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
require("./index.scss");

import { Button, Card, TextArea, Intent, Spinner } from "@blueprintjs/core";

const InfoCard = () => {
  const [title, setTitle] = useState();
  const [text, setText] = useState();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const result = await fetch(
        "https://aptffw7dm7.execute-api.eu-west-1.amazonaws.com/finder",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "list" }),
        }
      ).then((res) => res.json());
      setDocuments(result);
    };
    load();
  }, [loading]);
  const saveCard = async () => {
    setLoading(true);
    const result = await fetch(
      "https://aptffw7dm7.execute-api.eu-west-1.amazonaws.com/finder",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "store",
          documents: [
            { name: Math.random().toString(32).substr(2), text: text },
          ],
        }),
      }
    ).then((res) => res.json());
    setLoading(false);
  };
  if (loading) {
    return <Spinner size={Spinner.SIZE_STANDARD} className="spinner" />;
  }
  return (
    <info-card>
      <Card>
        <h2>Add Info card</h2>
        <TextArea
          growVertically={true}
          large={true}
          intent={Intent.PRIMARY}
          onChange={(e) => setText(e.target.value)}
          value={text}
        />

        <Button intent="success" text="Add card" onClick={() => saveCard()} />
      </Card>
      <info-container>
        {documents.map((x) => (
          <nugget-holder>{x.text}</nugget-holder>
        ))}
      </info-container>
    </info-card>
  );
};

const Search = () => {
  const [query, setQuery] = useState();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [top_k_retriever, settop_k_retriever] = useState(1);
  const [top_k_reader, settop_k_reader] = useState(1);

  const search = async () => {
    setLoading(true);
    const result = await fetch(
      "https://aptffw7dm7.execute-api.eu-west-1.amazonaws.com/finder",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "infer",
          query,
          config: {
            top_k_retriever: Number(top_k_retriever),
            top_k_reader: Number(top_k_reader),
          },
        }),
      }
    ).then((res) => res.json());
    setLoading(false);
    setResults(result.answers);
  };

  if (loading) {
    return <Spinner size={Spinner.SIZE_STANDARD} className="spinner" />;
  }
  return (
    <search-box>
      <div className="bp3-input-group">
        <span className="bp3-icon bp3-icon-search"></span>
        <input
          type="text"
          className="bp3-input"
          placeholder="Search"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              search();
            }
          }}
        />
        <button
          className="bp3-button bp3-minimal bp3-intent-primary bp3-icon-arrow-right"
          onClick={() => search()}
        ></button>
      </div>
      <search-results>
        {results.map((result) => (
          <search-result>
            <h2>{result.answer}</h2>
            <p>{result.context}</p>
          </search-result>
        ))}
      </search-results>
      <settings-container>
        <label>
          top_k_retriever
          <input
            value={top_k_retriever}
            onChange={(e) => settop_k_retriever(e.target.value)}
          ></input>
        </label>
        <label>
          top_k_reader
          <input
            value={top_k_reader}
            onChange={(e) => settop_k_reader(e.target.value)}
          ></input>
        </label>
      </settings-container>
    </search-box>
  );
};

const App = () => {
  return (
    <app-container>
      <Search />
      <InfoCard />
    </app-container>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
