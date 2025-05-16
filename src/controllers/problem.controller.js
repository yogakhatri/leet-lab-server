import { httpStatus } from "../utils/constants.js";
import { ApiResponses } from "../utils/api-responses.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../lib/judge0.lib.js";
import { db } from "../lib/db.js";

export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testcases,
      codeSnippets,
      referenceSolutions,
    } = req.body;

    if (req.user.role !== "ADMIN") {
      return res
        .status(httpStatus.Forbidden)
        .json(
          new ApiResponses(
            httpStatus.Forbidden,
            "You are not allowed to created a problem.",
          ),
        );
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res
          .status(httpStatus.BadRequest)
          .json(
            new ApiResponses(
              httpStatus.BadRequest,
              `Language ${language} is not supported`,
            ),
          );
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res
            .status(httpStatus.BadRequest)
            .json(
              new ApiResponses(
                httpStatus.BadRequest,
                `Testcase ${i + 1} failed for language ${language}`,
              ),
            );
        }
      }
      // save the problems in database
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          hints,
          editorial,
          testcases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id,
        },
      });

      return res
        .status(httpStatus.Created)
        .json(
          new ApiResponses(
            httpStatus.Created,
            "new problem created successfully.",
            newProblem,
          ),
        );
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllProblems = async (req, res) => {};

export const getProblemById = async (req, res) => {};

export const deleteProblem = async (req, res) => {};

export const deleteProblemById = async (req, res) => {};

export const getAllProblemsSolvedByUser = async (req, res) => {};
