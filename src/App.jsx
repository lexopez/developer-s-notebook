import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import ProtectedApp from "./components/ProtectedApp";
import AuthPage from "./components/AuthPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <ProtectedApp>
              <MainLayout />
            </ProtectedApp>
          }
        />
        <Route path="AuthPage" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
