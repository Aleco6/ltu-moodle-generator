export default function AboutPage() {
  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">About</h1>
      
      <div className="space-y-1">
        <p><strong>Name:</strong> Alexander-James Anglias</p>
        <p><strong>Student #:</strong> 19369305</p>
      </div>

      <div className="aspect-video max-w-3xl">
        <h2 className="text-xl font-semibold">How to use this website</h2>
        <iframe
          className="w-full h-full rounded"
          src="https://www.youtube.com/embed/Sklc_fQBmcs"
          title="How to use this website"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <p className="text-sm text-gray-600">
        This site generates copy-pasteable HTML5 + JS with inline CSS (no classes) for Moodle. 
        Navigate using the header, configure a component (e.g., tabs), then copy the output into a blank file and open it as <code>Hello.html</code>. 
      </p>
    </section>
  );
}