module.exports = async function handler(req, res) {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    let body = req.body;

    // 🔥 CORREÇÃO PRINCIPAL
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const message = body?.message || "oi";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é ASKAR, um assistente inteligente, amigável e proativo. Ajuda com finanças, metas, tarefas e marketing."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "Erro OpenAI",
        details: data
      });
    }

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "Sem resposta"
    });

  } catch (error) {
    return res.status(500).json({
      error: "Erro interno",
      message: error.message
    });
  }
};
