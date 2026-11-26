"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "../../../lib/supabase/browser";

type QuizQuestion = { id: string; prompt: string; options: string[] };
type QuizData = { id: string; title: string; passingPercent: number; questions: QuizQuestion[] };
type QuizResult = { score_percent: number; passed: boolean; coins_awarded: number };

export default function CourseQuiz({ quizId, title }: { quizId: string; title: string }) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();
    async function loadQuiz() {
      try {
        const { data, error } = await supabase.rpc("get_quiz", { p_quiz_id: quizId });
        if (!active) return;
        if (error || !data) setMessage("This knowledge check is unavailable for your account.");
        else setQuiz(data as unknown as QuizData);
      } catch {
        if (active) setMessage("Could not load this knowledge check. Refresh and try again.");
      }
    }
    void loadQuiz();
    return () => { active = false; };
  }, [quizId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!quiz || Object.keys(answers).length !== quiz.questions.length) {
      setMessage("Choose an answer for each question before submitting.");
      return;
    }
    setLoading(true);
    setMessage("");
    setResult(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.rpc("submit_quiz", { p_quiz_id: quiz.id, p_answers: answers });
      if (error) throw error;
      const attempt = (Array.isArray(data) ? data[0] : data) as QuizResult | null;
      if (!attempt) throw new Error("Missing quiz result");
      setResult(attempt);
    } catch {
      setMessage("Your answers could not be submitted. Check your course access and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="learning-quiz" aria-labelledby={`quiz-${quizId}`}>
      <h3 id={`quiz-${quizId}`}>{title}</h3>
      {quiz ? <form onSubmit={submit}>
        {quiz.questions.map((question, index) => <fieldset className="learning-quiz-question" key={question.id}>
          <legend><p>{index + 1}. {question.prompt}</p></legend>
          {question.options.map((option, optionIndex) => <label className="learning-quiz-option" key={optionIndex}>
            <input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))} />
            <span>{option}</span>
          </label>)}
        </fieldset>)}
        <button className="learning-button" type="submit" disabled={loading}>{loading ? "Submitting…" : "Submit answers"}</button>
      </form> : <p className="learning-message">{message || "Loading knowledge check…"}</p>}
      {result && <p className="learning-quiz-result" role="status">Score: {result.score_percent}% · {result.passed ? "Passed" : "Try again"}{result.coins_awarded ? ` · ${result.coins_awarded} coins earned` : ""}</p>}
      {message && quiz && <p className="learning-message" role="alert">{message}</p>}
    </section>
  );
}
