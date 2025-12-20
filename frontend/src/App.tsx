/**
 * Main App Component.
 * Sets up routing and the dashboard.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import "./index.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Dashboard />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
