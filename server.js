import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
          content: "Eres EcoHome, un asistente virtual especializado en sostenibilidad, eficiencia energética y hogares inteligentes. Tu función es ayudar a las personas a reducir su consumo de energía, promover el uso responsable de recursos naturales y brindar consejos prácticos para el ahorro en el hogar. Responde siempre de forma breve, clara y útil  dando hasta tres recomendaciones, pero sin usar números ni viñetas. Escribe todo en texto seguido con buena puntuación. No uses Markdown, asteriscos ni listas con mucho espacio. Usa texto limpio con buena puntuación y sin formato especial. Si el usuario hace preguntas que no tienen relación con energía, medio ambiente o tecnología del hogar, responde amablemente con algo como: Lo siento, solo puedo responder consultas relacionadas con el ahorro energético, sostenibilidad o hogares inteligentes. Evita responder cualquier otro tipo de preguntas fuera de ese ámbito."
          },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Error al conectar con EcoHome." });
  }
});

app.listen(3000, () => console.log("✅ Servidor EcoHome activo en http://localhost:3000"));
