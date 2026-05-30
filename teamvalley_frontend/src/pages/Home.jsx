import React from "react";
import "../styles/Home.css";
import homePageImage from "../assets/images/homepage.png";

function Home() {
  const categories = [
    "Retail & Product",
    "Content Writer",
    "Human Resource",
    "Market Research",
    "Software",
    "Finance",
    "Management",
    "Marketing & Sales",
  ];

  const jobs = [
    { company: "Ashford", title: "Lead Quality Control QA", price: "$500", color: "red" },
    { company: "Percepta", title: "React Native Web Developer", price: "$800", color: "blue" },
    { company: "Tesla", title: "Senior System Engineer", price: "$500", color: "yellow" },
    { company: "Bing Search", title: "Full Stack Engineer", price: "$800", color: "purple" },
    { company: "Exela Movers", title: "UI/UX Designer Fulltime", price: "$500", color: "green" },
    { company: "Amazon", title: "Frontend Developer", price: "$800", color: "cyan" },
    { company: "Aceable, Inc.", title: "Java Software Engineer", price: "$500", color: "orange" },
    { company: "Baseball Saving", title: "Full Stack Engineer", price: "$800", color: "teal" },
  ];

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-left">
          <h1>
            The <span>Easiest Way</span>
            <br />
            to Get Your New Job
          </h1>

          <p>
            Each month, more than 3 million job seekers turn to our platform in
            their search for work, making over 140,000 applications every single day.
          </p>

          <div className="hero-search">
            <div className="search-field">
              <span>▦</span>
              <input type="text" placeholder="Industry" />
            </div>

            <div className="search-field">
              <span>⌖</span>
              <input type="text" placeholder="Location" />
            </div>

            <div className="search-field">
              <span>⌗</span>
              <input type="text" placeholder="Keywords" />
            </div>

            <button>Search</button>
          </div>

          <div className="popular-searches">
            <strong>Popular Searches:</strong>
            <a href="/jobs">Content Writer</a>
            <a href="/jobs">Finance</a>
            <a href="/jobs">Human Resource</a>
            <a href="/jobs">Management</a>
          </div>
        </div>

        <div className="hero-right">
          <div className="shape shape-one"></div>
          <div className="shape shape-two"></div>

          <div className="image-card image-card-main">
            <img src={homePageImage} alt="JobValley team" />
          </div>

          <div className="image-card image-card-small">
            <img src={homePageImage} alt="Job interview" />
          </div>

          <div className="dots dots-one"></div>
          <div className="dots dots-two"></div>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <h2>Browse by category</h2>
          <p>Find the job that’s perfect for you. About 800+ new jobs everyday.</p>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => (
            <div className="category-card" key={index}>
              <div className="category-icon">▰</div>
              <div>
                <h3>{category}</h3>
                <p>{index + 3} Jobs Available</p>
              </div>
            </div>
          ))}
        </div>

        <div className="slider-dots">
          <span></span>
          <span></span>
          <span className="active"></span>
        </div>
      </section>

      <section className="hiring-banner">
        <div className="hiring-left">
          <span>WE ARE</span>
          <h2>HIRING</h2>
        </div>

        <p>Let’s Work Together & Explore Opportunities</p>

        <a href="/jobs">Apply Now</a>
      </section>

      <section className="jobs-section">
        <div className="section-heading">
          <h2>Jobs of the day</h2>
          <p>Search and connect with the right candidates faster.</p>
        </div>

        <div className="job-tabs">
          <button>Content Writer</button>
          <button>Finance</button>
          <button>Human Resource</button>
          <button>Management</button>
          <button>Market Research</button>
          <button>Marketing & Sales</button>
          <button>Retail & Product</button>
          <button>Software</button>
        </div>

        <div className="jobs-grid">
          {jobs.map((job, index) => (
            <div className="job-card" key={index}>
              <div className={`job-logo ${job.color}`}>
                {job.company.charAt(0)}
              </div>

              <h3>{job.company}</h3>
              <h4>{job.title}</h4>

              <div className="job-meta">
                <span>Full Time</span>
                <span>Posted 8 months ago</span>
              </div>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Recusandae architecto eveniet.
              </p>

              <div className="job-tags">
                <span>App</span>
                <span>Figma</span>
                <span>Java</span>
              </div>

              <div className="job-bottom">
                <strong>{job.price}<small>/Hour</small></strong>
                <a href="/jobs">Apply Now</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;