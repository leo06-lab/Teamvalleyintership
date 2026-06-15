import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utils/getImageUrl";
import InlineMessage from "../../components/InlineMessage";
import { useInlineMessage } from "../../hooks/useInlineMessage";

function CompanyProfile() {
  const API_URL = "http://localhost:5000/api/company";
  const token = localStorage.getItem("jobvalleyToken");

  const { message, showMessage } = useInlineMessage();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [formData, setFormData] = useState({
    logo: "",
    companyName: "",
    nipt: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    industry: "",
    companySize: "",
    description: "",
  });

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          showMessage(
            result.message || "Could not load company profile.",
            "error"
          );
          setLoading(false);
          return;
        }

        setFormData({
          logo: result.data.logo || "",
          companyName: result.data.companyName || "",
          nipt: result.data.nipt || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
          website: result.data.website || "",
          address: result.data.address || "",
          industry: result.data.industry || "",
          companySize: result.data.companySize || "",
          description: result.data.description || "",
        });

        setLoading(false);
      } catch (error) {
        setLoading(false);
        showMessage("Backend is not running. Please try again.", "error");
      }
    };

    fetchCompanyProfile();
  }, [token, showMessage]);

  const saveUserToLocalStorage = (companyData) => {
    const oldUser = JSON.parse(localStorage.getItem("jobvalleyUser"));

    localStorage.setItem(
      "jobvalleyUser",
      JSON.stringify({
        ...oldUser,
        ...companyData,
        isLoggedIn: true,
      })
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showMessage(
        "Logo image is too large. Please choose an image under 2MB.",
        "warning"
      );
      return;
    }

    const logoFormData = new FormData();
    logoFormData.append("logo", file);

    try {
      setUploadingLogo(true);

      const response = await fetch(`${API_URL}/profile/logo`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: logoFormData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not upload logo.", "error");
        setUploadingLogo(false);
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        logo: result.data.logo || "",
      }));

      saveUserToLocalStorage(result.data);

      setUploadingLogo(false);
      showMessage("Logo uploaded successfully.", "success");
    } catch (error) {
      setUploadingLogo(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  };

  const handleRemoveLogo = async () => {
    const confirmRemove = window.confirm("Are you sure you want to remove logo?");

    if (!confirmRemove) {
      return;
    }

    try {
      setUploadingLogo(true);

      const response = await fetch(`${API_URL}/profile/logo`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(result.message || "Could not remove logo.", "error");
        setUploadingLogo(false);
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        logo: "",
      }));

      saveUserToLocalStorage(result.data);

      setUploadingLogo(false);
      showMessage("Logo removed successfully.", "success");
    } catch (error) {
      setUploadingLogo(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (formData.companyName.trim() === "" || formData.phone.trim() === "") {
      showMessage("Please fill company name and phone.", "warning");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          phone: formData.phone,
          website: formData.website,
          address: formData.address,
          industry: formData.industry,
          companySize: formData.companySize,
          description: formData.description,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showMessage(
          result.message || "Could not save company profile.",
          "error"
        );
        setSaving(false);
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        ...result.data,
      }));

      saveUserToLocalStorage(result.data);

      setSaving(false);
      showMessage("Company profile saved successfully.", "success");
    } catch (error) {
      setSaving(false);
      showMessage("Backend is not running. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <section className="company-dashboard-card company-profile-page">
        <h2>Loading company profile...</h2>
      </section>
    );
  }

  const logoUrl = getImageUrl(formData.logo);

  return (
    <section className="company-dashboard-card company-profile-page">
      <div className="company-profile-header">
        <div className="company-profile-main-info">
          <div className="company-profile-logo">
            {logoUrl ? (
              <img src={logoUrl} alt="Company logo" />
            ) : (
              <span>{formData.companyName.charAt(0).toUpperCase() || "C"}</span>
            )}
          </div>

          <div>
            <h2>{formData.companyName || "Company Profile"}</h2>
            <p>{formData.industry || "Complete your company information"}</p>

            {uploadingLogo && <small>Saving logo...</small>}
          </div>
        </div>

        <div className="company-profile-header-actions">
          <div className="company-upload-logo-preview">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo preview" />
            ) : (
              <span>Preview</span>
            )}
          </div>

          <label className="company-logo-upload-btn">
            {uploadingLogo ? "Uploading..." : "Upload Logo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              disabled={uploadingLogo}
            />
          </label>

          {formData.logo && (
            <button
              type="button"
              className="company-remove-logo-btn"
              onClick={handleRemoveLogo}
              disabled={uploadingLogo}
            >
              Remove Logo
            </button>
          )}
        </div>
      </div>

      <InlineMessage message={message} />

      <form className="company-profile-form" onSubmit={handleSaveProfile}>
        <div className="company-profile-form-grid">
          <div className="company-form-group">
            <label>Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
            />
          </div>

          <div className="company-form-group">
            <label>NIPT</label>
            <input
              type="text"
              name="nipt"
              value={formData.nipt}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="company-form-group">
            <label>Company Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="company-form-group">
            <label>Phone Number *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+355 69 123 4567"
            />
          </div>

          <div className="company-form-group">
            <label>Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://company.com"
            />
          </div>

          <div className="company-form-group">
            <label>Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Technology, Construction, Finance..."
            />
          </div>

          <div className="company-form-group">
            <label>Company Size</label>
            <select
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
            >
              <option value="">Select company size</option>
              <option value="1-10 employees">1-10 employees</option>
              <option value="11-50 employees">11-50 employees</option>
              <option value="51-200 employees">51-200 employees</option>
              <option value="201-500 employees">201-500 employees</option>
              <option value="500+ employees">500+ employees</option>
            </select>
          </div>

          <div className="company-form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Tirana, Albania"
            />
          </div>
        </div>

        <div className="company-form-group">
          <label>Company Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a short description about your company..."
          ></textarea>
        </div>

        <div className="company-profile-actions">
          <button
            type="submit"
            className="company-primary-btn"
            disabled={saving || uploadingLogo}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CompanyProfile;