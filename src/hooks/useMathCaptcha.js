// src/hooks/useMathCaptcha.js
"use client";

import { useState, useCallback } from "react";

function generateProblem() {
  const operations = ["+", "-", "×"];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let a, b, answer;

  if (operation === "+") {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    answer = a + b;
  } else if (operation === "-") {
    a = Math.floor(Math.random() * 20) + 10;
    b = Math.floor(Math.random() * 10) + 1;
    answer = a - b; // always kept positive by generating a > b range
  } else {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
    answer = a * b;
  }

  return { a, b, operation, answer };
}

export function useMathCaptcha() {
  const [problem, setProblem] = useState(generateProblem);
  const [userAnswer, setUserAnswer] = useState("");
  const [error, setError] = useState(null);
  const [honeypot, setHoneypot] = useState(""); // bonus bot-trap field, see Part D

  const refresh = useCallback(() => {
    setProblem(generateProblem());
    setUserAnswer("");
    setError(null);
  }, []);

  const validate = useCallback(() => {
    // Honeypot check — if this hidden field has ANY value, a bot filled it in. Silently fail.
    if (honeypot.trim() !== "") {
      setError("Verification failed. Please try again.");
      refresh();
      return false;
    }

    if (userAnswer.trim() === "") {
      setError("Please solve the verification below");
      return false;
    }

    if (Number(userAnswer) !== problem.answer) {
      setError("That's not quite right — please try again");
      refresh();
      return false;
    }

    setError(null);
    return true;
  }, [userAnswer, problem, honeypot, refresh]);

  const reset = useCallback(() => {
    refresh();
  }, [refresh]);

  return {
    problem,
    userAnswer,
    setUserAnswer,
    error,
    validate,
    reset,
    honeypot,
    setHoneypot,
  };
}