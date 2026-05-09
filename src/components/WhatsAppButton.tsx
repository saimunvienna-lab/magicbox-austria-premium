const WhatsAppButton = () => {
  const phone = "4367696177230";
  const href = `https://wa.me/${phone}?text=${encodeURIComponent("Hello SAIDA MagicBox, I would like more information.")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 size-14 rounded-full bg-[hsl(142,70%,45%)] text-white grid place-items-center shadow-elevated hover:scale-110 transition-transform animate-float-slow"
    >
      <svg viewBox="0 0 32 32" className="size-7" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.07c-.3-.15-1.78-.88-2.06-.98-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.49 1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.31.18-1.43-.07-.12-.27-.2-.57-.35zM16.02 5.33c-5.9 0-10.69 4.79-10.69 10.69 0 1.88.49 3.7 1.43 5.31L5 27l5.79-1.51c1.55.84 3.3 1.29 5.07 1.29h.01c5.9 0 10.69-4.79 10.69-10.69 0-2.85-1.11-5.54-3.13-7.55a10.62 10.62 0 0 0-7.41-3.21z" />
      </svg>
    </a>
  );
};
export default WhatsAppButton;
