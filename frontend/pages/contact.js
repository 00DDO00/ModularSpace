import Head from 'next/head';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(''), 3000);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Head>
        <title>Contact · ModularSpace Studio Liaison</title>
      </Head>

      <div className="border-y-2 border-line bg-background">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-0">
          <div className="grid gap-16 lg:grid-cols-[1.1fr,1fr]">
            <div className="space-y-12">
              <div className="space-y-6">
                <p className="text-xs tracking-[0.5rem] text-muted">STUDIO LIAISON</p>
                <h1 className="text-4xl sm:text-5xl uppercase">
                  Connect with the ModularSpace team.
                </h1>
                <p className="max-w-xl text-sm text-muted">
                  For commissions, architectural collaborations, or enterprise rollouts, complete the form and our studio manager will respond within 24 hours.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div className="border-2 border-line bg-surface p-6">
                  <div className="flex items-center gap-3">
                    <Mail className="h-6 w-6 text-dhbBlue" />
                    <p className="text-xs tracking-[0.3rem] text-muted">EMAIL</p>
                  </div>
                  <p className="mt-4 text-sm text-primary">info@modularspace.com</p>
                  <p className="text-sm text-primary">studio@modularspace.com</p>
                </div>
                <div className="border-2 border-line bg-surface p-6">
                  <div className="flex items-center gap-3">
                    <Phone className="h-6 w-6 text-dhbBlue" />
                    <p className="text-xs tracking-[0.3rem] text-muted">PHONE</p>
                  </div>
                  <p className="mt-4 text-sm text-primary">+1 (555) 123-4567</p>
                  <p className="text-xs text-muted">Mon—Fri · 09:00—18:00 GMT</p>
                </div>
                <div className="border-2 border-line bg-surface p-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-dhbBlue" />
                    <p className="text-xs tracking-[0.3rem] text-muted">HQ</p>
                  </div>
                  <p className="mt-4 text-sm text-primary">Design District, Istanbul</p>
                  <p className="text-xs text-muted">Private showroom by appointment</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-line bg-surface p-8">
              <h2 className="text-lg uppercase">Project worksheet</h2>
              <p className="mt-3 text-xs tracking-[0.3rem] text-muted">
                Tell us about your concept.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="space-y-2 text-xs uppercase">
                    <span className="tracking-[0.3rem] text-muted">Name *</span>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border-2 border-line bg-background px-4 py-3 text-sm text-primary focus:border-dhbBlue focus:outline-none"
                      placeholder="Your full name"
                    />
                  </label>
                  <label className="space-y-2 text-xs uppercase">
                    <span className="tracking-[0.3rem] text-muted">Email *</span>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border-2 border-line bg-background px-4 py-3 text-sm text-primary focus:border-dhbBlue focus:outline-none"
                      placeholder="contact@studio.com"
                    />
                  </label>
                </div>

                <label className="space-y-2 text-xs uppercase">
                  <span className="tracking-[0.3rem] text-muted">Subject *</span>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border-2 border-line bg-background px-4 py-3 text-sm text-primary focus:border-dhbBlue focus:outline-none"
                    placeholder="Project scope"
                  />
                </label>

                <label className="space-y-2 text-xs uppercase">
                  <span className="tracking-[0.3rem] text-muted">Message *</span>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full border-2 border-line bg-background px-4 py-3 text-sm text-primary focus:border-dhbBlue focus:outline-none"
                    placeholder="Outline deliverables, timeline, and budget range."
                  />
                </label>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex w-full items-center justify-center gap-3 border-2 border-primary bg-primary px-6 py-4 text-sm font-semibold tracking-[0.35rem] text-contrast transition-transform hover:-translate-y-1 disabled:opacity-60"
                >
                  {status === 'sending' ? 'SENDING…' : 'SUBMIT BRIEF'}
                  <Send className="h-5 w-5" />
                </button>

                {status === 'success' && (
                  <div className="border-2 border-dhbBlue bg-background px-4 py-3 text-sm text-primary">
                    Thank you. Our studio liaison will reply within one business day.
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="mt-24 border-t-2 border-line pt-12">
            <h3 className="text-2xl uppercase">FAQ · Working with ModularSpace</h3>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {[
                {
                  q: 'What formats can I export from the configurator?',
                  a: 'Download high-resolution stills, wireframes, and JSON configuration data for direct collaboration with fabrication partners.',
                },
                {
                  q: 'Do you handle installation logistics?',
                  a: 'Yes. Our operations team manages crate packing, transport, and on-site assembly globally.',
                },
                {
                  q: 'Can I integrate my own materials?',
                  a: 'We support custom finishes. Provide material specs and we will generate matching textures for previews.',
                },
                {
                  q: 'Is there enterprise onboarding?',
                  a: 'Enterprise partners receive dedicated training sessions, custom libraries, and API access.',
                },
              ].map((item) => (
                <div key={item.q} className="border-2 border-line bg-surface p-6">
                  <p className="text-xs tracking-[0.3rem] text-muted">QUESTION</p>
                  <h4 className="mt-3 text-lg uppercase">{item.q}</h4>
                  <p className="mt-4 text-sm text-muted">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
