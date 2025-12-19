import { Routes, Route } from 'react-router-dom';
import Landing from './routes/Landing';
import Dashboard from './routes/Dashboard';
import Transactions from './routes/Transactions';
import Goals from './routes/Goals';
import Settings from './routes/Settings';
import Toast from './components/Toast';

function App() {
  return (
    <>
      <Toast />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default App;
