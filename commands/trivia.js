import axios from 'axios';
import { fakeQuoted } from '../lib/fquoted.js';

const games = {};
function decodeHtml(html) {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&eacute;/g, 'é')
    .replace(/&agrave;/g, 'à');
}

export default async function triviaCommand(message, client, { args }) {
  const chat = message.key.remoteJid;

  if (args[0] === 'start') {
    if (games[chat]) {
      return client.sendMessage(chat, { text: '⚠️ Une partie est déjà en cours dans ce groupe ! Finissez-la ou attendez.' }, { quoted: fakeQuoted });
    }

    try {
      const res = await axios.get('https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple');
      if (!res.data.results || res.data.results.length === 0) {
        throw new Error("Impossible de joindre l'API de Quiz.");
      }

      games[chat] = {
        questions: res.data.results,
        currentIndex: 0,
        score: 0,
      };

      return sendNextQuestion(chat, client);
    } catch (err) {
      console.error(err);
      return client.sendMessage(chat, { text: '❌ Erreur lors du chargement des questions Trivia.' }, { quoted: fakeQuoted });
    }
  }

  if (!games[chat]) return;

  const userReply = message.body?.trim();
  const session = games[chat];
  const currentQuestion = session.questions[session.currentIndex];

  if (['1', '2', '3', '4'].includes(userReply)) {
    const selectedAnswerIndex = parseInt(userReply) - 1;
    const selectedAnswer = session.shuffledOptions[selectedAnswerIndex];

    if (selectedAnswer === currentQuestion.correct_answer) {
      session.score++;
      await client.sendMessage(chat, { text: '✅ **Bonne réponse !**' }, { quoted: fakeQuoted });
    } else {
      await client.sendMessage(chat, { text: `❌ **Mauvaise réponse.** La bonne réponse était : *${decodeHtml(currentQuestion.correct_answer)}*` }, { quoted: fakeQuoted });
    }

    session.currentIndex++;

    if (session.currentIndex >= session.questions.length) {
      await client.sendMessage(chat, {
        text: `🏁 **PARTIE TERMINÉE !**\n\n> Votre score final : *${session.score} / 10*`
      }, { quoted: fakeQuoted });
      delete games[chat];
    } else {
      await sendNextQuestion(chat, client);
    }
  }
}

async function sendNextQuestion(chat, client) {
  const session = games[chat];
  const q = session.questions[session.currentIndex];
  const options = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
  session.shuffledOptions = options;

  let questionText = `📝 *QUESTION n°${session.currentIndex + 1} / 10*\n\n`;
  questionText += `*${decodeHtml(q.question)}*\n\n`;
  options.forEach((opt, index) => {
    questionText += `${index + 1}. ${decodeHtml(opt)}\n`;
  });
  questionText += `\n Répondez par le numéro correspondant (*1*, *2*, *3* ou *4*)`;

  await client.sendMessage(chat, { text: questionText }, { quoted: fakeQuoted });
}
