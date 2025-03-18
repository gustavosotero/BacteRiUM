import LoginForm from './form/loginForm';
import About from './form/aboutPage';
import Contact from './form/contactPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginForm />}/>
          <Route path="/loginForm" element={<LoginForm />} />
          <Route path="/aboutPage" element={<About />} />
          <Route path="/contactPage" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </div> 
  );
}

export default App;
