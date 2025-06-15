<<<<<<< HEAD
// const OpenAI = require('openai');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

exports.generateDeepQuestion = async (req, res) => {
  const { journalText } = req.body;

  try {
    // ❗ In production, this would send the journalText to OpenAI and return a generated question.
    // const completion = await openai.chat.completions.create({
    //   model: 'gpt-4',
    //   messages: [
    //     {
    //       role: 'system',
    //       content:
    //         'You are a journaling assistant guided by Stoic philosophy. Read the user\'s journal entry and respond with one thoughtful, probing question to help them reflect more deeply — especially through principles of Stoicism such as control, virtue, reason, acceptance, or impermanence. Do not summarize the entry — ask only a single question.',
    //     },
    //     {
    //       role: 'user',
    //       content: journalText,
    //     },
    //   ],
    // });

    // const question = completion.choices[0].message.content;

    // ✅ For development/demo purposes, use a mock response:
    const question = "How might this situation look different if you focused only on what is within your control?";

    res.status(200).json({ question });
  } catch (error) {
    console.error('Error generating Stoic question:', error);
    res.status(500).json({ error: 'Failed to generate deep question' });
  }
};
=======
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateDeepQuestion = async (request, response) => {
  const { journalText } = request.body;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a journaling assistant guided by Stoic philosophy. Read the user\'s journal entry and respond with one thoughtful, probing question to help them reflect more deeply — especially through principles of Stoicism such as control, virtue, reason, acceptance, or impermanence. Do not summarize the entry — ask only a single question.',
        },
        {
          role: 'user',
          content: journalText,
        },
      ],
    });

    const question = completion.data.choices[0].message.content;
    response.status(200).json({ question });
  } catch (error) {
    console.error('OpenAI error:', error);
    response.status(500).json({ error: 'Failed to generate deep question' });
  }
};

module.exports = {
  generateDeepQuestion,
};
>>>>>>> a3f075a05d6eca264ebc6f7842c95b582b3fcdf6
