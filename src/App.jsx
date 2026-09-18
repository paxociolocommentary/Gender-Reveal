import { useEffect, useState } from 'react'

const REVEAL_CODES = {
  '4475': 'girl',
  '0269': 'boy',
}

const JOKES = [
  'We are trading sleep for tiny socks. It feels fair somehow.',
  'The nursery is almost ready. The parents are a different story.',
  'A baby is on the way, which means the snack budget has become a lifestyle.',
  'Parenthood: where a two-hour nap is called a weekend getaway.',
  'The baby has not arrived yet, but already runs the entire household.',
  'They say babies change everything. We started with the thermostat.',
  'Nine months of preparation for a person who will ignore the manual.',
  'The due date is approaching. The excitement has already arrived.',
]

const HYPE_MESSAGES = [
  { text: 'is it a boy?', color: '#a2d2ff' },
  { text: 'is it a girl?', color: '#ffafcc' },
  { text: 'what is your take?', color: '#fcf6bd' },
  { text: 'raise your hand if you vote for a girl', color: '#ffafcc' },
  { text: 'raise your hand if you vote for a boy', color: '#a2d2ff' },
  { text: 'blink your eyes 10 times if you really want a girl', color: '#ffafcc' },
  { text: 'nod 10 times if you really want a boy', color: '#a2d2ff' },
  { text: 'again again again', color: '#fcf6bd' },
  { text: 'is it a boy?', color: '#a2d2ff' },
  { text: 'is it a girl?', color: '#ffafcc' },
  { text: 'tally your votes now!', color: '#fcf6bd' },
  { text: 'last question, is it a boy or a girl?', color: '#fcf6bd' },
]

const PHASES = {
  ENTRY: 'entry',
  JOKES: 'jokes',
  HYPE: 'hype',
  TRIGGER: 'trigger',
  COUNTDOWN: 'countdown',
  REVEAL: 'reveal',
}

function PrimaryButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative mt-8 overflow-hidden border-2 border-[#201c30] bg-[#201c30] px-8 py-4 font-sans text-sm font-extrabold uppercase tracking-[0.16em] text-white shadow-[6px_6px_0_#201c30] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#201c30] hover:shadow-[9px_9px_0_#201c30] focus:outline-none focus:ring-4 focus:ring-white/70 active:translate-y-0 active:shadow-[4px_4px_0_#201c30] sm:px-10 sm:text-base"
    >
      <span className="relative">{children}</span>
    </button>
  )
}

