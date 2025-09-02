// components/Header.tsx
import Nav from "@/components/Nav";

type HeaderProps = {
  studentName: string;
  studentNumber: string;
};

export default function Header({ studentName, studentNumber }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-4 py-3 border-b bg-white dark:bg-neutral-900"
      role="banner"
    >
      {/* Left side: Student info + brand */}
      <div className="flex items-center gap-3">
        <span
          className="font-mono text-sm font-semibold px-2 py-1 border rounded-md"
          aria-label="Student number"
        >
          {studentNumber}
        </span>
        <a
          href="/"
          className="text-lg font-bold tracking-tight hover:underline underline-offset-4"
        >
          LTU LMS Tools
        </a>
      </div>

      {/* Right side: Navigation */}
      <Nav />

      {/* Hidden info for screen readers */}
      <span className="sr-only">
        {studentName} – {studentNumber}
      </span>
    </header>
  );
}

.dark select {
  background-color: #000000; /* black background */
  color: #ffffff;           /* white text */
  border: 1px solid #ffffff; /* white border */
  padding: 0.5rem;
  border-radius: 0.375rem;  /* optional rounded corners */
}