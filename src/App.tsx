import "./App.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function App() {
	return (
		<div className="App">
			<Loader
				type="Puff"
				color="#00BFFF"
				height={100}
				width={100}
				timeout={3000}
			/>
			<header className="App-header">
				<p>
					<div className="App-logo">
						<FontAwesomeIcon icon={faSpinner} />
					</div>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