function App() {
  const [phase, setPhase] = useState(PHASES.ENTRY)
  const [code, setCode] = useState('')
  const [gender, setGender] = useState(null)
  const [sequenceIndex, setSequenceIndex] = useState(0)
  const [countdown, setCountdown] = useState(10)

  const hypeMessage = HYPE_MESSAGES[sequenceIndex]
  const revealColor = gender === 'girl' ? '#ffafcc' : '#a2d2ff'
  const backgroundColor =
    phase === PHASES.HYPE
      ? hypeMessage.color
      : phase === PHASES.REVEAL
        ? revealColor
        : phase === PHASES.COUNTDOWN
          ? '#201c30'
          : '#fcf6bd'

  useEffect(() => {
    if (phase !== PHASES.JOKES && phase !== PHASES.HYPE) return undefined

    const items = phase === PHASES.JOKES ? JOKES : HYPE_MESSAGES
    const timer = window.setTimeout(() => {
      if (sequenceIndex < items.length - 1) {
        setSequenceIndex((index) => index + 1)
        return
      }

      setSequenceIndex(0)
      setPhase(phase === PHASES.JOKES ? PHASES.HYPE : PHASES.TRIGGER)
    }, 10_000)

    return () => window.clearTimeout(timer)
  }, [phase, sequenceIndex])

  useEffect(() => {
    if (phase !== PHASES.COUNTDOWN) return undefined

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current > 1) return current - 1

        window.clearInterval(timer)
        setPhase(PHASES.REVEAL)
        return 0
      })
    }, 1_000)

    return () => window.clearInterval(timer)
  }, [phase])

  function updateCode(value) {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 4)
    setCode(digitsOnly)
    setGender(REVEAL_CODES[digitsOnly] ?? null)
  }

  function beginShow() {
    setSequenceIndex(0)
    setPhase(PHASES.JOKES)
  }

  function startCountdown() {
    setCountdown(10)
    setPhase(PHASES.COUNTDOWN)
  }

  return (
    <main
      className="stage relative flex min-h-screen w-screen overflow-hidden text-[#201c30] transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(#201c30_1px,transparent_1px)] [background-size:20px_20px]" />

      {phase === PHASES.ENTRY && (
        <section className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-12">
          <div className="w-full max-w-lg text-center animate-[rise-in_700ms_cubic-bezier(.16,1,.3,1)_both]">
            <p className="font-sans text-xs font-extrabold uppercase tracking-[0.28em]">A little secret</p>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-7xl">Gender reveal</h1>
            <p className="mx-auto mt-6 max-w-sm font-sans text-base leading-relaxed sm:text-lg">Enter the four digits that unlock tonight&apos;s answer.</p>
            <label className="sr-only" htmlFor="reveal-code">Four-digit reveal code</label>
            <input
              id="reveal-code"
              value={code}
              onChange={(event) => updateCode(event.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              placeholder="0000"
              className="mt-9 w-full border-b-4 border-[#201c30] bg-transparent px-2 py-3 text-center font-display text-6xl tracking-[0.25em] outline-none placeholder:text-[#201c30]/30 focus:border-white sm:text-7xl"
            />
            <div className="mt-5 min-h-7 font-sans text-sm font-bold uppercase tracking-[0.13em]" aria-live="polite">
              {code.length === 4 && !gender && 'That code is not on tonight\'s guest list.'}
              {gender && `Code accepted. The secret is safe.`}
            </div>
            {gender && <PrimaryButton onClick={beginShow}>Let&apos;s start the Gender Reveal</PrimaryButton>}
          </div>
        </section>
      )}

      {phase === PHASES.JOKES && (
        <MessageStage key={`joke-${sequenceIndex}`} eyebrow="Before we begin" message={JOKES[sequenceIndex]} />
      )}

      {phase === PHASES.HYPE && (
        <MessageStage key={`hype-${sequenceIndex}`} eyebrow="Make some noise" message={hypeMessage.text} loud />
      )}

      {phase === PHASES.TRIGGER && (
        <section className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 text-center">
          <div className="animate-[rise-in_700ms_cubic-bezier(.16,1,.3,1)_both]">
            <p className="font-sans text-xs font-extrabold uppercase tracking-[0.28em]">The moment is here</p>
            <h2 className="mx-auto mt-5 max-w-5xl font-display text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">are you ready to reveal the gender?</h2>
            <PrimaryButton onClick={startCountdown}>Show Gender</PrimaryButton>
          </div>
        </section>
      )}

      {phase === PHASES.COUNTDOWN && (
        <section className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 text-center text-white">
          <div className="w-full animate-[rise-in_650ms_cubic-bezier(.16,1,.3,1)_both]">
            <p className="font-sans text-xs font-extrabold uppercase tracking-[0.3em] text-[#fcf6bd]">The secret code</p>
            <div className="mt-4 font-display text-7xl tracking-[0.14em] animate-pulse sm:text-8xl lg:text-9xl">{code}</div>
            <p className="mt-3 font-sans text-lg font-bold uppercase tracking-[0.18em] text-white/80 sm:text-xl">check your keypad</p>
            <div key={countdown} className="mt-10 font-display text-[9rem] leading-none text-[#fcf6bd] animate-[count-pop_800ms_cubic-bezier(.16,1,.3,1)_both] sm:text-[13rem] lg:text-[16rem]">
              {countdown}
            </div>
          </div>
        </section>
      )}

      {phase === PHASES.REVEAL && (
        <section className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 text-center">
          <div className="animate-[reveal-pop_950ms_cubic-bezier(.16,1,.3,1)_both]">
            <p className="font-sans text-xs font-extrabold uppercase tracking-[0.3em]">It&apos;s official</p>
            <h2 className="mt-5 font-display text-6xl leading-[0.82] sm:text-8xl lg:text-9xl">IT IS A<br />{gender === 'girl' ? 'GIRL' : 'BOY'}</h2>
          </div>
        </section>
      )}
    </main>
  )
}

function MessageStage({ eyebrow, message, loud = false }) {
  return (
    <section className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 text-center">
      <div className="max-w-6xl animate-[message-in_900ms_cubic-bezier(.16,1,.3,1)_both]">
        <p className="font-sans text-xs font-extrabold uppercase tracking-[0.28em]">{eyebrow}</p>
        <h2 className={`mt-6 font-display leading-[0.92] ${loud ? 'text-6xl sm:text-8xl lg:text-9xl' : 'text-5xl sm:text-7xl lg:text-8xl'}`}>
          {message}
        </h2>
      </div>
    </section>
  )
}

export default App