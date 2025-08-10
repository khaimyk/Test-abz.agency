import React from 'react';
import Fon from '../../assets/HeroFon.webp';
import './Hero.scss';
const Hero = () => {
  return (
    <section className="hero">
      <img src={Fon} alt="background Image" className="hero__fon" />
      <div className="hero__container">
        <h1 className="hero__title">Test assignment for front-end developer</h1>
        <p className="hero__subtitle">
          What defines a good front-end developer is one that has skilled knowledge of HTML, CSS, JS
          with a vast understanding of User design thinking as they'll be building web interfaces
          with accessibility in mind. They should also be excited to learn, as the world of
          Front-End Development keeps evolving.
        </p>
        <a href="#sign-up" type="button" className="hero__button">
          Sign up
        </a>
      </div>
    </section>
  );
};
export default Hero;
