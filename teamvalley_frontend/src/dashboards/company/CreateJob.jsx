import React, { useState } from "react";
import InlineMessage from "../../components/InlineMessage";
import { useInlineMessage } from "../../hooks/useInlineMessage";

const JOBS_API_URL = "http://localhost:5000/api/jobs";

function CreateJob() {
  const token = localStorage.getItem("jobvalleyToken");
  const { message, showMessage } = useInlineMessage();

  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    type: "",
    salary: "",
    deadline: "",
    level: "Junior / Mid",
    responsibilities: "",
    requirements: "",
    benefits: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      type: "",
      salary: "",
      deadline: "",
      level: "Junior / Mid",
      responsibilities: "",
      requirements: "",
      benefits: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();

    if (
      formData.title.trim() === "" ||
      formData.description.trim() === "" ||
      formData.category.trim() === "" ||
      formData.location.trim() === "" ||
      formData.type.trim() === ""
    ) {
      showMessage(
        "Please fill title, description, category, location and job type.",
        "warning"
      );
      return;
    }

    try {
      setCreating(true);

      const response = await fetch(JOBS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          type: formData.type,
          salary: formData.salary,
          deadline: formData.deadline,
          level: formData.level,
          responsibilities: formData.responsibilities,
          requirements: formData.requirements,
          benefits: formData.benefits,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not create job.", "error");
        setCreating(false);
        return;
      }

      resetForm();
      setCreating(false);
      showMessage("Job created successfully.", "success");
    } catch (error) {
      setCreating(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  };

  return (
    <section className="company-dashboard-card create-job-page">
      <div className="company-card-header">
        <div>
          <h2>Create Job</h2>
          <p>
            Publish a new job opportunity and complete all job details for
            candidates.
          </p>
        </div>

        <span>MongoDB</span>
      </div>

      <InlineMessage message={message} />

      <form className="create-job-form" onSubmit={handleCreateJob}>
        <div className="create-job-grid">
          <div className="company-form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Frontend Developer"
            />
          </div>

          <div className="company-form-group">
            <label>Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Software"
            />
          </div>

          <div className="company-form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Tirana"
            />
          </div>

          <div className="company-form-group">
            <label>Job Type *</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="">Select job type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="company-form-group">
            <label>Salary</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="$800 - $1200"
            />
          </div>

          <div className="company-form-group">
            <label>Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          <div className="company-form-group">
            <label>Level</label>
            <select name="level" value={formData.level} onChange={handleChange}>
              <option value="Intern">Intern</option>
              <option value="Junior">Junior</option>
              <option value="Junior / Mid">Junior / Mid</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
          </div>
        </div>

        <div className="company-form-group">
          <label>Job Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a short description about this job position..."
          ></textarea>
        </div>

        <div className="create-job-extra-grid">
          <div className="company-form-group">
            <label>Responsibilities</label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder={
                "Write one responsibility per line\nExample:\nBuild responsive pages\nConnect frontend with backend APIs\nFix UI bugs"
              }
            ></textarea>
          </div>

          <div className="company-form-group">
            <label>Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder={
                "Write one requirement per line\nExample:\nGood knowledge of React\nBasic knowledge of JavaScript\nUnderstanding of HTML and CSS"
              }
            ></textarea>
          </div>

          <div className="company-form-group">
            <label>Benefits</label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              placeholder={
                "Write one benefit per line\nExample:\nModern work environment\nCareer growth opportunities\nFlexible working schedule"
              }
            ></textarea>
          </div>
        </div>

        <div className="create-job-actions">
          <button type="submit" className="company-primary-btn" disabled={creating}>
            {creating ? "Creating..." : "Create Job"}
          </button>

          <button
            type="button"
            className="company-secondary-btn"
            onClick={resetForm}
            disabled={creating}
          >
            Clear Form
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateJob;