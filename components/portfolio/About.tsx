export function About() {
  return (
    <section id="about" className="max-w-3xl mx-auto px-6 py-24">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
        <span className="w-8 h-0.5 bg-violet-600 inline-block shrink-0" />
        About Me
      </h2>
      <div className="space-y-5 text-zinc-600 leading-relaxed text-base">
        <p>
          I'm a software developer based in [City, Country] with X years of experience
          building web applications. I specialize in [your specialties].
        </p>
        <p>
          When I'm not coding, I [your hobbies / interests]. I'm currently [open to opportunities /
          working at X / looking for Y].
        </p>
      </div>
    </section>
  );
}
