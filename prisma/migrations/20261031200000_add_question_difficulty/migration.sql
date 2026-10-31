ALTER TABLE `questions`
ADD COLUMN `difficulty` ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL DEFAULT 'MEDIUM';

UPDATE `questions` AS question
JOIN (
    SELECT
        ranked_questions.`id`,
        CASE
            WHEN ranked_questions.question_number <= CEIL(ranked_questions.question_count / 3)
                THEN 'EASY'
            WHEN ranked_questions.question_number <= CEIL(2 * ranked_questions.question_count / 3)
                THEN 'MEDIUM'
            ELSE 'HARD'
        END AS `difficulty`
    FROM (
        SELECT
            `id`,
            ROW_NUMBER() OVER (PARTITION BY `quizId` ORDER BY `id`) AS question_number,
            COUNT(*) OVER (PARTITION BY `quizId`) AS question_count
        FROM `questions`
    ) AS ranked_questions
) AS ranked ON question.`id` = ranked.`id`
SET question.`difficulty` = ranked.`difficulty`;

CREATE INDEX `questions_quizId_difficulty_idx`
ON `questions`(`quizId`, `difficulty`);
