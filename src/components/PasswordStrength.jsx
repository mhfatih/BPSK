import { useState, useEffect } from "react";

export default function PasswordStrength({ password }) {
  const [strengthLevel, setStrengthLevel] = useState(0);
  const [label, setLabel] = useState("");

  useEffect(() => {
    evaluate(password);
  }, [password]);

  const evaluate = (password) => {
    if (!password) {
      setStrengthLevel(0);
      setLabel("");
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    setStrengthLevel(score);

    if (score <= 1) setLabel("Weak");
    else if (score === 2) setLabel("Fair");
    else if (score === 3) setLabel("Good");
    else if (score === 4) setLabel("Strong");
  };

  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];

  return (
    <div className="w-full mt-1">
      {/* Strength Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            strengthLevel > 0 ? colors[strengthLevel - 1] : ""
          }`}
          style={{
            width: `${(strengthLevel / 4) * 100}%`,
            boxShadow:
              strengthLevel === 4
                ? "0 0 10px rgba(16,185,129,0.8)" // glow hijau untuk strong
                : "none",
          }}
        />
      </div>

      {/* Text Label */}
      {label && (
        <p
          className={`text-sm mt-1 font-medium transition-colors duration-300 ${
            strengthLevel <= 1
              ? "text-red-500"
              : strengthLevel === 2
              ? "text-orange-500"
              : strengthLevel === 3
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          Password Strength: {label}
        </p>
      )}
    </div>
  );
}
