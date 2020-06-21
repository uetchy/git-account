import {Config, User} from './config';
import prompts from 'prompts';

export async function askUser(users: Config) {
  const questions = [
    {
      type: 'select' as const,
      name: 'user',
      message: 'Select account:',
      choices: users.map((user) => ({
        title: `${user.name} <${user.email}>`,
        value: user,
      })),
    },
  ] as Array<prompts.PromptObject>;
  const result = await prompts(questions, {
    onCancel: () => {
      process.exit(0);
    },
  });
  return result.user as User;
}
