export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { image_url, char_name } = req.body;
    const response = await fetch('https://api.meshy.ai/openapi/v1/image-to-3d', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MESHY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url,
        // どうぶつの森風：lowpolyで丸みあるカワイイ形状に
        model_type: 'lowpoly',
        should_texture: true,
        texture_prompt: `cute stuffed animal toy, chibi style, Animal Crossing character, ${char_name}, soft plush texture, rounded shapes, adorable`,
        target_polycount: 5000,
        output_formats: ['glb'],
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.status(200).json({ task_id: data.result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
