import React, { useState } from "react"; // Importon React dhe useState
import "../styles/Home.css"; // Importon CSS-in e Home
import homePageImage from "../assets/images/homepage.png"; // Importon foton kryesore

function Home() { // Krijon komponentin Home
  const [activeCategory, setActiveCategory] = useState("All"); // Mban kategorinë aktive
  const [searchText, setSearchText] = useState(""); // Mban tekstin e kërkimit
  const [locationText, setLocationText] = useState(""); // Mban lokacionin e kërkimit

  const categories = [ // Lista dinamike e kategorive
    "Retail & Product",
    "Content Writer",
    "Human Resource",
    "Market Research",
    "Software",
    "Finance",
    "Management",
    "Marketing & Sales",
  ];

  const jobs = [ // Lista dinamike e punëve
    {
      company: "Ashford",
      title: "Lead Quality Control QA",
      category: "Management",
      location: "Remote",
      type: "Full Time",
      price: "$500",
      color: "red",
    },
    {
      company: "Percepta",
      title: "React Native Web Developer",
      category: "Software",
      location: "Hybrid",
      type: "Part Time",
      price: "$800",
      color: "blue",
    },
    {
      company: "Tesla",
      title: "Senior System Engineer",
      category: "Software",
      location: "Tirana",
      type: "Full Time",
      price: "$500",
      color: "yellow",
    },
    {
      company: "Bing Search",
      title: "Full Stack Engineer",
      category: "Software",
      location: "Remote",
      type: "Full Time",
      price: "$800",
      color: "purple",
    },
    {
      company: "Exela Movers",
      title: "UI/UX Designer Fulltime",
      category: "Market Research",
      location: "Hybrid",
      type: "Full Time",
      price: "$500",
      color: "green",
    },
    {
      company: "Amazon",
      title: "Frontend Developer",
      category: "Software",
      location: "Remote",
      type: "Full Time",
      price: "$800",
      color: "cyan",
    },
    {
      company: "Aceable, Inc.",
      title: "Java Software Engineer",
      category: "Software",
      location: "Tirana",
      type: "Part Time",
      price: "$500",
      color: "orange",
    },
    {
      company: "Baseball Saving",
      title: "Marketing Specialist",
      category: "Marketing & Sales",
      location: "On-site",
      type: "Full Time",
      price: "$800",
      color: "teal",
    },
  ];

 const filteredJobs = jobs.filter((job) => { // Filtro punët në mënyrë dinamike
  const matchesCategory = activeCategory === "All" || job.category === activeCategory; // Kontrollon kategorinë

  const matchesSearch =
    job.title.toLowerCase().includes(searchText.toLowerCase()) ||
    job.company.toLowerCase().includes(searchText.toLowerCase()) ||
    job.category.toLowerCase().includes(searchText.toLowerCase()); // Kontrollon tekstin e kërkimit

  const matchesLocation =
    locationText === "" ||
    job.location.toLowerCase().includes(locationText.toLowerCase()); // Kontrollon lokacionin

  return matchesCategory && matchesSearch && matchesLocation; // Kthen vetëm punët që përputhen
});

  const handleSearch = () => { // Funksion për butonin search
    const jobsSection = document.querySelector(".jobs-section"); // Merr seksionin e jobs
    if (jobsSection) { // Kontrollon nëse ekziston
      jobsSection.scrollIntoView({ behavior: "smooth" }); // Bën scroll smooth te jobs
    }
  };

  return ( // Kthen pamjen
    <main className="home-page"> {/* Faqja Home */}

      <section className="hero"> {/* Hero section */}

        <div className="hero-left fade-up"> {/* Ana e majtë me animacion */}

          <h1> {/* Titulli kryesor */}
            The <span>Easiest Way</span>
            <br />
            to Get Your New Job
          </h1>

          <p> {/* Përshkrimi */}
            Each month, thousands of job seekers use JobValley to discover new
            opportunities and connect with companies faster.
          </p>

          <div className="hero-search"> {/* Search box */}
            <div className="search-field"> {/* Field industry */}
              <span>▦</span>
              <input
                type="text"
                placeholder="Industry or keyword"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className="search-field"> {/* Field location */}
              <span>⌖</span>
              <input
                type="text"
                placeholder="Location"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
              />
            </div>

            <div className="search-field"> {/* Field category */}
              <span>⌗</span>
              <input
                type="text"
                placeholder="Category"
                value={activeCategory === "All" ? "" : activeCategory}
                onChange={(e) => setActiveCategory(e.target.value || "All")}
              />
            </div>

            <button onClick={handleSearch}>Search</button> {/* Butoni search */}
          </div>

          <div className="popular-searches"> {/* Popular searches */}
            <strong>Popular Searches:</strong>
            {["Software", "Finance", "Human Resource", "Management"].map((item) => ( // Krijon linke dinamike
              <button
                key={item}
                onClick={() => setActiveCategory(item)}
                className="popular-btn"
              >
                {item}
              </button>
            ))}
          </div>

        </div>

        <div className="hero-right fade-in"> {/* Ana e djathtë */}
          <div className="shape shape-one"></div> {/* Dekorim */}
          <div className="shape shape-two"></div> {/* Dekorim */}

          <div className="image-card image-card-main"> {/* Imazhi kryesor */}
            <img src={homePageImage} alt="JobValley team" />
          </div>

          <div className="image-card image-card-small"> {/* Imazhi i dytë */}
            <img src={homePageImage} alt="Job interview" />
          </div>

          <div className="dots dots-one"></div> {/* Dots */}
          <div className="dots dots-two"></div> {/* Dots */}
        </div>

      </section>

      <section className="categories-section"> {/* Seksioni i kategorive */}

        <div className="section-heading fade-up"> {/* Titulli */}
          <h2>Browse by category</h2>
          <p>Find the job that’s perfect for you. New opportunities are added every day.</p>
        </div>

        <div className="category-filter-row"> {/* Rreshti i filterave */}
          <button
            className={activeCategory === "All" ? "filter-btn active" : "filter-btn"}
            onClick={() => setActiveCategory("All")}
          >
            All
          </button>

          {categories.map((category) => ( // Krijon butonat e kategorive
            <button
              key={category}
              className={activeCategory === category ? "filter-btn active" : "filter-btn"}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="category-grid"> {/* Grid kategorish */}
          {categories.map((category, index) => ( // Krijon kategori dinamike
            <button
              className="category-card"
              key={category}
              onClick={() => setActiveCategory(category)}
            >
              <div className="category-icon">▰</div>
              <div>
                <h3>{category}</h3>
                <p>{index + 3} Jobs Available</p>
              </div>
            </button>
          ))}
        </div>

        <div className="slider-dots"> {/* Dots dekorative */}
          <span></span>
          <span></span>
          <span className="active"></span>
        </div>
      </section>

      <section className="hiring-banner fade-up"> {/* Banner hiring */}
        <div className="hiring-left">
          <span>WE ARE</span>
          <h2>HIRING</h2>
        </div>

        <p>Let’s Work Together & Explore Opportunities</p>

        <a href="/jobs">Apply Now</a>
      </section>

      <section className="jobs-section"> {/* Seksioni i jobs */}
        <div className="section-heading fade-up"> {/* Titulli */}
          <h2>Jobs of the day</h2>
          <p>Search and connect with the right opportunities faster.</p>
        </div>

        <div className="job-tabs"> {/* Tabs dinamike */}
          <button
            className={activeCategory === "All" ? "active-tab" : ""}
            onClick={() => setActiveCategory("All")}
          >
            All Jobs
          </button>

          {categories.map((category) => ( // Krijon tabs nga kategoritë
            <button
              key={category}
              className={activeCategory === category ? "active-tab" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="results-info"> {/* Numri i rezultateve */}
          <span>{filteredJobs.length} jobs found</span>
          {activeCategory !== "All" && (
            <button onClick={() => setActiveCategory("All")}>Clear filter</button>
          )}
        </div>

        <div className="jobs-grid"> {/* Grid i jobs */}
          {filteredJobs.length > 0 ? ( // Kontrollon nëse ka jobs
            filteredJobs.map((job, index) => ( // Krijon cards dinamike
              <div className="job-card smooth-card" key={index}>
                <div className={`job-logo ${job.color}`}>{job.company.charAt(0)}</div>

                <h3>{job.company}</h3>
                <h4>{job.title}</h4>

                <div className="job-meta">
                  <span>{job.type}</span>
                  <span>{job.location}</span>
                </div>

                <p>
                  A modern opportunity for motivated candidates who want to grow
                  their career with a professional team.
                </p>

                <div className="job-tags">
                  <span>{job.category}</span>
                  <span>React</span>
                  <span>Remote</span>
                </div>

                <div className="job-bottom">
                  <strong>{job.price}<small>/Hour</small></strong>
                  <a href="/jobs">Apply Now</a>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results"> {/* Kur nuk ka rezultate */}
              <h3>No jobs found</h3>
              <p>Try another keyword, location or category.</p>
              <button
                onClick={() => {
                  setSearchText("");
                  setLocationText("");
                  setActiveCategory("All");
                }}
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </section>

    </main>
  ); // Mbyll return
} // Mbyll komponentin

export default Home; // Eksporton Home