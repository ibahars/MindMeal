import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="*"
          element={
            <div className="flex h-screen items-center justify-center font-sans">
              <h1 className="text-2xl font-bold">404 - Sayfa Bulunamadı</h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
