import { BrowserRouter } from 'react-router-dom';
import Header from './components/_header/Header.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {UserProvider} from "./contexts/UserContext.jsx";
import Main from "./components/_main/Main.jsx";
import { FONT_FAMILIES } from './utils/constants.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Footer from "./components/_footer/Footer.jsx";

function App() {
    return (
        <BrowserRouter>
            <UserProvider>
                <div className="app-container" style={{ fontFamily: FONT_FAMILIES.SECONDARY }}>
                    <Header />
                    <Main className="main-content" />
                    <Footer />
                </div>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;
