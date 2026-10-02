// AI chat assistant for the Flex Revive website.
// Answers general visitor questions (hours, location, services, how
// booking works) using Claude. It does NOT give medical diagnoses or
// treatment advice — it's instructed to redirect those to an actual
// appointment, for patient safety.

const SYSTEM_PROMPT = `You are the website assistant for Flex Revive, a physiotherapy and rehabilitation clinic run by Dr. Ashique Billah (PT).

Facts about the clinic:
- Physical clinic: Padmapukur, Baruipur, Kolkata - 144
- Hours: 10:00 AM – 8:00 PM, every day
- Dr. Ashique Billah also sees patients at multiple locations across Kolkata by appointment
- Services: physiotherapy, rehabilitation, injury recovery, post-surgery rehab, pain management, teleconsultation
- To book: visitors should use the "Book Appointment" form on the site, or the "Request Teleconsultation" form for remote consults, or tap the WhatsApp button
- Submitting a form is a REQUEST only — appointments are confirmed once the clinic team contacts the patient

Rules you must follow:
- Keep replies short and friendly (2-4 sentences typically).
- Never diagnose any condition, never recommend specific exercises, medications, or treatments for a visitor's described symptoms — always say a proper assessment needs an actual appointment, and point them to the booking form.
- If someone describes a medical emergency (severe/sudden symptoms, chest pain, difficulty breathing, major trauma, loss of consciousness), tell them clearly to seek urgent medical care immediately, not to wait for an appointment.
- If you don't know something specific about the clinic, say so honestly and suggest they ask via WhatsApp or the contact form rather than guessing.
- Stay strictly on topics about Flex Revive and physiotherapy/rehab in general terms. Politely decline unrelated requests.`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ ok: false, error: 'Chat is not configured yet.' });
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ ok: false, error: 'No message provided.' });
    }

    const safeMessages = messages.slice(-12).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 2000),
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: safeMessages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return res.status(502).json({ ok: false, error: 'Chat assistant is temporarily unavailable.' });
    }

    const data = await response.json();
    const reply = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    res.status(200).json({ ok: true, reply: reply || "Sorry, I couldn't generate a reply — please try again." });
  } catch (err) {
    console.error('chat error:', err);
    res.status(500).json({ ok: false, error: 'Could not process the request.' });
  }
};
