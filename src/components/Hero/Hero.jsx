import AddTask from '../AddTask/AddTask';
import './Hero.css'

function Hero() {
  return(
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1>Next<span>Up</span></h1>
          <p>
              A simple way to plan your day,
              stay focused and make progress.
          </p>

          <div className="moto">
            <span className="line"></span>
          <span className="badge">Get Things Done !!</span>
          </div>
        </div>
      </div>

    </section>
  );
}

export default Hero