import "./App.css";
import Sidebar from "./app/Sidebar";
import QuickCheckPage from "./features/QuickCheckPage";

function App() {
  return (
    
    <div className="app-shell">
      <Sidebar />
      <main>
        <QuickCheckPage />
      </main>
      </div>
    
  );
}

export default App;
