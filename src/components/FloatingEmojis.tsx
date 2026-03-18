const emojis = [
  { char: '🩺', top: '8%', left: '5%', size: 'text-3xl', anim: 'emote-float', delay: '0s' },
  { char: '💊', top: '15%', right: '8%', size: 'text-2xl', anim: 'emote-bounce', delay: '0.5s' },
  { char: '🏥', top: '30%', left: '3%', size: 'text-2xl', anim: 'emote-drift', delay: '1s' },
  { char: '📚', top: '60%', right: '4%', size: 'text-3xl', anim: 'emote-float', delay: '1.5s' },
  { char: '🎓', top: '75%', left: '6%', size: 'text-2xl', anim: 'emote-bounce', delay: '0.3s' },
  { char: '❤️', top: '45%', right: '6%', size: 'text-xl', anim: 'emote-drift', delay: '2s' },
  { char: '🧑‍⚕️', top: '85%', right: '10%', size: 'text-2xl', anim: 'emote-wave', delay: '0.8s' },
  { char: '💙', top: '20%', left: '12%', size: 'text-xl', anim: 'emote-drift', delay: '1.2s' },
  { char: '🌟', top: '50%', left: '2%', size: 'text-xl', anim: 'emote-bounce', delay: '0.7s' },
  { char: '🫀', top: '70%', right: '3%', size: 'text-xl', anim: 'emote-float', delay: '1.8s' },
];

export default function FloatingEmojis() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {emojis.map((e, i) => (
        <span
          key={i}
          className={`absolute ${e.size} ${e.anim} opacity-60`}
          style={{
            top: e.top,
            left: e.left,
            right: e.right,
            animationDelay: e.delay,
          }}
        >
          {e.char}
        </span>
      ))}
    </div>
  );
}
