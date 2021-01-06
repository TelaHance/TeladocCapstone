import React from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import AppLayout from "./Components/Layout/AppLayout";
import Loading from "./Components/Loading/Loading";

function App() {
    const {isLoading} = useAuth0();
    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="App">
            <AppLayout />
        </div>
    );
}

export default App;
