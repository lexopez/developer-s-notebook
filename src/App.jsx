import { MainLayout } from "./components/MainLayout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchFolders, fetchNotes } from "./store/newStore";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fire off both requests in parallel
    dispatch(fetchFolders());
    dispatch(fetchNotes());
  }, [dispatch]);

  return <MainLayout />;
}

export default App;
