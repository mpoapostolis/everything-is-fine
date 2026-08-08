import type { ScriptContext, Step } from './types';

/** Interprets chapter scripts: an ordered list of small, typed steps. */
export class ScriptRunner {
  constructor(private ctx: ScriptContext) {}

  async run(steps: Step[]): Promise<void> {
    for (const step of steps) {
      await this.exec(step);
    }
  }

  private async exec(step: Step): Promise<void> {
    const { state, notebook, ui } = this.ctx;
    if ('say' in step) {
      await ui.say(step.say.speaker, step.say.text);
    } else if ('objective' in step) {
      ui.setObjective(step.objective);
    } else if ('note' in step) {
      notebook.add(step.note.time, step.note.text);
    } else if ('flag' in step) {
      state.set(step.flag);
    } else if ('clock' in step) {
      state.setClock(step.clock);
      ui.setClock(step.clock);
    } else if ('wait' in step) {
      await new Promise((r) => setTimeout(r, step.wait));
    } else if ('call' in step) {
      await step.call(this.ctx);
    }
  }
}
