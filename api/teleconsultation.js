const { supabase } = require('../lib/supabase');
const { emailSubmission } = require('../lib/email');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const payload = req.body || {};

    const { error } = await supabase
      .from('submissions')
      .insert([{ type: 'teleconsultation', payload }]);

    if (error) throw error;

    await emailSubmission('New teleconsultation request — Flex Revive', payload);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('teleconsultation error:', err);
    res.status(500).json({ ok: false, error: 'Could not process the request.' });
  }
};
