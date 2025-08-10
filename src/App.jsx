import './styles/App.scss';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import UserSection from './components/Users';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <UserSection />
      </main>
    </>
  );
}

export default App;
