const applicationRepo = require("../repositories/application.repositories");
const SAWRepo = require("../repositories/SAW.repositories");
const { v4: uuidv4 } = require("uuid");

const mapping_category = {
  "Magang KRS": 2,
  "Magang Mandiri": 1,
};

const pairwiseMatrix = [
  [1, 3, 5, 7],
  [1 / 3, 1, 3, 5],
  [1 / 5, 1 / 3, 1, 3],
  [1 / 7, 1 / 5, 1 / 3, 1],
];

const calculateAHPWeights = (matrix) => {
  const size = matrix.length;
  const colSums = Array(size).fill(0);

  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      colSums[j] += matrix[i][j];
    }
  }

  const normalized = matrix.map((row) => row.map((val, j) => val / colSums[j]));

  return normalized.map((row) => row.reduce((sum, val) => sum + val, 0) / size);
};

const normalizeApplications = (data) => {
  const max = {
    intern_category: Math.max(
      ...data.map((d) => mapping_category[d.intern_category] || 0)
    ),
    IPK: Math.max(...data.map((d) => parseFloat(d.IPK))),
    CV_score: Math.max(...data.map((d) => d.CV_score)),
    motivation_letter_score: Math.max(
      ...data.map((d) => d.motivation_letter_score)
    ),
  };

  return data.map((app) => {
    return {
      ...app,
      normalized: {
        intern_category:
          (mapping_category[app.intern_category] || 0) / max.intern_category,
        IPK: parseFloat(app.IPK) / max.IPK,
        CV_score: app.CV_score / max.CV_score,
        motivation_letter_score:
          app.motivation_letter_score / max.motivation_letter_score,
      },
    };
  });
};

const calculateTotalScores = (data, weights) => {
  return data.map((app) => {
    const total =
      weights[0] * app.normalized.intern_category +
      weights[1] * app.normalized.IPK +
      weights[2] * app.normalized.CV_score +
      weights[3] * app.normalized.motivation_letter_score;
    return {
      ...app,
      total_score: total * 100,
    };
  });
};

exports.calculate = async (year, month) => {
  const startMonthString = `${year}-${String(month).padStart(2, "0")}`;

  const applications = await applicationRepo.getApplicationByStartDate(
    startMonthString
  );

  const weights = calculateAHPWeights(pairwiseMatrix);
  const normalized = normalizeApplications(applications);
  const scored = calculateTotalScores(normalized, weights);

  const sorted = scored.sort((a, b) => b.total_score - a.total_score);
  console.log(sorted);
  const formattedResults = sorted.map((selected) => ({
    id: uuidv4(),
    application_id: selected.id,
    full_name: selected.full_name,
    email: selected.email,
    start_month: selected.start_month,
    IPK: selected.IPK,
    intern_category: selected.intern_category,
    college_major: selected.college_major,
    IPK_score: selected.normalized.IPK,
    intern_category_score: selected.normalized.intern_category,
    CV_score: selected.CV_score,
    motivation_letter_score: selected.motivation_letter_score,
    total_score: selected.total_score,
  }));

  if (formattedResults.length > 0) {
    await SAWRepo.saveSAW_Result(formattedResults);
  }

  return formattedResults;
};

exports.getSAW_Results = async ({
  month,
  year,
  page = 1,
  limit = 10,
  sort = "desc",
  sortBy = "total_score",
  search = "",
}) => {
  const { data, totalItems, totalPages } = await SAWRepo.getSAW_Results({
    month,
    year,
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    sortBy,
    search,
  });

  return {
    data,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
    },
  };
};

exports.sendMail_Results = async (payload) => {
  await SAWRepo.sendMail_Results(payload);

  return true;
};
