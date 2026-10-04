import { SITE } from '../../config/site';

export default function WhatsAppButton() {
  if (!SITE.whatsapp) return null;
  return (
    <a className="wa-float" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 3.5A11 11 0 0 0 3.6 17.4L2 22l4.7-1.5A11 11 0 1 0 20.5 3.5Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.8.9.9-2.7-.2-.3A9 9 0 1 1 20 12a9 9 0 0 1-8 8.5Zm4.9-6.3c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-1.4-.7-2.3-1.3-3.2-2.8-.2-.4.2-.4.6-1.3.1-.1 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.6 4 3.6.6.2 1 .4 1.3.5.6.2 1.1.2 1.5.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.1-.3-.2-.6-.3Z" />
      </svg>
    </a>
  );
}