import OpenAI from "openai";

const openai = new OpenAI()


export default async function handler(req, res) {
    const { prompt } = req.body;
    try {
        const result = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: `${prompt}`,
                },
            ],
        });

        res.status(200).json(result.choices[0].message.content);

    } catch (error) {
        console.error('Error in API:', error);
        res.status(500).json({ message: 'An error occurred while processing the request.', error: error.message });
    }
}