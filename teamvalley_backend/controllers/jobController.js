const Job = require("../models/Job");

const normalizeListField = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item !== "");
  }

  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item !== "");
};

const getCompanyDisplayName = (user) => {
  if (!user) {
    return "Company Account";
  }

  return (
    user.companyName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "Company Account"
  );
};

const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      type,
      salary,
      deadline,
      level,
      responsibilities,
      requirements,
      benefits,
    } = req.body;

    if (!title || !description || !category || !location || !type) {
      return res.status(400).json({
        success: false,
        message: "Please fill title, description, category, location and type.",
      });
    }

    const job = await Job.create({
      company: req.user._id,
      companyName: getCompanyDisplayName(req.user),
      title,
      description,
      category,
      location,
      type,
      salary: salary || "Negotiable",
      deadline: deadline || "",
      level: level || "Junior / Mid",
      responsibilities: normalizeListField(responsibilities),
      requirements: normalizeListField(requirements),
      benefits: normalizeListField(benefits),
      status: "active",
      applicants: 0,
    });

    const populatedJob = await Job.findById(job._id).populate(
      "company",
      "companyName nipt email phone website industry address companySize description logo firstName lastName role"
    );

    res.status(201).json({
      success: true,
      message: "Job created successfully.",
      data: populatedJob,
    });
  } catch (error) {
    console.log("Create job error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not create job.",
    });
  }
};

const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 6,
      search,
      category,
      location,
      type,
      status,
    } = req.query;

    const query = { status: status || "active" };

    if (category && category !== "All") {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (type && type !== "All") {
      query.type = { $regex: `^${type}$`, $options: "i" };
    }

    if (location && location.trim() !== "") {
      query.location = { $regex: location.trim(), $options: "i" };
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { companyName: { $regex: search.trim(), $options: "i" } },
        { category: { $regex: search.trim(), $options: "i" } },
        { location: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate(
        "company",
        "companyName nipt email phone website industry address companySize description logo firstName lastName role"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      total,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber) || 1,
      },
      data: jobs,
    });
  } catch (error) {
    console.log("Get jobs error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not load jobs.",
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "company",
      "companyName nipt email phone website industry address companySize description logo firstName lastName role"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.log("Get job by id error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not load job details.",
    });
  }
};

const getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user._id })
      .populate(
        "company",
        "companyName nipt email phone website industry address companySize description logo firstName lastName role"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.log("Get company jobs error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not load company jobs.",
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      company: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you are not allowed to edit it.",
      });
    }

    const {
      title,
      description,
      category,
      location,
      type,
      salary,
      deadline,
      level,
      responsibilities,
      requirements,
      benefits,
      status,
    } = req.body;

    job.title = title || job.title;
    job.description = description || job.description;
    job.category = category || job.category;
    job.location = location || job.location;
    job.type = type || job.type;
    job.salary = salary || job.salary;
    job.deadline = deadline || job.deadline;
    job.level = level || job.level;

    if (responsibilities !== undefined) {
      job.responsibilities = normalizeListField(responsibilities);
    }

    if (requirements !== undefined) {
      job.requirements = normalizeListField(requirements);
    }

    if (benefits !== undefined) {
      job.benefits = normalizeListField(benefits);
    }

    if (status && ["active", "closed"].includes(status)) {
      job.status = status;
    }

    const updatedJob = await job.save();

    const populatedJob = await Job.findById(updatedJob._id).populate(
      "company",
      "companyName nipt email phone website industry address companySize description logo firstName lastName role"
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      data: populatedJob,
    });
  } catch (error) {
    console.log("Update job error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not update job.",
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      company: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you are not allowed to delete it.",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.log("Delete job error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not delete job.",
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  getCompanyJobs,
  updateJob,
  deleteJob,
};
