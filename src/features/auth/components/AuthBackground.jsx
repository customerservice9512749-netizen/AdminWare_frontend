export default function AuthBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-emerald-200/50 rounded-full blur-3xl animate-pulse [animation-duration:6s]" />
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-purple-300/40 rounded-full blur-3xl animate-pulse [animation-duration:8s] [animation-delay:2s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-100/60 rounded-full blur-3xl animate-pulse [animation-duration:10s]" />

      <svg
        className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-40 animate-[spin_40s_linear_infinite]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-200 -200 1400 1400"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M-200,0 Q500,800 1200,0" className="text-emerald-500/70 animate-[pulse_4s_ease-in-out_infinite]" />
          <path d="M-200,200 Q500,1000 1200,200" className="text-emerald-400/60 animate-[pulse_5s_ease-in-out_infinite] [animation-delay:0.5s]" />
          <path d="M-200,400 Q500,1200 1200,400" className="text-teal-400/50 animate-[pulse_6s_ease-in-out_infinite] [animation-delay:1s]" />
          <path d="M-200,600 Q500,1400 1200,600" className="text-purple-500/60 animate-[pulse_5s_ease-in-out_infinite] [animation-delay:1.5s]" />
          <path d="M-200,800 Q500,1600 1200,800" className="text-indigo-400/60 animate-[pulse_4s_ease-in-out_infinite] [animation-delay:2s]" />
        </g>
      </svg>

      <svg
        className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-30 animate-[spin_55s_linear_infinite_reverse]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-200 -200 1400 1400"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M1200,100 Q500,700 -200,100" className="text-purple-600/60" />
          <path d="M1200,300 Q500,900 -200,300" className="text-indigo-500/50" />
          <path d="M1200,500 Q500,1100 -200,500" className="text-emerald-500/60" />
          <path d="M1200,700 Q500,1300 -200,700" className="text-teal-400/50" />
        </g>
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-[#F8FAFC]/80 pointer-events-none" />
    </div>
  );
}
