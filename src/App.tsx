import AppInfo from './components/AppInfo';
import './styles/global.scss';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div>
      <AppInfo />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={2}
      />
    </div>
  );
}

export default App;
